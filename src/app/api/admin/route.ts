import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";  // If passwords are hashed
import Email from "next-auth/providers/email";
import { generateJWT } from "@/utils/jwt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Find admin user by username
    const adminUser = await prisma.admin.findUnique({
      where: { email },
    });

    if (!adminUser) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // If passwords are hashed in DB:
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate a JWT token or a session cookie here:
    // For example, create JWT:
    const token = generateJWT({ id: adminUser.id, Email: adminUser.email });

    // Send token as cookie or in response body:
    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Implement generateJWT() using your preferred JWT library
