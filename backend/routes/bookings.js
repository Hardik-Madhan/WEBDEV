// ==============================================================================
//  EXPRESS ROUTE: /api/bookings (Corresponds to: find.html Booking Wizard & Dashboard)
//  File: backend/routes/bookings.js
//  Purpose: Parameters 3 & 4 - Express API saving to local JSON & MongoDB Atlas
// ==============================================================================

const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const mongoose = require("mongoose")
const { readJson, writeJson, getCurrentUser } = require("../db")
const BookingModel = require("../models/Booking")

// POST /api/bookings: Save booking to data/bookings.json and sync to MongoDB
router.post("/", async (req, res) => {
  const user = getCurrentUser(req)
  const { caretakerId, date, time, address, durationHours, estimatedTotal } = req.body

  if (!caretakerId || !date || !time || !address) {
    return res.status(422).json({ error: "Please provide date, time, and address." })
  }

  // 1. Save to local JSON (Parameter 3: Local JSON persistence)
  const bookings = readJson("bookings.json")
  const newBooking = {
    id: `CS-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
    userId: user ? user.id : "guest-user",
    familyName: user ? user.name : (req.body.familyName || "Guest Family"),
    familyEmail: user ? user.email : (req.body.familyEmail || "guest@example.com"),
    caretakerId,
    caretakerName: req.body.caretakerName || "Caregiver Specialist",
    date,
    time,
    address,
    durationHours: Number(durationHours) || 4,
    estimatedTotal: Number(estimatedTotal) || 1400,
    submittedAt: new Date().toISOString(),
  }

  bookings.push(newBooking)
  writeJson("bookings.json", bookings)

  // 2. Dual persistence to MongoDB Atlas (Parameter 4)
  if (mongoose.connection.readyState === 1) {
    try {
      await new BookingModel({
        bookingId: newBooking.id,
        caretakerId: newBooking.caretakerId,
        caretakerName: newBooking.caretakerName,
        familyName: newBooking.familyName,
        familyEmail: newBooking.familyEmail,
        date: newBooking.date,
        time: newBooking.time,
        address: newBooking.address,
        durationHours: newBooking.durationHours,
        estimatedTotal: newBooking.estimatedTotal,
        source: "Find Page Booking",
      }).save()
    } catch (err) {
      console.warn("MongoDB sync note:", err.message)
    }
  }

  res.status(201).json({ ok: true, booking: { id: newBooking.id } })
})

// GET /api/bookings: Returns bookings from data/bookings.json for dashboard
router.get("/", (req, res) => {
  const bookings = readJson("bookings.json")
  res.json({ bookings })
})

module.exports = router
