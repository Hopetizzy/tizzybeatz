
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the GoogleGenAI client using the environment variable directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const generateProductDescription = async (title: string, tags: string[], type: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a professional, high-converting product description for a ${type} called "${title}". Tags: ${tags.join(', ')}. Keep it under 100 words and focus on musical qualities and mood.`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Description Error:", error);
    return "High-quality professional assets for your next hit record.";
  }
};

export const suggestTags = async (title: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on this product title "${title}" and description "${description}", suggest 5 relevant musical genre or mood tags as a comma separated list.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });
    const result = JSON.parse(response.text || '{"tags":[]}');
    return result.tags;
  } catch (error) {
    return [];
  }
};
