// controllers/voteController.js
const Vote = require("../models/voteModel");

/* =========================
   CAST / TOGGLE VOTE
========================= */
const vote = async (req, res) => {
  try {
    const userId = req.user._id;
    const { articleId, voteType, vote } = req.body;
    const type = voteType || vote;

    if (!articleId || !["up", "down"].includes(type)) {
      return res.status(400).json({ msg: "Invalid vote data. 'articleId' and 'voteType' are required." });
    }

    const existingVote = await Vote.findOne({ userId, articleId });

    // Case 1: No previous vote → create
    if (!existingVote) {
      await Vote.create({ userId, articleId, voteType: type });
      return res.status(201).json({ msg: "Vote added" });
    }

    // Case 2: Same vote clicked → remove
    if (existingVote.voteType === type) {
      await Vote.findByIdAndDelete(existingVote._id);
      return res.status(200).json({ msg: "Vote removed" });
    }

    // Case 3: Switch vote
    existingVote.voteType = type;
    await existingVote.save();

    return res.status(200).json({ msg: "Vote updated" });
  } catch (error) {
    console.error("Vote Error:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

/* =========================
   GET VOTE COUNT
========================= */
const getVoteCount = async (req, res) => {
  try {
    const { articleId } = req.params; // Changed from targetId to articleId

    const upvotes = await Vote.countDocuments({
      articleId,
      voteType: "up",
    });

    const downvotes = await Vote.countDocuments({
      articleId,
      voteType: "down",
    });

    return res.status(200).json({
      upvotes,
      downvotes,
      score: upvotes - downvotes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  vote,
  getVoteCount,
};
