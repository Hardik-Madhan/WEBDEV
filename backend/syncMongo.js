// ==============================================================================
//  CARESURE - MONGODB ATLAS SEED & AUTO-SYNC UTILITY
//  File: backend/syncMongo.js
//  Purpose: Syncs Users, Caretakers, and Bookings from local JSON into MongoDB Atlas
// ==============================================================================

const path = require("path")
const fs = require("fs")
const User = require("./models/User")
const Caretaker = require("./models/Caretaker")
const Booking = require("./models/Booking")
const Contact = require("./models/Contact")

function readJsonFile(filename) {
  const filePath = path.join(__dirname, "data", filename)
  if (!fs.existsSync(filePath)) return []
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"))
  } catch (err) {
    return []
  }
}

async function syncAllDataToMongo() {
  try {
    console.log("🔄 Starting sync of local JSON data to MongoDB Atlas (caresure)...")

    // 1. Sync Users
    const users = readJsonFile("users.json")
    let userCount = 0
    for (const u of users) {
      await User.findOneAndUpdate(
        { email: u.email.toLowerCase() },
        {
          userId: u.id,
          name: u.name,
          email: u.email.toLowerCase(),
          password: u.password,
          phone: u.phone || "",
          location: u.location || "Bengaluru",
          careNeeds: u.careNeeds || "",
          saved: u.saved || [],
        },
        { upsert: true, returnDocument: "after" }
      )
      userCount++
    }
    console.log(`✅ Users Synced to Atlas: ${userCount} users`)

    // 2. Sync Caretakers
    const caretakers = readJsonFile("caretakers.json")
    let caretakerCount = 0
    for (const c of caretakers) {
      await Caretaker.findOneAndUpdate(
        { caretakerId: c.id },
        {
          caretakerId: c.id,
          name: c.name,
          photo: c.photo || "images/caretaker-1.png",
          verified: c.verified !== false,
          rating: c.rating || 4.8,
          reviews: c.reviews || 50,
          experience: c.experience || 5,
          skills: c.skills || [],
          careTypes: c.careTypes || [],
          location: c.location || "Bengaluru",
          distance: c.distance || 2.0,
          availability: c.availability || "Available Today",
          price: c.price || 350,
          languages: c.languages || ["English", "Hindi"],
          about: c.about || "",
          services: c.services || [],
          responseTime: c.responseTime || "Usually responds in 15 min",
          map: c.map || { x: 50, y: 50 },
        },
        { upsert: true, returnDocument: "after" }
      )
      caretakerCount++
    }
    console.log(`✅ Caretakers Synced to Atlas: ${caretakerCount} caretakers`)

    // 3. Sync Bookings
    const bookings = readJsonFile("bookings.json")
    let bookingCount = 0
    for (const b of bookings) {
      await Booking.findOneAndUpdate(
        { bookingId: b.id },
        {
          bookingId: b.id,
          caretakerId: b.caretakerId,
          caretakerName: b.caretakerName || "Caregiver Specialist",
          familyName: b.familyName || "CareSure Family",
          familyEmail: b.familyEmail || "family@example.com",
          phone: b.familyPhone || "+91 98765 43210",
          date: b.date,
          time: b.time,
          address: b.address,
          durationHours: b.durationHours || 4,
          estimatedTotal: b.estimatedTotal || 1400,
          status: b.status || "Confirmed",
          source: "Local JSON Sync",
        },
        { upsert: true, returnDocument: "after" }
      )
      bookingCount++
    }
    console.log(`✅ Bookings Synced to Atlas: ${bookingCount} bookings`)

    // 4. Sync Contacts
    const contacts = readJsonFile("contacts.json")
    let contactCount = 0
    for (const c of contacts) {
      await Contact.findOneAndUpdate(
        { contactId: c.id },
        {
          contactId: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone || "",
          subject: c.topic || c.subject || "General Inquiry",
          message: c.message,
        },
        { upsert: true, returnDocument: "after" }
      )
      contactCount++
    }
    console.log(`✅ Contacts Synced to Atlas: ${contactCount} contacts`)

    console.log("🎉 All CareSure data successfully uploaded to MongoDB Atlas (caresure)!")
  } catch (err) {
    console.warn("⚠️ MongoDB sync error:", err.message)
  }
}

module.exports = { syncAllDataToMongo }
