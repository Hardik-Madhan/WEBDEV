// ==============================================================================
//  CARESURE - MODULAR NODE.JS HTTP SERVER
//  File: backend/server.js
//  Purpose: Modular router delegating requests to page-specific route modules:
//           - routes/bookings.js   -> Handles find.html booking wizard
//           - routes/auth.js       -> Handles login.html, signup.html & dashboard.html
//           - routes/contact.js    -> Handles contact.html inquiries
//           - routes/caretakers.js -> Handles caretaker.html applications
// ==============================================================================

const http = require("http")
const fs = require("fs")
const path = require("path")

// Import modular route handlers
const { handleBookings } = require("./routes/bookings")
const { handleAuth } = require("./routes/auth")
const { handleContact } = require("./routes/contact")
const { handleCaretakerApplications } = require("./routes/caretakers")

const PORT = process.env.PORT || 3000
const FRONTEND_DIR = path.join(__dirname, "..", "frontend")

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

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`)
  const pathname = parsedUrl.pathname
  const method = req.method

  const sendJson = (statusCode, data, extraHeaders = {}) => {
    res.writeHead(statusCode, { "Content-Type": "application/json", ...extraHeaders })
    res.end(JSON.stringify(data))
  }

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
    // 1. MODULAR PAGE-SPECIFIC API ROUTES
    // --------------------------------------------------------------------------
    if (handleBookings(req, res, pathname, method, parsedBody, sendJson)) return
    if (handleAuth(req, res, pathname, method, parsedBody, sendJson)) return
    if (handleContact(req, res, pathname, method, parsedBody, sendJson)) return
    if (handleCaretakerApplications(req, res, pathname, method, parsedBody, sendJson)) return

    // --------------------------------------------------------------------------
    // 2. STATIC FILE SERVER (Serves frontend pages: HTML, CSS, JS, Images)
    // --------------------------------------------------------------------------
    let filePath = path.join(FRONTEND_DIR, pathname === "/" ? "index.html" : pathname)

    if (!filePath.startsWith(FRONTEND_DIR)) {
      res.writeHead(403)
      return res.end("Forbidden")
    }

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
  console.log(`==================================================`)
  console.log(`🚀 CareSure Modular Backend Server is Running!`)
  console.log(`👉 Visit: http://localhost:${PORT}`)
  console.log(`📂 Frontend: ${FRONTEND_DIR}`)
  console.log(`==================================================`)
})
