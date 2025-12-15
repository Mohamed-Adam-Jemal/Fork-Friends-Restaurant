// app/api/reservations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ==============================
// GET: fetch all reservations (PUBLIC)
// ==============================
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const date = url.searchParams.get("date"); // 'YYYY-MM-DD'
    const time = url.searchParams.get("time"); // 'HH:MM'

    const reservations = await prisma.reservation.findMany({
      where: {
        // Fix: Convert date string to Date object and handle the full day
        ...(date && {
          date: {
            gte: new Date(date),
            lt: new Date(new Date(date).getTime() + 86400000), // next day
          },
        }),
        ...(time && { time }),
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
      include: { table: true },
    });

    // Transform response to match frontend expectations
    const formatted = reservations.map((res: { id: any; firstName: any; lastName: any; email: any; phone: any; date: { toISOString: () => any; }; time: any; guests: any; specialRequests: any; occasion: any; seating: any; table: { id: any; tableNumber: any; seats: any; type: any; availability: any; }; }) => ({
      id: res.id,
      first_name: res.firstName,
      last_name: res.lastName,
      email: res.email,
      phone: res.phone,
      date: res.date.toISOString(),
      time: res.time,
      guests: res.guests,
      special_requests: res.specialRequests,
      occasion: res.occasion,
      seating: res.seating,
      table_id: res.table
        ? {
            id: res.table.id,
            table_number: res.table.tableNumber,
            seats: res.table.seats,
            type: res.table.type,
            availability: res.table.availability,
          }
        : null,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations." },
      { status: 500 }
    );
  }
}

// ==============================
// POST: create a new reservation (PROTECTED)
// ==============================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      date,
      time,
      guests,
      specialRequests,
      occasion,
      seating, // "INDOOR" or "OUTDOOR"
    } = body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !date ||
      !time ||
      !guests ||
      !seating
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const guestCount = Number(guests);

    // Validate guest count
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 100) {
      return NextResponse.json(
        { error: "Guest count must be between 1 and 100" },
        { status: 400 }
      );
    }

    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (selectedDateTime <= now) {
      return NextResponse.json(
        { error: "Cannot reserve a table in the past." },
        { status: 400 }
      );
    }

    // Ensure seating is uppercase to match TableType enum
    const tableType = seating.toUpperCase() as "INDOOR" | "OUTDOOR";

    // Validate table type
    if (tableType !== "INDOOR" && tableType !== "OUTDOOR") {
      return NextResponse.json(
        { error: "Seating must be INDOOR or OUTDOOR" },
        { status: 400 }
      );
    }

    // Find tables matching seating type and enough seats
    const suitableTables = await prisma.table.findMany({
      where: {
        type: tableType,
        seats: { gte: guestCount },
        availability: true,
      },
    });

    if (suitableTables.length === 0) {
      return NextResponse.json(
        {
          error: `No ${seating} tables can accommodate ${guestCount} guests`,
        },
        { status: 409 }
      );
    }

    // Check table availability at the specific date and time
    const reservationsAtTime = await prisma.reservation.findMany({
      where: {
        date: {
          gte: new Date(date),
          lt: new Date(new Date(date).getTime() + 86400000),
        },
        time,
        tableId: { in: suitableTables.map((t: { id: any; }) => t.id) },
      },
      select: { tableId: true },
    });

    const availableTables = suitableTables.filter(
      (t: { id: any; }) => !reservationsAtTime.some((r: { tableId: any; }) => r.tableId === t.id)
    );

    if (availableTables.length === 0) {
      return NextResponse.json(
        {
          error: `All ${seating} tables are already reserved at ${time} on ${date}`,
        },
        { status: 409 }
      );
    }

    const tableToReserve = availableTables[0];

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        date: new Date(date),
        time,
        guests: guestCount,
        specialRequests: specialRequests ?? null,
        occasion: occasion ?? null,
        seating: tableType,
        tableId: tableToReserve.id,
      },
      include: { table: true },
    });

    // Update table availability
    await prisma.table.update({
      where: { id: tableToReserve.id },
      data: { availability: false },
    });

    // Format response
    const formattedRes = {
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

    return NextResponse.json(formattedRes, { status: 201 });
  } catch (error: any) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      {
        error: "Failed to create reservation",
        reason: error.message || null,
      },
      { status: 500 }
    );
  }
}