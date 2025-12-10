import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Helper: get authenticated user
async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return { user, supabase };
}

// GET: Fetch all tables (secured)
export async function GET(_request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: tables, error } = await auth.supabase
      .from("tables")
      .select("*");

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch tables." }, { status: 500 });
    }

    return NextResponse.json(tables, { status: 200 });
  } catch (error) {
    console.error("Error fetching tables:", error);
    return NextResponse.json({ error: "Failed to fetch tables." }, { status: 500 });
  }
}

// POST: Create new table(s) (secured) with auto-generated table_number
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Define type for input
    type TableInput = {
      seats: number;
      type: "Indoor" | "Outdoor";
      availability?: boolean;
    };

    // Parse body and convert single object to array if needed
    let body: TableInput | TableInput[] = await request.json();
    const tablesArray: TableInput[] = Array.isArray(body) ? body : [body];

    // Validate required fields
    for (const table of tablesArray) {
      if (!table.seats || !table.type) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
      }
    }

    // Fetch existing table numbers
    const { data: existingTables, error: fetchError } = await auth.supabase
      .from("tables")
      .select("table_number");

    if (fetchError) {
      console.error("Supabase fetch error:", fetchError);
      return NextResponse.json({ error: "Failed to fetch existing table numbers." }, { status: 500 });
    }

    const existingNumbers = existingTables?.map((t: any) => t.table_number) || [];

    // Assign unique table_number to each new table
    const tablesToInsert = tablesArray.map((table: TableInput) => {
      let table_number = 1;
      while (existingNumbers.includes(table_number)) {
        table_number++;
      }
      existingNumbers.push(table_number); // reserve this number
      return {
        table_number,
        seats: table.seats,
        type: table.type,
        availability: table.availability ?? true,
        created_at: new Date().toISOString(),
      };
    });

    // Insert into Supabase
    const { data, error } = await auth.supabase
      .from("tables")
      .insert(tablesToInsert)
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to create table(s)." }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating table(s):", error);
    return NextResponse.json({ error: "Failed to create table(s)." }, { status: 500 });
  }
}

// POST: Create new table(s) without auth
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();

//     // Normalize body to array
//     const tables = Array.isArray(body) ? body : [body];

//     // Validate tables
//     for (const table of tables) {
//       if (!table.seats || !table.type) {
//         return NextResponse.json(
//           { error: "Missing required fields: seats or type." },
//           { status: 400 }
//         );
//       }
//     }

//     const supabase = await createClient();

//     // Fetch existing table numbers
//     const { data: existingTables, error: fetchError } = await supabase
//       .from("tables")
//       .select("table_number");

//     if (fetchError) {
//       console.error("Supabase fetch error:", fetchError);
//       return NextResponse.json(
//         { error: "Failed to fetch existing table numbers." },
//         { status: 500 }
//       );
//     }

//     const existingNumbers = existingTables?.map((t: any) => t.table_number) || [];

//     // Assign table_number for each table
//     const tablesToInsert = tables.map((table: any) => {
//       let table_number = 1;
//       while (existingNumbers.includes(table_number)) table_number++;
//       existingNumbers.push(table_number);

//       return {
//         table_number,
//         seats: table.seats,
//         type: table.type,
//         availability: table.availability ?? true,
//         created_at: new Date().toISOString(),
//       };
//     });

//     const { data, error } = await supabase
//       .from("tables")
//       .insert(tablesToInsert)
//       .select();

//     if (error) {
//       console.error("Supabase insert error:", error);
//       return NextResponse.json({ error: "Failed to create table(s)." }, { status: 500 });
//     }

//     return NextResponse.json(data, { status: 201 });
//   } catch (error) {
//     console.error("Error creating table(s):", error);
//     return NextResponse.json({ error: "Failed to create table(s)." }, { status: 500 });
//   }
// }