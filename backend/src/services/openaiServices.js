const OpenAI = require("openai");
require("dotenv").config();

// Debug API Key presence
if (!process.env.OPENAI_API_KEY) {
    console.warn("WARNING: OPENAI_API_KEY is missing from environment variables.");
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateSummary = async (articleText) => {
    try {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error("OPENAI_API_KEY is not set.");
        }

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

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
        });

        const summary = completion.choices[0].message.content;
        return summary;

    } catch (err) {
        console.error("OpenAI Service Error Details:");
        console.error("Message:", err.message);
        throw new Error("Failed to generate summary: " + err.message);
    }
};

module.exports = { generateSummary };
