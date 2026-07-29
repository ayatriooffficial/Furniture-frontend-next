import { homeDecorCategoryData } from "@/Model/Dropdown/CategoryData/HomeDecorCategoryData";
import { wallDecorCategoryData } from "@/Model/Dropdown/CategoryData/WallDecorCategoryData";
import { flooringCategoryData } from "@/Model/Dropdown/CategoryData/FlooringCategoryData";
import { blindsCategoryData } from "@/Model/Dropdown/CategoryData/BlindsCategoryData";
import { curtainsCategoryData } from "@/Model/Dropdown/CategoryData/CurtainsCategoryData";
import { wallpaperCategoryData } from "@/Model/Dropdown/CategoryData/WallpaperCategoryData";
import { inspirationCategoryData } from "@/Model/Dropdown/CategoryData/InspirationCategoryData";

/* ---------------- FOOTER & PHONE NUMBER LOGIC ---------------- */
function avatrioFooter() {
  return `

---

💬 **Need personalized design guidance?**

Our interior experts can help you choose the right decor.

[📞 Call Us: +91 9836465083](tel:+919836465083)
[💬 WhatsApp Us](https://wa.me/916291531025)
`;
}

/* ---------------- AI LLM REPLY ---------------- */
async function getAIReply(question) {
  try {
    const context = `
You have access to the complete database of Avatrio's products. Use ONLY the following details to answer the user's questions. Do not invent products.

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

    const systemPrompt = `
You are the AI Design Assistant for Avatrio.

STRICT RULES:
• Only answer using the provided context/data. Do NOT assume or invent facts.
• Keep replies structured, concise, and easy to read.
• Highlight important categories using **bold**.
• If asked about specific decor (Home, Wall, Floor), list the options available.
• Use markdown headings (##) and bullet lists.
• If asked something entirely outside the context, politely state you can only help with Avatrio's product categories like Home Decor, Wall Decor, and Flooring.

${context}
`;

    let res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GEMINI_API || ""}`,
        },
        body: JSON.stringify({
          model: "gemini-3.1-flash-lite",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: question }
          ],
          temperature: 0.2
        }),
      }
    );

    let data = await res.json();
    
    // Fallback to gemini-2.5-flash-lite if the primary model fails
    if (!res.ok || data?.error) {
      console.warn("Primary model failed, falling back to gemini-2.5-flash-lite...");
      res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GEMINI_API || ""}`,
          },
          body: JSON.stringify({
            model: "gemini-2.5-flash-lite",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: question }
            ],
            temperature: 0.2
          }),
        }
      );
      data = await res.json();
    }
    
    if (data?.error) {
      console.error("Gemini API Error:", data.error.message);
      return "I can help you explore our Home Decor, Wall Decor, Floors, Rooms, and Offers." + avatrioFooter();
    }

    const reply = data?.choices?.[0]?.message?.content || "I can help with Home Decor, Wall Decor, or Offers.";
    return reply + avatrioFooter();
  } catch (err) {
    console.error("Chatbot Error:", err);
    return "Please contact our support team for more details." + avatrioFooter();
  }
}

/* ---------------- MAIN BOT ROUTER ---------------- */
export default async function askBot(question) {
  const q = question.toLowerCase().trim();

  // Fast Greeting Matching
  if (/^(hi|hello|hey|hii|namaste)/.test(q) && q.split(" ").length <= 3) {
    return `
👋 Hello! Welcome to **Avatrio**.

I can help you with:
• Home decor
• Wall decor
• Floors & Rooms
• Services & Offers

How can I assist you today?
`;
  }

  // Fallback to LLM for complex queries
  return await getAIReply(question);
}
