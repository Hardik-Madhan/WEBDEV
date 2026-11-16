// ==============================================================================
//  CARESURE - AUTHENTICATION JAVASCRIPT LOGIC
//  File: scripts/auth.js
//  JavaScript logic for this page: Handles login and registration form validation,
//  password matching verification, and sends data to data/users.json and data/sessions.json.
// ==============================================================================

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")
  const authError = document.getElementById("auth-error")
  const submitBtn = document.getElementById("auth-submit-btn")

  // 1. Handle Login Submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      if (authError) authError.textContent = ""

      const email = document.getElementById("login-email").value.trim()
      const password = document.getElementById("login-password").value

      if (!email || !password) {
        showError("Please enter both your email address and password.")
        return
      }

      submitBtn.disabled = true
      submitBtn.textContent = "Logging in…"

      try {
        const response = await fetch("/api/account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, action: "login" }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Incorrect email or password.")
        }

        // Redirect to dashboard upon successful login
        window.location.href = "dashboard.html"
      } catch (err) {
        showError(err.message)
      } finally {
        submitBtn.disabled = false
        submitBtn.textContent = "Log in"
      }
    })
  }

  // 2. Handle Sign Up Submission
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      if (authError) authError.textContent = ""

      const name = document.getElementById("signup-name").value.trim()
      const phone = document.getElementById("signup-phone").value.trim()
      const location = document.getElementById("signup-location").value.trim()
      const careNeeds = document.getElementById("signup-care-needs")?.value.trim() || ""
      const email = document.getElementById("signup-email").value.trim()
      const password = document.getElementById("signup-password").value
      const confirmPassword = document.getElementById("signup-confirm-password").value

      // Client-side validations
      if (name.length < 2) {
        showError("Full name must be at least 2 characters.")
        return
      }

      if (phone.length < 7) {
        showError("Please enter a valid phone number.")
        return
      }

      if (password.length < 8) {
        showError("Password must be at least 8 characters long.")
        return
      }

      // Password Confirmation Match Validation
      if (password !== confirmPassword) {
        showError("Passwords do not match. Please verify both password entries.")
        return
      }

      submitBtn.disabled = true
      submitBtn.textContent = "Creating account in users.json…"

      try {
        const response = await fetch("/api/account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            phone,
            location,
            careNeeds,
            email,
            password,
            action: "signup",
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Could not create account.")
        }

        // Redirect to dashboard upon successful registration
        window.location.href = "dashboard.html"
      } catch (err) {
        showError(err.message)
      } finally {
        submitBtn.disabled = false
        submitBtn.textContent = "Create account"
      }
    })
  }

  function showError(msg) {
    if (authError) {
      authError.textContent = msg
      authError.style.display = "block"
    }
  }
})
