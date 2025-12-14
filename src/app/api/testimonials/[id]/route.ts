import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper: check authentication (replace with your auth logic)
async function checkUser() {
  // Implement your authentication check here
  // Example: return { user: { id: 1 } } if authenticated, null otherwise
  return { user: { id: 1 } }; // placeholder
}

// GET — fetch a single testimonial (secured)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await checkUser();
  if (!auth?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });

    return NextResponse.json(testimonial, { status: 200 });
  } catch (err) {
    console.error("GET testimonial error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — update testimonial (secured)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await checkUser();
  if (!auth?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const body = await req.json();

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedTestimonial, { status: 200 });
  } catch (err: any) {
    console.error("PATCH testimonial error:", err);
    if (err.code === "P2025") {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

// DELETE — delete testimonial (secured)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await checkUser();
  if (!auth?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    await prisma.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (err: any) {
    console.error("DELETE testimonial error:", err);
    if (err.code === "P2025") {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
