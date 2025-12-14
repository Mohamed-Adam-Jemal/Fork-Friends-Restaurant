import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET: Fetch all tables (PUBLIC)
export async function GET(_request: NextRequest) {
  try {
    const tables = await prisma.table.findMany({
      orderBy: { tableNumber: "asc" },
    });
    return NextResponse.json(tables, { status: 200 });
  } catch (error) {
    console.error("Error fetching tables:", error);
    return NextResponse.json(
      { error: "Failed to fetch tables." },
      { status: 500 }
    );
  }
}

// POST: Create new table(s) (PROTECTED)
export async function POST(request: NextRequest) {
  // 🔐 Auth check
  const authCheck = requireAuth(request);
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    type TableInput = {
      seats: number;
      type: "Indoor" | "Outdoor";
      availability?: boolean;
    };

    // Normalize input to an array
    const body: TableInput | TableInput[] = await request.json();
    const tablesArray: TableInput[] = Array.isArray(body) ? body : [body];

    // Validate required fields
    for (const table of tablesArray) {
      if (!table.seats || !table.type) {
        return NextResponse.json(
          { error: "Missing required fields: seats or type." },
          { status: 400 }
        );
      }
    }

    // Fetch existing table numbers
    const existingTables = await prisma.table.findMany({
      select: { tableNumber: true },
    });
    const existingNumbers = existingTables.map((t) => t.tableNumber);

    // Assign unique table numbers
    const tablesToInsert = tablesArray.map((table) => {
      let tableNumber = 1;
      while (existingNumbers.includes(tableNumber)) tableNumber++;
      existingNumbers.push(tableNumber);
      return {
        tableNumber,
        seats: table.seats,
        type: table.type,
        availability: table.availability ?? true,
      };
    });

    // Insert all tables
    await prisma.table.createMany({
      data: tablesToInsert,
    });

    // Return full inserted tables
    const insertedTables = await prisma.table.findMany({
      where: {
        tableNumber: { in: tablesToInsert.map((t) => t.tableNumber) },
      },
      orderBy: { tableNumber: "asc" },
    });

    return NextResponse.json(insertedTables, { status: 201 });
  } catch (error: any) {
    console.error("Error creating table(s):", error);
    // Handle unique constraint errors gracefully
    if (
      error.code === "P2002" &&
      error.meta?.target?.includes("tableNumber")
    ) {
      return NextResponse.json(
        { error: "One or more table numbers already exist." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create table(s)." },
      { status: 500 }
    );
  }
}

// PUT: Update a table (PROTECTED)
export async function PUT(request: NextRequest) {
  // 🔐 Auth check
  const authCheck = requireAuth(request);
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid table ID." },
        { status: 400 }
      );
    }

    type UpdateInput = {
      seats?: number;
      type?: string;
      availability?: boolean;
    };

    const body: UpdateInput = await request.json();

    // Update the table
    const updatedTable = await prisma.table.update({
      where: { id: Number(id) },
      data: {
        ...(body.seats !== undefined && { seats: body.seats }),
        ...(body.type && { type: body.type }),
        ...(body.availability !== undefined && {
          availability: body.availability,
        }),
      },
    });

    return NextResponse.json(updatedTable, { status: 200 });
  } catch (error: any) {
    console.error("Error updating table:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Table not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update table." },
      { status: 500 }
    );
  }
}

// PATCH: Toggle or update table availability (PROTECTED)
export async function PATCH(request: NextRequest) {
  // 🔐 Auth check
  const authCheck = requireAuth(request);
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid table ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Update availability
    const updatedTable = await prisma.table.update({
      where: { id: Number(id) },
      data: {
        availability: body.availability,
      },
    });

    return NextResponse.json(updatedTable, { status: 200 });
  } catch (error: any) {
    console.error("Error updating table availability:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Table not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update table availability." },
      { status: 500 }
    );
  }
}

// DELETE: Delete a table (PROTECTED)
export async function DELETE(request: NextRequest) {
  // 🔐 Auth check
  const authCheck = requireAuth(request);
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid table ID." },
        { status: 400 }
      );
    }

    // Delete the table
    await prisma.table.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Table deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting table:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Table not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete table." },
      { status: 500 }
    );
  }
}