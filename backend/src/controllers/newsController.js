const News = require("../models/newsModel");

// Using the key found in frontend, but ideally this should be in .env
const API_KEY = "486ba8fb6dd54c2bb4862220c6c4886d";

const syncNews = async (req, res) => {
    try {
        // 1. Fetch from News API
        // Fetching top headlines for US. You can make this dynamic via req.query if needed.
        const response = await fetch(
            `https://newsapi.org/v2/top-headlines?country=us&pageSize=100&apiKey=${API_KEY}`
        );
        const data = await response.json();

        if (data.status !== "ok" || !data.articles) {
            console.error("News API Error:", data);
            return res.status(502).json({ msg: "Failed to fetch news from external source" });
        }

        let savedCount = 0;

        // 2. Iterate and Save
        for (const article of data.articles) {
            if (!article.url || !article.title) continue;

            const { url } = article;

            // Duplicate prevention logic: Atomic Upsert
            // Try to find by URL. If not found, insert. If found, do nothing ($setOnInsert).
            try {
                const result = await News.updateOne(
                    { url },
                    {
                        $setOnInsert: {
                            source: article.source,
                            author: article.author,
                            title: article.title,
                            description: article.description,
                            url: article.url,
                            urlToImage: article.urlToImage,
                            publishedAt: article.publishedAt,
                            content: article.content,
                        },
                    },
                    { upsert: true }
                );

                if (result.upsertedCount > 0) {
                    savedCount++;
                }
            } catch (err) {
                console.error("Error saving article:", err.message);
                // Continue to next article even if one fails
            }
        }

        // 3. Do not return API data directly
        return res.status(200).json({
            msg: "News synced successfully",
            savedArticles: savedCount
        });

    } catch (error) {
        console.error("Sync Error:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

module.exports = { syncNews };
