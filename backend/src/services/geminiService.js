const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Debug API Key presence
if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is missing from environment variables.");
} else {
    console.log("GEMINI_API_KEY is present.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateSummary = async (articleText) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
You are a professional news editor.

Read this article and:
1. Write a short simple summary (5-6 lines)
2. Extract key bullet points
3. Add a section:
   "If you want to know more about this, you should explore:"

Article:
${articleText}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (err) {
        console.error("Gemini AI Service Error Details:");
        console.error("Message:", err.message);
        throw new Error("Failed to generate summary: " + err.message);
    }
};

module.exports = { generateSummary };
