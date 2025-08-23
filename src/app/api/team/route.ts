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

  // Safe destructuring
  const getSessionRes = await supabase.auth.getSession();
  const session = getSessionRes.data?.session ?? null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.email || !body.role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase.from('team').insert([
      {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        role: body.role,
        quote: body.quote || null,
        image: body.image || null,
      },
    ]);

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ error: 'Failed to add team member' }, { status: 500 });
    }

    return NextResponse.json(data?.[0] ?? null, { status: 201 });
  } catch (err) {
    console.error('POST error:', err);
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
