import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, name, age, role } = await request.json();

    // Validate required fields
    if (!email || !password || !firstName || !name || !age || !role) {
      return NextResponse.json(
        { message: "All fields (email, password, firstName, name, age, role) are required." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user with all fields
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        name,
        age: Number(age), // make sure age is a number
        role,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully.",
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          name: newUser.name,
          age: newUser.age,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
