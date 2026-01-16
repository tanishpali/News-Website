// models/voteModel.js
const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    articleId: {
      type: String,
      required: true,
      index: true,
    },

    voteType: {
      type: String,
      enum: ["up", "down"],
      required: true,
    },
  },
  { timestamps: true }
);

// One vote per user per article
voteSchema.index({ userId: 1, articleId: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);
