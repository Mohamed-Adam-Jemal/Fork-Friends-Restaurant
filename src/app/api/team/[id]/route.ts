import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Helper to get authenticated user and Supabase client
async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user) return null;
  return { user, supabase };
}

// GET: fetch single team member by ID (open)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const { data, error } = await supabase.from("team").select("*").eq("id", id).single();

  if (error || !data) {
    console.error("Error fetching team member:", error);
    return NextResponse.json({ error: "Team member not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PUT: update team member (secured)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { data, error } = await auth.supabase
      .from("team")
      .update({
        name: body.name,
        email: body.email,
        phone: body.phone,
        role: body.role,
        quote: body.quote,
        image: body.image,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
}

// DELETE: delete team member (secured)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const { error } = await auth.supabase.from("team").delete().eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
  }

  return NextResponse.json({ message: "Team member deleted successfully" });
}