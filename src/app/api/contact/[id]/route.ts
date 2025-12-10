import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET by ID
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Extract id from the URL
    const { searchParams } = new URL(request.url);
    const id = request.nextUrl.pathname.split("/").pop(); // extract [id] from path

    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch message." }, { status: 500 });
  }
}

// PATCH by ID
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) return NextResponse.json({ error: "ID is required." }, { status: 400 });

    const updates = await request.json();

    const { data, error } = await supabase
      .from("contacts")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: "Failed to update message." }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update message." }, { status: 500 });
  }
}

// DELETE by ID
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) return NextResponse.json({ error: "ID is required." }, { status: 400 });

    const { data, error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: "Failed to delete message." }, { status: 500 });
    }

    return NextResponse.json({ message: "Message deleted successfully.", data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete message." }, { status: 500 });
  }
}
