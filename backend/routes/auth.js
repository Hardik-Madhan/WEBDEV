// ==============================================================================
//  EXPRESS ROUTE: /api/account (Corresponds to: login.html, signup.html & dashboard.html)
//  File: backend/routes/auth.js
//  Purpose: Handles user registration, authentication, sessions, and profile updates in JSON
// ==============================================================================

const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const mongoose = require("mongoose")
const User = require("../models/User")
const { readJson, writeJson, getCurrentUser } = require("../db")

// POST /api/account: Handles Login, Sign Up, and Logout
router.post("/", (req, res) => {
  const action = req.body.action
  console.log(`[AUTH DEBUG] Action: ${action} | Received from Frontend at ${new Date().toLocaleTimeString()}`)

  // A. Logout
  if (action === "logout") {
    res.setHeader("Set-Cookie", "care_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT")
    return res.json({ ok: true })
  }

  // B. Login
  if (action === "login") {
    debugger // Automatic pause for Backend Debugger
    const email = String(req.body.email || "").trim().toLowerCase()
    const password = String(req.body.password || "")

    const users = readJson("users.json")
    const user = users.find((u) => u.email.toLowerCase() === email)

    if (!user) {
      return res.status(404).json({ error: "No account exists with this email. Please sign up first." })
    }// 404 = Not Found

    if (user.password !== password) {
      return res.status(401).json({ error: "Incorrect password. Please verify and try again." })
    }// 401 = Unauthorized

    const token = crypto.randomBytes(32).toString("hex")
    const sessions = readJson("sessions.json")
    sessions.push({ token, userId: user.id, expires: Date.now() + 7 * 86400000 })
    writeJson("sessions.json", sessions)

    res.setHeader("Set-Cookie", `care_session=${token}; Path=/; HttpOnly; SameSite=Lax`)
    return res.json({ user: { id: user.id, name: user.name, email: user.email } })
  }

  // C. Sign Up
  if (action === "signup") {
    const { name, phone, location, careNeeds, email, password } = req.body

    if (!name || !email || !password || String(password).length < 8) {
      return res.status(422).json({ error: "Please fill in valid details. Passwords must be at least 8 characters." })
    }

    const users = readJson("users.json")
    if (users.some((u) => u.email.toLowerCase() === String(email).trim().toLowerCase())) {
      return res.status(409).json({ error: "An account with this email already exists." })
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: String(name).trim(),
      phone: String(phone || "").trim(),
      location: String(location || "Bengaluru").trim(),
      careNeeds: String(careNeeds || "").trim(),
      email: String(email).trim().toLowerCase(),
      password: String(password),
      saved: [],
    }

    users.push(newUser)
    writeJson("users.json", users)

    // Dual-save to MongoDB Atlas Users collection
    if (mongoose.connection.readyState === 1) {
      User.findOneAndUpdate(
        { email: newUser.email },
        {
          userId: newUser.id,
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          phone: newUser.phone,
          location: newUser.location,
          careNeeds: newUser.careNeeds,
          saved: [],
        },
        { upsert: true, returnDocument: "after" }
      ).catch((err) => console.warn("MongoDB User sync note:", err.message))
    }

    const token = crypto.randomBytes(32).toString("hex")
    const sessions = readJson("sessions.json")
    sessions.push({ token, userId: newUser.id, expires: Date.now() + 7 * 86400000 })
    writeJson("sessions.json", sessions)

    res.setHeader("Set-Cookie", `care_session=${token}; Path=/; HttpOnly; SameSite=Lax`)
    return res.status(201).json({ user: { id: newUser.id, name: newUser.name, email: newUser.email } })
  }

  res.status(400).json({ error: "Invalid action." })
})

// GET /api/account: Check current user session (used by dashboard.html & main.js)
router.get("/", (req, res) => {
  const user = getCurrentUser(req)
  res.json({
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: user.location,
          careNeeds: user.careNeeds,
          saved: user.saved || [],
        }
      : null,
  })
})

// PATCH /api/account: Update user profile
router.patch("/", (req, res) => {
  const user = getCurrentUser(req)
  if (!user) {
    return res.status(401).json({ error: "Please log in." })
  }

  const users = readJson("users.json")
  const target = users.find((u) => u.id === user.id)
  if (target) {
    if (req.body.name) target.name = req.body.name
    if (req.body.phone) target.phone = req.body.phone
    if (req.body.location) target.location = req.body.location
    if (req.body.careNeeds !== undefined) target.careNeeds = req.body.careNeeds
    writeJson("users.json", users)

    // Dual-update in MongoDB Atlas
    if (mongoose.connection.readyState === 1) {
      User.findOneAndUpdate(
        { userId: target.id },
        {
          name: target.name,
          phone: target.phone,
          location: target.location,
          careNeeds: target.careNeeds,
        },
        { returnDocument: "after" }
      ).catch((err) => console.warn("MongoDB User update note:", err.message))
    }
  }
  res.json({ user: target })
})

module.exports = router
