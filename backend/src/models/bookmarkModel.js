// models/bookmarkModel.js
const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    articleId: {
      type: String,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    author: {
      type: String,
    },

    content: {
      type: String,
    },

    url: {
      type: String,
      required: true,
    },

    urlToImage: {
      type: String,
    },

    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);


bookmarkSchema.index({ userId: 1, articleId: 1 }, { unique: true, sparse: true });
bookmarkSchema.index({ userId: 1, title: 1 }, { unique: true });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
