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
    id: "priya-sharma",
    name: "Priya Sharma",
    photo: "images/caretaker-1.png",
    verified: true,
    rating: 4.9,
    reviews: 126,
    experience: 8,
    skills: ["Medication", "Mobility", "Companionship", "Meal Prep"],
    careTypes: ["Elderly Care", "Patient Care"],
    location: "Koramangala, Bengaluru",
    distance: 1.4,
    availability: "Available Today",
    price: 350,
    languages: ["English", "Hindi", "Kannada"],
    about: "Compassionate elderly-care specialist with nearly a decade of experience supporting seniors with daily living, gentle mobility, and warm companionship.",
    map: { x: 32, y: 40 }
  },
  {
    id: "arjun-mehta",
    name: "Arjun Mehta",
    photo: "images/caretaker-2.png",
    verified: true,
    rating: 4.8,
    reviews: 94,
    experience: 12,
    skills: ["Nursing", "Wound Care", "Physiotherapy", "Vitals"],
    careTypes: ["Patient Care", "Home Assistance"],
    location: "Indiranagar, Bengaluru",
    distance: 2.1,
    availability: "Available Now",
    price: 420,
    languages: ["English", "Hindi"],
    about: "Certified nursing assistant focused on post-operative recovery, wound dressing, and routine vitals monitoring with clear family updates.",
    map: { x: 58, y: 28 }
  },
  {
    id: "neha-verma",
    name: "Neha Verma",
    photo: "images/caretaker-3.png",
    verified: true,
    rating: 4.9,
    reviews: 152,
    experience: 6,
    skills: ["Newborn Care", "Play", "Nutrition", "First Aid"],
    careTypes: ["Child Care", "Companion Care"],
    location: "HSR Layout, Bengaluru",
    distance: 3.0,
    availability: "Available Today",
    price: 300,
    languages: ["English", "Hindi", "Telugu"],
    about: "Warm, energetic childcare professional experienced with infants, toddlers, and school-age kids. First-aid certified.",
    map: { x: 46, y: 62 }
  },
  {
    id: "lakshmi-rao",
    name: "Lakshmi Rao",
    photo: "images/caretaker-4.png",
    verified: true,
    rating: 4.7,
    reviews: 81,
    experience: 15,
    skills: ["Alzheimer's Care", "Bedridden Care", "Palliative"],
    careTypes: ["Elderly Care", "Patient Care"],
    location: "Jayanagar, Bengaluru",
    distance: 4.2,
    availability: "Available Today",
    price: 450,
    languages: ["English", "Kannada", "Tamil"],
    about: "Specialist in senior memory support and post-stroke rehabilitation with 15 years of dedicated hospital and home experience.",
    map: { x: 25, y: 70 }
  },
  {
    id: "vikram-sen",
    name: "Vikram Sen",
    photo: "images/caretaker-5.png",
    verified: true,
    rating: 4.8,
    reviews: 67,
    experience: 5,
    skills: ["Mobility Support", "Exercises", "Transferring"],
    careTypes: ["Patient Care", "Home Assistance"],
    location: "Whitefield, Bengaluru",
    distance: 6.5,
    availability: "Available Today",
    price: 380,
    languages: ["English", "Hindi", "Bengali"],
    about: "Physiotherapy assistant helping patients rebuild strength and independence following orthopedic procedures and injury.",
    map: { x: 80, y: 45 }
  },
  {
    id: "ananya-das",
    name: "Ananya Das",
    photo: "images/caretaker-6.png",
    verified: true,
    rating: 4.9,
    reviews: 110,
    experience: 9,
    skills: ["Child Care", "Toddlers", "Tutoring", "Creative Arts"],
    careTypes: ["Child Care", "Companion Care"],
    location: "Bellandur, Bengaluru",
    distance: 4.8,
    availability: "Available Now",
    price: 320,
    languages: ["English", "Hindi"],
    about: "Early childhood educator providing loving attention, meal routines, and constructive playtime activities.",
    map: { x: 65, y: 68 }
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
let selectedBookingTime = ""

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
  selectedBookingTime = ""

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
    continueBtn.textContent = "Continue ➔"
    continueBtn.disabled = !selectedBookingDate

    // Generate upcoming dates
    const dates = []
    const now = new Date()
    for (let i = 0; i < 7; i++) {
      const d = new Date(now)
      d.setDate(now.getDate() + i)
      dates.push(d.toISOString().slice(0, 10))
    }

    stepContainer.innerHTML = `
      <h3 style="font-weight:700; margin-bottom:0.75rem;">1. Select Appointment Date</h3>
      <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:0.5rem;">
        ${dates.map(dateStr => `
          <button type="button" class="btn btn-outline ${selectedBookingDate === dateStr ? 'btn-primary' : ''}" onclick="selectDate('${dateStr}')">
            ${dateStr}
          </button>
        `).join('')}
      </div>
    `
  } else if (bookingStep === 1) {
    backBtn.style.display = "inline-flex"
    continueBtn.textContent = "Continue ➔"
    continueBtn.disabled = !selectedBookingTime

    const timeSlots = ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"]
    stepContainer.innerHTML = `
      <h3 style="font-weight:700; margin-bottom:0.75rem;">2. Select Time Slot</h3>
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:0.5rem;">
        ${timeSlots.map(t => `
          <button type="button" class="btn btn-outline ${selectedBookingTime === t ? 'btn-primary' : ''}" onclick="selectTime('${t}')">
            ${t}
          </button>
        `).join('')}
      </div>
    `
  } else if (bookingStep === 2) {
    backBtn.style.display = "inline-flex"
    continueBtn.textContent = "Review Booking ➔"
    const addr = document.getElementById("booking-address")?.value || ""
    continueBtn.disabled = addr.length < 5

    stepContainer.innerHTML = `
      <h3 style="font-weight:700; margin-bottom:0.75rem;">3. Service Location Address</h3>
      <textarea id="booking-address" rows="3" class="hero-input-field" style="width:100%; resize:none;" placeholder="Enter house no, street, area, city (min 5 characters)" oninput="checkAddress(this)">${addr}</textarea>
    `
  } else if (bookingStep === 3) {
    backBtn.style.display = "inline-flex"
    continueBtn.textContent = "Confirm & Save Booking ✓"
    continueBtn.disabled = false

    const addr = document.getElementById("booking-address")?.value || "Koramangala, Bengaluru"
    const total = activeBookingCaretaker.price * 4

    stepContainer.innerHTML = `
      <h3 style="font-weight:700; margin-bottom:0.75rem;">4. Review Booking Summary</h3>
      <div style="background:var(--bg-main); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1rem; display:flex; flex-direction:column; gap:0.5rem; font-size:0.875rem;">
        <p><strong>Caretaker:</strong> ${activeBookingCaretaker.name}</p>
        <p><strong>Date:</strong> ${selectedBookingDate}</p>
        <p><strong>Time:</strong> ${selectedBookingTime}</p>
        <p><strong>Location:</strong> ${addr}</p>
        <div style="border-top:1px solid var(--border-color); padding-top:0.5rem; display:flex; justify-content:space-between; font-weight:800; font-size:1rem; color:var(--primary);">
          <span>Estimated Total (4 hrs):</span>
          <span>₹${total}</span>
        </div>
      </div>
    `
  } else if (bookingStep === 4) {
    backBtn.style.display = "none"
    continueBtn.textContent = "Done"
    continueBtn.disabled = false
  }
}

window.selectDate = function (dateStr) {
  selectedBookingDate = dateStr
  renderBookingStep()
}

window.selectTime = function (timeStr) {
  selectedBookingTime = timeStr
  renderBookingStep()
}

window.checkAddress = function (el) {
  document.getElementById("wizard-continue-btn").disabled = el.value.trim().length < 5
}

async function handleWizardNext() {
  if (bookingStep < 3) {
    bookingStep++
    renderBookingStep()
  } else if (bookingStep === 3) {
    // Submit booking to POST /api/bookings which writes to data/bookings.json
    const continueBtn = document.getElementById("wizard-continue-btn")
    continueBtn.disabled = true
    continueBtn.textContent = "Saving to bookings.json…"

    const addr = document.getElementById("booking-address")?.value || "Koramangala, Bengaluru"

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caretakerId: activeBookingCaretaker.id,
          date: selectedBookingDate,
          time: selectedBookingTime,
          address: addr,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Please log in before submitting a booking.")
      }

      bookingStep = 4
      const stepContainer = document.getElementById("wizard-step-content")
      stepContainer.innerHTML = `
        <div style="text-align:center; padding:1.5rem 0;">
          <span style="font-size:3rem;">✅</span>
          <h3 style="font-size:1.5rem; font-weight:800; margin-top:0.5rem;">Booking Request Saved!</h3>
          <p style="color:var(--text-muted); margin-top:0.5rem; font-size:0.875rem;">
            Your request has been stored into <code>data/bookings.json</code> with Booking ID: <strong>${data.booking?.id || 'CS-CONFIRMED'}</strong>.
          </p>
          <div style="margin-top:1.5rem; display:flex; gap:0.5rem; justify-content:center;">
            <a href="dashboard.html?section=Bookings" class="btn btn-primary">View in Dashboard</a>
          </div>
        </div>
      `
      continueBtn.style.display = "none"
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
