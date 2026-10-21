
const mongoose = require("mongoose");

const concernSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        "bullying",
        "abuse",
        "online-safety",
        "missing-child",
        "neglect",
        "other"
      ]
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000
    },
    location: {
      type: String,
      trim: true,
      maxlength: 200,
      default: ""
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium"
    },
    status: {
      type: String,
      enum: [
        "pending",
        "under-review",
        "in-progress",
        "resolved"
      ],
      default: "pending"
    },
    reporterName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "Anonymous"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Concern", concernSchema);
