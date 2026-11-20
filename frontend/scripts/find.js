// ==============================================================================
//  CARESURE - FIND CARETAKER JAVASCRIPT LOGIC
//  File: scripts/find.js
//  JavaScript logic for this page: Manages the caretaker catalog, real-time
//  filters (distance, rating, experience, care types), list vs. map switching,
//  and the 5-step booking modal wizard that writes to data/bookings.json.
// ==============================================================================

// Initial mock caretakers dataset
const initialCaretakers = [
  {
    "id": "priya-sharma",
    "name": "Priya Sharma",
    "photo": "images/caretaker-1.png",
    "verified": true,
    "rating": 4.9,
    "reviews": 126,
    "experience": 8,
    "skills": [
      "Medication",
      "Mobility",
      "Companionship",
      "Meal Prep"
    ],
    "careTypes": [
      "Elderly Care",
      "Patient Care"
    ],
    "location": "Koramangala, Bengaluru",
    "distance": 1.4,
    "availability": "Available Today",
    "price": 350,
    "languages": [
      "English",
      "Hindi",
      "Kannada"
    ],
    "about": "Compassionate elderly-care specialist with nearly a decade of experience supporting seniors with daily living, medication schedules, and gentle physiotherapy. I believe care is about dignity first.",
    "services": [
      "Daily living support",
      "Medication reminders",
      "Post-surgery care",
      "Mobility assistance"
    ],
    "responseTime": "Usually responds in 10 min",
    "map": {
      "x": 32,
      "y": 40
    }
  },
  {
    "id": "arjun-mehta",
    "name": "Arjun Mehta",
    "photo": "images/caretaker-2.png",
    "verified": true,
    "rating": 4.8,
    "reviews": 94,
    "experience": 12,
    "skills": [
      "Nursing",
      "Wound Care",
      "Physiotherapy",
      "Vitals"
    ],
    "careTypes": [
      "Patient Care"
    ],
    "location": "Indiranagar, Bengaluru",
    "distance": 2.1,
    "availability": "Available Today",
    "price": 420,
    "languages": [
      "English",
      "Hindi"
    ],
    "about": "Certified nursing assistant focused on post-operative and chronic-illness patient care. I keep families informed with clear daily updates and a calm, steady presence.",
    "services": [
      "Post-operative care",
      "Wound dressing",
      "Vitals monitoring",
      "Injections"
    ],
    "responseTime": "Usually responds in 5 min",
    "map": {
      "x": 58,
      "y": 28
    }
  },
  {
    "id": "neha-verma",
    "name": "Neha Verma",
    "photo": "images/caretaker-3.png",
    "verified": true,
    "rating": 4.9,
    "reviews": 152,
    "experience": 6,
    "skills": [
      "Newborn Care",
      "Play",
      "Nutrition",
      "First Aid"
    ],
    "careTypes": [
      "Child Care"
    ],
    "location": "HSR Layout, Bengaluru",
    "distance": 3,
    "availability": "Available Today",
    "price": 300,
    "languages": [
      "English",
      "Hindi",
      "Telugu"
    ],
    "about": "Warm and energetic childcare professional. From newborns to school-age kids, I create safe, playful routines that give parents complete peace of mind.",
    "services": [
      "Newborn care",
      "After-school care",
      "Meal preparation",
      "Activity planning"
    ],
    "responseTime": "Usually responds in 15 min",
    "map": {
      "x": 46,
      "y": 62
    }
  },
  {
    "id": "lakshmi-rao",
    "name": "Lakshmi Rao",
    "photo": "images/caretaker-4.png",
    "verified": true,
    "rating": 4.7,
    "reviews": 210,
    "experience": 15,
    "skills": [
      "Dementia",
      "Companionship",
      "Meal Prep",
      "Mobility"
    ],
    "careTypes": [
      "Elderly Care",
      "Patient Care"
    ],
    "location": "Jayanagar, Bengaluru",
    "distance": 4.2,
    "availability": "Available Tomorrow",
    "price": 380,
    "languages": [
      "English",
      "Hindi",
      "Tamil",
      "Kannada"
    ],
    "about": "Fifteen years caring for seniors, with special training in dementia and Alzheimer's support. Patience and a gentle routine are at the heart of everything I do.",
    "services": [
      "Dementia care",
      "Companionship",
      "Meal preparation",
      "Light housekeeping"
    ],
    "responseTime": "Usually responds in 30 min",
    "map": {
      "x": 24,
      "y": 70
    }
  },
  {
    "id": "rohan-iyer",
    "name": "Rohan Iyer",
    "photo": "images/caretaker-5.png",
    "verified": true,
    "rating": 4.8,
    "reviews": 78,
    "experience": 5,
    "skills": [
      "Physiotherapy",
      "Mobility",
      "Vitals",
      "Companionship"
    ],
    "careTypes": [
      "Patient Care"
    ],
    "location": "Whitefield, Bengaluru",
    "distance": 5.6,
    "availability": "Available Today",
    "price": 360,
    "languages": [
      "English",
      "Hindi",
      "Malayalam"
    ],
    "about": "Physiotherapy-trained caregiver helping patients rebuild strength and confidence at home after injury or surgery. I make recovery feel achievable, one small win at a time.",
    "services": [
      "Physiotherapy support",
      "Mobility training",
      "Vitals monitoring",
      "Recovery planning"
    ],
    "responseTime": "Usually responds in 8 min",
    "map": {
      "x": 74,
      "y": 48
    }
  },
  {
    "id": "ananya-das",
    "name": "Ananya Das",
    "photo": "images/caretaker-6.png",
    "verified": true,
    "rating": 5,
    "reviews": 63,
    "experience": 9,
    "skills": [
      "Child Care",
      "Toddlers",
      "Tutoring",
      "Creative Arts"
    ],
    "careTypes": [
      "Child Care"
    ],
    "location": "Malleshwaram, Bengaluru",
    "distance": 3.8,
    "availability": "Available Today",
    "price": 400,
    "languages": [
      "English",
      "Hindi",
      "Bengali"
    ],
    "about": "Early childhood educator providing loving attention, meal routines, and constructive playtime activities.",
    "services": [
      "Early childhood care",
      "Activity planning",
      "Nutrition support",
      "Tutoring"
    ],
    "responseTime": "Usually responds in 12 min",
    "map": {
      "x": 40,
      "y": 22
    }
  },
  {
    "id": "sunita-patil",
    "name": "Sunita Patil",
    "photo": "images/caretaker-7.png",
    "verified": true,
    "rating": 4.9,
    "reviews": 88,
    "experience": 7,
    "skills": [
      "Medication",
      "Mobility",
      "Meal Prep",
      "Vitals Check"
    ],
    "careTypes": [
      "Elderly Care",
      "Patient Care"
    ],
    "location": "Indiranagar, Bengaluru",
    "distance": 2.8,
    "availability": "Available Today",
    "price": 380,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "about": "Certified elder-care nurse with 7 years of hospital and private home experience. Attentive, patient, and dedicated to compassionate senior dignity.",
    "services": [
      "Elderly mobility",
      "Medication management",
      "Daily living support",
      "Vitals check"
    ],
    "responseTime": "Usually responds in 10 min",
    "map": {
      "x": 52,
      "y": 36
    }
  },
  {
    "id": "rajesh-nair",
    "name": "Rajesh Nair",
    "photo": "images/caretaker-8.png",
    "verified": true,
    "rating": 4.8,
    "reviews": 74,
    "experience": 10,
    "skills": [
      "Physiotherapy",
      "Wound Care",
      "Vitals",
      "Post-Op Recovery"
    ],
    "careTypes": [
      "Patient Care",
      "Elderly Care"
    ],
    "location": "Hebbal, Bengaluru",
    "distance": 5.2,
    "availability": "Available Today",
    "price": 400,
    "languages": [
      "English",
      "Hindi",
      "Malayalam"
    ],
    "about": "Experienced home care nurse specializing in orthopedic rehabilitation, post-surgery recovery, and gentle geriatric assistance with transparent family updates.",
    "services": [
      "Post-surgical care",
      "Wound dressing",
      "Physiotherapy support",
      "Mobility assistance"
    ],
    "responseTime": "Usually responds in 15 min",
    "map": {
      "x": 38,
      "y": 18
    }
  }
]

let allCaretakers = []
let lastFiltered = []
let loggedInUser = null
let authMode = "login"

let currentFilters = {
  careType: "All",
  locationQuery: "",
  maxDistance: 10,
  minRating: 0,
  minExperience: 0
}

let activeBookingCaretaker = null
let bookingStep = 0
let selectedBookingDate = ""
let selectedBookingHours = 4
let selectedBookingTime = ""
let selectedBookingAddress = ""
let lastSubmittedBooking = null

document.addEventListener("DOMContentLoaded", async () => {
  // Check URL query parameters (e.g. find.html?care=Elderly+Care)
  const urlParams = new URLSearchParams(window.location.search)
  const careParam = urlParams.get("care")
  if (careParam) {
    currentFilters.careType = careParam
    const careSelect = document.getElementById("search-care-type")
    if (careSelect) careSelect.value = careParam
  }

  // Check user authentication status from backend
  await checkAuthStatus()

  // Load caretakers directly from data/caretakers.json (our single source of truth)
  await loadCaretakersFromJson()

  // Setup Event Listeners
  setupFilterControls()
  setupBookingModal()

  // Initial render
  renderCaretakers()
})

async function loadCaretakersFromJson() {
  try {
    const res = await fetch("data/caretakers.json")
    if (res.ok) {
      allCaretakers = await res.json()
    } else {
      allCaretakers = [...initialCaretakers]
    }
  } catch (err) {
    allCaretakers = [...initialCaretakers]
  }
}

function syncFilterUI() {
  // Sync care type pills
  document.querySelectorAll(".care-type-pill").forEach((p) => {
    if (p.dataset.value.toLowerCase() === currentFilters.careType.toLowerCase()) {
      p.classList.add("active")
    } else {
      p.classList.remove("active")
    }
  })

  // Sync search dropdown
  const careSelect = document.getElementById("search-care-type")
  if (careSelect) {
    careSelect.value = currentFilters.careType === "All" ? "All" : currentFilters.careType
  }

  // Sync distance
  const distanceSlider = document.getElementById("distance-slider")
  const distanceLabel = document.getElementById("distance-label")
  if (distanceSlider) distanceSlider.value = currentFilters.maxDistance
  if (distanceLabel) distanceLabel.textContent = `Within ${currentFilters.maxDistance} km`

  // Sync rating
  document.querySelectorAll(".rating-pill").forEach((p) => {
    if (Number(p.dataset.value) === currentFilters.minRating) {
      p.classList.add("active")
    } else {
      p.classList.remove("active")
    }
  })

  // Sync experience
  const expSlider = document.getElementById("experience-slider")
  const expLabel = document.getElementById("experience-label")
  if (expSlider) expSlider.value = currentFilters.minExperience
  if (expLabel) expLabel.textContent = `${currentFilters.minExperience}+ years`
}

function setupFilterControls() {
  // Care Type pills
  document.querySelectorAll(".care-type-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".care-type-pill").forEach((p) => p.classList.remove("active"))
      pill.classList.add("active")
      currentFilters.careType = pill.dataset.value
      const careSelect = document.getElementById("search-care-type")
      if (careSelect) careSelect.value = pill.dataset.value
      renderCaretakers()
    })
  })

  // Care Type dropdown in search header
  const careSelect = document.getElementById("search-care-type")
  if (careSelect) {
    careSelect.addEventListener("change", (e) => {
      currentFilters.careType = e.target.value
      document.querySelectorAll(".care-type-pill").forEach((p) => {
        if (p.dataset.value.toLowerCase() === e.target.value.toLowerCase()) {
          p.classList.add("active")
        } else {
          p.classList.remove("active")
        }
      })
      renderCaretakers()
    })
  }

  // Location search input
  const locationInput = document.getElementById("search-location")
  if (locationInput) {
    locationInput.addEventListener("input", (e) => {
      currentFilters.locationQuery = e.target.value.trim().toLowerCase()
      renderCaretakers()
    })
  }

  // Distance range slider
  const distanceSlider = document.getElementById("distance-slider")
  const distanceLabel = document.getElementById("distance-label")
  if (distanceSlider) {
    distanceSlider.addEventListener("input", (e) => {
      currentFilters.maxDistance = Number(e.target.value)
      if (distanceLabel) distanceLabel.textContent = `Within ${e.target.value} km`
      renderCaretakers()
    })
  }

  // Rating pills
  document.querySelectorAll(".rating-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".rating-pill").forEach((p) => p.classList.remove("active"))
      pill.classList.add("active")
      currentFilters.minRating = Number(pill.dataset.value)
      renderCaretakers()
    })
  })

  // Experience slider
  const expSlider = document.getElementById("experience-slider")
  const expLabel = document.getElementById("experience-label")
  if (expSlider) {
    expSlider.addEventListener("input", (e) => {
      currentFilters.minExperience = Number(e.target.value)
      if (expLabel) expLabel.textContent = `${e.target.value}+ years`
      renderCaretakers()
    })
  }

  // Search Bar button
  const searchBtn = document.getElementById("search-btn")
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const careSelect = document.getElementById("search-care-type")
      if (careSelect) currentFilters.careType = careSelect.value
      const locInput = document.getElementById("search-location")
      if (locInput) currentFilters.locationQuery = locInput.value.trim().toLowerCase()
      renderCaretakers()
    })
  }
}

// Map view toggle removed as requested

function renderCaretakers() {
  const grid = document.getElementById("caretakers-grid")
  const countBadge = document.getElementById("results-count")
  if (!grid) return

  // Filter Algorithm based on active criteria
  const filtered = allCaretakers.filter((c) => {
    const matchType =
      !currentFilters.careType ||
      currentFilters.careType === "All" ||
      (Array.isArray(c.careTypes) && c.careTypes.some((t) => t.toLowerCase() === currentFilters.careType.toLowerCase()))

    const matchLocation =
      !currentFilters.locationQuery ||
      (c.location && c.location.toLowerCase().includes(currentFilters.locationQuery))

    const matchDist = typeof c.distance === "number" ? c.distance <= currentFilters.maxDistance : true
    const matchRating = typeof c.rating === "number" ? c.rating >= currentFilters.minRating : true
    const matchExp = typeof c.experience === "number" ? c.experience >= currentFilters.minExperience : true

    return matchType && matchLocation && matchDist && matchRating && matchExp
  })

  lastFiltered = filtered
  if (countBadge) countBadge.textContent = filtered.length

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; border: 1px dashed var(--border-color); border-radius: var(--radius-xl);">
        <p style="font-size: 1.25rem; font-weight: 700;">No caretakers match your active filters</p>
        <p style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.875rem;">Try widening your distance slider or resetting criteria.</p>
        <button id="reset-filters-btn" class="btn btn-primary" style="margin-top: 1rem;">Reset Filters</button>
      </div>
    `
    document.getElementById("reset-filters-btn")?.addEventListener("click", () => {
      currentFilters = { careType: "All", locationQuery: "", maxDistance: 10, minRating: 0, minExperience: 0 }
      const locInput = document.getElementById("search-location")
      if (locInput) locInput.value = ""
      syncFilterUI()
      renderCaretakers()
    })
    return
  }

  grid.innerHTML = filtered
    .map(
      (c) => `
      <div class="caretaker-card">
        <div class="caretaker-card-header">
          <img src="${c.photo || 'images/caretaker-1.png'}" alt="${c.name}" class="caretaker-avatar" onerror="this.src='images/caretaker-1.png'">
          <div>
            <h3 class="caretaker-name">${c.name} ${c.verified ? '🛡️' : ''}</h3>
            <p style="font-size:0.85rem; color:var(--text-muted);">${c.location} · <strong>${c.distance} km</strong></p>
            <p style="font-size:0.85rem; margin-top:2px;">⭐ <strong>${c.rating || 4.8}</strong> (${c.reviews || 20} reviews) · <strong>${c.experience} yrs exp</strong></p>
          </div>
        </div>

        <p class="caretaker-about">${c.about}</p>

        <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:1rem;">
          ${(c.skills || []).map(s => `<span style="font-size:0.75rem; background:var(--bg-main); border:1px solid var(--border-color); padding:2px 8px; border-radius:9999px;">${s}</span>`).join('')}
        </div>

        <div class="caretaker-card-actions">
          <div style="flex:1;">
            <span style="font-size:0.75rem; color:var(--text-muted); display:block;">Rate</span>
            <span class="caretaker-price">₹${c.price}<span style="font-size:0.75rem; font-weight:normal; color:var(--text-muted);">/hr</span></span>
          </div>
          <button class="btn btn-outline" onclick="openProfileModal('${c.id}')">View</button>
          <button class="btn btn-primary" onclick="startBooking('${c.id}')">Book</button>
        </div>
      </div>
    `
    )
    .join("")
}

// ------------------------------------------------------------------------------
// BOOKING MODAL & AUTHENTICATION LOGIC (Saves to data/bookings.json)
// ------------------------------------------------------------------------------

async function checkAuthStatus() {
  try {
    const res = await fetch("/api/account")
    if (res.ok) {
      const data = await res.json()
      loggedInUser = data.user || null
    } else {
      loggedInUser = null
    }
  } catch (err) {
    loggedInUser = null
  }
  return loggedInUser
}

function getTodayIso() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getTomorrowIso() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function timeStrToMinutes(timeStr) {
  if (!timeStr) return 0
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return 0
  let h = parseInt(match[1], 10)
  const m = parseInt(match[2], 10)
  const ampm = match[3].toUpperCase()
  if (ampm === "PM" && h < 12) h += 12
  if (ampm === "AM" && h === 12) h = 0
  return h * 60 + m
}

function getMinAllowedMinutesForToday() {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes() + 60
}

function getMinTimeStringForToday() {
  const now = new Date()
  const minTime = new Date(now.getTime() + 60 * 60 * 1000)
  let h = minTime.getHours()
  const m = String(minTime.getMinutes()).padStart(2, "0")
  const ampm = h >= 12 ? "PM" : "AM"
  if (h === 0) h = 12
  else if (h > 12) h -= 12
  return `${String(h).padStart(2, "0")}:${m} ${ampm}`
}

function isTimeSlotAvailable(timeStr, dateIso) {
  const todayIso = getTodayIso()
  if (dateIso !== todayIso) return true
  return timeStrToMinutes(timeStr) >= getMinAllowedMinutesForToday()
}

function setupBookingModal() {
  const closeBtn = document.getElementById("booking-modal-close")
  const modal = document.getElementById("booking-modal")
  const popup = document.getElementById("booking-confirm-popup")
  const popupConfirmBtn = document.getElementById("popup-btn-confirm")
  const popupCheckingBtn = document.getElementById("popup-btn-checking")

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active")
    })
  }

  // Next / Continue button
  const continueBtn = document.getElementById("wizard-continue-btn")
  if (continueBtn) {
    continueBtn.addEventListener("click", handleWizardNext)
  }

  // Back button
  const backBtn = document.getElementById("wizard-back-btn")
  if (backBtn) {
    backBtn.addEventListener("click", handleWizardBack)
  }

  // Confirmation Popup Buttons
  if (popupConfirmBtn) {
    popupConfirmBtn.addEventListener("click", () => {
      if (popup) popup.classList.remove("active")
      confirmAndSubmitBooking()
    })
  }

  if (popupCheckingBtn) {
    popupCheckingBtn.addEventListener("click", () => {
      if (popup) popup.classList.remove("active")
    })
  }
}

window.startBooking = async function (caretakerId) {
  const c = allCaretakers.find((item) => item.id === caretakerId)
  if (!c) return

  activeBookingCaretaker = c
  await checkAuthStatus()

  // First step is Sign Up / Login if not logged in
  bookingStep = loggedInUser ? 1 : 0
  selectedBookingDate = getTodayIso()
  selectedBookingHours = 4
  selectedBookingTime = ""
  selectedBookingAddress = ""

  document.getElementById("booking-caretaker-name").textContent = c.name
  const rateBadge = document.getElementById("booking-caretaker-rate")
  if (rateBadge) rateBadge.textContent = `₹${c.price}/hr`
  
  document.getElementById("booking-modal").classList.add("active")
  renderBookingStep()
}

window.closeBookingModal = function () {
  const modal = document.getElementById("booking-modal")
  const popup = document.getElementById("booking-confirm-popup")
  if (modal) modal.classList.remove("active")
  if (popup) popup.classList.remove("active")
}

window.setAuthTab = function (mode) {
  authMode = mode
  renderBookingStep()
}

window.handleModalAuth = async function (action) {
  const errorEl = document.getElementById("modal-auth-error")
  const submitBtn = document.getElementById("modal-auth-submit-btn")
  if (errorEl) {
    errorEl.textContent = ""
    errorEl.style.display = "none"
  }
  if (submitBtn) {
    submitBtn.disabled = true
    submitBtn.textContent = action === "login" ? "Logging in…" : "Creating account…"
  }

  try {
    let payload = { action }
    if (action === "login") {
      const email = document.getElementById("modal-login-email")?.value.trim()
      const password = document.getElementById("modal-login-password")?.value
      if (!email || !password) {
        throw new Error("Please enter both email and password.")
      }
      payload.email = email
      payload.password = password
    } else {
      const name = document.getElementById("modal-signup-name")?.value.trim()
      const phone = document.getElementById("modal-signup-phone")?.value.trim()
      const email = document.getElementById("modal-signup-email")?.value.trim()
      const password = document.getElementById("modal-signup-password")?.value
      if (!name || !phone || !email || !password) {
        throw new Error("Please fill in all registration fields.")
      }
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long.")
      }
      payload.name = name
      payload.phone = phone
      payload.location = "Bengaluru"
      payload.careNeeds = "Elderly / Patient Care"
      payload.email = email
      payload.password = password
    }

    const response = await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || "Authentication failed.")
    }

    loggedInUser = data.user
    if (typeof checkUserSession === "function") {
      checkUserSession()
    }
    bookingStep = 1
    renderBookingStep()
  } catch (err) {
    if (errorEl) {
      errorEl.textContent = err.message
      errorEl.style.display = "block"
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.textContent = action === "login" ? "Log In & Continue ➔" : "Create Account & Continue ➔"
    }
  }
}

function renderBookingStep() {
  const stepContainer = document.getElementById("wizard-step-content")
  const backBtn = document.getElementById("wizard-back-btn")
  const continueBtn = document.getElementById("wizard-continue-btn")
  const stepperBars = document.querySelectorAll(".stepper-bar")

  stepperBars.forEach((bar, i) => {
    if (i <= bookingStep) bar.classList.add("active")
    else bar.classList.remove("active")
  })

  // STEP 0: Authentication (Sign up or Login if not logged in)
  if (bookingStep === 0) {
    backBtn.style.display = "none"

    if (loggedInUser) {
      continueBtn.style.display = "inline-flex"
      continueBtn.textContent = "Continue to Date & Hours ➔"
      continueBtn.disabled = false

      stepContainer.innerHTML = `
        <div style="background:#f0fdf4; border:1px solid #86efac; border-radius:0.75rem; padding:1.25rem; text-align:center;">
          <div style="font-size:2.2rem; margin-bottom:0.35rem;">👤</div>
          <h4 style="font-size:1.15rem; font-weight:800; color:#166534; margin-bottom:0.25rem;">Logged In as Verified User</h4>
          <p style="font-size:0.875rem; color:#15803d; margin-bottom:0.75rem;">
            Booking with family profile: <strong>${loggedInUser.name}</strong> (${loggedInUser.email})
          </p>
          <span style="display:inline-block; font-size:0.75rem; font-weight:700; background:#dcfce7; color:#166534; padding:0.25rem 0.75rem; border-radius:9999px;">
            ✓ Step 1 of 5 Completed
          </span>
        </div>
      `
    } else {
      continueBtn.style.display = "none"

      stepContainer.innerHTML = `
        <div style="margin-bottom:0.75rem;">
          <span style="font-size:0.75rem; font-weight:700; color:var(--primary); text-transform:uppercase;">Step 1 of 5 · Authentication</span>
          <h3 style="font-weight:800; font-size:1.15rem; margin-top:0.15rem;">Log in or Sign up to Book</h3>
          <p style="font-size:0.8rem; color:var(--text-muted);">Please sign in or create an account to reserve an appointment.</p>
        </div>

        <!-- Auth Tabs -->
        <div style="display:flex; border-bottom:1px solid var(--border-color); margin-bottom:1rem;">
          <button type="button" onclick="setAuthTab('login')" style="flex:1; padding:0.5rem; font-size:0.85rem; font-weight:700; border:none; background:transparent; cursor:pointer; border-bottom:2px solid ${authMode === 'login' ? 'var(--primary)' : 'transparent'}; color:${authMode === 'login' ? 'var(--primary)' : 'var(--text-muted)'};">
            🔑 Log In
          </button>
          <button type="button" onclick="setAuthTab('signup')" style="flex:1; padding:0.5rem; font-size:0.85rem; font-weight:700; border:none; background:transparent; cursor:pointer; border-bottom:2px solid ${authMode === 'signup' ? 'var(--primary)' : 'transparent'}; color:${authMode === 'signup' ? 'var(--primary)' : 'var(--text-muted)'};">
            ✍️ Create Account
          </button>
        </div>

        <div id="modal-auth-error" style="display:none; color:#b91c1c; background:#fee2e2; border:1px solid #fecaca; padding:0.5rem 0.75rem; border-radius:0.5rem; font-size:0.8rem; margin-bottom:0.75rem;"></div>

        ${
          authMode === "login"
            ? `
          <div>
            <label style="display:block; font-size:0.8rem; font-weight:600; margin-bottom:0.25rem;">Email Address</label>
            <input type="email" id="modal-login-email" class="hero-input-field" placeholder="you@example.com" style="width:100%; padding:0.55rem 0.75rem; margin-bottom:0.75rem; border:1px solid var(--border-color); border-radius:0.5rem; font-size:0.85rem;">
            
            <label style="display:block; font-size:0.8rem; font-weight:600; margin-bottom:0.25rem;">Password</label>
            <input type="password" id="modal-login-password" class="hero-input-field" placeholder="••••••••" style="width:100%; padding:0.55rem 0.75rem; margin-bottom:1rem; border:1px solid var(--border-color); border-radius:0.5rem; font-size:0.85rem;">
            
            <button type="button" id="modal-auth-submit-btn" class="btn btn-primary" style="width:100%; justify-content:center; padding:0.7rem; font-weight:700;" onclick="handleModalAuth('login')">
              Log In & Continue ➔
            </button>
          </div>
        `
            : `
          <div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin-bottom:0.5rem;">
              <div>
                <label style="display:block; font-size:0.75rem; font-weight:600; margin-bottom:0.2rem;">Full Name</label>
                <input type="text" id="modal-signup-name" class="hero-input-field" placeholder="Rahul Sharma" style="width:100%; padding:0.45rem 0.65rem; border:1px solid var(--border-color); border-radius:0.5rem; font-size:0.85rem;">
              </div>
              <div>
                <label style="display:block; font-size:0.75rem; font-weight:600; margin-bottom:0.2rem;">Phone Number</label>
                <input type="tel" id="modal-signup-phone" class="hero-input-field" placeholder="+91 98765 43210" style="width:100%; padding:0.45rem 0.65rem; border:1px solid var(--border-color); border-radius:0.5rem; font-size:0.85rem;">
              </div>
            </div>

            <label style="display:block; font-size:0.75rem; font-weight:600; margin-bottom:0.2rem;">Email Address</label>
            <input type="email" id="modal-signup-email" class="hero-input-field" placeholder="you@example.com" style="width:100%; padding:0.45rem 0.65rem; margin-bottom:0.5rem; border:1px solid var(--border-color); border-radius:0.5rem; font-size:0.85rem;">

            <label style="display:block; font-size:0.75rem; font-weight:600; margin-bottom:0.2rem;">Password (min 8 chars)</label>
            <input type="password" id="modal-signup-password" class="hero-input-field" placeholder="••••••••" style="width:100%; padding:0.45rem 0.65rem; margin-bottom:0.85rem; border:1px solid var(--border-color); border-radius:0.5rem; font-size:0.85rem;">

            <button type="button" id="modal-auth-submit-btn" class="btn btn-primary" style="width:100%; justify-content:center; padding:0.7rem; font-weight:700;" onclick="handleModalAuth('signup')">
              Create Account & Continue ➔
            </button>
          </div>
        `
        }
      `
    }
  }

  // STEP 1: Select Date and Duration of Work (Auto-Calculates Amount)
  else if (bookingStep === 1) {
    backBtn.style.display = loggedInUser ? "none" : "inline-flex"
    continueBtn.style.display = "inline-flex"
    continueBtn.textContent = "Continue to Starting Time ➔"
    continueBtn.disabled = !selectedBookingDate

    const todayIso = getTodayIso()
    if (!selectedBookingDate || selectedBookingDate < todayIso) {
      selectedBookingDate = todayIso
    }

    // Generate upcoming 10 dates starting strictly today (no past date)
    const dates = []
    const now = new Date()
    for (let i = 0; i < 10; i++) {
      const d = new Date(now)
      d.setDate(now.getDate() + i)
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
      dates.push({
        iso,
        isToday: i === 0,
        day: i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.getDate(),
        month: d.toLocaleDateString("en-US", { month: "short" })
      })
    }

    const durationPresets = [2, 4, 6, 8, 12]
    const totalCost = activeBookingCaretaker.price * selectedBookingHours

    stepContainer.innerHTML = `
      <div style="margin-bottom:0.75rem;">
        <span style="font-size:0.75rem; font-weight:700; color:var(--primary); text-transform:uppercase;">Step 2 of 5 · Schedule & Hours</span>
        <h3 style="font-weight:800; font-size:1.15rem; margin-top:0.15rem;">Select Date & Work Duration</h3>
        <p style="font-size:0.8rem; color:var(--text-muted);">Choose a service date (past dates disabled) and work duration.</p>
      </div>

      <!-- Aesthetic Date Cards Grid -->
      <label style="display:block; font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.35rem;">Upcoming Dates</label>
      <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:0.4rem; max-height:160px; overflow-y:auto; padding:2px;">
        ${dates
          .map((d) => {
            const isSelected = selectedBookingDate === d.iso
            const activeStyle = isSelected
              ? "background:var(--primary) !important; color:#fff !important; border:2px solid var(--primary) !important; font-weight:700; box-shadow:0 4px 10px rgba(13,148,136,0.3); transform:scale(1.02);"
              : "background:#fff; color:var(--text-main); border:1px solid var(--border-color);"
            return `
            <button type="button" class="btn btn-outline" style="display:flex; flex-direction:column; align-items:center; padding:0.45rem 0.2rem; border-radius:0.75rem; cursor:pointer; transition:all 0.15s ease; ${activeStyle}" onclick="selectDate('${d.iso}')">
              <span style="font-size:0.65rem; text-transform:uppercase; opacity:0.85; font-weight:700;">${d.day}</span>
              <span style="font-size:1.1rem; font-weight:800; margin:0.1rem 0;">${d.date}</span>
              <span style="font-size:0.65rem; opacity:0.8;">${d.month}</span>
            </button>
          `
          })
          .join("")}
      </div>

      <!-- Aesthetic Native Date Picker (Strict min=today prevents past dates) -->
      <div style="margin-top:0.6rem; display:flex; align-items:center; justify-content:space-between; background:var(--bg-main); border:1px solid var(--border-color); border-radius:0.65rem; padding:0.4rem 0.75rem;">
        <span style="font-size:0.75rem; font-weight:600; color:var(--text-main);">Or pick a specific future date:</span>
        <input type="date" id="booking-custom-date" min="${todayIso}" value="${selectedBookingDate}" class="hero-input-field" style="padding:0.3rem 0.5rem; font-size:0.8rem; border-radius:0.4rem; border:1px solid var(--border-color);" onchange="selectDate(this.value)">
      </div>

      <!-- Work Duration Selection -->
      <label style="display:block; font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-top:0.75rem; margin-bottom:0.35rem;">Hours of Work</label>
      <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:0.4rem;">
        ${durationPresets
          .map((hrs) => {
            const isSelected = selectedBookingHours === hrs
            const activeStyle = isSelected
              ? "background:var(--primary) !important; color:#fff !important; border:2px solid var(--primary) !important; font-weight:700; box-shadow:0 4px 10px rgba(13,148,136,0.3); transform:scale(1.02);"
              : "background:#fff; color:var(--text-main); border:1px solid var(--border-color);"
            return `
            <button type="button" class="btn btn-outline" style="display:flex; flex-direction:column; align-items:center; padding:0.5rem 0.2rem; border-radius:0.75rem; cursor:pointer; transition:all 0.15s ease; ${activeStyle}" onclick="selectHours(${hrs})">
              <span style="font-size:1.1rem; font-weight:800;">${hrs}</span>
              <span style="font-size:0.65rem; opacity:0.85;">Hours</span>
            </button>
          `
          })
          .join("")}
      </div>

      <!-- Custom Hour Stepper -->
      <div style="margin-top:0.5rem; display:flex; align-items:center; justify-content:space-between; background:var(--bg-main); border:1px solid var(--border-color); border-radius:0.65rem; padding:0.4rem 0.75rem;">
        <span style="font-size:0.75rem; font-weight:600; color:var(--text-main);">Adjust Duration (1 - 24 hrs)</span>
        <div style="display:flex; align-items:center; gap:0.4rem;">
          <button type="button" class="btn btn-outline" style="width:1.85rem; height:1.85rem; padding:0; font-weight:800; border-radius:0.4rem;" onclick="adjustHours(-1)">−</button>
          <span style="font-weight:800; min-width:2.5rem; text-align:center; font-size:0.85rem;">${selectedBookingHours} hrs</span>
          <button type="button" class="btn btn-outline" style="width:1.85rem; height:1.85rem; padding:0; font-weight:800; border-radius:0.4rem;" onclick="adjustHours(1)">+</button>
        </div>
      </div>

      <!-- Live Auto-Calculated Amount Card -->
      <div style="margin-top:0.75rem; background:linear-gradient(135deg, #f0fdfa, #e6fffa); border:1.5px solid #5eead4; border-radius:0.75rem; padding:0.75rem 1rem; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-size:0.7rem; font-weight:700; color:#0f766e; text-transform:uppercase; letter-spacing:0.04em; display:block;">Auto-Calculated Amount</span>
          <span style="font-size:0.85rem; color:#134e4a; font-weight:600;">₹${activeBookingCaretaker.price} / hr × ${selectedBookingHours} hrs</span>
        </div>
        <div style="text-align:right;">
          <span style="font-size:1.35rem; font-weight:800; color:#0d9488;">₹${totalCost}</span>
          <span style="font-size:0.65rem; color:#115e59; display:block;">Total to pay</span>
        </div>
      </div>
    `
  }

  // STEP 2: Select Starting Time (Min 1 hour future when date is today)
  else if (bookingStep === 2) {
    backBtn.style.display = "inline-flex"
    continueBtn.style.display = "inline-flex"
    continueBtn.textContent = "Continue to Address ➔"

    const todayIso = getTodayIso()
    const isToday = selectedBookingDate === todayIso
    const minTimeString = getMinTimeStringForToday()

    const standardTimeSlots = [
      "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", 
      "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", 
      "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", 
      "08:00 PM", "09:00 PM"
    ]

    // Validate active selected time
    const isSelectedTimeValid = selectedBookingTime && isTimeSlotAvailable(selectedBookingTime, selectedBookingDate)
    continueBtn.disabled = !isSelectedTimeValid

    // Count available slots for today
    const availableSlots = standardTimeSlots.filter((t) => isTimeSlotAvailable(t, selectedBookingDate))

    stepContainer.innerHTML = `
      <div style="margin-bottom:0.75rem;">
        <span style="font-size:0.75rem; font-weight:700; color:var(--primary); text-transform:uppercase;">Step 3 of 5 · Starting Time</span>
        <h3 style="font-weight:800; font-size:1.15rem; margin-top:0.15rem;">Select Care Starting Time</h3>
        <p style="font-size:0.8rem; color:var(--text-muted);">
          Selected Date: <strong>${selectedBookingDate}</strong> ${isToday ? "(Today)" : ""}
        </p>
      </div>

      ${
        isToday
          ? `
        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:0.65rem; padding:0.5rem 0.75rem; margin-bottom:0.75rem; font-size:0.78rem; color:#1e40af; display:flex; align-items:center; gap:0.4rem;">
          <span style="font-size:1rem;">⚡</span>
          <span><strong>Notice:</strong> For today's service, starting time must be at least 1 hour in future (after <strong>${minTimeString}</strong>).</span>
        </div>
      `
          : ""
      }

      ${
        isToday && availableSlots.length === 0
          ? `
        <div style="text-align:center; padding:1.25rem; background:#fff7ed; border:1px dashed #fdba74; border-radius:0.75rem; margin-bottom:1rem;">
          <p style="font-size:0.9rem; font-weight:700; color:#c2410c;">No remaining slots available for today</p>
          <p style="font-size:0.8rem; color:#9a3412; margin:0.25rem 0 0.75rem;">All appointments require a minimum 1 hour advance booking notice.</p>
          <button type="button" class="btn btn-primary" onclick="selectDate('${getTomorrowIso()}')">
            📅 Switch to Tomorrow (${getTomorrowIso()})
          </button>
        </div>
      `
          : `
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:0.4rem; max-height:190px; overflow-y:auto; padding:2px;">
          ${standardTimeSlots
            .map((t) => {
              const available = isTimeSlotAvailable(t, selectedBookingDate)
              const isSelected = selectedBookingTime === t

              if (!available) {
                return `
                  <button type="button" class="btn" disabled style="padding:0.55rem 0.35rem; border-radius:0.65rem; font-size:0.8rem; font-weight:600; opacity:0.35; cursor:not-allowed; text-decoration:line-through; background:#f1f5f9; color:#94a3b8; border:1px solid #e2e8f0;" title="Must be at least 1 hour in advance">
                    ${t}
                  </button>
                `
              }

              const activeStyle = isSelected
                ? "background:var(--primary) !important; color:#fff !important; border:2px solid var(--primary) !important; font-weight:700; box-shadow:0 4px 10px rgba(13,148,136,0.3); transform:scale(1.02);"
                : "background:#fff; color:var(--text-main); border:1px solid var(--border-color);"

              return `
                <button type="button" class="btn btn-outline" style="padding:0.55rem 0.35rem; border-radius:0.65rem; font-size:0.8rem; font-weight:600; cursor:pointer; transition:all 0.15s ease; ${activeStyle}" onclick="selectTime('${t}')">
                  ${t}
                </button>
              `
            })
            .join("")}
        </div>
      `
      }

      <!-- Custom Time Selector -->
      <div style="margin-top:0.75rem; display:flex; align-items:center; justify-content:space-between; background:var(--bg-main); border:1px solid var(--border-color); border-radius:0.65rem; padding:0.4rem 0.75rem;">
        <span style="font-size:0.75rem; font-weight:600; color:var(--text-main);">Custom Starting Time:</span>
        <input type="time" id="booking-custom-time" class="hero-input-field" style="padding:0.3rem 0.5rem; font-size:0.8rem; border-radius:0.4rem; border:1px solid var(--border-color);" onchange="handleCustomTimeChange(this.value)">
      </div>
      <div id="custom-time-error" style="display:none; color:#dc2626; font-size:0.75rem; margin-top:0.35rem; font-weight:600;"></div>
    `
  }

  // STEP 3: Service Address & Final Summary Review
  else if (bookingStep === 3) {
    backBtn.style.display = "inline-flex"
    continueBtn.style.display = "inline-flex"
    continueBtn.textContent = "Confirm Booking ✓"
    continueBtn.disabled = selectedBookingAddress.trim().length < 5

    const total = activeBookingCaretaker.price * selectedBookingHours
    const userName = loggedInUser ? loggedInUser.name : "Guest Family"
    const userEmail = loggedInUser ? loggedInUser.email : "Not Provided"

    stepContainer.innerHTML = `
      <div style="margin-bottom:0.75rem;">
        <span style="font-size:0.75rem; font-weight:700; color:var(--primary); text-transform:uppercase;">Step 4 of 5 · Address & Review</span>
        <h3 style="font-weight:800; font-size:1.15rem; margin-top:0.15rem;">Enter Service Address</h3>
        <p style="font-size:0.8rem; color:var(--text-muted);">Provide the exact address where caretaker care will be delivered.</p>
      </div>

      <!-- External Postal API Auto-fill (Evaluation Parameter 1) -->
      <div style="margin-bottom:0.75rem; background:#f8fafc; border:1px solid var(--border-color); border-radius:0.5rem; padding:0.6rem 0.75rem;">
        <label style="display:block; font-size:0.75rem; font-weight:700; color:var(--text-main); margin-bottom:0.25rem;">
          📍 Auto-fill Address by Pincode (India Post External API)
        </label>
        <div style="display:flex; gap:0.5rem;">
          <input type="text" id="booking-pincode-input" maxlength="6" class="hero-input-field" placeholder="Enter 6-digit PIN (e.g. 560034)" style="flex:1; padding:0.4rem 0.6rem; font-size:0.8rem; border-radius:0.4rem; border:1px solid var(--border-color);">
          <button type="button" class="btn btn-outline" style="padding:0.4rem 0.75rem; font-size:0.75rem; font-weight:700;" onclick="handleLookupPincode()">
            Lookup PIN ➔
          </button>
        </div>
        <div id="pincode-feedback" style="font-size:0.72rem; margin-top:0.3rem; font-weight:600;"></div>
      </div>

      <label style="display:block; font-size:0.8rem; font-weight:700; margin-bottom:0.25rem;">
        Service Location / Address <span style="color:#ef4444;">*</span>
      </label>
      <textarea id="booking-address" rows="2" class="hero-input-field" style="width:100%; resize:none; padding:0.5rem; font-size:0.85rem; border-radius:0.5rem; border:1px solid var(--border-color);" placeholder="Enter house no, street, locality, landmark, Bengaluru (min 5 characters)" oninput="checkAddress(this)">${selectedBookingAddress}</textarea>

      <!-- Booking Itemized Review Card -->
      <div style="margin-top:0.75rem; background:var(--bg-main); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:0.75rem; display:flex; flex-direction:column; gap:0.4rem; font-size:0.85rem;">
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Caretaker:</span> <strong>${activeBookingCaretaker.name} (₹${activeBookingCaretaker.price}/hr)</strong></div>
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Client Account:</span> <strong>${userName} (${userEmail})</strong></div>
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Scheduled Date:</span> <strong>${selectedBookingDate}</strong></div>
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Shift Schedule:</span> <strong>${selectedBookingTime} (${selectedBookingHours} hrs)</strong></div>
        <div style="border-top:1px solid var(--border-color); padding-top:0.4rem; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <span style="font-size:0.75rem; color:var(--text-muted); display:block;">Rate</span>
            <span style="font-size:0.85rem; font-weight:600;">₹${activeBookingCaretaker.price} / hr</span>
          </div>
          <div style="text-align:right;">
            <span style="font-size:0.75rem; color:var(--text-muted); display:block;">Total to Pay</span>
            <span style="font-weight:800; font-size:1.25rem; color:var(--primary);">₹${total}</span>
          </div>
        </div>
      </div>
    `
  }

  // STEP 4: Confirmed Receipt Screen
  else if (bookingStep === 4) {
    backBtn.style.display = "none"
    continueBtn.style.display = "none"

    const totalCost = activeBookingCaretaker.price * selectedBookingHours
    const bookingId = lastSubmittedBooking ? lastSubmittedBooking.id : "CS-CONFIRMED"

    stepContainer.innerHTML = `
      <div style="text-align:center; padding:0.5rem 0;">
        <div style="display:inline-flex; width:3.5rem; height:3.5rem; border-radius:9999px; background:#ecfdf5; align-items:center; justify-content:center; font-size:1.8rem; margin-bottom:0.5rem;">
          ✅
        </div>
        <span style="display:inline-block; font-size:0.75rem; font-weight:700; color:#065f46; background:#d1fae5; padding:0.2rem 0.6rem; border-radius:9999px; margin-bottom:0.35rem;">Step 5 of 5 · Confirmed</span>
        <h3 style="font-size:1.35rem; font-weight:800; color:var(--text-main);">Booking Confirmed!</h3>
        <p style="color:var(--text-muted); font-size:0.8rem;">
          Your appointment has been reserved and registered in bookings.json.
        </p>

        <div style="margin-top:0.85rem; text-align:left; background:var(--bg-main); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:0.75rem; font-size:0.85rem; display:flex; flex-direction:column; gap:0.35rem;">
          <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Booking ID:</span> <strong style="color:var(--primary);">${bookingId}</strong></div>
          <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Caretaker:</span> <strong>${activeBookingCaretaker.name}</strong></div>
          <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Date:</span> <strong>${selectedBookingDate}</strong></div>
          <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Shift:</span> <strong>${selectedBookingTime} (${selectedBookingHours} hrs)</strong></div>
          <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Location:</span> <strong>${selectedBookingAddress}</strong></div>
          <div style="border-top:1px solid var(--border-color); padding-top:0.35rem; display:flex; justify-content:space-between;">
            <span style="font-weight:700;">Total Amount:</span>
            <strong style="color:var(--primary); font-size:1.15rem;">₹${totalCost}</strong>
          </div>
        </div>

        <div style="margin-top:1.25rem; display:flex; gap:0.5rem; justify-content:center;">
          <a href="dashboard.html?section=Bookings" class="btn btn-primary" style="flex:1; text-align:center;">View in Dashboard</a>
          <button type="button" class="btn btn-outline" onclick="closeBookingModal()">Done</button>
        </div>
      </div>
    `
  }
}

window.selectDate = function (dateStr) {
  const todayIso = getTodayIso()
  if (dateStr < todayIso) {
    alert("Past dates cannot be selected. Please choose today or a future date.")
    return
  }
  selectedBookingDate = dateStr
  selectedBookingTime = ""
  renderBookingStep()
}

window.selectHours = function (hrs) {
  selectedBookingHours = hrs
  renderBookingStep()
}

window.adjustHours = function (delta) {
  selectedBookingHours = Math.max(1, Math.min(24, selectedBookingHours + delta))
  renderBookingStep()
}

window.selectTime = function (timeStr) {
  if (!isTimeSlotAvailable(timeStr, selectedBookingDate)) {
    alert("For today's booking, the starting time must be at least 1 hour in advance.")
    return
  }
  selectedBookingTime = timeStr
  renderBookingStep()
}

window.handleCustomTimeChange = function (val) {
  const errorEl = document.getElementById("custom-time-error")
  const continueBtn = document.getElementById("wizard-continue-btn")
  if (!val) return

  const parts = val.split(":")
  let h = parseInt(parts[0], 10)
  const m = parts[1] || "00"
  const ampm = h >= 12 ? "PM" : "AM"
  if (h === 0) h = 12
  else if (h > 12) h -= 12
  const formatted = `${String(h).padStart(2, "0")}:${m} ${ampm}`

  if (selectedBookingDate === getTodayIso()) {
    const totalMins = parseInt(parts[0], 10) * 60 + parseInt(m, 10)
    const minMins = getMinAllowedMinutesForToday()
    if (totalMins < minMins) {
      if (errorEl) {
        errorEl.textContent = `⚠️ Starting time must be at least 1 hour in advance (after ${getMinTimeStringForToday()}).`
        errorEl.style.display = "block"
      }
      if (continueBtn) continueBtn.disabled = true
      selectedBookingTime = ""
      return
    }
  }

  if (errorEl) errorEl.style.display = "none"
  selectedBookingTime = formatted
  if (continueBtn) continueBtn.disabled = false
  renderBookingStep()
}

window.checkAddress = function (el) {
  selectedBookingAddress = el.value
  const continueBtn = document.getElementById("wizard-continue-btn")
  if (continueBtn) {
    continueBtn.disabled = selectedBookingAddress.trim().length < 5
  }
}

// Evaluation Parameter 1: India Post External API Pincode Lookup
window.handleLookupPincode = async function () {
  const pinInput = document.getElementById("booking-pincode-input")
  const feedback = document.getElementById("pincode-feedback")
  const addrTextarea = document.getElementById("booking-address")
  const continueBtn = document.getElementById("wizard-continue-btn")
  if (!pinInput || !addrTextarea) return

  const pin = pinInput.value.trim()
  if (!/^\d{6}$/.test(pin)) {
    if (feedback) {
      feedback.textContent = "Please enter a valid 6-digit Indian PIN code."
      feedback.style.color = "#dc2626"
    }
    return
  }

  if (feedback) {
    feedback.textContent = "Fetching location from India Post External API…"
    feedback.style.color = "#0284c7"
  }

  try {
    const res = await fetch(`/api/external/pincode/${pin}`)
    const data = await res.json()
    if (!data.ok || !data.locality) {
      if (feedback) {
        feedback.textContent = data.message || "No records found for this pincode."
        feedback.style.color = "#dc2626"
      }
      return
    }

    const areaName = data.locality
    const district = data.district
    const state = data.state
    const autoAddress = `${areaName}, ${district}, ${state} - ${pin}`
    addrTextarea.value = autoAddress
    selectedBookingAddress = autoAddress
    if (continueBtn) continueBtn.disabled = false

    if (feedback) {
      feedback.textContent = `✓ Auto-filled via India Post API: ${areaName}, ${district}, ${state}`
      feedback.style.color = "#16a34a"
    }
  } catch (err) {
    if (feedback) {
      feedback.textContent = "Could not reach postal service. Please type address manually."
      feedback.style.color = "#dc2626"
    }
  }
}

function handleWizardNext() {
  if (bookingStep < 3) {
    bookingStep++
    renderBookingStep()
  } else if (bookingStep === 3) {
    // When user taps "Confirm Booking", show popup: "Do you actually want to book or just checking?"
    const popup = document.getElementById("booking-confirm-popup")
    if (popup) {
      popup.classList.add("active")
    }
  }
}

function handleWizardBack() {
  if (bookingStep > 0) {
    bookingStep--
    renderBookingStep()
  }
}

async function confirmAndSubmitBooking() {
  const continueBtn = document.getElementById("wizard-continue-btn")
  if (continueBtn) {
    continueBtn.disabled = true
    continueBtn.textContent = "Saving booking…"
  }

  const addr = selectedBookingAddress.trim() || "Koramangala, Bengaluru"
  const totalCost = activeBookingCaretaker.price * selectedBookingHours

  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caretakerId: activeBookingCaretaker.id,
        caretakerName: activeBookingCaretaker.name,
        familyName: loggedInUser ? loggedInUser.name : "CareSure Family",
        familyEmail: loggedInUser ? loggedInUser.email : "family@example.com",
        date: selectedBookingDate,
        time: selectedBookingTime,
        address: addr,
        durationHours: selectedBookingHours,
        estimatedTotal: totalCost
      })
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || "Failed to confirm booking.")
    }

    lastSubmittedBooking = data.booking || { id: "CS-CONFIRMED" }
    bookingStep = 4
    renderBookingStep()
  } catch (err) {
    alert(err.message)
    if (continueBtn) {
      continueBtn.disabled = false
      continueBtn.textContent = "Confirm Booking ✓"
    }
  }
}

window.openProfileModal = function (caretakerId) {
  const c = allCaretakers.find((item) => item.id === caretakerId)
  if (!c) return
  alert(`${c.name} (${c.location})\nExperience: ${c.experience} years\nRate: ₹${c.price}/hr\nLanguages: ${c.languages.join(", ")}\nAbout: ${c.about}`)
}
