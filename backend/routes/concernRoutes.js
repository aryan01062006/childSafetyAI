
const express = require("express");
const router = express.Router();
const Concern = require("../models/Concern");

router.post("/", async (req, res) => {
  try {
    const { category, description, location, urgency, reporterName } =
      req.body;

    if (
      !category ||
      !description ||
      !description.trim() ||
      description.length > 3000
    ) {
      return res.status(400).json({
        message: "A valid category and description are required."
      });
    }

    const concern = await Concern.create({
      category,
      description: description.trim(),
      location,
      urgency,
      reporterName
    });

    res.status(201).json({
      message: "Concern submitted successfully.",
      concern
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Please check the submitted information."
      });
    }

    res.status(500).json({
      message: "Unable to submit concern."
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const concerns = await Concern.find()
      .select("-description -location -reporterName")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json(concerns);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve concerns."
    });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const allowedStatuses = [
      "pending",
      "under-review",
      "in-progress",
      "resolved"
    ];

    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({
        message: "Invalid case status."
      });
    }

    const concern = await Concern.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).select("-description -location -reporterName");

    if (!concern) {
      return res.status(404).json({
        message: "Concern not found."
      });
    }

    res.json({
      message: "Case status updated.",
      concern
    });
  } catch (error) {
    const invalidId = error.name === "CastError";

    res.status(invalidId ? 400 : 500).json({
      message: invalidId
        ? "Invalid concern ID."
        : "Unable to update case status."
    });
  }
});

module.exports = router;
