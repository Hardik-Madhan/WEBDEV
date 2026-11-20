// ==============================================================================
//  CARESURE - MONGOOSE BOOKING MODEL (FOR MONGODB ATLAS)
//  File: backend/models/Booking.js
//  Purpose: Mongoose Schema & Model for managing CareSure bookings in MongoDB Atlas
// ==============================================================================

const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      default: () => `CS-MG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      unique: true,
    },
    caretakerId: {
      type: String,
      required: true,
    },
    caretakerName: {
      type: String,
      default: "Caregiver Specialist",
    },
    familyName: {
      type: String,
      required: true,
      default: "CareSure Family",
    },
    familyEmail: {
      type: String,
      required: true,
      default: "family@example.com",
    },
    phone: {
      type: String,
      default: "+91 98765 43210",
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    durationHours: {
      type: Number,
      required: true,
      default: 4,
    },
    estimatedTotal: {
      type: Number,
      required: true,
      default: 1400,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"],
      default: "Confirmed",
    },
    source: {
      type: String,
      default: "MongoDB Atlas",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
)

module.exports = mongoose.model("Booking", bookingSchema)
