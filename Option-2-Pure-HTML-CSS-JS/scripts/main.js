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

  // 2. Active User Authentication Check: Calls GET /api/account
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
    }
  } catch (err) {
    // Session check fails gracefully if offline or logged out
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
