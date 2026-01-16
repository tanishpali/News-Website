// controllers/domainTrackerController.js
const DomainPreference = require("../models/trackerModel");

/* =========================
   TRACK DOMAIN PREFERENCE
 ========================= */
const trackDomain = async (req, res) => {
  try {
    const userId = req.user._id;
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ msg: "Domain is required" });
    }

    const normalizedDomain = domain.toLowerCase().trim();

    await DomainPreference.findOneAndUpdate(
      { userId, domain: normalizedDomain },
      {
        $inc: { viewCount: 1 },
        $set: { lastViewedAt: new Date() },
      },
      { upsert: true }
    );

    return res.status(200).json({ msg: "Domain tracked successfully" });
  } catch (error) {
    console.error("Domain Tracker Error:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};


/* =========================
   GET DOMAIN PREFERENCES
 ========================= */
const getDomainPreferences = async (req, res) => {
  try {
    const userId = req.user._id;

    const preferences = await DomainPreference.find({ userId })
      .sort({ viewCount: -1, lastViewedAt: -1 });

    return res.status(200).json({
      totalDomains: preferences.length,
      preferences,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  trackDomain,
  getDomainPreferences
};
