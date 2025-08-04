import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET: Fetch all tables
export async function GET() {
  try {
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

// POST: Create a new table
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { number, seats, type } = body;

    if (!number || !seats || !type) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const { data, error } = await supabase.from("tables").insert([
      {
        table_number: number,
        seats,
        type,
        availability: true,
      },
    ]).select().single(); // select().single() returns the inserted row

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
