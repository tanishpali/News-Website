// controllers/recentlyViewedController.js
const recentlyViewedModel = require("../models/recentlyviewModel");

/* =========================
   ADD / UPDATE RECENT VIEW
 ========================= */
const addRecentlyViewed = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      articleId,
      title,
      description,
      author,
      content,
      url,
      urlToImage,
      publishedAt,
    } = req.body;

    if (!title || !url) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    // Upsert: update timestamp if already viewed
    // Match by articleId if present, else title
    const filter = { userId };
    if (articleId) {
      filter.articleId = articleId;
    } else {
      filter.title = title;
    }

    await recentlyViewedModel.findOneAndUpdate(
      filter,
      {
        userId,
        articleId,
        title,
        description,
        author,
        content,
        url,
        urlToImage,
        publishedAt,
      },
      { upsert: true, new: true }
    );

    // Keep only last 20 viewed articles
    const views = await recentlyViewedModel
      .find({ userId })
      .sort({ updatedAt: -1 });

    if (views.length > 20) {
      const excess = views.slice(20);
      const ids = excess.map(v => v._id);
      await recentlyViewedModel.deleteMany({ _id: { $in: ids } });
    }

    return res.status(200).json({ msg: "Recently viewed updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};


/* =========================
   GET RECENTLY VIEWED
 ========================= */
const getRecentlyViewed = async (req, res) => {
  try {
    const userId = req.user._id;

    const recentViews = await recentlyViewedModel
      .find({ userId })
      .sort({ updatedAt: -1 })
      .limit(20);

    return res.status(200).json({
      total: recentViews.length,
      recentViews,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  addRecentlyViewed,
  getRecentlyViewed
};
