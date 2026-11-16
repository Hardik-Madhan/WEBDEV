// ==============================================================================
//  ROUTE: /api/account (Corresponds to: login.html, signup.html & dashboard.html)
//  File: backend/routes/auth.js
//  Purpose: Handles user registration, authentication, sessions, and profile updates
// ==============================================================================

const crypto = require("crypto")
const { readJson, writeJson, getCurrentUser } = require("../db")

function handleAuth(req, res, pathname, method, parsedBody, sendJson) {
  if (pathname !== "/api/account") return false

  // POST /api/account: Handles Login, Sign Up, and Logout
  if (method === "POST") {
    const action = parsedBody.action

    // A. Logout
    if (action === "logout") {
      sendJson(200, { ok: true }, {
        "Set-Cookie": "care_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      })
      return true
    }

    // B. Login
    if (action === "login") {
      const email = String(parsedBody.email || "").trim().toLowerCase()
      const password = String(parsedBody.password || "")

      const users = readJson("users.json")
      const user = users.find((u) => u.email === email && u.password === password)

      if (!user) {
        sendJson(401, { error: "Incorrect email or password." })
        return true
      }

      const token = crypto.randomBytes(32).toString("hex")
      const sessions = readJson("sessions.json")
      sessions.push({ token, userId: user.id, expires: Date.now() + 7 * 86400000 })
      writeJson("sessions.json", sessions)

      sendJson(200, { user: { id: user.id, name: user.name, email: user.email } }, {
        "Set-Cookie": `care_session=${token}; Path=/; HttpOnly; SameSite=Lax`,
      })
      return true
    }

    // C. Sign Up
    if (action === "signup") {
      const { name, phone, location, careNeeds, email, password } = parsedBody

      if (!name || !email || !password || String(password).length < 8) {
        sendJson(422, { error: "Please fill in valid details. Passwords must be at least 8 characters." })
        return true
      }

      const users = readJson("users.json")
      if (users.some((u) => u.email.toLowerCase() === String(email).trim().toLowerCase())) {
        sendJson(409, { error: "An account with this email already exists." })
        return true
      }

      const newUser = {
        id: crypto.randomUUID(),
        name: String(name).trim(),
        phone: String(phone).trim(),
        location: String(location).trim(),
        careNeeds: String(careNeeds || "").trim(),
        email: String(email).trim().toLowerCase(),
        password: String(password),
        saved: [],
      }

      users.push(newUser)
      writeJson("users.json", users)

      const token = crypto.randomBytes(32).toString("hex")
      const sessions = readJson("sessions.json")
      sessions.push({ token, userId: newUser.id, expires: Date.now() + 7 * 86400000 })
      writeJson("sessions.json", sessions)

      sendJson(201, { user: { id: newUser.id, name: newUser.name, email: newUser.email } }, {
        "Set-Cookie": `care_session=${token}; Path=/; HttpOnly; SameSite=Lax`,
      })
      return true
    }
  }

  // GET /api/account: Check current user session (used by dashboard.html)
  if (method === "GET") {
    const user = getCurrentUser(req)
    sendJson(200, {
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
    return true
  }

  // PATCH /api/account: Update user profile
  if (method === "PATCH") {
    const user = getCurrentUser(req)
    if (!user) {
      sendJson(401, { error: "Please log in." })
      return true
    }

    const users = readJson("users.json")
    const target = users.find((u) => u.id === user.id)
    if (target) {
      if (parsedBody.name) target.name = parsedBody.name
      if (parsedBody.phone) target.phone = parsedBody.phone
      if (parsedBody.location) target.location = parsedBody.location
      if (parsedBody.careNeeds !== undefined) target.careNeeds = parsedBody.careNeeds
      writeJson("users.json", users)
    }
    sendJson(200, { user: target })
    return true
  }

  return false
}

module.exports = { handleAuth }
