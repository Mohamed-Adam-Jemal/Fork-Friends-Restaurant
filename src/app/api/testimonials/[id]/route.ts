import { NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';

async function checkSession() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return { session, supabase };
}

export async function GET(_: Request, context: { params: { id: string } }) {
  const supabase = await createClient();
  const id = Number(context.params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to fetch testimonial" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
  const { session, supabase } = await checkSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(context.params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const body = await req.json();

  const { data, error } = await supabase
    .from("testimonial")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(_: Request, context: { params: { id: string } }) {
  const { session, supabase } = await checkSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(context.params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const { error } = await supabase.from("testimonial").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }

  return NextResponse.json({ message: "Deleted successfully" });
}
