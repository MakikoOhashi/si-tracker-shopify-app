import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_MODEL } from "../config/gemini";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateGeminiContent(prompt) {
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(prompt);
  return result.response.text();
}