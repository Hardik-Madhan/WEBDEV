// ==============================================================================
//  EXPRESS ROUTE: /api/caretaker (Corresponds to: caretaker.html)
//  File: backend/routes/caretakers.js
//  Purpose: Handles caregiver onboarding applications into data/caretaker-applications.json
// ==============================================================================

const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const { readJson, writeJson } = require("../db")

// POST /api/caretaker: Saves application to data/caretaker-applications.json
router.post("/", (req, res) => {
  const applications = readJson("caretaker-applications.json")
  const newApp = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    status: "Submitted",
    ...req.body,
  }
  applications.push(newApp)
  writeJson("caretaker-applications.json", applications)
  res.status(201).json({ ok: true, id: newApp.id })
})

// GET /api/caretaker: Returns registered applications
router.get("/", (req, res) => {
  const applications = readJson("caretaker-applications.json")
  res.json({ caretakers: applications })
})

module.exports = router
