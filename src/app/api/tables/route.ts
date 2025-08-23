import { NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';

async function checkSession() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return { session, supabase };
}

// GET: Fetch all tables (open)
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: tables, error } = await supabase.from("tables").select("*");

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch tables." }, { status: 500 });
    }

    return NextResponse.json(tables, { status: 200 });
  } catch (error) {
    console.error("Error fetching tables:", error);
    return NextResponse.json({ error: "Failed to fetch tables." }, { status: 500 });
  }
}

// POST: Create a new table (secured)
export async function POST(request: Request) {
  try {
    const { session, supabase } = await checkSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { table_number, seats, type } = body;


    if (!table_number || !seats || !type) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    
    const { data, error } = await supabase.from("tables").insert([
      {
        table_number,
        seats,
        type,
        availability: true,
      },
    ]).select().single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to create table." }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating table:", error);
    return NextResponse.json({ error: "Failed to create table." }, { status: 500 });
  }
}
