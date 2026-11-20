// ==============================================================================
//  CARESURE - EXPRESS CRUD ROUTER FOR MONGODB ATLAS
//  File: backend/routes/mongoBookings.js
//  Purpose: Full CRUD operations (Create, Read, Update, Delete) for Bookings in MongoDB
// ==============================================================================

const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Booking = require("../models/Booking")

// Middleware to check if MongoDB is connected
function checkMongoConnection(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      ok: false,
      error: "MongoDB is not connected. Please check your connection string in .env",
      readyState: mongoose.connection.readyState,
    })
  }
  next()
}

// ------------------------------------------------------------------------------
// 0. HEALTH / STATUS: Check MongoDB Atlas connection status
// ------------------------------------------------------------------------------
router.get("/status/health", (req, res) => {
  const states = ["Disconnected", "Connected", "Connecting", "Disconnecting"]
  const readyState = mongoose.connection.readyState
  res.json({
    ok: readyState === 1,
    status: states[readyState] || "Unknown",
    database: mongoose.connection.name || "caresure",
    host: mongoose.connection.host || "Atlas Cluster",
  })
})

// ------------------------------------------------------------------------------
// 1. CREATE (POST /api/mongo/bookings): Add new booking document to MongoDB Atlas
// ------------------------------------------------------------------------------
router.post("/", checkMongoConnection, async (req, res) => {
  try {
    const { caretakerId, caretakerName, familyName, familyEmail, phone, date, time, address, durationHours, estimatedTotal, status, notes, source } = req.body

    if (!date || !time || !address) {
      return res.status(422).json({
        ok: false,
        error: "Please provide date, time, and address.",
      })
    }

    const finalCaretakerId = caretakerId || (caretakerName ? caretakerName.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "caregiver-01")

    const newBooking = new Booking({
      caretakerId: finalCaretakerId,
      caretakerName: caretakerName || "Caregiver Specialist",
      familyName: familyName || "CareSure Family",
      familyEmail: familyEmail || "family@example.com",
      phone: phone || "+91 98765 43210",
      date,
      time,
      address,
      durationHours: Number(durationHours) || 4,
      estimatedTotal: Number(estimatedTotal) || 1400,
      status: status || "Confirmed",
      notes: notes || "",
      source: source || "MongoDB Atlas Direct",
    })

    const saved = await newBooking.save()
    res.status(201).json({
      ok: true,
      message: "Booking successfully created in MongoDB Atlas!",
      booking: saved,
    })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

// ------------------------------------------------------------------------------
// 2. READ ALL (GET /api/mongo/bookings): Fetch all booking documents from MongoDB
// ------------------------------------------------------------------------------
router.get("/", checkMongoConnection, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 })
    res.json({
      ok: true,
      count: bookings.length,
      bookings,
    })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

// ------------------------------------------------------------------------------
// 3. READ ONE (GET /api/mongo/bookings/:id): Fetch single booking by MongoDB _id or bookingId
// ------------------------------------------------------------------------------
router.get("/:id", checkMongoConnection, async (req, res) => {
  try {
    const { id } = req.params
    let booking = null

    if (mongoose.Types.ObjectId.isValid(id)) {
      booking = await Booking.findById(id)
    }
    if (!booking) {
      booking = await Booking.findOne({ bookingId: id })
    }

    if (!booking) {
      return res.status(404).json({ ok: false, error: "Booking not found in MongoDB." })
    }

    res.json({ ok: true, booking })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

// ------------------------------------------------------------------------------
// 4. UPDATE (PUT or PATCH /api/mongo/bookings/:id): Update booking fields in MongoDB
// ------------------------------------------------------------------------------
router.put("/:id", checkMongoConnection, async (req, res) => {
  try {
    const { id } = req.params
    let updated = null

    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Booking.findByIdAndUpdate(id, req.body, { returnDocument: "after", runValidators: true })
    }
    if (!updated) {
      updated = await Booking.findOneAndUpdate({ bookingId: id }, req.body, { returnDocument: "after", runValidators: true })
    }

    if (!updated) {
      return res.status(404).json({ ok: false, error: "Booking not found to update." })
    }

    res.json({
      ok: true,
      message: "Booking updated successfully in MongoDB Atlas!",
      booking: updated,
    })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

router.patch("/:id", checkMongoConnection, async (req, res) => {
  try {
    const { id } = req.params
    let updated = null

    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Booking.findByIdAndUpdate(id, { $set: req.body }, { returnDocument: "after" })
    }
    if (!updated) {
      updated = await Booking.findOneAndUpdate({ bookingId: id }, { $set: req.body }, { returnDocument: "after" })
    }

    if (!updated) {
      return res.status(404).json({ ok: false, error: "Booking not found to update." })
    }

    res.json({
      ok: true,
      message: "Booking updated successfully in MongoDB Atlas!",
      booking: updated,
    })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

// ------------------------------------------------------------------------------
// 5. DELETE (DELETE /api/mongo/bookings/:id): Remove booking document from MongoDB
// ------------------------------------------------------------------------------
router.delete("/:id", checkMongoConnection, async (req, res) => {
  try {
    const { id } = req.params
    let deleted = null

    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Booking.findByIdAndDelete(id)
    }
    if (!deleted) {
      deleted = await Booking.findOneAndDelete({ bookingId: id })
    }

    if (!deleted) {
      return res.status(404).json({ ok: false, error: "Booking not found to delete." })
    }

    res.json({
      ok: true,
      message: "Booking deleted successfully from MongoDB Atlas!",
      deletedId: id,
    })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

module.exports = router
