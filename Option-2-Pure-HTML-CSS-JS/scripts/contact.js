// ==============================================================================
//  CARESURE - CONTACT US JAVASCRIPT LOGIC
//  File: scripts/contact.js
//  JavaScript logic for this page: Handles form input validation, character count,
//  and submits the enquiry to /api/contact which saves it directly in data/contacts.json.
// ==============================================================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form")
  const nameInput = document.getElementById("contact-name")
  const emailInput = document.getElementById("contact-email")
  const phoneInput = document.getElementById("contact-phone")
  const topicSelect = document.getElementById("contact-topic")
  const messageInput = document.getElementById("contact-message")
  const consentCheckbox = document.getElementById("contact-consent")
  const charCounter = document.getElementById("char-counter")
  const statusBanner = document.getElementById("status-banner")
  const submitBtn = document.getElementById("submit-btn")

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

  // Live Character Counter for the message textarea
  if (messageInput && charCounter) {
    messageInput.addEventListener("input", () => {
      const currentLength = messageInput.value.length
      charCounter.textContent = `${currentLength} / 2000`
    })
  }

  // Clear specific error messages in real-time as the user types
  ;[nameInput, emailInput, phoneInput, topicSelect, messageInput, consentCheckbox].forEach((field) => {
    if (!field) return
    field.addEventListener("input", () => {
      const errorElem = document.getElementById(`${field.id}-error`)
      if (errorElem) errorElem.textContent = ""
      if (statusBanner) statusBanner.style.display = "none"
    })
  })

  // Form Submission Event Listener
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Reset error messages
      clearAllErrors()

      let hasErrors = false

      // 1. Name Validation (at least 2 characters)
      const nameVal = nameInput.value.trim()
      if (nameVal.length < 2) {
        showError("contact-name-error", "Please enter your name (at least 2 characters).")
        hasErrors = true
      } else if (nameVal.length > 100) {
        showError("contact-name-error", "Name must be under 100 characters.")
        hasErrors = true
      }

      // 2. Email Validation (regex match)
      const emailVal = emailInput.value.trim()
      if (!emailPattern.test(emailVal)) {
        showError("contact-email-error", "Enter a valid email address (e.g. alex@example.com).")
        hasErrors = true
      }

      // 3. Phone Validation (optional, max 30 chars)
      const phoneVal = phoneInput.value.trim()
      if (phoneVal.length > 30) {
        showError("contact-phone-error", "Phone number must be under 30 characters.")
        hasErrors = true
      }

      // 4. Topic Dropdown Validation
      if (!topicSelect.value) {
        showError("contact-topic-error", "Please select what your enquiry is about.")
        hasErrors = true
      }

      // 5. Message Validation (minimum 20 characters)
      const messageVal = messageInput.value.trim()
      if (messageVal.length < 20) {
        showError("contact-message-error", "Please provide more details (at least 20 characters).")
        hasErrors = true
      } else if (messageVal.length > 2000) {
        showError("contact-message-error", "Message must be under 2,000 characters.")
        hasErrors = true
      }

      // 6. Consent Checkbox Validation
      if (!consentCheckbox.checked) {
        showError("contact-consent-error", "Please agree to have your enquiry stored locally in contacts.json.")
        hasErrors = true
      }

      if (hasErrors) {
        showStatus("Please fix the highlighted errors before submitting.", "error")
        return
      }

      // Prepare payload to save in data/contacts.json
      const payload = {
        name: nameVal,
        email: emailVal,
        phone: phoneVal,
        topic: topicSelect.value,
        message: messageVal,
        consent: consentCheckbox.checked,
        submittedAt: new Date().toISOString(),
      }

      submitBtn.disabled = true
      submitBtn.textContent = "Saving enquiry to JSON…"

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to save enquiry.")
        }

        // Reset form inputs upon successful save
        form.reset()
        if (charCounter) charCounter.textContent = "0 / 2000"
        showStatus("Success! Your enquiry has been saved locally into data/contacts.json.", "success")
        submitBtn.textContent = "Save another enquiry"
      } catch (err) {
        showStatus(err.message || "An error occurred while saving. Please try again.", "error")
        submitBtn.textContent = "Save enquiry"
      } finally {
        submitBtn.disabled = false
      }
    })
  }

  function showError(elementId, message) {
    const el = document.getElementById(elementId)
    if (el) el.textContent = message
  }

  function clearAllErrors() {
    document.querySelectorAll(".contact-error-message").forEach((el) => {
      el.textContent = ""
    })
  }

  function showStatus(message, type) {
    if (!statusBanner) return
    statusBanner.textContent = message
    statusBanner.style.display = "block"
    if (type === "success") {
      statusBanner.className = "contact-status-banner-success"
    } else {
      statusBanner.className = "contact-status-banner-error"
    }
  }
})
