// ==============================================================================
//  MONGOOSE MODEL: User (Collection: users)
//  File: backend/models/User.js
//  Purpose: MongoDB Atlas Schema for User Accounts, Profiles, and Auth
// ==============================================================================

const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    userId: {
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
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "Bengaluru",
    },
    careNeeds: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["family", "caretaker", "admin"],
      default: "family",
    },
    saved: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("User", userSchema)
