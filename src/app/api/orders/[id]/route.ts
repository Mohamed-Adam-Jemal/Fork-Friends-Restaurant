export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// ==============================
// GET single order (PUBLIC)
// ==============================
export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// ==============================
// PUT order (PROTECTED)
// ==============================
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authCheck = requireAuth(req);
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const id = parseInt(params.id, 10);
    const body = await req.json();
    const { name, email, phone, address, total, items, status } = body;

    const orderStatus =
      status === "In Progress" || status === "Done" ? status : undefined;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        total,
        items,
        ...(orderStatus && { status: orderStatus }),
      },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// ==============================
// PATCH order (PROTECTED)
// ==============================
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authCheck = requireAuth(req);
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const id = parseInt(params.id, 10);
    const body = await req.json();

    const allowedFields = [
      "name",
      "email",
      "phone",
      "address",
      "total",
      "items",
      "status",
    ];

    const updates: Record<string, any> = {};

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        if (
          key === "status" &&
          (body[key] === "In Progress" || body[key] === "Done")
        ) {
          updates[key] = body[key];
        } else if (key !== "status") {
          updates[key] = body[key];
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    console.error("PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// ==============================
// DELETE order (PROTECTED)
// ==============================
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authCheck = requireAuth(req);
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const id = parseInt(params.id, 10);

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
