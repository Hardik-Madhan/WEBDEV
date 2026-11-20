// ==============================================================================
//  CARESURE - EXTERNAL PUBLIC API INTEGRATIONS
//  File: backend/routes/externalApi.js
//  Purpose: Parameter 1 - Fetching and displaying data from external public web APIs
// ==============================================================================

const express = require("express")
const router = express.Router()

// ------------------------------------------------------------------------------
// 1. EXTERNAL API: India Post Postal PIN Code Lookup API (No key required)
//    Endpoint: GET /api/external/pincode/:pincode
//    Upstream: https://api.postalpincode.in/pincode/{pincode}
// ------------------------------------------------------------------------------
router.get("/pincode/:pincode", async (req, res) => {
  const pincode = String(req.params.pincode || "").trim()

  if (!/^\d{6}$/.test(pincode)) {
    return res.status(400).json({
      ok: false,
      error: "Please enter a valid 6-digit Indian PIN code.",
    })
  }

  try {
    const upstreamUrl = `https://api.postalpincode.in/pincode/${pincode}`
    const apiRes = await fetch(upstreamUrl)
    const data = await apiRes.json()

    if (!Array.isArray(data) || !data[0] || data[0].Status !== "Success") {
      return res.status(404).json({
        ok: false,
        error: "No locality found for this PIN code.",
      })
    }

    const postOffices = data[0].PostOffice || []
    const first = postOffices[0] || {}

    res.json({
      ok: true,
      pincode,
      source: "India Post External Public API",
      locality: first.Name || "Area",
      district: first.District || "Bengaluru",
      state: first.State || "Karnataka",
      availableAreas: postOffices.map((po) => po.Name).slice(0, 5),
    })
  } catch (err) {
    res.status(502).json({
      ok: false,
      error: "Could not contact India Post external API: " + err.message,
    })
  }
})

// ------------------------------------------------------------------------------
// 2. EXTERNAL API: Live Bengaluru Care Weather & Outdoor Advisory (Open-Meteo)
//    Endpoint: GET /api/external/weather
//    Upstream: Open-Meteo Public Weather API (No key required)
// ------------------------------------------------------------------------------
router.get("/weather", async (req, res) => {
  try {
    // Coordinates for Bengaluru: Lat 12.9716, Long 77.5946
    const url = "https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FKolkata"
    const apiRes = await fetch(url)
    const data = await apiRes.json()

    const current = data.current || {}
    const temp = current.temperature_2m ?? 26
    const humidity = current.relative_humidity_2m ?? 55
    const wind = current.wind_speed_10m ?? 8

    // Senior citizen outdoor walk advisory
    let walkSafety = "Ideal for Senior Outdoor Walk"
    let statusColor = "#10b981"
    if (temp > 33) {
      walkSafety = "Hot Weather: Prefer Indoor Care & Hydration"
      statusColor = "#f59e0b"
    } else if (temp < 15) {
      walkSafety = "Cool Weather: Ensure Warm Clothing for Seniors"
      statusColor = "#3b82f6"
    }

    res.json({
      ok: true,
      city: "Bengaluru, Karnataka",
      source: "Open-Meteo External Weather API",
      temperature: temp,
      humidity,
      windSpeed: wind,
      advisory: walkSafety,
      statusColor,
      updatedAt: current.time || new Date().toISOString(),
    })
  } catch (err) {
    res.status(502).json({
      ok: false,
      error: "Could not contact Open-Meteo external API: " + err.message,
    })
  }
})

module.exports = router
