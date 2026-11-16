// ==============================================================================
//  CARESURE BACKEND - SHARED DATABASE & HELPER UTILITIES
//  File: backend/db.js
//  Purpose: Provides readJson, writeJson, cookie parsing, and auth helpers
// ==============================================================================

const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

const DATA_DIR = path.join(__dirname, "data")

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

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

module.exports = {
  DATA_DIR,
  readJson,
  writeJson,
  parseCookies,
  getCurrentUser,
}
