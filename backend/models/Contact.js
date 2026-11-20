// ==============================================================================
//  MONGOOSE MODEL: Contact (Collection: contacts)
//  File: backend/models/Contact.js
//  Purpose: MongoDB Atlas Schema for Contact Inquiries & Support Messages
// ==============================================================================

const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema(
  {
    contactId: {
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
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: "",
    },
    subject: {
      type: String,
      default: "General Inquiry",
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["New", "In Progress", "Resolved"],
      default: "New",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Contact", contactSchema)
