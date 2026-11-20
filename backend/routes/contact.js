// ==============================================================================
//  EXPRESS ROUTE: /api/contact (Corresponds to: contact.html)
//  File: backend/routes/contact.js
//  Purpose: Saves support & emergency enquiries into data/contacts.json
// ==============================================================================

const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const { readJson, writeJson } = require("../db")

router.post("/", (req, res) => {
  const { name, email, phone, topic, message, consent } = req.body

  if (!name || !email || !topic || !message) {
    return res.status(422).json({ error: "Please complete all required fields." })
  }

  const contacts = readJson("contacts.json")
  const submission = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone || "").trim(),
    topic: String(topic).trim(),
    message: String(message).trim(),
    consent: Boolean(consent),
    submittedAt: new Date().toISOString(),
  }

  contacts.push(submission)
  writeJson("contacts.json", contacts)
  res.status(201).json({ ok: true, submission: { id: submission.id } })
})

router.get("/", (req, res) => {
  const contacts = readJson("contacts.json")
  res.json({ contacts })
})

module.exports = router
