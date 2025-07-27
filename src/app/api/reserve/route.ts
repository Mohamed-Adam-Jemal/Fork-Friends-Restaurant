import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    } = body;

    const reservation = await prisma.reservation.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        date: new Date(date),
        time,
        guests: parseInt(guests),
        specialRequests,
        occasion,
      },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "Failed to create reservation." },
      { status: 500 }
    );
  }
}
