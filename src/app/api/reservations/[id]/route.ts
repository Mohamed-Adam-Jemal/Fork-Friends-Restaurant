import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// ==============================
// GET single reservation (PUBLIC)
// ==============================
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const numericId = Number(params.id);
  if (isNaN(numericId)) {
    return NextResponse.json({ error: 'Invalid reservation ID' }, { status: 400 });
  }

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: numericId },
      include: { table: true },
    });

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json(reservation, { status: 200 });
  } catch (error) {
    console.error('GET reservation error:', error);
    return NextResponse.json({ error: 'Failed to fetch reservation' }, { status: 500 });
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
    return NextResponse.json({ error: 'Invalid reservation ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const updates: any = {};

    if ('firstName' in body) updates.firstName = body.firstName;
    if ('lastName' in body) updates.lastName = body.lastName;
    if ('email' in body) updates.email = body.email;
    if ('phone' in body) updates.phone = body.phone;
    if ('date' in body) updates.date = new Date(body.date);
    if ('time' in body) updates.time = body.time;
    if ('guests' in body) updates.guests = Number(body.guests);
    if ('specialRequests' in body) updates.specialRequests = body.specialRequests ?? null;
    if ('occasion' in body) updates.occasion = body.occasion ?? null;
    if ('seating' in body) updates.seating = body.seating;
    if ('tableId' in body) updates.tableId = Number(body.tableId);

    const updatedReservation = await prisma.reservation.update({
      where: { id: numericId },
      data: updates,
      include: { table: true },
    });

    return NextResponse.json(updatedReservation, { status: 200 });
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
    return NextResponse.json({ error: 'Invalid reservation ID' }, { status: 400 });
  }

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: numericId },
    });

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    await prisma.reservation.delete({ where: { id: numericId } });

    // Update table availability
    if (reservation.tableId) {
      await prisma.table.update({
        where: { id: reservation.tableId },
        data: { availability: true },
      });
    }

    return NextResponse.json({ message: 'Deleted reservation and freed table' }, { status: 200 });
  } catch (error) {
    console.error('DELETE reservation error:', error);
    return NextResponse.json({ error: 'Failed to delete reservation' }, { status: 500 });
  }
}
