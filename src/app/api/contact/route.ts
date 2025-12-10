// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Fetch all contact messages
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
  }
}

// POST: Submit a new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { firstName, lastName, email, phone, subject, message } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("contacts")
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          subject,
          message,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to submit message." }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error submitting message:", error);
    return NextResponse.json({ error: "Failed to submit message." }, { status: 500 });
  }
}
