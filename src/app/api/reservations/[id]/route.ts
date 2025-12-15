import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// Helper function to format reservation response
function formatReservation(reservation: any) {
  return {
    id: reservation.id,
    first_name: reservation.firstName,
    last_name: reservation.lastName,
    email: reservation.email,
    phone: reservation.phone,
    date: reservation.date.toISOString(),
    time: reservation.time,
    guests: reservation.guests,
    special_requests: reservation.specialRequests,
    occasion: reservation.occasion,
    seating: reservation.seating,
    table_id: reservation.table
      ? {
          id: reservation.table.id,
          table_number: reservation.table.tableNumber,
          seats: reservation.table.seats,
          type: reservation.table.type,
          availability: reservation.table.availability,
        }
      : null,
  };
}

// ==============================
// GET single reservation (PUBLIC)
// ==============================
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const numericId = Number(params.id);
  if (isNaN(numericId)) {
    return NextResponse.json(
      { error: 'Invalid reservation ID' },
      { status: 400 }
    );
  }

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: numericId },
      include: { table: true },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(formatReservation(reservation), { status: 200 });
  } catch (error) {
    console.error('GET reservation error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservation' },
      { status: 500 }
    );
  }
}

// ==============================
// PATCH reservation (PROTECTED)
// ==============================
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 🔐 Auth check
  const authCheck = requireAuth(req);
  if (authCheck instanceof NextResponse) return authCheck;

  const numericId = Number(params.id);
  if (isNaN(numericId)) {
    return NextResponse.json(
      { error: 'Invalid reservation ID' },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();

    // Get existing reservation first
    const existing = await prisma.reservation.findUnique({
      where: { id: numericId },
      include: { table: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    // Build update object - only include provided fields
    const updates: any = {};
    if ('firstName' in body) updates.firstName = body.firstName;
    if ('lastName' in body) updates.lastName = body.lastName;
    if ('email' in body) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
      updates.email = body.email;
    }
    if ('phone' in body) updates.phone = body.phone;
    if ('date' in body) updates.date = new Date(body.date);
    if ('time' in body) updates.time = body.time;
    if ('guests' in body) {
      const guests = Number(body.guests);
      if (isNaN(guests) || guests < 1 || guests > 100) {
        return NextResponse.json(
          { error: 'Guest count must be between 1 and 100' },
          { status: 400 }
        );
      }
      updates.guests = guests;
    }
    if ('specialRequests' in body)
      updates.specialRequests = body.specialRequests ?? null;
    if ('occasion' in body) updates.occasion = body.occasion ?? null;

    // Handle seating/table changes
    if ('seating' in body || 'tableId' in body) {
      const newSeating = body.seating
        ? (body.seating.toUpperCase() as 'INDOOR' | 'OUTDOOR')
        : existing.seating;
      const newTableId = body.tableId ? Number(body.tableId) : existing.tableId;
      const newGuests = updates.guests || existing.guests;
      const newDate = updates.date || existing.date;
      const newTime = updates.time || existing.time;

      // Validate seating enum
      if (newSeating !== 'INDOOR' && newSeating !== 'OUTDOOR') {
        return NextResponse.json(
          { error: 'Seating must be INDOOR or OUTDOOR' },
          { status: 400 }
        );
      }

      // If table changed, check new table is available
      if (newTableId !== existing.tableId) {
        const newTable = await prisma.table.findUnique({
          where: { id: newTableId },
        });

        if (!newTable) {
          return NextResponse.json(
            { error: 'Table not found' },
            { status: 404 }
          );
        }

        if (newTable.seats < newGuests) {
          return NextResponse.json(
            { error: `Table only has ${newTable.seats} seats` },
            { status: 400 }
          );
        }

        // Check if new table is available at the same date/time
        const conflict = await prisma.reservation.findFirst({
          where: {
            id: { not: numericId }, // exclude current reservation
            tableId: newTableId,
            date: {
              gte: new Date(newDate),
              lt: new Date(
                new Date(newDate).getTime() + 86400000
              ),
            },
            time: newTime,
          },
        });

        if (conflict) {
          return NextResponse.json(
            { error: 'Table is not available at this date and time' },
            { status: 409 }
          );
        }

        // Free the old table
        await prisma.table.update({
          where: { id: existing.tableId || 0 },
          data: { availability: true },
        });

        // Reserve the new table
        await prisma.table.update({
          where: { id: newTableId },
          data: { availability: false },
        });

        updates.tableId = newTableId;
      }

      if ('seating' in body) updates.seating = newSeating;
    }

    // Update reservation
    const updatedReservation = await prisma.reservation.update({
      where: { id: numericId },
      data: updates,
      include: { table: true },
    });

    return NextResponse.json(formatReservation(updatedReservation), {
      status: 200,
    });
  } catch (error: any) {
    console.error('PATCH reservation error:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation', reason: error.message },
      { status: 500 }
    );
  }
}

// ==============================
// DELETE reservation (PROTECTED)
// ==============================
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 🔐 Auth check
  const authCheck = requireAuth(_req);
  if (authCheck instanceof NextResponse) return authCheck;

  const numericId = Number(params.id);
  if (isNaN(numericId)) {
    return NextResponse.json(
      { error: 'Invalid reservation ID' },
      { status: 400 }
    );
  }

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: numericId },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    // Delete reservation
    await prisma.reservation.delete({ where: { id: numericId } });

    // Free up the table
    if (reservation.tableId) {
      await prisma.table.update({
        where: { id: reservation.tableId },
        data: { availability: true },
      });
    }

    return NextResponse.json(
      { message: 'Reservation deleted and table freed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE reservation error:', error);
    return NextResponse.json(
      { error: 'Failed to delete reservation' },
      { status: 500 }
    );
  }
}