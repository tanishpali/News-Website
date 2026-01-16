// models/recentlyViewedModel.js
const mongoose = require("mongoose");

const recentlyViewedSchema = new mongoose.Schema(
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

// One article per user (update if re-viewed)
recentlyViewedSchema.index({ userId: 1, articleId: 1 }, { unique: true, sparse: true });
recentlyViewedSchema.index({ userId: 1, title: 1 }, { unique: true });

module.exports = mongoose.model("RecentlyViewed", recentlyViewedSchema);
