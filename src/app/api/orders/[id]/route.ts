import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const runtime = "nodejs";

async function handler(
  method: string,
  req: NextRequest,
  params: { id: string }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    switch (method) {
      case "GET":
        return await handleGET(id);
      case "PUT":
        return await handlePUT(req, id);
      case "PATCH":
        return await handlePATCH(req, id);
      case "DELETE":
        return await handleDELETE(id, req);
      default:
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
  } catch (error: any) {
    console.error(`${method} error:`, error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ error: `Failed to ${method.toLowerCase()} order` }, { status: 500 });
  }
}

async function handleGET(id: number) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(order);
}

async function handlePUT(req: NextRequest, id: number) {
  const authCheck = requireAuth(req);
  if (authCheck instanceof NextResponse) return authCheck;

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

  return NextResponse.json(updatedOrder);
}

async function handlePATCH(req: NextRequest, id: number) {
  const authCheck = requireAuth(req);
  if (authCheck instanceof NextResponse) return authCheck;

  const body = await req.json();
  const allowedFields = ["name", "email", "phone", "address", "total", "items", "status"];
  const updates: Record<string, any> = {};

  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      if (key === "status" && (body[key] === "In Progress" || body[key] === "Done")) {
        updates[key] = body[key];
      } else if (key !== "status") {
        updates[key] = body[key];
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields provided for update" }, { status: 400 });
  }

  const updatedOrder = await prisma.order.update({ where: { id }, data: updates });

  return NextResponse.json(updatedOrder);
}

async function handleDELETE(id: number, req: NextRequest) {
  const authCheck = requireAuth(req);
  if (authCheck instanceof NextResponse) return authCheck;

  await prisma.order.delete({ where: { id } });

  return NextResponse.json({ message: "Order deleted successfully" });
}

export async function GET(req: NextRequest, { params }: any) {
  return handler("GET", req, params);
}

export async function PUT(req: NextRequest, { params }: any) {
  return handler("PUT", req, params);
}

export async function PATCH(req: NextRequest, { params }: any) {
  return handler("PATCH", req, params);
}

export async function DELETE(req: NextRequest, { params }: any) {
  return handler("DELETE", req, params);
}