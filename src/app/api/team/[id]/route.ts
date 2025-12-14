import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET: fetch single team member by ID (protected)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = requireAuth(req);
  if (authCheck instanceof NextResponse) return authCheck;

  const { id } = await params;
  const memberId = Number(id);
  if (isNaN(memberId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const member = await prisma.team.findUnique({ where: { id: memberId } });
    if (!member) return NextResponse.json({ error: "Team member not found" }, { status: 404 });

    return NextResponse.json(member, { status: 200 });
  } catch (err) {
    console.error("GET team member error:", err);
    return NextResponse.json({ error: "Failed to fetch team member" }, { status: 500 });
  }
}

// PUT: update team member (protected)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = requireAuth(req);
  if (authCheck instanceof NextResponse) return authCheck;

  const { id } = await params;
  const memberId = Number(id);
  if (isNaN(memberId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const body = await req.json();

    const updatedMember = await prisma.team.update({
      where: { id: memberId },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone ?? null,
        role: body.role,
        quote: body.quote ?? null,
        image: body.image ?? null,
      },
    });

    return NextResponse.json(updatedMember, { status: 200 });
  } catch (err: any) {
    console.error("PUT team member error:", err);

    if (err.code === "P2002" && err.meta?.target?.includes("email")) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
  }
}

// DELETE: delete team member (protected)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = requireAuth(req);
  if (authCheck instanceof NextResponse) return authCheck;

  const { id } = await params;
  const memberId = Number(id);
  if (isNaN(memberId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    await prisma.team.delete({ where: { id: memberId } });
    return NextResponse.json({ message: "Team member deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE team member error:", err);
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
  }
}
