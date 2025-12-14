// src/app/api/tables/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET: fetch table by ID (public)
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const tableId = parseInt(params.id);
  if (isNaN(tableId)) {
    return NextResponse.json({ error: "Invalid table ID" }, { status: 400 });
  }

  try {
    const table = await prisma.table.findUnique({ where: { id: tableId } });
    if (!table) return NextResponse.json({ error: "Table not found" }, { status: 404 });

    return NextResponse.json(table, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to fetch table" }, { status: 500 });
  }
}

// PATCH: partial update (protected)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authCheck = requireAuth(req);
  if (authCheck instanceof NextResponse) return authCheck;

  const tableId = parseInt(params.id);
  if (isNaN(tableId)) return NextResponse.json({ error: "Invalid table ID" }, { status: 400 });

  try {
    const body = await req.json();
    const updates: Partial<{ seats: number; type: "Indoor" | "Outdoor"; availability: boolean; tableNumber: number }> = {};

    if ("availability" in body) updates.availability = body.availability;
    if ("table_number" in body) updates.tableNumber = body.table_number;
    if ("seats" in body) updates.seats = body.seats;
    if ("type" in body) updates.type = body.type;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const updatedTable = await prisma.table.update({ where: { id: tableId }, data: updates });
    return NextResponse.json(updatedTable, { status: 200 });
  } catch (err: any) {
    if (err.code === "P2002" && err.meta?.target?.includes("tableNumber")) {
      return NextResponse.json({ error: "The table number already exists." }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to update table" }, { status: 500 });
  }
}

// PUT: full update (protected)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authCheck = requireAuth(req);
  if (authCheck instanceof NextResponse) return authCheck;

  const tableId = parseInt(params.id);
  if (isNaN(tableId)) return NextResponse.json({ error: "Invalid table ID" }, { status: 400 });

  try {
    const body = await req.json();
    const { table_number, seats, type, availability } = body;

    if (!table_number || !seats || !type || typeof availability !== "boolean") {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const updatedTable = await prisma.table.update({
      where: { id: tableId },
      data: { tableNumber: table_number, seats, type, availability },
    });

    return NextResponse.json(updatedTable, { status: 200 });
  } catch (err: any) {
    if (err.code === "P2002" && err.meta?.target?.includes("tableNumber")) {
      return NextResponse.json({ error: "The table number already exists." }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to update table" }, { status: 500 });
  }
}

// DELETE: remove table (protected)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authCheck = requireAuth(_req);
  if (authCheck instanceof NextResponse) return authCheck;

  const tableId = parseInt(params.id);
  if (isNaN(tableId)) return NextResponse.json({ error: "Invalid table ID" }, { status: 400 });

  try {
    await prisma.table.delete({ where: { id: tableId } });
    return NextResponse.json({ message: `Table ${tableId} deleted successfully` }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to delete table" }, { status: 500 });
  }
}
