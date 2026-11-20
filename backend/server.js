// ==============================================================================
//  CARESURE - EXPRESS.JS BACKEND SERVER (NODE + EXPRESS + MONGODB ATLAS + JSON)
//  File: backend/server.js
//  Purpose: Parameters 2, 3 & 4:
//           - Parameter 2: Node and Express setup
//           - Parameter 3: Express APIs to save/fetch data to local JSON files
//           - Parameter 4: CRUD operations using Express APIs to manage data in MongoDB
// ==============================================================================

require("dotenv").config()
const express = require("express")
const cors = require("cors")
const path = require("path")
const mongoose = require("mongoose")
const fs = require("fs")

// 1. Import Express Routers
const authRoutes = require("./routes/auth")
const bookingRoutes = require("./routes/bookings")
const contactRoutes = require("./routes/contact")
const caretakerRoutes = require("./routes/caretakers")
const mongoBookingRoutes = require("./routes/mongoBookings")
const externalApiRoutes = require("./routes/externalApi")

const app = express()
const PORT = process.env.PORT || 3000
const FRONTEND_DIR = path.join(__dirname, "..", "frontend")

// 2. Middlewares (CORS, JSON Body Parsing, URL-encoded)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 3. Connect to MongoDB Atlas (Parameter 4)
const DEFAULT_MONGODB_URI = "mongodb+srv://CARE_SURE:care.sure84@cluster0.yy0gztc.mongodb.net/caresure?retryWrites=true&w=majority&appName=Cluster0"
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI
if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("🍃 MongoDB Atlas Connected Successfully! (Cluster0 / caresure)")
    })
    .catch((err) => {
      console.warn("⚠️ MongoDB Atlas connection notice:", err.message)
    })
} else {
  console.log("ℹ️ No MONGODB_URI found in .env; local JSON database active.")
}

// 4. API Endpoints

// Parameter 3: Express APIs for Local JSON files (users.json, bookings.json, contacts.json)
app.use("/api/account", authRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/caretaker", caretakerRoutes)

// Parameter 4: Complete CRUD Express APIs for MongoDB Atlas
app.use("/api/mongo/bookings", mongoBookingRoutes)

// Parameter 1: External Public Web APIs (India Post Pincode & Open-Meteo Weather)
app.use("/api/external", externalApiRoutes)

// Downloadable Auth.js Viva PDF Guide route
app.get("/download-auth-guide.pdf", (req, res) => {
  const pdfPath = "C:\\Users\\amitm\\.gemini\\antigravity\\brain\\0673d418-f3d2-4885-a555-11526043627a\\Auth_JS_Viva_and_Debugging_Guide.pdf"
  if (fs.existsSync(pdfPath)) {
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'inline; filename="Auth_JS_Viva_and_Debugging_Guide.pdf"')
    return fs.createReadStream(pdfPath).pipe(res)
  }
  res.status(404).send("PDF guide not found.")
})

// 5. Static File Server: Serves frontend HTML, CSS, JS, Images & JSON data
app.use(express.static(FRONTEND_DIR))

// Fallback to index.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"))
})

// 6. Start the Express Server
app.listen(PORT, () => {
  console.log("==================================================")
  console.log(`🚀 CareSure Express Server is Running on http://localhost:${PORT}`)
  console.log(`📂 Frontend Static Directory: ${FRONTEND_DIR}`)
  console.log(`🍃 MongoDB Atlas CRUD API: http://localhost:${PORT}/api/mongo/bookings`)
  console.log(`🌤️ External Public APIs: http://localhost:${PORT}/api/external/weather`)
  console.log("==================================================")
})
