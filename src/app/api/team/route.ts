import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('team')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Check user session for authorization
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const { data, error } = await supabase.from('team').insert([
      {
        name: body.name,
        email: body.email,
        phone: body.phone,
        role: body.role,
        quote: body.quote,
        image: body.image,
      },
    ]);

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ error: 'Failed to add team member' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
