// app/api/menu/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = Array.isArray(body) ? body : [body];

    // Validate required fields for each item
    for (const item of items) {
      if (!item.name || !item.price || !item.category) {
        return NextResponse.json(
          { error: 'Each item must have name, price, and category' },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from('menu_items')
      .insert(
        items.map((item) => ({
          name: item.name,
          description: item.description || '',
          price: item.price,
          image: item.image || '',
          category: item.category,
          cuisine: item.cuisine || '',
          featured: item.featured ?? false,
          chef_choice: item.chefChoice ?? false,
        }))
      );

    if (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to create menu items' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Menu items added successfully', data }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Invalid request format' }, { status: 500 });
  }
}
