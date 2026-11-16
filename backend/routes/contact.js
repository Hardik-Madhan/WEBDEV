// ==============================================================================
//  ROUTE: /api/contact (Corresponds to: contact.html)
//  File: backend/routes/contact.js
//  Purpose: Saves support & emergency enquiries into data/contacts.json
// ==============================================================================

const crypto = require("crypto")
const { readJson, writeJson } = require("../db")

function handleContact(req, res, pathname, method, parsedBody, sendJson) {
  if (pathname !== "/api/contact") return false

  if (method === "POST") {
    const { name, email, phone, topic, message, consent } = parsedBody

    if (!name || !email || !topic || !message) {
      sendJson(422, { error: "Please complete all required fields." })
      return true
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
    sendJson(201, { ok: true, submission: { id: submission.id } })
    return true
  }

  return false
}

module.exports = { handleContact }
