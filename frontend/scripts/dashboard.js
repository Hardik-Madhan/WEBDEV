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
  setupMongoCrudControls()
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
    loadWeatherAdvisory()

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

  if (tabName === "MongoDB") {
    loadMongoAtlasData()
  }
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

// ==============================================================================
//  PARAMETER 1: EXTERNAL WEATHER API ADVISORY (Open-Meteo)
// ==============================================================================
async function loadWeatherAdvisory() {
  const cityEl = document.getElementById("weather-city")
  const detailsEl = document.getElementById("weather-temp-details")
  const badgeEl = document.getElementById("weather-advisory-badge")

  if (!cityEl) return

  try {
    const res = await fetch("/api/external/weather")
    const data = await res.json()

    if (data.ok) {
      cityEl.textContent = `${data.city} Weather`
      detailsEl.textContent = `${data.temperature}°C · Humidity ${data.humidity}% · Wind ${data.windSpeed} km/h`
      badgeEl.textContent = `Outdoor Safety: ${data.advisory}`
      badgeEl.style.background = data.statusColor || "#10b981"
    } else {
      detailsEl.textContent = "Weather service currently updating."
    }
  } catch (err) {
    detailsEl.textContent = "External weather advisory available on refresh."
  }
}

// ==============================================================================
//  PARAMETER 4: MONGODB ATLAS CLOUD CRUD OPERATIONS
// ==============================================================================
function setupMongoCrudControls() {
  const toggleBtn = document.getElementById("mongo-toggle-create-btn")
  const cancelBtn = document.getElementById("m-cancel-create-btn")
  const createCard = document.getElementById("mongo-create-card")
  const createForm = document.getElementById("mongo-create-form")
  const refreshBtn = document.getElementById("mongo-refresh-btn")

  if (toggleBtn && createCard) {
    toggleBtn.addEventListener("click", () => {
      const isClosed = createCard.style.display === "none" || !createCard.style.display
      createCard.style.display = isClosed ? "block" : "none"
      if (isClosed) {
        // Pre-fill date to today
        const dateInput = document.getElementById("m-date")
        if (dateInput && !dateInput.value) {
          dateInput.value = new Date().toISOString().split("T")[0]
        }
        if (currentUser) {
          const fnInput = document.getElementById("m-family-name")
          const feInput = document.getElementById("m-family-email")
          if (fnInput && !fnInput.value) fnInput.value = currentUser.name
          if (feInput && !feInput.value) feInput.value = currentUser.email
        }
      }
    })
  }

  if (cancelBtn && createCard) {
    cancelBtn.addEventListener("click", () => {
      createCard.style.display = "none"
    })
  }

  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      loadMongoAtlasData()
    })
  }

  // Handle Document Creation (CREATE - C)
  if (createForm) {
    createForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      const feedback = document.getElementById("m-create-feedback")
      if (feedback) feedback.textContent = "Saving document to MongoDB Atlas…"

      const payload = {
        caretakerName: document.getElementById("m-caretaker-name").value.trim(),
        familyName: document.getElementById("m-family-name").value.trim(),
        familyEmail: document.getElementById("m-family-email").value.trim(),
        date: document.getElementById("m-date").value,
        time: document.getElementById("m-time").value.trim(),
        durationHours: Number(document.getElementById("m-duration").value) || 4,
        estimatedTotal: Number(document.getElementById("m-total").value) || 1400,
        address: document.getElementById("m-address").value.trim(),
        status: document.getElementById("m-status").value,
        source: "Dashboard MongoDB CRUD Manager",
      }

      try {
        const res = await fetch("/api/mongo/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await res.json()

        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to create document in MongoDB Atlas.")
        }

        if (feedback) {
          feedback.textContent = `Document saved in MongoDB Atlas! (ID: ${data.booking.bookingId})`
          feedback.style.color = "var(--success)"
        }

        // Reload the table and hide form after brief moment
        loadMongoAtlasData()
        setTimeout(() => {
          createForm.reset()
          if (createCard) createCard.style.display = "none"
          if (feedback) feedback.textContent = ""
        }, 1200)
      } catch (err) {
        if (feedback) {
          feedback.textContent = err.message
          feedback.style.color = "var(--destructive)"
        }
      }
    })
  }
}

// Read all documents from MongoDB Atlas (READ - R)
async function loadMongoAtlasData() {
  const tbody = document.getElementById("mongo-documents-tbody")
  const countLabel = document.getElementById("mongo-count-label")
  const healthText = document.getElementById("mongo-health-text")

  // 1. Check health & collections count
  const statsEl = document.getElementById("mongo-collections-stats")
  try {
    const statusRes = await fetch("/api/mongo/status")
    const statusData = await statusRes.json()
    if (statusData.ok) {
      if (healthText) {
        healthText.textContent = `Connected to ${statusData.cluster} / ${statusData.database} (Mongoose State: Connected)`
      }
      if (statsEl && statusData.collections) {
        statsEl.textContent = `${statusData.collections.users} Users, ${statusData.collections.caretakers} Caretakers, ${statusData.collections.bookings} Bookings`
      }
    }
  } catch {
    if (healthText) healthText.textContent = "Connecting to MongoDB Atlas…"
  }

  // 2. Fetch bookings
  if (!tbody) return
  tbody.innerHTML = `
    <tr>
      <td colspan="7" style="padding:1.5rem; text-align:center; color:var(--text-muted);">
        Fetching live documents from MongoDB Atlas…
      </td>
    </tr>
  `

  try {
    const res = await fetch("/api/mongo/bookings")
    const data = await res.json()

    if (!res.ok || !data.ok) {
      throw new Error(data.error || "Failed to fetch documents from MongoDB Atlas.")
    }

    const bookings = data.bookings || []
    if (countLabel) countLabel.textContent = `${bookings.length} document${bookings.length === 1 ? "" : "s"}`

    if (bookings.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="padding:2.5rem; text-align:center; color:var(--text-muted);">
            <div style="font-size:1.5rem; margin-bottom:0.5rem;">🍃</div>
            <p style="font-weight:700; color:var(--text-main);">No documents in MongoDB collection yet.</p>
            <p style="font-size:0.75rem; margin-top:0.25rem;">Click <strong>+ Insert Document (Create)</strong> above to create your first document in MongoDB Atlas!</p>
          </td>
        </tr>
      `
      return
    }

    tbody.innerHTML = bookings
      .map((b) => {
        const id = b._id || b.bookingId
        const displayId = b.bookingId || String(b._id).slice(-8)
        const dateStr = b.date ? new Date(b.date).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "N/A"
        const statusColors = {
          Pending: "background:#fef3c7; color:#b45309;",
          Confirmed: "background:#d1fae5; color:#065f46;",
          Completed: "background:#e0f2fe; color:#0369a1;",
          Cancelled: "background:#fee2e2; color:#b91c1c;",
        }
        const badgeStyle = statusColors[b.status] || "background:#f1f5f9; color:#475569;"

        return `
          <tr style="border-bottom:1px solid var(--border-color); vertical-align:middle;">
            <td style="padding:0.75rem; font-family:monospace; font-weight:700; color:var(--primary); font-size:0.78rem;">
              ${displayId}
            </td>
            <td style="padding:0.75rem;">
              <strong style="display:block; color:var(--text-main);">${b.caretakerName || "Caregiver"}</strong>
              <span style="font-size:0.72rem; color:var(--text-muted);">${b.source || "Atlas"}</span>
            </td>
            <td style="padding:0.75rem;">
              <strong style="display:block;">${b.familyName || "Family"}</strong>
              <span style="font-size:0.72rem; color:var(--text-muted);">${b.familyEmail || ""}</span>
            </td>
            <td style="padding:0.75rem;">
              <span>${dateStr}</span>
              <span style="display:block; font-size:0.72rem; color:var(--text-muted);">${b.time || ""} (${b.durationHours || 4} hrs)</span>
            </td>
            <td style="padding:0.75rem; font-weight:700; color:var(--text-main);">
              ₹${b.estimatedTotal || 1400}
            </td>
            <td style="padding:0.75rem;">
              <span style="display:inline-block; font-size:0.72rem; font-weight:700; padding:0.2rem 0.55rem; border-radius:9999px; ${badgeStyle}">
                ${b.status || "Pending"}
              </span>
            </td>
            <td style="padding:0.75rem; text-align:right;">
              <div style="display:inline-flex; align-items:center; gap:0.4rem;">
                <select style="font-size:0.75rem; padding:0.25rem 0.4rem; border:1px solid var(--border-color); border-radius:0.4rem; background:#fff;" onchange="updateMongoBookingStatus('${id}', this.value)" title="Update Status (Express PUT)">
                  <option value="Pending" ${b.status === "Pending" ? "selected" : ""}>Pending</option>
                  <option value="Confirmed" ${b.status === "Confirmed" ? "selected" : ""}>Confirmed</option>
                  <option value="Completed" ${b.status === "Completed" ? "selected" : ""}>Completed</option>
                  <option value="Cancelled" ${b.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                </select>
                <button type="button" class="btn btn-outline" style="color:#dc2626; border-color:#fca5a5; padding:0.25rem 0.55rem; font-size:0.75rem;" onclick="deleteMongoBooking('${id}')" title="Delete from Atlas (Express DELETE)">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        `
      })
      .join("")
  } catch (err) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="padding:1.5rem; text-align:center; color:var(--destructive);">
          Could not load data from MongoDB Atlas: ${err.message}
        </td>
      </tr>
    `
  }
}

// Update Document in MongoDB Atlas (UPDATE - U)
window.updateMongoBookingStatus = async function (id, newStatus) {
  try {
    const res = await fetch(`/api/mongo/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    const data = await res.json()
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "Failed to update document.")
    }
    loadMongoAtlasData()
  } catch (err) {
    loadMongoAtlasData()
  }
}

// Delete Document from MongoDB Atlas (DELETE - D)
window.deleteMongoBooking = async function (id) {
  try {
    const res = await fetch(`/api/mongo/bookings/${id}`, {
      method: "DELETE",
    })
    const data = await res.json()
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "Failed to delete document.")
    }
    loadMongoAtlasData()
  } catch (err) {
    loadMongoAtlasData()
  }
}
