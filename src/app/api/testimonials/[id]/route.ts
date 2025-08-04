import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(_: Request, context: { params: { id: string } }) {
  const id = Number(context.params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const { data, error } = await supabase
    .from("testimonial")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Supabase returns this code if no record is found with .single()
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to fetch testimonial" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
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
  const id = Number(context.params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const { error } = await supabase.from("testimonial").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }

  return NextResponse.json({ message: "Deleted successfully" });
}
