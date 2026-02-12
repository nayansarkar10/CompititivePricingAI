import { GoogleGenAI, Chat } from "@google/genai";
import { AnalysisResult, PricingItem, Question, RefinementData } from "../types";

const MODEL_NAME = "gemini-3-pro-preview";

let genAI: GoogleGenAI | null = null;

const initializeGenAI = () => {
  try {
    if (!genAI && process.env.API_KEY) {
      genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
  } catch (e) {
    console.error("Failed to initialize GenAI", e);
  }
  return genAI;
};

// Fallback Data Generators
const getFallbackQuestions = (): Question[] => [
  { id: "q1", text: "What is your specific budget range?", options: ["Budget Friendly", "Mid-Range", "Premium / Luxury"] },
  { id: "q2", text: "What is the primary intended use?", options: ["Personal / Home", "Professional / Business", "Industrial / Heavy Duty"] },
  { id: "q3", text: "Do you have a specific brand preference?", options: ["Top Tier Brands", "Value for Money", "No Preference"] }
];

const getMockAnalysis = (query: string): AnalysisResult => ({
    report: `### ⚠️ High Traffic - Simulation Mode Active
    
**Executive Summary**
We are currently experiencing extremely high demand on our AI research agents (API Quota Exceeded). We have switched to **Simulation Mode** to provide you with an example of how the analysis would look for *"${query}"*.

**Market Overview (Simulated)**
The market for *${query}* is competitive with multiple established players. Prices typically range widely based on specifications, brand value, and current retailer discounts.

**Key Observations**
- **Pricing:** Dynamic fluctuations observed.
- **Availability:** Generally good stock levels across major online retailers (Amazon, Flipkart).
- **Value:** Mid-range options currently offer the best price-to-performance ratio in this simulated scenario.

*Please try again later for real-time live data.*`,
    data: [
        {
            company: "Market Leader (Simulated)",
            brand: "Pro Series X",
            usp: "High durability and brand value",
            specs: "Top-tier specifications, extended warranty, premium build quality",
            price: 45999,
            currency: "INR",
            link: "",
            isBestDeal: false
        },
        {
            company: "Value King (Simulated)",
            brand: "Budget Master",
            usp: "Best price in segment",
            specs: "Standard specifications, reliable performance for daily use",
            price: 24999,
            currency: "INR",
            link: "",
            isBestDeal: true
        },
        {
            company: "Tech Innovators (Simulated)",
            brand: "NextGen 5",
            usp: "Latest features & AI",
            specs: "Cutting-edge tech, sleek design, eco-friendly packaging",
            price: 55000,
            currency: "INR",
            link: "",
            isBestDeal: false
        },
         {
            company: "Reliable Choice (Simulated)",
            brand: "Classic v2",
            usp: "User favorite",
            specs: "High user ratings, standard performance, good after-sales support",
            price: 35000,
            currency: "INR",
            link: "",
            isBestDeal: true
        }
    ]
});

/**
 * LAYER 2: Generate Clarifying Questions
 */
export const generateQuestions = async (query: string): Promise<Question[]> => {
  const ai = initializeGenAI();
  if (!ai) return getFallbackQuestions();
  
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
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Invalid format");
    return parsed;
  } catch (e: any) {
    console.error("Error generating questions:", e);
    // Return fallback for ANY error to keep app alive
    return getFallbackQuestions();
  }
};

/**
 * LAYER 3/4: Perform Deep Analysis (The "Master Agent")
 */
export const generateAnalysis = async (data: RefinementData): Promise<AnalysisResult> => {
  const ai = initializeGenAI();
  // Fallback immediately if no key provided, though environment should have it
  if (!ai) return getMockAnalysis(data.originalQuery);

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

    // Sanity check: if empty, likely blocked response or filtering
    if (!report && pricingData.length === 0) {
        throw new Error("Empty response from AI");
    }

    return { report, data: pricingData };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Check for Quota/Rate Limit errors (429)
    if (
        error.status === 429 || 
        (error.message && error.message.includes('429')) ||
        (error.message && error.message.includes('quota'))
    ) {
        return getMockAnalysis(data.originalQuery);
    }
    
    // For other critical errors, we also fallback to keep UI functional
    return getMockAnalysis(data.originalQuery);
  }
};
