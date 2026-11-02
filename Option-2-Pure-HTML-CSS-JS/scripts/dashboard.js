// ==============================================================================
//  CARESURE - USER DASHBOARD JAVASCRIPT LOGIC
//  File: scripts/dashboard.js
//  JavaScript logic for this page: Loads active session from data/sessions.json,
//  fetches user bookings from data/bookings.json, renders the expandable booking list,
//  and allows updating profile information into data/users.json.
// ==============================================================================

let currentUser = null
let currentBookings = []
let activeSection = "Overview"

document.addEventListener("DOMContentLoaded", () => {
  // Check URL query parameters (e.g. dashboard.html?section=Bookings)
  const params = new URLSearchParams(window.location.search)
  const sec = params.get("section")
  if (sec) activeSection = sec

  // Load User Data & Bookings
  initDashboard()
  setupTabNavigation()
  setupProfileForm()
})

async function initDashboard() {
  const loadingIndicator = document.getElementById("dash-loading")
  const mainContent = document.getElementById("dash-main-content")
  const unauthBox = document.getElementById("dash-unauth-box")

  try {
    // 1. Fetch authenticated user profile
    const userRes = await fetch("/api/account")
    const userData = await userRes.json()

    if (!userData.user) {
      if (loadingIndicator) loadingIndicator.style.display = "none"
      if (unauthBox) unauthBox.style.display = "block"
      return
    }

    currentUser = userData.user

    // 2. Fetch user bookings from data/bookings.json
    const bookingsRes = await fetch("/api/bookings")
    const bookingsData = await bookingsRes.json()
    currentBookings = bookingsData.bookings || []

    // Update Topbar Profile
    document.getElementById("dash-user-name").textContent = currentUser.name
    document.getElementById("dash-user-sub").textContent = currentUser.location
    document.getElementById("dash-welcome-heading").textContent = `Welcome back, ${currentUser.name.split(" ")[0]}`

    // Populate profile settings form
    document.getElementById("setting-name").value = currentUser.name
    document.getElementById("setting-phone").value = currentUser.phone
    document.getElementById("setting-location").value = currentUser.location
    document.getElementById("setting-care-needs").value = currentUser.careNeeds || ""
    document.getElementById("setting-email-display").textContent = currentUser.email

    // Render stats and lists
    renderStats()
    renderBookings()

    if (loadingIndicator) loadingIndicator.style.display = "none"
    if (mainContent) mainContent.style.display = "block"

    switchTab(activeSection)
  } catch (err) {
    if (loadingIndicator) loadingIndicator.textContent = "Could not load dashboard. Please refresh."
  }
}

function setupTabNavigation() {
  document.querySelectorAll(".dash-nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab
      switchTab(tab)
    })
  })

  // Sign out button
  document.getElementById("dash-logout-btn")?.addEventListener("click", async () => {
    await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    })
    window.location.href = "login.html"
  })
}

function switchTab(tabName) {
  activeSection = tabName

  document.querySelectorAll(".dash-nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabName)
  })

  document.querySelectorAll(".dash-section-panel").forEach((panel) => {
    panel.style.display = panel.id === `section-${tabName.toLowerCase().replace(" ", "-")}` ? "block" : "none"
  })
}

function renderStats() {
  document.getElementById("stat-bookings-count").textContent = currentBookings.length
  document.getElementById("stat-saved-count").textContent = currentUser.saved ? currentUser.saved.length : 0
}

function renderBookings() {
  const container = document.getElementById("bookings-records-container")
  const overviewContainer = document.getElementById("overview-bookings-preview")
  if (!container) return

  if (currentBookings.length === 0) {
    const emptyHtml = `
      <p style="color:var(--text-muted); font-size:0.875rem; padding:1rem 0;">
        No care requests yet. Explore local caregivers to book your first appointment.
      </p>
      <a href="find.html" class="btn btn-primary" style="margin-top:0.5rem;">Find a Caretaker →</a>
    `
    container.innerHTML = emptyHtml
    if (overviewContainer) overviewContainer.innerHTML = emptyHtml
    return
  }

  const itemsHtml = currentBookings
    .map(
      (b) => `
      <div class="booking-record-item">
        <div class="booking-record-header">
          <div>
            <p style="font-weight:700; font-size:1rem;">${b.caretakerName}</p>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:2px;">
              ${new Date(b.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })} · ${b.time} · Request saved
            </p>
          </div>
          <button class="btn btn-outline" onclick="toggleDetails('${b.id}')">Details</button>
        </div>

        <div id="details-${b.id}" class="booking-record-drawer" style="display:none;">
          <p><strong>Booking ID:</strong> ${b.id}</p>
          <p><strong>Service Location:</strong> ${b.address}</p>
          <p><strong>Estimated Total (4 hrs):</strong> ₹${b.estimatedTotal}</p>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.5rem;">
            Saved locally in data/bookings.json. Caretakers registered on this computer can view requests in their dashboard.
          </p>
        </div>
      </div>
    `
    )
    .join("")

  container.innerHTML = itemsHtml
  if (overviewContainer) overviewContainer.innerHTML = itemsHtml
}

window.toggleDetails = function (bookingId) {
  const drawer = document.getElementById(`details-${bookingId}`)
  if (drawer) {
    drawer.style.display = drawer.style.display === "none" ? "block" : "none"
  }
}

function setupProfileForm() {
  const form = document.getElementById("profile-settings-form")
  const feedback = document.getElementById("settings-feedback")

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault()
      if (feedback) feedback.textContent = ""

      const name = document.getElementById("setting-name").value.trim()
      const phone = document.getElementById("setting-phone").value.trim()
      const location = document.getElementById("setting-location").value.trim()
      const careNeeds = document.getElementById("setting-care-needs").value.trim()

      try {
        const response = await fetch("/api/account", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, location, careNeeds }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Could not save profile.")
        }

        currentUser = data.user
        document.getElementById("dash-user-name").textContent = currentUser.name
        document.getElementById("dash-user-sub").textContent = currentUser.location
        if (feedback) {
          feedback.textContent = "Profile updated and saved directly into data/users.json!"
          feedback.style.color = "var(--success)"
        }
      } catch (err) {
        if (feedback) {
          feedback.textContent = err.message
          feedback.style.color = "var(--destructive)"
        }
      }
    })
  }
}
