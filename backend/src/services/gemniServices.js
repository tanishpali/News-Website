import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function summarizeArticle(articleText) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are a professional news editor.

Read this article and:
1. Write a short simple summary (5-6 lines)
2. Extract key bullet points
3. Add a section:
   "If you want to know more about this, you should explore:"
   and suggest 3 related topics.

Article:
${articleText}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);


  return text;
}
