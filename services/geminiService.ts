import { GoogleGenAI, Chat, GenerativeModel } from "@google/genai";
import { AnalysisResult, PricingItem } from "../types";

const MODEL_NAME = "gemini-3-pro-preview";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const SYSTEM_INSTRUCTION = `
You are CompetitivePricingAI (V2), an elite market strategy consultant and pricing analyst.
Your goal is to conduct a deep-dive analysis for a product or service input by the user.

**CORE TASK:**
Perform a comprehensive 6-Step Pricing Strategy Analysis and Data Collection.

**STEP 1: Identify Key Competitors**
*   Identify Direct competitors (same product, same market).
*   Identify Indirect competitors (substitutes).
*   Identify Market leaders and low-cost players.

**STEP 2: Collect Competitor Price Data**
*   Use 'googleSearch' to find REAL, current selling prices.
*   Look for discounts, bundled pricing, and payment terms.
*   **CRITICAL:** You MUST find a genuine "Link to buy/verify" for every competitor listed.
*   **Target Market:** India (INR) unless specified otherwise.

**STEP 3: Compare Features & Value**
*   Evaluate Quality and USP (Unique Selling Proposition).

**STEP 4: Determine Cost Structure (Estimation)**
*   Estimate likely Fixed vs. Variable costs for this industry.
*   Estimate a rough Break-even point concept.

**STEP 5: Choose Competitive Pricing Position**
*   Recommend where the user should position: Premium, At Par, or Penetration/Discount.

**STEP 6: Decide Final Price**
*   Suggest a specific price point (e.g., Psychological pricing like ₹999).

**OUTPUT FORMAT:**
You must generate a response with TWO distinct parts:

PART 1: THE DETAILED ANALYSIS REPORT (Markdown)
*   Write a professional, structured report covering Steps 1, 4, 5, and 6. 
*   Use H2 headers (##) for sections.
*   Be specific to the user's industry.

PART 2: THE DATA (JSON)
*   Output the raw competitor data found in Steps 2 & 3.
*   Wrap this in a code block: \`\`\`json ... \`\`\`
*   Structure:
    [
      {
        "company": "Company Name",
        "brand": "Brand Name",
        "usp": "Specific USP",
        "specs": "Key Specs/Features",
        "price": 1234,
        "currency": "INR",
        "link": "https://actual-url-to-product"
      }
    ]

**CONSTRAINTS:**
*   **Links:** Must be valid URLs found via search.
*   **Currency:** Prioritize INR (₹).
*   **Tone:** Professional, analytical, strategic.
`;

export const initializeGenAI = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing");
    return;
  }
  genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const startNewChat = () => {
  if (!genAI) initializeGenAI();
  if (!genAI) throw new Error("Failed to initialize Gemini AI");

  chatSession = genAI.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }],
    },
  });
};

export const sendMessage = async (message: string): Promise<AnalysisResult> => {
  if (!chatSession) {
    startNewChat();
  }
  if (!chatSession) throw new Error("Chat session not initialized");

  try {
    const response = await chatSession.sendMessage({ message });
    const fullText = response.text || "";

    // 1. Extract JSON Data
    const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/);
    let data: PricingItem[] = [];
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (Array.isArray(parsed)) {
          data = parsed;
        }
      } catch (e) {
        console.warn("Failed to parse JSON from model response", e);
      }
    }

    // 2. Extract Report (Everything NOT in the JSON block)
    const report = fullText.replace(/```json[\s\S]*?```/g, '').trim();

    return { report, data };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
