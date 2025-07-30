import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    const where: any = {};

    if (date) {
      where.date = new Date(date);
    }
    if (time) {
      where.time = time;
    }

    const reservations = await prisma.reservation.findMany({
      where,
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

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
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const guestCount = parseInt(guests);
    const parsedDate = new Date(date);

    // Find available table for requested seating, seats and availability = true
    const availableTable = await prisma.table.findFirst({
      where: {
        seats: { gte: guestCount },
        type: seating,
        availability: true,
      },
      orderBy: {
        seats: "asc", // choose smallest fitting table for efficiency
      },
    });

    if (!availableTable) {
      return NextResponse.json(
        { error: "No available tables for the selected seating and guests." },
        { status: 409 }
      );
    }

    // Create reservation with the available table
    const reservation = await prisma.reservation.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        date: parsedDate,
        time,
        guests: guestCount,
        specialRequests,
        occasion,
        seating,
        tableNumber: availableTable.number,
      },
    });

    // Update table availability to false
    await prisma.table.update({
      where: { id: availableTable.id },
      data: { availability: false },
    });

    return NextResponse.json(reservation, { status: 201 });


    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "Failed to create reservation." },
      { status: 500 }
    );
  }
}
