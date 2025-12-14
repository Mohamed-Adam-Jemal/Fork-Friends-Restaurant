import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: fetch all testimonials, newest first
export async function GET(): Promise<NextResponse> {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(testimonials, { status: 200 });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

// POST: create a new testimonial
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { name, photo, rating, content } = body;

    if (!name || !rating || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        photo: photo ?? null,
        rating,
        content,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
