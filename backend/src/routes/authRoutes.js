const express = require("express");
const Route = express.Router();

const {
    addUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser,
} = require("../controllers/userController");

const {
    addBookmark,
    getBookmarks,
    deleteBookmark,
} = require("../controllers/bookmarkController");

const {
    addRecentlyViewed,
    getRecentlyViewed,
} = require("../controllers/recentlyviewController");

const {
    trackDomain,
    getDomainPreferences,
} = require("../controllers/trackerController");

const {
    vote,
    getVoteCount,
} = require("../controllers/voteController");

const { protect } = require("../middlewares/authMiddleware");

// --- User/Auth Routes ---
Route.post("/register", addUser);
Route.post("/login", loginUser);
Route.get("/getUser", protect, getUser);
Route.put("/updateUser/:id", protect, updateUser);
Route.delete("/deleteUser/:id", protect, deleteUser);

// --- Bookmark Routes ---
Route.post("/addBookmark", protect, addBookmark);
Route.get("/getBookmarks", protect, getBookmarks);
Route.delete("/deleteBookmark", protect, deleteBookmark);

// --- Recently Viewed Routes ---
Route.post("/addRecentlyViewed", protect, addRecentlyViewed);
Route.get("/getRecentlyViewed", protect, getRecentlyViewed);

// --- Domain Tracker Routes ---
Route.post("/track-domain", protect, trackDomain);
Route.get("/domain-preferences", protect, getDomainPreferences);

// --- Vote Routes ---
Route.post("/vote", protect, vote);
Route.get("/vote-count/:articleId", getVoteCount);

module.exports = Route;
