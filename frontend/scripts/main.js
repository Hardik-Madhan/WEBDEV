// ==============================================================================
//  CARESURE - GLOBAL MAIN JAVASCRIPT LOGIC
//  File: scripts/main.js
//  JavaScript logic for this page: Manages the navigation bar across all HTML pages,
//  detects active user sessions, and updates the UI with Dashboard / Logout links.
// ==============================================================================

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
      lockUrgentFeature()
    }
  } catch (err) {
    lockUrgentFeature()
  }
}

// ==============================================================================
//  URGENT CARETAKER DISPATCH FEATURE (LOCKED FOR GUEST, UNLOCKED FOR LOGGED IN)
// ==============================================================================
function setupUrgentCaretakerFeature() {
  const urgentBtn = document.getElementById("urgent-caretaker-btn")
  const modal = document.getElementById("urgent-auth-modal")
  const closeX = document.getElementById("close-urgent-modal-x")
  const closeBtn = document.getElementById("close-urgent-modal-btn")

  function closeUrgentModal() {
    if (modal) modal.style.display = "none"
  }

  if (closeX) closeX.addEventListener("click", closeUrgentModal)
  if (closeBtn) closeBtn.addEventListener("click", closeUrgentModal)
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeUrgentModal()
    })
  }

  if (urgentBtn) {
    urgentBtn.addEventListener("click", (e) => {
      const isUnlocked = urgentBtn.dataset.unlocked === "true"

      if (isUnlocked) {
        // Logged-in user: Regularly functional -> Navigate to urgent dispatch catalog
        window.location.href = "find.html?urgent=true"
      } else {
        // Logged-out guest: Feature is locked -> Show dedicated popup modal
        e.preventDefault()
        if (modal) {
          modal.style.display = "flex"
        }
      }
    })
  }
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
    if (btnIcon) btnIcon.textContent = "⚡"
    if (btnText) btnText.textContent = "Find Caretaker Urgently ➔"
    if (btnSub) btnSub.textContent = `Priority matching active for ${user.name.split(" ")[0]}`
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
    if (btnIcon) btnIcon.textContent = "🔒"
    if (btnText) btnText.textContent = "Find Caretaker Urgently"
    if (btnSub) btnSub.textContent = "Tap to login & unlock urgent matching"
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
