import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie");
  if (!cookie) return NextResponse.json({ admin: null });

  const match = cookie.match(/admin_token=([^;]+)/);
  if (!match) return NextResponse.json({ admin: null });

  try {
    const payload: any = jwt.verify(match[1], JWT_SECRET);

    const admin = await prisma.admin.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ admin });
  } catch {
    return NextResponse.json({ admin: null });
  }
}
