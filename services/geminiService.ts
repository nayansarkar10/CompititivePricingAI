import { GoogleGenAI, Chat } from "@google/genai";
import { AnalysisResult, PricingItem, Question, RefinementData } from "../types";

const MODEL_NAME = "gemini-3-pro-preview";

let genAI: GoogleGenAI | null = null;

const initializeGenAI = () => {
  if (!genAI && process.env.API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  if (!genAI) throw new Error("Gemini AI not initialized. Check API_KEY.");
  return genAI;
};

/**
 * LAYER 2: Generate Clarifying Questions
 */
export const generateQuestions = async (query: string): Promise<Question[]> => {
  const ai = initializeGenAI();
  
  const prompt = `
    User wants market research for: "${query}".
    To provide the best competitive pricing analysis in India (INR), I need to narrow this down.
    Generate 3 specific, relevant multiple-choice questions to ask the user (e.g., Budget, Specific Features, Usage, Brand Preference).
    
    Output strictly valid JSON in this format:
    [
      { "id": "q1", "text": "Question text?", "options": ["Option A", "Option B", "Option C"] }
    ]
    Do not add markdown formatting like \`\`\`json. Just raw JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (e) {
    console.error("Error generating questions:", e);
    // Fallback if AI fails
    return [
      { id: "q1", text: "What is your budget range?", options: ["Low (Budget)", "Medium (Mid-range)", "High (Premium)"] },
      { id: "q2", text: "What is the primary use case?", options: ["Personal", "Business/Enterprise", "Industrial"] }
    ];
  }
};

/**
 * LAYER 3/4: Perform Deep Analysis (The "Master Agent")
 */
export const generateAnalysis = async (data: RefinementData): Promise<AnalysisResult> => {
  const ai = initializeGenAI();

  // Construct the context from Q&A
  const refinementContext = Object.entries(data.answers)
    .map(([q, a]) => `- ${q}: ${a}`)
    .join("\n");

  const SYSTEM_INSTRUCTION = `
You are CompetitivePricingAI V3, a Master Agent coordinating 4 specialized sub-agents to research the Indian Market (INR).

**USER REQUEST:** "${data.originalQuery}"
**CONTEXT:**
${refinementContext}

**YOUR WORKFLOW (Simulate these Agents):**

1.  **Agent 1 (Gathering):** Search Amazon.in, Flipkart, Croma, Reliance Digital, etc. Find 5-10 REAL products/services available now.
2.  **Agent 2 (Analysis):** For each item, extract Price (INR), Discounts, Specs, USP, and a GENUINE Purchase Link.
3.  **Agent 3 (Positioning):** Identify if the item is Premium, Market-rate, or Penetration pricing.
4.  **Agent 4 (Intelligence):** Identify best value options.

**OUTPUT REQUIREMENTS:**

1.  **JSON Data (The Table):**
    *   Strict JSON array.
    *   Fields: "company", "brand", "price" (number), "currency" (INR), "specs" (short), "usp" (short), "link" (valid URL), "isBestDeal" (boolean - true for top 2 value-for-money items).
    *   Sort by Price High to Low.

2.  **Analysis Report (Markdown):**
    *   Executive Summary of the market.
    *   Price Range Analysis.
    *   Recommendations based on the user's answers.
    *   Agent Observations (briefly mention what Agent 1-4 found).

**RESPONSE FORMAT:**
Return the JSON array wrapped in \`\`\`json ... \`\`\`.
Everything else is the Markdown report.
`;

  try {
    // We use a chat session to maintain some state if we needed, but single generation is fine here.
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: "Execute Master Agent Workflow.",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const fullText = response.text || "";

    // 1. Extract JSON
    const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/);
    let pricingData: PricingItem[] = [];
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (Array.isArray(parsed)) pricingData = parsed;
      } catch (e) {
        console.warn("JSON Parse Error", e);
      }
    }

    // 2. Extract Report
    const report = fullText.replace(/```json[\s\S]*?```/g, '').trim();

    return { report, data: pricingData };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
