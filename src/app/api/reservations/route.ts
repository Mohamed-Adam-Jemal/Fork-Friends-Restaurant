import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';

// Helper to get authenticated user
async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

// GET: fetch all reservations (optionally filtered by date/time)
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    let query = supabase
      .from("reservations")
      .select(`
        *,
        table_id (
          id,
          table_number,
          seats,
          type,
          availability
        )
      `)
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (date) query = query.eq("date", date);
    if (time) query = query.eq("time", time);

    const { data: reservations, error } = await query;

    if (error) throw error;

    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json({ error: "Failed to fetch reservations." }, { status: 500 });
  }
}

// POST: create a new reservation
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      date,
      time,
      guests,
      specialRequests,
      occasion,
      seating,
    } = body;

    if (!firstName || !lastName || !email || !phone || !date || !time || !guests || !seating) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const guestCount = Number(guests);

    // Find an available table
    const { data: availableTables, error: tableError } = await supabase
      .from("tables")
      .select("*")
      .gte("seats", guestCount)
      .eq("type", seating)
      .eq("availability", true)
      .order("seats", { ascending: true })
      .limit(1);

    if (tableError) throw tableError;

    if (!availableTables || availableTables.length === 0) {
      return NextResponse.json({ error: "No available tables for the selected seating and guests." }, { status: 409 });
    }

    const availableTable = availableTables[0];

    const { data: reservation, error: insertError } = await supabase
      .from("reservations")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        date,
        time,
        guests: guestCount,
        special_requests: specialRequests ?? null,
        occasion: occasion ?? null,
        seating,
        table_id: availableTable.id,
      })
      .select(`
        *,
        table_id (
          id,
          table_number,
          seats,
          type,
          availability
        )
      `)
      .single();

    if (insertError) throw insertError;

    // Update table availability
    const { error: updateError } = await supabase
      .from("tables")
      .update({ availability: false })
      .eq("id", availableTable.id);

    if (updateError) console.error("Error updating table availability:", updateError);

    return NextResponse.json(reservation, { status: 201 });

  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json({ error: "Failed to create reservation." }, { status: 500 });
  }
}
