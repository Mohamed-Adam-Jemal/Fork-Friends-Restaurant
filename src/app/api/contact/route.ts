// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET: Fetch all contact messages (protected)
export async function GET(req: NextRequest) {
  // 🔐 Auth check
  const authCheck = requireAuth(req);
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const messages = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
  }
}

// POST: Submit a new contact message (public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, subject, message } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const newMessage = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        subject,
        message,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error submitting message:", error);
    return NextResponse.json({ error: "Failed to submit message." }, { status: 500 });
  }
}
