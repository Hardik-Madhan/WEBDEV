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

let allCaretakers = [...initialCaretakers]
let currentFilters = {
  careType: "All",
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

document.addEventListener("DOMContentLoaded", () => {
  // Check URL query parameters (e.g. find.html?care=Elderly+Care)
  const urlParams = new URLSearchParams(window.location.search)
  const careParam = urlParams.get("care")
  if (careParam) {
    currentFilters.careType = careParam
    const careSelect = document.getElementById("search-care-type")
    if (careSelect) careSelect.value = careParam
  }

  // Load dynamically registered local caretaker applications from data/caretaker-applications.json
  loadRegisteredCaretakers()

  // Setup Event Listeners
  setupFilterControls()
  setupViewToggle()
  setupBookingModal()

  // Initial render
  renderCaretakers()
})

async function loadRegisteredCaretakers() {
  try {
    const res = await fetch("/api/caretaker")
    const data = await res.json()
    if (data.caretakers && data.caretakers.length > 0) {
      allCaretakers = [...initialCaretakers, ...data.caretakers]
      renderCaretakers()
    }
  } catch (err) {}
}

function setupFilterControls() {
  // Care Type pills
  document.querySelectorAll(".care-type-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".care-type-pill").forEach((p) => p.classList.remove("active"))
      pill.classList.add("active")
      currentFilters.careType = pill.dataset.value
      renderCaretakers()
    })
  })

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
      renderCaretakers()
    })
  }
}

function setupViewToggle() {
  const listViewBtn = document.getElementById("list-view-btn")
  const mapViewBtn = document.getElementById("map-view-btn")
  const gridView = document.getElementById("caretakers-grid")
  const mapCanvas = document.getElementById("map-canvas")

  if (listViewBtn && mapViewBtn) {
    listViewBtn.addEventListener("click", () => {
      listViewBtn.classList.add("active")
      mapViewBtn.classList.remove("active")
      if (gridView) gridView.style.display = "grid"
      if (mapCanvas) mapCanvas.classList.remove("active")
    })

    mapViewBtn.addEventListener("click", () => {
      mapViewBtn.classList.add("active")
      listViewBtn.classList.remove("active")
      if (gridView) gridView.style.display = "none"
      if (mapCanvas) mapCanvas.classList.add("active")
      renderMapPins()
    })
  }
}

function renderCaretakers() {
  const grid = document.getElementById("caretakers-grid")
  const countBadge = document.getElementById("results-count")
  if (!grid) return

  // Filter Algorithm based on active criteria
  const filtered = allCaretakers.filter((c) => {
    const matchType =
      currentFilters.careType === "All" ||
      c.careTypes.some((t) => t.toLowerCase() === currentFilters.careType.toLowerCase())
    const matchDist = c.distance <= currentFilters.maxDistance
    const matchRating = c.rating >= currentFilters.minRating
    const matchExp = c.experience >= currentFilters.minExperience
    return matchType && matchDist && matchRating && matchExp
  })

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
      currentFilters = { careType: "All", maxDistance: 10, minRating: 0, minExperience: 0 }
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
          ${c.skills.map(s => `<span style="font-size:0.75rem; background:var(--bg-main); border:1px solid var(--border-color); padding:2px 8px; border-radius:9999px;">${s}</span>`).join('')}
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

function renderMapPins() {
  const mapCanvas = document.getElementById("map-canvas")
  if (!mapCanvas) return

  mapCanvas.innerHTML = allCaretakers
    .map(
      (c) => `
      <div class="map-pin" style="left: ${c.map ? c.map.x : 50}%; top: ${c.map ? c.map.y : 50}%;" onclick="startBooking('${c.id}')">
        📍 ${c.name.split(" ")[0]} · ₹${c.price}
      </div>
    `
    )
    .join("")
}

// ------------------------------------------------------------------------------
// 5-STEP BOOKING MODAL WIZARD LOGIC (Saves to data/bookings.json)
// ------------------------------------------------------------------------------
function setupBookingModal() {
  const closeBtn = document.getElementById("booking-modal-close")
  const modal = document.getElementById("booking-modal")

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
}

window.startBooking = function (caretakerId) {
  const c = allCaretakers.find((item) => item.id === caretakerId)
  if (!c) return

  activeBookingCaretaker = c
  bookingStep = 0
  selectedBookingDate = ""
  selectedBookingHours = 4
  selectedBookingTime = ""
  selectedBookingAddress = ""

  document.getElementById("booking-caretaker-name").textContent = c.name
  document.getElementById("booking-caretaker-rate").textContent = `₹${c.price}/hr`
  document.getElementById("booking-modal").classList.add("active")

  renderBookingStep()
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

  if (bookingStep === 0) {
    backBtn.style.display = "none"
    continueBtn.style.display = "inline-flex"
    continueBtn.textContent = "Continue ➔"
    continueBtn.disabled = !selectedBookingDate

    // Generate upcoming 12 dates
    const dates = []
    const now = new Date()
    for (let i = 0; i < 12; i++) {
      const d = new Date(now)
      d.setDate(now.getDate() + i)
      dates.push({
        iso: d.toISOString().slice(0, 10),
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.getDate(),
        month: d.toLocaleDateString("en-US", { month: "short" })
      })
    }

    stepContainer.innerHTML = `
      <h3 style="font-weight:700; margin-bottom:0.25rem;">1. Choose a Date</h3>
      <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">Click any date to select it.</p>
      <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:0.5rem; max-height:220px; overflow-y:auto; padding-right:2px;">
        ${dates.map(d => {
          const isSelected = selectedBookingDate === d.iso
          const activeStyle = isSelected
            ? 'background:var(--primary) !important; color:#fff !important; border:2px solid var(--primary) !important; font-weight:700; box-shadow:0 4px 10px rgba(13,148,136,0.3); transform:scale(1.02);'
            : 'background:#fff; color:var(--text-main); border:1px solid var(--border-color);'
          return `
            <button type="button" class="btn btn-outline" style="display:flex; flex-direction:column; align-items:center; padding:0.5rem 0.25rem; border-radius:0.75rem; cursor:pointer; transition:all 0.15s ease; ${activeStyle}" onclick="selectDate('${d.iso}')">
              <span style="font-size:0.65rem; text-transform:uppercase; opacity:0.8;">${d.day}</span>
              <span style="font-size:1.1rem; font-weight:800; margin:0.15rem 0;">${d.date}</span>
              <span style="font-size:0.65rem; opacity:0.8;">${d.month}</span>
            </button>
          `
        }).join('')}
      </div>
    `
  } else if (bookingStep === 1) {
    backBtn.style.display = "inline-flex"
    continueBtn.style.display = "inline-flex"
    continueBtn.textContent = "Continue ➔"
    continueBtn.disabled = !selectedBookingHours

    const durationPresets = [2, 4, 6, 8, 12]
    const totalCost = activeBookingCaretaker.price * selectedBookingHours

    stepContainer.innerHTML = `
      <h3 style="font-weight:700; margin-bottom:0.25rem;">2. Number of Hours of Work</h3>
      <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">Select how many hours of care assistance you require.</p>
      <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:0.4rem;">
        ${durationPresets.map(hrs => {
          const isSelected = selectedBookingHours === hrs
          const activeStyle = isSelected
            ? 'background:var(--primary) !important; color:#fff !important; border:2px solid var(--primary) !important; font-weight:700; box-shadow:0 4px 10px rgba(13,148,136,0.3); transform:scale(1.02);'
            : 'background:#fff; color:var(--text-main); border:1px solid var(--border-color);'
          return `
            <button type="button" class="btn btn-outline" style="display:flex; flex-direction:column; align-items:center; padding:0.6rem 0.2rem; border-radius:0.75rem; cursor:pointer; transition:all 0.15s ease; ${activeStyle}" onclick="selectHours(${hrs})">
              <span style="font-size:1.15rem; font-weight:800;">${hrs}</span>
              <span style="font-size:0.65rem; opacity:0.85;">${hrs === 1 ? 'Hour' : 'Hours'}</span>
            </button>
          `
        }).join('')}
      </div>

      <!-- Custom Stepper -->
      <div style="margin-top:0.75rem; display:flex; align-items:center; justify-content:space-between; background:var(--bg-main); border:1px solid var(--border-color); border-radius:0.75rem; padding:0.5rem 0.75rem;">
        <div>
          <span style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); display:block;">Custom Duration</span>
          <span style="font-size:0.85rem; font-weight:700; color:var(--text-main);">Adjust hours (1 - 24 hrs)</span>
        </div>
        <div style="display:flex; align-items:center; gap:0.4rem;">
          <button type="button" class="btn btn-outline" style="width:2rem; height:2rem; padding:0; font-weight:800; border-radius:0.5rem;" onclick="adjustHours(-1)">−</button>
          <span style="font-weight:800; min-width:3rem; text-align:center; font-size:0.9rem;">${selectedBookingHours} hrs</span>
          <button type="button" class="btn btn-outline" style="width:2rem; height:2rem; padding:0; font-weight:800; border-radius:0.5rem;" onclick="adjustHours(1)">+</button>
        </div>
      </div>

      <!-- Live Price Calculation -->
      <div style="margin-top:0.75rem; background:#f0fdfa; border:1px solid #99f6e4; border-radius:0.75rem; padding:0.6rem 0.75rem; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-size:0.7rem; color:var(--text-muted); display:block;">Estimated Cost Calculation</span>
          <span style="font-size:0.8rem; font-weight:600; color:var(--text-main);">₹${activeBookingCaretaker.price} / hr × ${selectedBookingHours} hrs</span>
        </div>
        <span style="font-size:1.2rem; font-weight:800; color:var(--primary);">₹${totalCost}</span>
      </div>
    `
  } else if (bookingStep === 2) {
    backBtn.style.display = "inline-flex"
    continueBtn.style.display = "inline-flex"
    continueBtn.textContent = "Continue ➔"
    continueBtn.disabled = !selectedBookingTime

    const timeSlots = [
      "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", 
      "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", 
      "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
    ]

    stepContainer.innerHTML = `
      <h3 style="font-weight:700; margin-bottom:0.25rem;">3. What Time to Begin?</h3>
      <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">Select your preferred shift start time.</p>
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:0.4rem; max-height:220px; overflow-y:auto; padding-right:2px;">
        ${timeSlots.map(t => {
          const isSelected = selectedBookingTime === t
          const activeStyle = isSelected
            ? 'background:var(--primary) !important; color:#fff !important; border:2px solid var(--primary) !important; font-weight:700; box-shadow:0 4px 10px rgba(13,148,136,0.3); transform:scale(1.02);'
            : 'background:#fff; color:var(--text-main); border:1px solid var(--border-color);'
          return `
            <button type="button" class="btn btn-outline" style="padding:0.6rem 0.4rem; border-radius:0.75rem; font-size:0.85rem; font-weight:600; cursor:pointer; transition:all 0.15s ease; ${activeStyle}" onclick="selectTime('${t}')">
              ${t}
            </button>
          `
        }).join('')}
      </div>
    `
  } else if (bookingStep === 3) {
    backBtn.style.display = "inline-flex"
    continueBtn.style.display = "inline-flex"
    continueBtn.textContent = "Confirm & Save Booking ✓"
    continueBtn.disabled = selectedBookingAddress.trim().length < 5

    const total = activeBookingCaretaker.price * selectedBookingHours

    stepContainer.innerHTML = `
      <h3 style="font-weight:700; margin-bottom:0.25rem;">4. Service Location & Review</h3>
      <label style="display:block; font-size:0.8rem; font-weight:600; margin-bottom:0.25rem;">
        Service Address <span style="color:#ef4444;">*</span>
      </label>
      <textarea id="booking-address" rows="2" class="hero-input-field" style="width:100%; resize:none; padding:0.5rem; font-size:0.85rem; border-radius:0.5rem; border:1px solid var(--border-color);" placeholder="Enter house no, street, locality, landmark, city (min 5 characters)" oninput="checkAddress(this)">${selectedBookingAddress}</textarea>

      <div style="margin-top:0.75rem; background:var(--bg-main); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:0.75rem; display:flex; flex-direction:column; gap:0.4rem; font-size:0.85rem;">
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Caretaker:</span> <strong>${activeBookingCaretaker.name}</strong></div>
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Date:</span> <strong>${selectedBookingDate}</strong></div>
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Shift:</span> <strong>Starting at ${selectedBookingTime} (${selectedBookingHours} hrs)</strong></div>
        <div style="border-top:1px solid var(--border-color); padding-top:0.4rem; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <span style="font-size:0.75rem; color:var(--text-muted); display:block;">Rate</span>
            <span style="font-size:0.85rem; font-weight:600;">₹${activeBookingCaretaker.price} / hr</span>
          </div>
          <div style="text-align:right;">
            <span style="font-size:0.75rem; color:var(--text-muted); display:block;">Estimated Total</span>
            <span style="font-weight:800; font-size:1.15rem; color:var(--primary);">₹${total}</span>
          </div>
        </div>
      </div>
    `
  } else if (bookingStep === 4) {
    backBtn.style.display = "none"
    continueBtn.style.display = "none"
  }
}

window.selectDate = function (dateStr) {
  selectedBookingDate = dateStr
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
  selectedBookingTime = timeStr
  renderBookingStep()
}

window.checkAddress = function (el) {
  selectedBookingAddress = el.value
  document.getElementById("wizard-continue-btn").disabled = selectedBookingAddress.trim().length < 5
}

async function handleWizardNext() {
  if (bookingStep < 3) {
    bookingStep++
    renderBookingStep()
  } else if (bookingStep === 3) {
    // Submit booking to POST /api/bookings which writes to data/bookings.json
    const continueBtn = document.getElementById("wizard-continue-btn")
    continueBtn.disabled = true
    continueBtn.textContent = "Confirming booking…"

    const addr = selectedBookingAddress.trim() || document.getElementById("booking-address")?.value?.trim() || "Koramangala, Bengaluru"

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caretakerId: activeBookingCaretaker.id,
          date: selectedBookingDate,
          time: selectedBookingTime,
          address: addr,
          durationHours: selectedBookingHours,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Please log in before submitting a booking.")
      }

      bookingStep = 4
      const stepperBars = document.querySelectorAll(".stepper-bar")
      stepperBars.forEach((bar) => bar.classList.add("active"))

      const stepContainer = document.getElementById("wizard-step-content")
      const totalCost = activeBookingCaretaker.price * selectedBookingHours

      stepContainer.innerHTML = `
        <div style="text-align:center; padding:1rem 0;">
          <div style="display:inline-flex; width:3.5rem; height:3.5rem; border-radius:9999px; background:#ecfdf5; align-items:center; justify-content:center; font-size:1.8rem; margin-bottom:0.5rem;">
            ✅
          </div>
          <span style="display:inline-block; font-size:0.75rem; font-weight:700; color:#065f46; background:#d1fae5; padding:0.2rem 0.6rem; border-radius:9999px; margin-bottom:0.5rem;">Step 5 of 5 · Confirmed</span>
          <h3 style="font-size:1.35rem; font-weight:800; color:var(--text-main);">Booking Confirmed!</h3>
          <p style="color:var(--text-muted); margin-top:0.25rem; font-size:0.8rem;">
            Your care appointment has been reserved and scheduled with your care coordinator.
          </p>

          <div style="margin-top:1rem; text-align:left; background:var(--bg-main); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:0.75rem; font-size:0.85rem; display:flex; flex-direction:column; gap:0.35rem;">
            <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Booking ID:</span> <strong style="color:var(--primary);">${data.booking?.id || 'CS-CONFIRMED'}</strong></div>
            <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Caretaker:</span> <strong>${activeBookingCaretaker.name}</strong></div>
            <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Date:</span> <strong>${selectedBookingDate}</strong></div>
            <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Shift:</span> <strong>Starting at ${selectedBookingTime} (${selectedBookingHours} hrs)</strong></div>
            <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Location:</span> <strong>${addr}</strong></div>
            <div style="border-top:1px solid var(--border-color); padding-top:0.35rem; display:flex; justify-content:space-between;">
              <span style="font-weight:700;">Total Cost:</span>
              <strong style="color:var(--primary); font-size:1.05rem;">₹${totalCost}</strong>
            </div>
          </div>

          <div style="margin-top:1.25rem; display:flex; gap:0.5rem; justify-content:center;">
            <a href="dashboard.html?section=Bookings" class="btn btn-primary" style="flex:1; text-align:center;">View in Dashboard</a>
            <button type="button" class="btn btn-outline" onclick="document.getElementById('booking-modal').classList.remove('active')">Close</button>
          </div>
        </div>
      `
      continueBtn.style.display = "none"
      document.getElementById("wizard-back-btn").style.display = "none"
    } catch (err) {
      alert(err.message + " (Please log in via the Login page to save your booking).")
      continueBtn.disabled = false
      continueBtn.textContent = "Confirm & Save Booking ✓"
    }
  }
}

function handleWizardBack() {
  if (bookingStep > 0) {
    bookingStep--
    renderBookingStep()
  }
}

window.openProfileModal = function (caretakerId) {
  const c = allCaretakers.find((item) => item.id === caretakerId)
  if (!c) return
  alert(`${c.name} (${c.location})\nExperience: ${c.experience} years\nRate: ₹${c.price}/hr\nLanguages: ${c.languages.join(", ")}\nAbout: ${c.about}`)
}
