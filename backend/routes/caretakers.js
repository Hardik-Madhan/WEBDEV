// ==============================================================================
//  EXPRESS ROUTE: /api/caretaker (Corresponds to: caretaker.html)
//  File: backend/routes/caretakers.js
//  Purpose: Handles caregiver onboarding applications into data/caretaker-applications.json
// ==============================================================================

const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const mongoose = require("mongoose")
const CaretakerApplication = require("../models/CaretakerApplication")
const { readJson, writeJson } = require("../db")

// POST /api/caretaker: Saves application to data/caretaker-applications.json & MongoDB Atlas
router.post("/", async (req, res) => {
  const applications = readJson("caretaker-applications.json")
  const newApp = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    status: "Submitted",
    ...req.body,
  }
  applications.push(newApp)
  writeJson("caretaker-applications.json", applications)

  // Dual-save to MongoDB Atlas
  if (mongoose.connection.readyState === 1) {
    try {
      await new CaretakerApplication({
        applicationId: newApp.id,
        name: newApp.name || "Applicant",
        email: newApp.email || "",
        phone: newApp.phone || "",
        experience: newApp.experience || "",
        rate: newApp.rate || "",
        location: newApp.location || "Bengaluru",
        skills: Array.isArray(newApp.skills) ? newApp.skills : [newApp.skills].filter(Boolean),
        status: "Submitted",
        trainingSlotStatus: "Pending Slot Booking",
      }).save()
    } catch (err) {
      console.warn("MongoDB Caretaker Application note:", err.message)
    }
  }

  res.status(201).json({ ok: true, id: newApp.id })
})

// GET /api/caretaker: Returns registered applications
router.get("/", (req, res) => {
  const applications = readJson("caretaker-applications.json")
  res.json({ caretakers: applications })
})

module.exports = router
