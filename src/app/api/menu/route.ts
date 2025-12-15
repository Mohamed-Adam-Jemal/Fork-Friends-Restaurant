export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET all menu items (PUBLIC)
export async function GET(req: NextRequest) {
  try {
    // Explicitly select fields
    const items = await prisma.menuItem.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        category: true,
        cuisine: true,
        chefChoice: true, // Prisma field
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

// POST new menu items (PROTECTED)
export async function POST(req: NextRequest) {
  const authCheck = requireAuth(req);
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const body = await req.json();
    const items = Array.isArray(body) ? body : [body];

    // Validate required fields
    for (const item of items) {
      if (!item.name || !item.price || !item.category) {
        return NextResponse.json(
          { error: "Each item must have name, price, and category" },
          { status: 400 }
        );
      }
    }

    const createdItems = await prisma.menuItem.createMany({
      data: items.map((item) => ({
        name: item.name,
        description: item.description ?? null,
        price: item.price,
        image: item.image ?? null,
        category: item.category,
        cuisine: item.cuisine ?? null,
        featured: item.featured ?? false,
        chefChoice: item.chefChoice ?? false,
      })),
    });

    return NextResponse.json(
      {
        message: "Menu items added successfully",
        count: createdItems.count,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 500 }
    );
  }
}
