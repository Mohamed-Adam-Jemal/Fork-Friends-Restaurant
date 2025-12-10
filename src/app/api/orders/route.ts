import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Helper to get authenticated user
async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

// GET: fetch all orders (secured)
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = await createClient();

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
          created_at: new Date().toISOString(),
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
