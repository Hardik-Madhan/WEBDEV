// ==============================================================================
//  MONGOOSE MODEL: CaretakerApplication (Collection: caretaker_applications)
//  File: backend/models/CaretakerApplication.js
//  Purpose: MongoDB Atlas Schema for Caregiver Job Onboarding Applications
// ==============================================================================

const mongoose = require("mongoose")

const caretakerApplicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
    },
    rate: {
      type: String,
    },
    location: {
      type: String,
      default: "Bengaluru",
    },
    skills: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Submitted", "Under Review", "Training Slot Booked", "Approved"],
      default: "Submitted",
    },
    trainingSlotStatus: {
      type: String,
      default: "Pending Slot Booking",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("CaretakerApplication", caretakerApplicationSchema)
