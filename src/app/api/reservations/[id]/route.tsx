import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    return NextResponse.json(reservation, { status: 200 });
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return NextResponse.json({ error: "Failed to fetch reservation." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
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

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(date && { date: new Date(date) }),
        ...(time && { time }),
        ...(guests && { guests: Number(guests) }),
        ...(specialRequests !== undefined && { specialRequests }),
        ...(occasion !== undefined && { occasion }),
        ...(seating && { seating }),
      },
    });

    return NextResponse.json(updatedReservation, { status: 200 });
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json({ error: "Failed to update reservation." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    await prisma.reservation.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Reservation deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json({ error: "Failed to delete reservation." }, { status: 500 });
  }
}
