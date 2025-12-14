export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// ==============================
// GET contact by ID (PROTECTED)
// ==============================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 🔐 Auth check
  const authCheck = requireAuth(request);
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }

    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch message." }, { status: 500 });
  }
}

// ==============================
// PATCH contact by ID (PROTECTED)
// ==============================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 🔐 Auth check
  const authCheck = requireAuth(request);
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    const updates = await request.json();

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(updatedContact, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Failed to update message." }, { status: 500 });
  }
}

// ==============================
// DELETE contact by ID (PROTECTED)
// ==============================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 🔐 Auth check
  const authCheck = requireAuth(request);
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    await prisma.contact.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Message deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete message." }, { status: 500 });
  }
}
