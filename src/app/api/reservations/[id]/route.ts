import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Helper to securely get the authenticated user
async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

// Type for route context params
interface RouteParams {
  id: string;
}

// GET: Fetch a single reservation
export async function GET(
  req: NextRequest,
  context: { params: Promise<RouteParams> }
): Promise<NextResponse> {
  const params = await context.params;
  const numericId = Number(params.id);
  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 });
  }

  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createClient();
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
    console.error("GET reservation error:", error);
    return NextResponse.json({ error: "Failed to fetch reservation" }, { status: 500 });
  }
}

// PATCH: Update a reservation
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<RouteParams> }
): Promise<NextResponse> {
  const params = await context.params;
  const numericId = Number(params.id);
  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 });
  }

  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const updates: Record<string, any> = {};

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

    const supabase = await createClient();
    const { data: updatedReservation, error } = await supabase
      .from("reservations")
      .update(updates)
      .eq("id", numericId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updatedReservation, { status: 200 });
  } catch (error) {
    console.error("PATCH reservation error:", error);
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 });
  }
}

// DELETE: Delete a reservation and free the table
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<RouteParams> }
): Promise<NextResponse> {
  const params = await context.params;
  const numericId = Number(params.id);
  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 });
  }

  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createClient();

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

    const { error: deleteError } = await supabase.from("reservations").delete().eq("id", numericId);
    if (deleteError) throw deleteError;

    const { error: updateTableError } = await supabase
      .from("tables")
      .update({ availability: true })
      .eq("id", reservation.table_id);

    if (updateTableError) console.error("Failed to update table availability:", updateTableError);

    return NextResponse.json({ message: "Deleted reservation and freed table" }, { status: 200 });
  } catch (error) {
    console.error("DELETE reservation error:", error);
    return NextResponse.json({ error: "Failed to delete reservation" }, { status: 500 });
  }
}