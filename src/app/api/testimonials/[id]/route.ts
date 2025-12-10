import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Helper to securely get user
async function checkUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error, supabase };
}

// GET — fetch a single testimonial (secured)
export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { user, error, supabase } = await checkUser();
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const { data, error: fetchError } = await supabase
      .from("testimonials")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
      }
      console.error("Fetch error:", fetchError);
      return NextResponse.json({ error: "Failed to fetch testimonial" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — update testimonial (secured)
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { user, error, supabase } = await checkUser();
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await req.json();

    const { data, error: updateError } = await supabase
      .from("testimonials")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
}

// DELETE — delete testimonial (secured)
export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const { user, error, supabase } = await checkUser();
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const { error: deleteError } = await supabase.from("testimonials").delete().eq("id", id);

  if (deleteError) {
    console.error("Delete error:", deleteError);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }

  return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
}