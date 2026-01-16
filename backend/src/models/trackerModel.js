// models/domainPreferenceModel.js
const mongoose = require("mongoose");

const domainPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    domain: {
      type: String, 
      required: true,
      lowercase: true,
      trim: true,
    },

    viewCount: {
      type: Number,
      default: 1,
    },

    lastViewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// One domain per user
domainPreferenceSchema.index(
  { userId: 1, domain: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "DomainPreference",
  domainPreferenceSchema
);
