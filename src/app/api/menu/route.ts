// app/api/menu/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET: Fetch all menu items
export async function GET(req: NextRequest) {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(menuItems)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 })
  }
}

// POST: Add many menu items at once (bulk insert)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const items = Array.isArray(body) ? body : [body]; // wrap single item in array

    for (const item of items) {
      if (!item.name || !item.price || !item.category) {
        return NextResponse.json(
          { error: 'Each item must have name, price, and category' },
          { status: 400 }
        );
      }
    }

    await prisma.menuItem.createMany({
      data: items.map((item) => ({
        name: item.name,
        description: item.description ?? '',
        price: item.price,
        image: item.image ?? '',
        category: item.category,
        chefChoice: item.chefChoice ?? false,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ message: 'Menu items added successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create menu items' }, { status: 500 });
  }
}
