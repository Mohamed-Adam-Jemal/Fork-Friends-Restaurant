import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Helper: get authenticated user
async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return { user, supabase };
}

// GET: Fetch all tables (secured)
export async function GET(_request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: tables, error } = await auth.supabase
      .from("tables")
      .select("*");

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

// POST: Create a new table (secured) with auto-generated table_number
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { seats, type } = body;

    if (!seats || !type) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Fetch existing table numbers
    const { data: existingTables, error: fetchError } = await auth.supabase
      .from("tables")
      .select("table_number");

    if (fetchError) {
      console.error("Supabase fetch error:", fetchError);
      return NextResponse.json({ error: "Failed to fetch existing table numbers." }, { status: 500 });
    }

    // Generate next available table_number
    const existingNumbers = existingTables?.map((t: any) => t.table_number) || [];
    let table_number = 1;
    while (existingNumbers.includes(table_number)) {
      table_number++;
    }

    const { data, error } = await auth.supabase
      .from("tables")
      .insert([
        {
          table_number,
          seats,
          type,
          availability: true,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

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
