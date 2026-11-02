// ==============================================================================
//  CARESURE - PURE NODE.JS HTTP SERVER & LOCAL JSON DATABASE
//  File: Option-2-Pure-HTML-CSS-JS/server.js
//  Purpose: Serves pure HTML, CSS, JavaScript, and image assets, and provides
//           REST API endpoints that persist form data into local JSON files in data/
//  Usage: Run with "node server.js" (Zero external npm dependencies required!)
// ==============================================================================

const http = require("http")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

const PORT = process.env.PORT || 3000
const BASE_DIR = __dirname
const DATA_DIR = path.join(BASE_DIR, "data")

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// MIME types dictionary for static files
const MIME_TYPES = {
  ".html": "text/html; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
  ".js": "application/javascript; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
}

// ------------------------------------------------------------------------------
// JSON FILE HELPER FUNCTIONS
// ------------------------------------------------------------------------------
function readJson(fileName) {
  const filePath = path.join(DATA_DIR, fileName)
  try {
    if (!fs.existsSync(filePath)) return []
    const content = fs.readFileSync(filePath, "utf8")
    return JSON.parse(content) || []
  } catch (err) {
    return []
  }
}

function writeJson(fileName, data) {
  const filePath = path.join(DATA_DIR, fileName)
  const tempPath = `${filePath}.${crypto.randomUUID()}.tmp`
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf8")
  fs.renameSync(tempPath, filePath)
}

function parseCookies(req) {
  const list = {}
  const rc = req.headers.cookie
  if (rc) {
    rc.split(";").forEach((cookie) => {
      const parts = cookie.split("=")
      list[parts.shift().trim()] = decodeURI(parts.join("="))
    })
  }
  return list
}

function getCurrentUser(req) {
  const cookies = parseCookies(req)
  const token = cookies.care_session
  if (!token) return null

  const sessions = readJson("sessions.json")
  const session = sessions.find((s) => s.token === token && s.expires > Date.now())
  if (!session) return null

  const users = readJson("users.json")
  return users.find((u) => u.id === session.userId) || null
}

// ------------------------------------------------------------------------------
// MAIN HTTP REQUEST ROUTER
// ------------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`)
  const pathname = parsedUrl.pathname
  const method = req.method

  // Helper to send JSON responses
  const sendJson = (statusCode, data, extraHeaders = {}) => {
    res.writeHead(statusCode, { "Content-Type": "application/json", ...extraHeaders })
    res.end(JSON.stringify(data))
  }

  // Collect request body for POST/PATCH
  let bodyBuffer = []
  req.on("data", (chunk) => bodyBuffer.push(chunk))
  req.on("end", () => {
    const rawBody = Buffer.concat(bodyBuffer).toString()
    let parsedBody = {}
    try {
      if (rawBody && req.headers["content-type"]?.includes("application/json")) {
        parsedBody = JSON.parse(rawBody)
      }
    } catch (e) {}

    // --------------------------------------------------------------------------
    // 1. API ROUTES (Writing directly to local JSON files)
    // --------------------------------------------------------------------------

    // POST /api/contact: Saves enquiry into data/contacts.json
    if (pathname === "/api/contact" && method === "POST") {
      const { name, email, phone, topic, message, consent } = parsedBody

      if (!name || !email || !topic || !message) {
        return sendJson(422, { error: "Please complete all required fields." })
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
      return sendJson(201, { ok: true, submission: { id: submission.id } })
    }

    // POST /api/account: Handles Login, Sign Up, and Logout
    if (pathname === "/api/account" && method === "POST") {
      const action = parsedBody.action

      // A. Logout
      if (action === "logout") {
        return sendJson(200, { ok: true }, {
          "Set-Cookie": "care_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
        })
      }

      // B. Login
      if (action === "login") {
        const email = String(parsedBody.email || "").trim().toLowerCase()
        const password = String(parsedBody.password || "")

        const users = readJson("users.json")
        const user = users.find((u) => u.email === email && u.password === password)

        if (!user) {
          return sendJson(401, { error: "Incorrect email or password." })
        }

        const token = crypto.randomBytes(32).toString("hex")
        const sessions = readJson("sessions.json")
        sessions.push({ token, userId: user.id, expires: Date.now() + 7 * 86400000 })
        writeJson("sessions.json", sessions)

        return sendJson(200, { user: { id: user.id, name: user.name, email: user.email } }, {
          "Set-Cookie": `care_session=${token}; Path=/; HttpOnly; SameSite=Lax`,
        })
      }

      // C. Sign Up
      if (action === "signup") {
        const { name, phone, location, careNeeds, email, password } = parsedBody

        if (!name || !email || !password || String(password).length < 8) {
          return sendJson(422, { error: "Please fill in valid details. Passwords must be at least 8 characters." })
        }

        const users = readJson("users.json")
        if (users.some((u) => u.email.toLowerCase() === String(email).trim().toLowerCase())) {
          return sendJson(409, { error: "An account with this email already exists." })
        }

        const newUser = {
          id: crypto.randomUUID(),
          name: String(name).trim(),
          phone: String(phone).trim(),
          location: String(location).trim(),
          careNeeds: String(careNeeds || "").trim(),
          email: String(email).trim().toLowerCase(),
          password: String(password), // Stored in users.json
          saved: [],
        }

        users.push(newUser)
        writeJson("users.json", users)

        const token = crypto.randomBytes(32).toString("hex")
        const sessions = readJson("sessions.json")
        sessions.push({ token, userId: newUser.id, expires: Date.now() + 7 * 86400000 })
        writeJson("sessions.json", sessions)

        return sendJson(201, { user: { id: newUser.id, name: newUser.name, email: newUser.email } }, {
          "Set-Cookie": `care_session=${token}; Path=/; HttpOnly; SameSite=Lax`,
        })
      }
    }

    // GET /api/account: Check current user session
    if (pathname === "/api/account" && method === "GET") {
      const user = getCurrentUser(req)
      return sendJson(200, { user: user ? { id: user.id, name: user.name, email: user.email, phone: user.phone, location: user.location, careNeeds: user.careNeeds, saved: user.saved || [] } : null })
    }

    // PATCH /api/account: Update user profile
    if (pathname === "/api/account" && method === "PATCH") {
      const user = getCurrentUser(req)
      if (!user) return sendJson(401, { error: "Please log in." })

      const users = readJson("users.json")
      const target = users.find((u) => u.id === user.id)
      if (target) {
        if (parsedBody.name) target.name = parsedBody.name
        if (parsedBody.phone) target.phone = parsedBody.phone
        if (parsedBody.location) target.location = parsedBody.location
        if (parsedBody.careNeeds !== undefined) target.careNeeds = parsedBody.careNeeds
        writeJson("users.json", users)
      }
      return sendJson(200, { user: target })
    }

    // POST /api/bookings: Save booking to data/bookings.json
    if (pathname === "/api/bookings" && method === "POST") {
      const user = getCurrentUser(req)
      const { caretakerId, date, time, address } = parsedBody

      if (!caretakerId || !date || !time || !address) {
        return sendJson(422, { error: "Please provide date, time, and address." })
      }

      const bookings = readJson("bookings.json")
      const newBooking = {
        id: `CS-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
        userId: user ? user.id : "guest-user",
        familyName: user ? user.name : "Guest Family",
        familyEmail: user ? user.email : "guest@example.com",
        caretakerId,
        caretakerName: "Caregiver Specialist",
        date,
        time,
        address,
        durationHours: 4,
        estimatedTotal: 1400,
        submittedAt: new Date().toISOString(),
      }

      bookings.push(newBooking)
      writeJson("bookings.json", bookings)
      return sendJson(201, { ok: true, booking: { id: newBooking.id } })
    }

    // GET /api/bookings: Returns bookings from data/bookings.json
    if (pathname === "/api/bookings" && method === "GET") {
      const bookings = readJson("bookings.json")
      return sendJson(200, { bookings })
    }

    // POST /api/caretaker: Saves application to data/caretaker-applications.json
    if (pathname === "/api/caretaker" && method === "POST") {
      const applications = readJson("caretaker-applications.json")
      const newApp = {
        id: crypto.randomUUID(),
        submittedAt: new Date().toISOString(),
        status: "Submitted",
      }
      applications.push(newApp)
      writeJson("caretaker-applications.json", applications)
      return sendJson(201, { ok: true, id: newApp.id })
    }

    // GET /api/caretaker: Returns registered applications
    if (pathname === "/api/caretaker" && method === "GET") {
      const applications = readJson("caretaker-applications.json")
      return sendJson(200, { caretakers: applications })
    }

    // --------------------------------------------------------------------------
    // 2. STATIC FILE SERVER (Serves .html, .css, .js, images)
    // --------------------------------------------------------------------------
    let filePath = path.join(BASE_DIR, pathname === "/" ? "index.html" : pathname)

    // Normalize path to prevent directory traversal
    if (!filePath.startsWith(BASE_DIR)) {
      res.writeHead(403)
      return res.end("Forbidden")
    }

    // If requesting directory, serve index.html inside it
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html")
    }

    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME_TYPES[ext] || "application/octet-stream"

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.writeHead(404, { "Content-Type": "text/html" })
          res.end("<h1>404 Not Found</h1><p><a href='/'>Return to Home</a></p>")
        } else {
          res.writeHead(500)
          res.end(`Server Error: ${err.code}`)
        }
      } else {
        res.writeHead(200, { "Content-Type": contentType })
        res.end(content)
      }
    })
  })
})

server.listen(PORT, () => {
  console.log(`\n==================================================`)
  console.log(`🚀 CareSure Pure HTML/CSS/JS Server is Live!`)
  console.log(`👉 Open: http://localhost:${PORT}`)
  console.log(`📂 Data files saved in: ${DATA_DIR}`)
  console.log(`==================================================\n`)
})
