import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return { user, supabase };
}

//  PATCH (secured)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const tableId = parseInt(resolvedParams.id);
    if (isNaN(tableId)) return NextResponse.json({ error: "Invalid table ID" }, { status: 400 });

    const { availability, table_number } = await req.json();

    const updateData: any = { availability };
    if (table_number !== undefined) updateData.table_number = table_number;

    const { data, error } = await auth.supabase
      .from("tables")
      .update(updateData)
      .eq("id", tableId)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);

      if (error.code === "23505" && error.details?.includes("table_number")) {
        return NextResponse.json({ error: "The table number already exists." }, { status: 409 });
      }

      throw error;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to update table" }, { status: 500 });
  }
}

//  GET (secured)
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const tableId = parseInt(resolvedParams.id);
    if (isNaN(tableId)) return NextResponse.json({ error: "Invalid table ID" }, { status: 400 });

    const { data, error } = await auth.supabase
      .from("tables")
      .select("*")
      .eq("id", tableId)
      .single();

    if (error || !data) return NextResponse.json({ error: "Table not found" }, { status: 404 });

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to fetch table" }, { status: 500 });
  }
}

//  DELETE (secured)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const tableId = parseInt(resolvedParams.id);
    if (isNaN(tableId)) return NextResponse.json({ error: "Invalid table ID" }, { status: 400 });

    const { error } = await auth.supabase.from("tables").delete().eq("id", tableId);
    if (error) throw error;

    return NextResponse.json({ message: `Table ${tableId} deleted successfully` }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to delete table" }, { status: 500 });
  }
}

//  PUT (secured)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const tableId = parseInt(resolvedParams.id);
    if (isNaN(tableId)) return NextResponse.json({ error: "Invalid table ID" }, { status: 400 });

    const body = await req.json();
    const { table_number, seats, type, availability } = body;

    if (!table_number || !seats || !type || typeof availability !== "boolean") {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const { data, error } = await auth.supabase
      .from("tables")
      .update({ table_number, seats, type, availability })
      .eq("id", tableId)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);

      if (error.code === "23505" && error.details?.includes("table_number")) {
        return NextResponse.json({ error: "The table number already exists." }, { status: 409 });
      }

      throw error;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to update table" }, { status: 500 });
  }
}