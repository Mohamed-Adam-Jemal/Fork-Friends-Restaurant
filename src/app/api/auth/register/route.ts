import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // Auth check
  const authCheck = requireAuth(req);
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, or password" },
        { status: 400 }
      );
    }

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Admin created", admin }, { status: 201 });
  } catch (err: any) {
    console.error("Admin creation error:", err);
    return NextResponse.json({ error: err.message || "Failed to create admin" }, { status: 500 });
  }
}
