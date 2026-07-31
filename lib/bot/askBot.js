import { homeDecorCategoryData } from "@/Model/Dropdown/CategoryData/HomeDecorCategoryData";
import { wallDecorCategoryData } from "@/Model/Dropdown/CategoryData/WallDecorCategoryData";
import { flooringCategoryData } from "@/Model/Dropdown/CategoryData/FlooringCategoryData";
import { blindsCategoryData } from "@/Model/Dropdown/CategoryData/BlindsCategoryData";
import { curtainsCategoryData } from "@/Model/Dropdown/CategoryData/CurtainsCategoryData";
import { wallpaperCategoryData } from "@/Model/Dropdown/CategoryData/WallpaperCategoryData";
import { inspirationCategoryData } from "@/Model/Dropdown/CategoryData/InspirationCategoryData";

/* ---------------- CONFIG ---------------- */
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const GEMINI_MODELS = ["gemini-3.1-flash-lite", "gemini-3.5-flash-lite", "gemini-2.5-flash-lite"];
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://www.ayatrio.com";

/* ---------------- FOOTER ---------------- */
function avatrioFooter() {
  return `

---

💬 **Need personalized design guidance?**

Our interior experts can help you choose the right decor.

[📞 Call Us: +91 9836465083](tel:+919836465083)
[💬 WhatsApp Us](https://wa.me/916291531025)
`;
}

/* ---------------- CATEGORY CONTEXT ---------------- */
const categoryContext = `
You know Avatrio's product CATEGORIES. Use this for general "what do you have" questions.
Do NOT use this for pricing, specific product names, or inventory — use the search tool for those.

### 🏡 HOME DECOR
${JSON.stringify(homeDecorCategoryData, null, 2)}

### 🖼️ WALL DECOR
${JSON.stringify(wallDecorCategoryData, null, 2)}

### 🖼️ WALLPAPER
${JSON.stringify(wallpaperCategoryData, null, 2)}

### 🪵 FLOORING
${JSON.stringify(flooringCategoryData, null, 2)}

### 🪟 BLINDS
${JSON.stringify(blindsCategoryData, null, 2)}

### 🪟 CURTAINS
${JSON.stringify(curtainsCategoryData, null, 2)}

### ✨ INSPIRATION
${JSON.stringify(inspirationCategoryData, null, 2)}
`;

/* ---------------- SYSTEM PROMPT ---------------- */
const SYSTEM_PROMPT = `You are Avatrio's AI shopping assistant. You have access to a live product database through the search_ayatrio_products tool — use it whenever the user asks about products, prices, or availability.

ALWAYS CALL THE TOOL when:
• User asks about specific products, prices, discounts, offers, deals, sales
• User says "cheapest", "most expensive", "best", "popular", "trending", "top", "recommended", "most selling"
• User asks "do you have X", "is X in stock", "show me Y", "recommend me Z"
• User mentions a budget: "under ₹1000", "within 5000", "cheap"
• User asks "what offer is going on", "which product has the best deal", "any discounts on X"

WHEN USER IS VAGUE (no category named):
• "which product has the best offer" → searchQuery="curtains wallpaper flooring" sortBy="popularity"
• "most selling item" → searchQuery="curtains wallpaper flooring blinds" sortBy="popularity"
• "cheapest product" → searchQuery="curtains wallpaper flooring blinds decor" sortBy="price_asc"
• ALWAYS call the tool even if the user doesn't name a category. Search broadly.

WHEN USER IS SPECIFIC:
• "cheapest red curtains" → searchQuery="red curtains" sortBy="price_asc" category="Curtains"
• "popular floral wallpaper" → searchQuery="floral wallpaper" sortBy="popularity" category="Wallpaper"

HOW TO PRESENT RESULTS:
• List products with name, price, one-line description
• If discountedPrice differs from price: "₹699 (was ₹899) — [offer name]"
• If zero results, be honest and suggest browsing categories
• Use bullet lists, be concise

ONLY SKIP THE TOOL for:
• Greetings / small talk
• "What categories/collections/wallpapers do you have?" → use your category knowledge below
• Contact / WhatsApp / store hours questions

${categoryContext}`;

/* ---------------- TOOL DEFINITIONS ---------------- */
const tools = [
  {
    type: "function",
    function: {
      name: "search_ayatrio_products",
      description:
        "Search Avatrio's live product database. MANDATORY for any question about products, prices, discounts, offers, deals, popularity, trends, recommendations, inventory. If the user asks about products in ANY way, call this. If you are unsure whether to call, CALL IT.",
      parameters: {
        type: "object",
        properties: {
          searchQuery: {
            type: "string",
            description:
              "Keywords to search. If user is vague, search broadly: 'curtains wallpaper flooring blinds'. If specific, use their exact terms."
          },
          sortBy: {
            type: "string",
            enum: ["popularity", "price_asc", "price_desc"],
            description:
              "popularity=best/most selling/trending/popular. price_asc=cheapest/budget. price_desc=most expensive."
          },
          category: {
            type: "string",
            description:
              "Optional filter to one category: wallpaper, curtains, flooring, blinds, home decor."
          }
        },
        required: ["searchQuery"]
      }
    }
  }
];

/* ---------------- GEMINI API HELPER ---------------- */
async function callGemini(messages) {
  const apiKey = process.env.GEMINI_API || "";

  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model, messages, tools, temperature: 0.2 }),
      });

      const data = await res.json();

      if (res.ok && !data?.error && data?.choices?.[0]?.message) {
        return data;
      }

      console.warn(`Gemini model ${model} failed, trying next...`);
    } catch (e) {
      console.warn(`Gemini model ${model} error:`, e.message);
    }
  }

  throw new Error("All Gemini models failed");
}

/* ---------------- FETCH PRODUCTS FROM BACKEND ---------------- */
async function searchProducts({ searchQuery, sortBy, category }) {
  const params = new URLSearchParams();
  params.append("q", searchQuery);
  params.append("limit", "5");
  if (sortBy) params.append("sort", sortBy);
  if (category) params.append("category", category);

  try {
    const res = await fetch(`${BACKEND_URL}/api/ai/products/search?${params}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Backend search failed:", err.message);
    return null;
  }
}

/* ---------------- MAIN AI REPLY WITH FUNCTION CALLING ---------------- */
export default async function askBot(question) {
  const q = question.toLowerCase().trim();

  if (/^(hi|hello|hey|hii|namaste)/.test(q) && q.split(" ").length <= 3) {
    return `
👋 Hello! Welcome to **Avatrio**.

I can help you with:
• Home decor
• Wall decor
• Floors & Rooms
• Services & Offers
• **Product prices and offers** — just ask me!

How can I assist you today?
`;
  }

  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: question },
    ];

    // === TURN 1: Ask Gemini (may return text or tool_call) ===
    const data = await callGemini(messages);
    const choice = data?.choices?.[0]?.message;
    if (!choice) {
      return "I can help you explore our Home Decor, Wall Decor, Floors, Rooms, and Offers." + avatrioFooter();
    }

    // Gemini answered directly — no tool needed
    if (!choice.tool_calls || choice.tool_calls.length === 0) {
      return (choice.content || "I can help with Home Decor, Wall Decor, or Offers.") + avatrioFooter();
    }

    // === Execute tool call ===
    const toolCall = choice.tool_calls[0];
    let args = {};
    try {
      args = JSON.parse(toolCall.function?.arguments || "{}");
    } catch {
      args = { searchQuery: question };
    }

    const searchResults = await searchProducts(args);

    const toolResultContent = searchResults
      ? JSON.stringify(searchResults.products)
      : JSON.stringify([]);

    // === TURN 2: Feed results back to Gemini ===
    messages.push(
      { role: "assistant", content: null, tool_calls: choice.tool_calls },
      { role: "tool", tool_call_id: toolCall.id, content: toolResultContent }
    );

    const finalData = await callGemini(messages);
    const finalReply =
      finalData?.choices?.[0]?.message?.content ||
      "I found some products — check our website for more details!";

    return finalReply + avatrioFooter();

  } catch (err) {
    console.error("Chatbot Error:", err.message);
    return "I can help you explore our Home Decor, Wall Decor, Floors, Rooms, and Offers." + avatrioFooter();
  }
}
