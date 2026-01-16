const express = require("express");
const router = express.Router();
const { syncNews } = require("../controllers/newsController");
const { protect } = require("../middlewares/authMiddleware");

// Route to sync news
// Method: GET or POST (GET is fine since it's a trigger, but validation implies state change so POST is semantically okay too. GET is often used for 'refresh')
router.get("/sync-news", protect, syncNews);

module.exports = router;
