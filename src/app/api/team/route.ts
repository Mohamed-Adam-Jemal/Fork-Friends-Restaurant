import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Helper to get authenticated user
async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error, supabase };
}

// GET: fetch all team members (secured)
export async function GET() {
  const { user, error, supabase } = await getAuthenticatedUser();

  // Check authentication
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error: fetchError } = await supabase
      .from("team")
      .select("*")
      .order("id", { ascending: true });

    if (fetchError) {
      console.error("Error fetching team:", fetchError);
      return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET /team error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: add a new team member (secured)
export async function POST(req: NextRequest) {
  const { user, error, supabase } = await getAuthenticatedUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.email || !body.role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error: insertError } = await supabase.from("team").insert([
      {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        role: body.role,
        quote: body.quote || null,
        image: body.image || null,
      },
    ]).select().single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: "Failed to add team member" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("POST /team error:", err);
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
}
