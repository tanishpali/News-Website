const bookmarkModel = require("../models/bookmarkModel");
const mongoose = require("mongoose");

/* =========================
   ADD BOOKMARK
========================= */
const addBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
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

    // Explicitly check if it already exists based on articleId OR TITLE
    // If articleId is present, check by it. Else check by title.
    const query = { userId };
    if (articleId) {
      query.articleId = articleId;
    } else {
      query.title = title;
    }

    const existingBookmark = await bookmarkModel.findOne(query);
    if (existingBookmark) {
      return res.status(400).json({ msg: "This article is already in your bookmarks" });
    }

    const bookmark = await bookmarkModel.create({
      userId,
      articleId,
      title,
      description,
      author,
      content,
      url,
      urlToImage,
      publishedAt,
    });

    return res.status(201).json({
      msg: "Bookmark added successfully",
      bookmark,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ msg: "Already bookmarked" });
    }
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

/* =========================
   GET ALL BOOKMARKS
========================= */
const getBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookmarks = await bookmarkModel
      .find({ userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      total: bookmarks.length,
      bookmarks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

/* =========================
   DELETE BOOKMARK
========================= */
const deleteBookmark = async (req, res) => {
  try {
    const bookmarkId = req.body.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(bookmarkId)) {
      return res.status(400).json({ msg: "Invalid bookmark id" });
    }

    const bookmark = await bookmarkModel.findOne({
      _id: bookmarkId,
      userId,
    });

    if (!bookmark) {
      return res.status(404).json({ msg: "Bookmark not found" });
    }

    await bookmarkModel.findByIdAndDelete(bookmarkId);

    return res.status(200).json({ msg: "Bookmark removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  addBookmark,
  getBookmarks,
  deleteBookmark,
};
