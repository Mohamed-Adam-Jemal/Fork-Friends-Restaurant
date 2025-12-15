import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// ==============================
// GET: fetch all orders (PUBLIC)
// ==============================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date'); // expected format: 'YYYY-MM-DD'

    let whereClause: any = {};

    if (date) {
      // Filter by date (only the date part of createdAt)
      whereClause = {
        createdAt: {
          gte: new Date(date + 'T00:00:00.000Z'),
          lt: new Date(date + 'T23:59:59.999Z'),
        },
      };
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// ==============================
// POST: create new order 
// ==============================
export async function POST(req: NextRequest) {

  try {
    const body = await req.json();
    const { name, email, phone, address, total, items, status } = body;

    if (!name || !email || !phone || !address || !total || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Missing or invalid fields: name, email, phone, address, total, items[]' },
        { status: 400 }
      );
    }

    const orderStatus =
      status && (status === 'In Progress' || status === 'Done') ? status : 'In Progress';

    const newOrder = await prisma.order.create({
      data: {
        name,
        email,
        phone,
        address,
        total,
        items,
        status: orderStatus,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
