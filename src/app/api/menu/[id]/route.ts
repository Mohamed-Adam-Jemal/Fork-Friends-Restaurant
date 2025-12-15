import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const runtime = "nodejs";

// ==============================
// GET menu item by ID (PUBLIC)
// ==============================
export async function GET(
  _request: NextRequest,
  context: any
) {
  try {
    const id = Number(context.params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const item = await prisma.menuItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch menu item" }, { status: 500 });
  }
}

// ==============================
// PATCH menu item by ID (PROTECTED)
// ==============================
export async function PATCH(
  request: NextRequest,
  context: any
) {
  const authCheck = requireAuth(request);
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const id = Number(context.params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const updates = await request.json();
    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: updates,
    });
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
  }
}

// ==============================
// DELETE menu item by ID (PROTECTED)
// ==============================
export async function DELETE(
  request: NextRequest,
  context: any
) {
  const authCheck = requireAuth(request);
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const id = Number(context.params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 });
  }
}