import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// PATCH — Update table availability
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const tableId = parseInt(params.id);
    if (isNaN(tableId)) {
      return NextResponse.json({ error: "Invalid table ID" }, { status: 400 });
    }

    const body = await request.json();
    const { availability } = body;

    if (typeof availability !== "boolean") {
      return NextResponse.json(
        { error: "Invalid availability value" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("table")
      .update({ availability })
      .eq("id", tableId)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { error: "Failed to update table" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Unexpected error (PATCH):", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET — Get a single table by ID
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const tableId = parseInt(params.id);
    if (isNaN(tableId)) {
      return NextResponse.json({ error: "Invalid table ID" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("table")
      .select("*")
      .eq("id", tableId)
      .single();

    if (error || !data) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { error: "Table not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Unexpected error (GET):", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE — Delete a table by ID
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const tableId = parseInt(params.id);
    if (isNaN(tableId)) {
      return NextResponse.json({ error: "Invalid table ID" }, { status: 400 });
    }

    const { error } = await supabase
      .from("table")
      .delete()
      .eq("id", tableId);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete table" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: `Table ${tableId} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error (DELETE):", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
