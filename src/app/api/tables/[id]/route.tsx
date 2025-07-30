import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const tableId = parseInt(params.id);
    if (isNaN(tableId)) {
      return NextResponse.json({ error: "Invalid table ID" }, { status: 400 });
    }

    const body = await request.json();
    const { availability } = body;

    if (typeof availability !== "boolean") {
      return NextResponse.json({ error: "Invalid availability value" }, { status: 400 });
    }

    const updatedTable = await prisma.table.update({
      where: { id: tableId },
      data: { availability },
    });

    return NextResponse.json(updatedTable, { status: 200 });
  } catch (error) {
    console.error("Error updating table:", error);
    return NextResponse.json({ error: "Failed to update table." }, { status: 500 });
  }
}
