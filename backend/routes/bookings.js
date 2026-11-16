// ==============================================================================
//  ROUTE: /api/bookings (Corresponds to: find.html 5-step Booking Modal)
//  File: backend/routes/bookings.js
//  Purpose: Handles booking creation and retrieval from data/bookings.json
// ==============================================================================

const crypto = require("crypto")
const { readJson, writeJson, getCurrentUser } = require("../db")

function handleBookings(req, res, pathname, method, parsedBody, sendJson) {
  if (pathname !== "/api/bookings") return false

  // POST /api/bookings: Save booking to data/bookings.json
  if (method === "POST") {
    const user = getCurrentUser(req)
    const { caretakerId, date, time, address, durationHours, estimatedTotal } = parsedBody

    if (!caretakerId || !date || !time || !address) {
      sendJson(422, { error: "Please provide date, time, and address." })
      return true
    }

    const bookings = readJson("bookings.json")
    const newBooking = {
      id: `CS-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
      userId: user ? user.id : "guest-user",
      familyName: user ? user.name : (parsedBody.familyName || "Guest Family"),
      familyEmail: user ? user.email : (parsedBody.familyEmail || "guest@example.com"),
      caretakerId,
      caretakerName: parsedBody.caretakerName || "Caregiver Specialist",
      date,
      time,
      address,
      durationHours: Number(durationHours) || 4,
      estimatedTotal: Number(estimatedTotal) || 1400,
      submittedAt: new Date().toISOString(),
    }

    bookings.push(newBooking)
    writeJson("bookings.json", bookings)
    sendJson(201, { ok: true, booking: { id: newBooking.id } })
    return true
  }

  // GET /api/bookings: Returns bookings from data/bookings.json for dashboard.html
  if (method === "GET") {
    const bookings = readJson("bookings.json")
    sendJson(200, { bookings })
    return true
  }

  return false
}

module.exports = { handleBookings }
