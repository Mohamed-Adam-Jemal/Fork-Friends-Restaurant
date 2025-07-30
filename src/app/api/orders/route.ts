import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: fetch all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST: create new order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, total, items } = body;

    if (!name || !email || !phone || !total || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Missing or invalid fields: name, email, phone, total, items[]' },
        { status: 400 }
      );
    }

    const newOrder = await prisma.order.create({
      data: {
        name,
        email,
        phone,
        total,
        items,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
