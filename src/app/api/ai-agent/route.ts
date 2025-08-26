import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Generate content using Google Gemini
    const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: [
    {
      role: "user",
      parts: [
        {
          text: `You are an assistant that ONLY answers questions related to:
          - Restaurants & food
          - Diet & nutrition
          - Sports & fitness
          - Health & wellness

          Rules:
          - Keep your answers short and clear (1–3 sentences max).
          - No long paragraphs.
          - If asked outside these topics, reply: "I'm here to help only with restaurant, diet, sport, and health topics."

          User: ${message}`
                  }
                ]
              }
            ],
          });


    const reply = response.text || "Sorry, I didn't understand.";

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
