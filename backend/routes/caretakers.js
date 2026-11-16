// ==============================================================================
//  ROUTE: /api/caretaker (Corresponds to: caretaker.html)
//  File: backend/routes/caretakers.js
//  Purpose: Handles caregiver onboarding applications into data/caretaker-applications.json
// ==============================================================================

const crypto = require("crypto")
const { readJson, writeJson } = require("../db")

function handleCaretakerApplications(req, res, pathname, method, parsedBody, sendJson) {
  if (pathname !== "/api/caretaker") return false

  // POST /api/caretaker: Saves application to data/caretaker-applications.json
  if (method === "POST") {
    const applications = readJson("caretaker-applications.json")
    const newApp = {
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      status: "Submitted",
      ...parsedBody,
    }
    applications.push(newApp)
    writeJson("caretaker-applications.json", applications)
    sendJson(201, { ok: true, id: newApp.id })
    return true
  }

  // GET /api/caretaker: Returns registered applications
  if (method === "GET") {
    const applications = readJson("caretaker-applications.json")
    sendJson(200, { caretakers: applications })
    return true
  }

  return false
}

module.exports = { handleCaretakerApplications }
