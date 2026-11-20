// ==============================================================================
//  CARESURE - GLOBAL MAIN JAVASCRIPT LOGIC
//  File: scripts/main.js
//  JavaScript logic for this page: Manages the navigation bar across all HTML pages,
//  detects active user sessions, and powers the 1-Click Urgent Dispatch System.
// ==============================================================================

let currentSessionUser = null
let activeUrgentCaretaker = null
let activeUrgentStartTime = ""
let activeUrgentTotal = 1400
let activeUrgentHours = 4

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Menu Drawer Toggle
  const hamburgerBtn = document.getElementById("hamburger-btn")
  const mobileDrawer = document.getElementById("mobile-drawer")

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener("click", () => {
      mobileDrawer.classList.toggle("active")
    })
  }

  // 2. Urgent Caretaker Feature Initialization
  setupUrgentCaretakerFeature()

  // 3. Active User Authentication Check: Calls GET /api/account
  checkUserSession()
})

async function checkUserSession() {
  const desktopAuthBox = document.getElementById("desktop-auth-actions")
  const mobileAuthBox = document.getElementById("mobile-auth-actions")

  try {
    const res = await fetch("/api/account")
    const data = await res.json()

    if (data.user) {
      currentSessionUser = data.user
      const firstName = data.user.name.split(" ")[0]

      // Update Desktop Navbar with Dashboard link and Logout button
      if (desktopAuthBox) {
        desktopAuthBox.innerHTML = `
          <a href="dashboard.html" class="btn btn-outline">
            👤 Dashboard (${firstName})
          </a>
          <button id="logout-btn-desktop" class="btn btn-secondary">
            Logout
          </button>
          <a href="find.html" class="btn btn-primary">Find a Caretaker</a>
        `
        document.getElementById("logout-btn-desktop")?.addEventListener("click", handleLogout)
      }

      // Update Mobile Drawer
      if (mobileAuthBox) {
        mobileAuthBox.innerHTML = `
          <a href="dashboard.html" class="btn btn-outline" style="text-align:center;">
            Dashboard (${firstName})
          </a>
          <button id="logout-btn-mobile" class="btn btn-secondary" style="width:100%;">
            Logout
          </button>
        `
        document.getElementById("logout-btn-mobile")?.addEventListener("click", handleLogout)
      }

      // Unlock Urgent Caretaker Dispatch Feature
      unlockUrgentFeature(data.user)
    } else {
      currentSessionUser = null
      lockUrgentFeature()
    }
  } catch (err) {
    currentSessionUser = null
    lockUrgentFeature()
  }
}

// ==============================================================================
//  URGENT CARETAKER DISPATCH FEATURE (LOCKED FOR GUEST, UNLOCKED FOR LOGGED IN)
// ==============================================================================
function getUrgentStartTime() {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 15)
  let h = now.getHours()
  const m = String(now.getMinutes()).padStart(2, "0")
  const ampm = h >= 12 ? "PM" : "AM"
  h = h % 12 || 12
  return `${h}:${m} ${ampm}`
}

function setupUrgentCaretakerFeature() {
  const urgentBtn = document.getElementById("urgent-caretaker-btn")
  const authModal = document.getElementById("urgent-auth-modal")
  const closeAuthX = document.getElementById("close-urgent-modal-x")
  const closeAuthBtn = document.getElementById("close-urgent-modal-btn")

  const bookingModal = document.getElementById("urgent-booking-modal")
  const closeBookingX = document.getElementById("close-urgent-booking-x")
  const confirmBtn = document.getElementById("confirm-urgent-dispatch-btn")

  const successModal = document.getElementById("urgent-success-modal")
  const closeSuccessBtn = document.getElementById("close-urgent-success-btn")

  function closeAuthModal() {
    if (authModal) authModal.style.display = "none"
  }
  function closeBookingModal() {
    if (bookingModal) bookingModal.style.display = "none"
  }
  function closeSuccessModal() {
    if (successModal) successModal.style.display = "none"
  }

  if (closeAuthX) closeAuthX.addEventListener("click", closeAuthModal)
  if (closeAuthBtn) closeAuthBtn.addEventListener("click", closeAuthModal)
  if (authModal) {
    authModal.addEventListener("click", (e) => {
      if (e.target === authModal) closeAuthModal()
    })
  }

  if (closeBookingX) closeBookingX.addEventListener("click", closeBookingModal)
  if (bookingModal) {
    bookingModal.addEventListener("click", (e) => {
      if (e.target === bookingModal) closeBookingModal()
    })
  }

  if (closeSuccessBtn) closeSuccessBtn.addEventListener("click", closeSuccessModal)
  if (successModal) {
    successModal.addEventListener("click", (e) => {
      if (e.target === successModal) closeSuccessModal()
    })
  }

  // Urgent Button Trigger
  if (urgentBtn) {
    urgentBtn.addEventListener("click", async (e) => {
      const isUnlocked = urgentBtn.dataset.unlocked === "true"

      if (isUnlocked) {
        // Logged-in user: Open Instant 1-Click Urgent Dispatch Modal
        await openUrgentDispatchModal()
      } else {
        // Logged-out guest: Feature is locked -> Show dedicated popup modal
        e.preventDefault()
        if (authModal) {
          authModal.style.display = "flex"
        }
      }
    })
  }

  // Handle Duration Selector Pills (2h, 4h, 6h, 8h, 12h)
  document.querySelectorAll(".urgent-duration-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".urgent-duration-pill").forEach((p) => {
        p.classList.remove("active")
        p.style.background = "#fff"
        p.style.color = "var(--text-main)"
        p.style.borderColor = "var(--border-color)"
      })
      pill.classList.add("active")
      pill.style.background = "var(--primary)"
      pill.style.color = "#fff"
      pill.style.borderColor = "var(--primary)"

      activeUrgentHours = Number(pill.dataset.hours) || 4
      const selectEl = document.getElementById("urgent-duration-select")
      if (selectEl) selectEl.value = String(activeUrgentHours)

      updateUrgentCalculation()
    })
  })

  // Handle Custom Duration Select Dropdown
  const durationSelect = document.getElementById("urgent-duration-select")
  if (durationSelect) {
    durationSelect.addEventListener("change", (e) => {
      activeUrgentHours = Number(e.target.value) || 4

      document.querySelectorAll(".urgent-duration-pill").forEach((p) => {
        const isMatch = Number(p.dataset.hours) === activeUrgentHours
        p.classList.toggle("active", isMatch)
        p.style.background = isMatch ? "var(--primary)" : "#fff"
        p.style.color = isMatch ? "#fff" : "var(--text-main)"
        p.style.borderColor = isMatch ? "var(--primary)" : "var(--border-color)"
      })

      updateUrgentCalculation()
    })
  }

  // Handle Profile Address Auto-Fill
  const locateBtn = document.getElementById("urgent-locate-btn")
  if (locateBtn) {
    locateBtn.addEventListener("click", () => {
      const locInput = document.getElementById("urgent-location-input")
      if (locInput) {
        locInput.value = currentSessionUser ? (currentSessionUser.location || "Flat 302, Green Glen Layout, Bellandur, Bengaluru") : "Flat 302, Green Glen Layout, Bellandur, Bengaluru"
      }
    })
  }

  // Handle Instant Urgent Dispatch Confirmation
  if (confirmBtn) {
    confirmBtn.addEventListener("click", async () => {
      const locInput = document.getElementById("urgent-location-input")
      const feedbackEl = document.getElementById("urgent-submit-feedback")
      const confirmedAddr = locInput ? locInput.value.trim() : ""

      if (confirmedAddr.length < 5) {
        if (feedbackEl) {
          feedbackEl.textContent = "Please confirm a valid delivery address (min 5 characters)."
          feedbackEl.style.color = "#dc2626"
        }
        return
      }

      confirmBtn.disabled = true
      confirmBtn.textContent = "Dispatching Caretaker Urgently…"
      if (feedbackEl) {
        feedbackEl.textContent = "Assigning nearest 4.5+ caregiver & registering booking…"
        feedbackEl.style.color = "#0284c7"
      }

      const todayIso = new Date().toISOString()
      const payload = {
        caretakerId: activeUrgentCaretaker ? activeUrgentCaretaker.id : "priya-sharma",
        caretakerName: activeUrgentCaretaker ? activeUrgentCaretaker.name : "Priya Sharma",
        familyName: currentSessionUser ? currentSessionUser.name : "CareSure Member",
        familyEmail: currentSessionUser ? currentSessionUser.email : "member@example.com",
        date: todayIso,
        time: activeUrgentStartTime || getUrgentStartTime(),
        address: confirmedAddr,
        durationHours: activeUrgentHours || 4,
        estimatedTotal: activeUrgentTotal || 1400,
        status: "Confirmed",
        source: `Urgent ${activeUrgentHours}h Dispatch`,
      }

      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || "Failed to book urgent caretaker.")
        }

        // Close dispatch modal & open success confirmation modal
        if (bookingModal) bookingModal.style.display = "none"

        const successId = document.getElementById("urgent-success-id")
        const successCaretaker = document.getElementById("urgent-success-caretaker")
        const successTime = document.getElementById("urgent-success-time")
        const successTotal = document.getElementById("urgent-success-total")
        const successMsg = document.getElementById("urgent-success-msg")

        const displayId = data.booking ? data.booking.id : "CS-URG-CONFIRMED"
        if (successId) successId.textContent = displayId
        if (successCaretaker && activeUrgentCaretaker) successCaretaker.textContent = activeUrgentCaretaker.name
        if (successTime) successTime.textContent = `Today at ${activeUrgentStartTime} (${activeUrgentHours} hrs)`
        if (successTotal) successTotal.textContent = `₹${activeUrgentTotal.toLocaleString("en-IN")}`
        if (successMsg && activeUrgentCaretaker) {
          successMsg.textContent = `${activeUrgentCaretaker.name} is preparing to arrive at ${confirmedAddr} within 15 minutes.`
        }

        if (successModal) successModal.style.display = "flex"
      } catch (err) {
        if (feedbackEl) {
          feedbackEl.textContent = err.message
          feedbackEl.style.color = "#dc2626"
        }
      } finally {
        confirmBtn.disabled = false
        confirmBtn.textContent = "🚨 Confirm & Dispatch Urgently (Starts in 15 Mins) ➔"
      }
    })
  }
}

function updateUrgentCalculation() {
  const rate = activeUrgentCaretaker ? (activeUrgentCaretaker.price || 350) : 350
  activeUrgentTotal = rate * activeUrgentHours

  const totalEl = document.getElementById("urgent-total-price")
  const chargeHoursEl = document.getElementById("urgent-charge-hours")
  const badgeEl = document.getElementById("urgent-hours-badge")
  const rateCalcEl = document.getElementById("urgent-rate-calc")

  if (totalEl) totalEl.textContent = `₹${activeUrgentTotal.toLocaleString("en-IN")}`
  if (chargeHoursEl) chargeHoursEl.textContent = `${activeUrgentHours} Hours`
  if (badgeEl) badgeEl.textContent = `${activeUrgentHours} Hours Selected`
  if (rateCalcEl) {
    rateCalcEl.textContent = `₹${rate}/hr × ${activeUrgentHours} hrs • Dispatch fee waived (₹0)`
  }
}

// Automatically detect nearest caretaker with 4.5+ rating available today
async function openUrgentDispatchModal() {
  const modal = document.getElementById("urgent-booking-modal")
  if (!modal) return

  // 1. Fetch caretakers and filter for 4.5+ rating and Available Today, sorted by nearest distance
  try {
    const res = await fetch("data/caretakers.json")
    const caretakers = await res.json()

    const eligible = caretakers.filter((c) => {
      const matchRating = typeof c.rating === "number" && c.rating >= 4.5
      const matchToday = typeof c.availability === "string" && c.availability.toLowerCase().includes("today")
      return matchRating && matchToday
    })

    eligible.sort((a, b) => (a.distance || 0) - (b.distance || 0))
    activeUrgentCaretaker = eligible[0] || caretakers[0]
  } catch {
    activeUrgentCaretaker = {
      id: "priya-sharma",
      name: "Priya Sharma",
      rating: 4.9,
      reviews: 126,
      distance: 1.4,
      location: "Koramangala, Bengaluru",
      price: 350,
      photo: "images/caretaker-1.png",
    }
  }

  // 2. Compute 15-minute start time & reset duration to 4 hours
  activeUrgentStartTime = getUrgentStartTime()
  activeUrgentHours = 4
  activeUrgentTotal = (activeUrgentCaretaker.price || 350) * activeUrgentHours

  const selectEl = document.getElementById("urgent-duration-select")
  if (selectEl) selectEl.value = "4"
  document.querySelectorAll(".urgent-duration-pill").forEach((p) => {
    const isDefault = Number(p.dataset.hours) === 4
    p.classList.toggle("active", isDefault)
    p.style.background = isDefault ? "var(--primary)" : "#fff"
    p.style.color = isDefault ? "#fff" : "var(--text-main)"
    p.style.borderColor = isDefault ? "var(--primary)" : "var(--border-color)"
  })

  // 3. Populate modal UI
  const imgEl = document.getElementById("urgent-caretaker-img")
  const nameEl = document.getElementById("urgent-caretaker-name")
  const ratingEl = document.getElementById("urgent-caretaker-rating")
  const distEl = document.getElementById("urgent-caretaker-dist")
  const locEl = document.getElementById("urgent-caretaker-loc")
  const dateEl = document.getElementById("urgent-date-display")
  const timeEl = document.getElementById("urgent-time-display")
  const rateEl = document.getElementById("urgent-rate-display")
  const totalEl = document.getElementById("urgent-total-price")
  const locInput = document.getElementById("urgent-location-input")
  const feedbackEl = document.getElementById("urgent-submit-feedback")

  if (imgEl) imgEl.src = activeUrgentCaretaker.photo || "images/caretaker-1.png"
  if (nameEl) nameEl.textContent = activeUrgentCaretaker.name
  if (ratingEl) ratingEl.textContent = `⭐ ${activeUrgentCaretaker.rating} (${activeUrgentCaretaker.reviews || 100}+ reviews)`
  if (distEl) distEl.textContent = `${activeUrgentCaretaker.distance || 1.4} km away`
  if (locEl) locEl.textContent = activeUrgentCaretaker.location || "Bengaluru"
  if (rateEl) rateEl.textContent = `₹${activeUrgentCaretaker.price || 350} / hr`
  if (totalEl) totalEl.textContent = `₹${activeUrgentTotal.toLocaleString("en-IN")}`

  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  if (dateEl) dateEl.textContent = `Today (${todayStr})`
  if (timeEl) timeEl.textContent = `Starts in 15 mins (${activeUrgentStartTime})`

  // Pre-fill location from user profile
  if (locInput) {
    locInput.value = currentSessionUser ? (currentSessionUser.location || "Flat 302, Green Glen Layout, Bellandur, Bengaluru") : "Flat 302, Green Glen Layout, Bellandur, Bengaluru"
  }
  if (feedbackEl) feedbackEl.textContent = ""

  modal.style.display = "flex"
}

function unlockUrgentFeature(user) {
  const urgentBtn = document.getElementById("urgent-caretaker-btn")
  const lockBadge = document.getElementById("urgent-lock-badge")
  const btnIcon = document.getElementById("urgent-btn-icon")
  const btnText = document.getElementById("urgent-btn-text")
  const btnSub = document.getElementById("urgent-btn-sub")

  if (urgentBtn) {
    urgentBtn.dataset.unlocked = "true"
    urgentBtn.classList.remove("locked")
    urgentBtn.classList.add("unlocked")
    if (btnIcon) {
      btnIcon.textContent = "⚡"
      btnIcon.style.background = "#ffffff"
      btnIcon.style.color = "#dc2626"
    }
    if (btnText) btnText.textContent = "Need Urgent Care? Book Now ➔"
    if (btnSub) btnSub.textContent = `Priority urgent booking active for ${user.name.split(" ")[0]}`
  }

  if (lockBadge) {
    lockBadge.innerHTML = `🟢 <strong>Unlocked:</strong> Priority Dispatch Ready`
    lockBadge.style.background = "#dcfce7"
    lockBadge.style.color = "#15803d"
    lockBadge.style.borderColor = "#86efac"
  }
}

function lockUrgentFeature() {
  const urgentBtn = document.getElementById("urgent-caretaker-btn")
  const lockBadge = document.getElementById("urgent-lock-badge")
  const btnIcon = document.getElementById("urgent-btn-icon")
  const btnText = document.getElementById("urgent-btn-text")
  const btnSub = document.getElementById("urgent-btn-sub")

  if (urgentBtn) {
    urgentBtn.dataset.unlocked = "false"
    urgentBtn.classList.add("locked")
    urgentBtn.classList.remove("unlocked")
    if (btnIcon) {
      btnIcon.textContent = "🔒"
      btnIcon.style.background = "#fee2e2"
      btnIcon.style.color = "#991b1b"
    }
    if (btnText) btnText.textContent = "Need Urgent Care"
    if (btnSub) btnSub.textContent = "Tap lock to login or signup"
  }

  if (lockBadge) {
    lockBadge.innerHTML = `🔒 Locked · Login Required`
    lockBadge.style.background = "#f1f5f9"
    lockBadge.style.color = "#64748b"
    lockBadge.style.borderColor = "#cbd5e1"
  }
}

async function handleLogout() {
  try {
    await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    })
    window.location.href = "index.html"
  } catch (err) {
    window.location.reload()
  }
}
