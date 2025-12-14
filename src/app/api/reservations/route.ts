import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import type { Table } from "@prisma/client";

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
        ...(date && { date: new Date(date) }),
        ...(time && { time }),
      },
      orderBy: [
        { date: "asc" },
        { time: "asc" },
      ],
      include: {
        table: true,
      },
    });

    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json({ error: "Failed to fetch reservations." }, { status: 500 });
  }
}

// ==============================
// POST: create a new reservation (PROTECTED)
// ==============================
export async function POST(req: NextRequest) {
  // 🔐 Auth check
  const authCheck = requireAuth(req);
  if (authCheck instanceof NextResponse) return authCheck;

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
      seating,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !date || !time || !guests || !seating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const guestCount = Number(guests);
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    if (selectedDateTime <= now) {
      return NextResponse.json(
        { error: "Cannot reserve a table in the past." },
        { status: 400 }
      );
    }

    // Find tables matching seating type and enough seats
    const suitableTables = await prisma.table.findMany({
      where: {
        type: seating,
        seats: { gte: guestCount },
      },
    });

    if (suitableTables.length === 0) {
      return NextResponse.json(
        { error: `No ${seating} tables can accommodate ${guestCount} guests` },
        { status: 409 }
      );
    }

    // Check table availability
    const reservationsAtTime = await prisma.reservation.findMany({
      where: {
        date: new Date(date),
        time,
        tableId: { in: suitableTables.map((t: Table) => t.id) },
      },
      select: { tableId: true },
    });

    const availableTables = suitableTables.filter(
      (t: Table) => !reservationsAtTime.some((r: { tableId: number; }) => r.tableId === t.id)
    );

    if (availableTables.length === 0) {
      return NextResponse.json(
        { error: `All ${seating} tables are already reserved at ${time} on ${date}` },
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
        seating,
        tableId: tableToReserve.id,
      },
      include: { table: true },
    });

    // Optionally mark table as unavailable
    await prisma.table.update({
      where: { id: tableToReserve.id },
      data: { availability: false },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error: any) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "Failed to create reservation", reason: error.message || null },
      { status: 500 }
    );
  }
}
