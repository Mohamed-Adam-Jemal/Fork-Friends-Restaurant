import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET: Fetch all team members (protected)
export async function GET(req: NextRequest) {
  try {
    const team = await prisma.team.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

// POST: Add a new team member (protected)
export async function POST(req: NextRequest) {
  const authCheck = requireAuth(req);
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const { name, email, phone, role, quote, image } = body;

    // Validate required fields
    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, or role." },
        { status: 400 }
      );
    }

    const newMember = await prisma.team.create({
      data: {
        name,
        email,
        phone: phone ?? null,
        role,
        quote: quote ?? null,
        image: image ?? null,
      },
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (err: any) {
    console.error("Error adding team member:", err);

    // Handle Prisma unique constraint error
    if (err?.code === "P2002" && err?.meta?.target?.includes("email")) {
      return NextResponse.json(
        { error: "A team member with this email already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add team member." },
      { status: 500 }
    );
  }
}
