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

// POST: create a new reservation with detailed error messages
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

    // Required fields validation
    if (!firstName || !lastName || !email || !phone || !date || !time || !guests || !seating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const guestCount = Number(guests);

    // Date validation
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`); // assuming time in "HH:MM" 24h format

    if (selectedDateTime <= now) {
      return NextResponse.json(
        { error: "Invalid time", reason: "Cannot reserve a table in the past." },
        { status: 400 }
      );
    }

    // Check tables by seating type
    const { data: tablesByType, error: tablesError } = await supabase
      .from("tables")
      .select("*")
      .eq("type", seating);

    if (tablesError) throw tablesError;

    if (!tablesByType || tablesByType.length === 0) {
      return NextResponse.json(
        { error: "No tables of selected type", reason: `No ${seating} tables available` },
        { status: 409 }
      );
    }

    // Filter tables by number of seats
    const suitableTables = tablesByType.filter(t => t.seats >= guestCount);

    if (suitableTables.length === 0) {
      return NextResponse.json(
        { error: "No tables with enough seats", reason: `No ${seating} tables can accommodate ${guestCount} guests` },
        { status: 409 }
      );
    }

    // Check availability at the requested date/time
    const { data: existingReservations, error: resError } = await supabase
      .from("reservations")
      .select("table_id")
      .eq("date", date)
      .eq("time", time)
      .in("table_id", suitableTables.map(t => t.id));

    if (resError) throw resError;

    const availableTables = suitableTables.filter(
      t => !existingReservations?.some(r => r.table_id === t.id)
    );

    if (availableTables.length === 0) {
      return NextResponse.json(
        {
          error: "All tables booked",
          reason: `All ${seating} tables for ${guestCount} guests are already reserved at ${time} on ${date}`
        },
        { status: 409 }
      );
    }

    // Choose the first available table
    const tableToReserve = availableTables[0];

    // Insert reservation
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
        table_id: tableToReserve.id,
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
    await supabase
      .from("tables")
      .update({ availability: false })
      .eq("id", tableToReserve.id);

    return NextResponse.json(reservation, { status: 201 });

  } catch (error: any) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "Failed to create reservation", reason: error.message || null },
      { status: 500 }
    );
  }
}