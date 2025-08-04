import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

// GET: fetch all orders
export async function GET() {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

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
    const { name, email, phone, address, total, items } = body;

    if (!name || !email || !phone || !address || !total || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Missing or invalid fields: name, email, phone, address, total, items[]' },
        { status: 400 }
      );
    }

    const { data: newOrder, error } = await supabase.from('orders').insert([
      {
        name,
        email,
        phone,
        address,
        total,
        items,
      },
    ]).select().single();

    if (error) throw error;

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
