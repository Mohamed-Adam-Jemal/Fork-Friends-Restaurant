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
            text: `You are an AI assistant specializing in these areas:
          - **Restaurants & Food**
          - **Diet & Nutrition**
          - **Sports & Fitness**
          - **Health & Wellness**

          Response Guidelines:
          - Use **Markdown formatting** for all responses.
          - Use **bullet points** (\`- item\`) for unordered lists.
          - Use **numbered lists** (\`1. item\`) for sequences or steps.
          - Use **bold text** (\`**bold**\`) to highlight important terms.
          - Use **tables** if needed to organize data.
          - You may use **nested lists** for subcategories.
          - Keep responses **concise and readable** (1–3 sentences).
          - Always stay focused on the listed topics.
          - If asked something unrelated, respond politely with:
            "I can best help with restaurants, diet, sports, or health. Would you like to ask me about one of these?"

          Examples:
          - **Lean Proteins**: Chicken, fish, legumes
          - **Whole Grains**: Quinoa, oats, brown rice
          - **Fruits**:
            - Apples
            - Bananas
            - Oranges
          - Ordered Steps:
            1. First step
            2. Second step
            3. Third step
          - Nested List:
            - Fruits
              - Apples
              - Bananas
            - Vegetables
              - Carrots
              - Broccoli

          Now, provide a response for the following user query:

          ${message}`
          }


          ],
        },
      ],
    });

    // ✅ In @google/genai, response is directly on top-level
    const reply =
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I didn't understand.";

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("AI API error:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
