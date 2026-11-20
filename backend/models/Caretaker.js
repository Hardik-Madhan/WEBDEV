// ==============================================================================
//  MONGOOSE MODEL: Caretaker (Collection: caretakers)
//  File: backend/models/Caretaker.js
//  Purpose: MongoDB Atlas Schema for Caregiver Directory & Verified Professionals
// ==============================================================================

const mongoose = require("mongoose")

const caretakerSchema = new mongoose.Schema(
  {
    caretakerId: {
      type: String,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      default: "images/caretaker-1.png",
    },
    verified: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviews: {
      type: Number,
      default: 50,
    },
    experience: {
      type: Number,
      default: 5,
    },
    skills: {
      type: [String],
      default: [],
    },
    careTypes: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      default: "Bengaluru",
    },
    distance: {
      type: Number,
      default: 2.0,
    },
    availability: {
      type: String,
      default: "Available Today",
    },
    price: {
      type: Number,
      default: 350,
    },
    languages: {
      type: [String],
      default: ["English", "Hindi"],
    },
    about: {
      type: String,
      default: "",
    },
    services: {
      type: [String],
      default: [],
    },
    responseTime: {
      type: String,
      default: "Usually responds in 15 min",
    },
    map: {
      x: { type: Number, default: 50 },
      y: { type: Number, default: 50 },
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Caretaker", caretakerSchema)
