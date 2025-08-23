import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: fetch all orders (secured)
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get date query parameter
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date'); // expected format: 'YYYY-MM-DD'

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (date) {
      // Filter by only the date part of created_at
      query = query.eq('created_at::date', date); // works for PostgreSQL
    }

    const { data: orders, error } = await query;

    if (error) throw error;

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST: create new order (open)
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { name, email, phone, address, total, items, status } = body;

    if (!name || !email || !phone || !address || !total || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Missing or invalid fields: name, email, phone, address, total, items[]' },
        { status: 400 }
      );
    }

    // Default status to "In Progress" if not provided
    const orderStatus =
      status && (status === 'In Progress' || status === 'Done') ? status : 'In Progress';

    const { data: newOrder, error } = await supabase
      .from('orders')
      .insert([
        {
          name,
          email,
          phone,
          address,
          total,
          items,
          status: orderStatus,
          created_at: new Date().toISOString(), // explicitly set timestamp
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
