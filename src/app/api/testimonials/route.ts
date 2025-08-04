import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(): Promise<NextResponse> {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { name, photo, rating, content } = body;

    if (!name || !rating || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase.from('testimonials').insert([
      {
        name,
        photo,
        rating,
        content,
      },
    ]).select().single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
