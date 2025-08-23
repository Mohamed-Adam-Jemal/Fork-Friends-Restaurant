import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function checkSession() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return { session, supabase };
}

// GET single reservation
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { session, supabase } = await checkSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const numericId = Number(params.id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 });
    }

    const { data: reservation, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("id", numericId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(reservation, { status: 200 });
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return NextResponse.json({ error: "Failed to fetch reservation." }, { status: 500 });
  }
}

// PATCH update reservation
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { session, supabase } = await checkSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const numericId = Number(params.id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 });
    }

    const body = await request.json();

    const updates: any = {};
    if ("firstName" in body) updates.first_name = body.firstName;
    if ("lastName" in body) updates.last_name = body.lastName;
    if ("email" in body) updates.email = body.email;
    if ("phone" in body) updates.phone = body.phone;
    if ("date" in body) updates.date = body.date;
    if ("time" in body) updates.time = body.time;
    if ("guests" in body) updates.guests = Number(body.guests);
    if ("specialRequests" in body) updates.special_requests = body.specialRequests;
    if ("occasion" in body) updates.occasion = body.occasion;
    if ("seating" in body) updates.seating = body.seating;
    if ("tableId" in body) updates.table_id = Number(body.tableId); 

    const { data: updatedReservation, error } = await supabase
      .from("reservations")
      .update(updates)
      .eq("id", numericId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updatedReservation, { status: 200 });
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json({ error: "Failed to update reservation." }, { status: 500 });
  }
}

// DELETE reservation
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { session, supabase } = await checkSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params
    const { id } = await params;
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 });
    }

    // Fetch reservation
    const { data: reservation, error: fetchError } = await supabase
      .from("reservations")
      .select("table_id")
      .eq("id", numericId)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
      }
      throw fetchError;
    }

    // Delete reservation
    const { error: deleteError } = await supabase
      .from("reservations")
      .delete()
      .eq("id", numericId);
    if (deleteError) throw deleteError;

    // Update table availability
    const { error: updateTableError } = await supabase
      .from("tables")
      .update({ availability: true })
      .eq("id", reservation.table_id);
    if (updateTableError) console.error("Error updating table:", updateTableError);

    return NextResponse.json({ message: "Deleted and freed up table." });
  } catch (error) {
    console.error("DELETE /api/reservations/[id] failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}