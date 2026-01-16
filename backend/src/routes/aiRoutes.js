const express = require("express");
const router = express.Router();
const { generateSummary } = require("../services/openaiServices");

const News = require("../models/newsModel");

// POST /api/ai/summarize/:articleId
router.post("/summarize/:articleId", async (req, res) => {
    try {
        const { articleId } = req.params;
        let contentToSummarize = "";

        // Log for debugging
        console.log(`Generating summary for ID: ${articleId}`);

        // 1. If req.body has content, prioritize it (Robustness for non-DB articles)
        const { article } = req.body;
        if (article) {
            contentToSummarize = article.content || article.description || article.title;
            // Sometimes content is truncated with "[+chars]", rely on description if content is too short or equal to title
            if (contentToSummarize && contentToSummarize.length < 100 && article.description && article.description.length > contentToSummarize.length) {
                contentToSummarize = article.description;
            }
        } else if (req.body.content) {
            contentToSummarize = req.body.content;
        }

        // 2. If no content from body, try fetching from DB
        if (!contentToSummarize && articleId.match(/^[0-9a-fA-F]{24}$/)) {
            try {
                const newsItem = await News.findById(articleId);
                if (newsItem) {
                    contentToSummarize = newsItem.content || newsItem.description || newsItem.title;
                }
            } catch (dbErr) {
                console.error("Error fetching from DB:", dbErr);
            }
        }

        if (!contentToSummarize) {
            // Fallback: If URL passed as ID and no body content found, maybe use the ID itself if it's not a MongoID?
            // But unlikely to be useful text.
            return res.status(404).json({ error: "Article content not found or provided." });
        }

        console.log("Sending to OpenAI...");
        const summary = await generateSummary(contentToSummarize);
        res.json({ summary });

    } catch (error) {
        console.error("Error in summarize route:", error);
        res.status(500).json({ error: "Failed to generate summary" });
    }
});

module.exports = router;
