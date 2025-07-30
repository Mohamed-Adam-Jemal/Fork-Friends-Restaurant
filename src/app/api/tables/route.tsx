import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tables = await prisma.table.findMany();
    return NextResponse.json(tables, { status: 200 });
  } catch (error) {
    console.error("Error fetching tables:", error);
    return NextResponse.json({ error: "Failed to fetch tables." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { number, seats, type } = body;

    if (!number || !seats || !type) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const table = await prisma.table.create({
      data: {
        number,
        seats,
        type,
        availability: true,
      },
    });

    return NextResponse.json(table, { status: 201 });
  } catch (error) {
    console.error("Error creating table:", error);
    return NextResponse.json({ error: "Failed to create table." }, { status: 500 });
  }
}
