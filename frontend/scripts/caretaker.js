// ==============================================================================
//  CARESURE - BECOME A CARETAKER JAVASCRIPT LOGIC
//  File: scripts/caretaker.js
//  JavaScript logic for this page: Checks session and submits the application form
//  to /api/caretaker, saving applicant details directly into data/caretaker-applications.json.
// ==============================================================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("caretaker-form")
  const submitBtn = document.getElementById("caretaker-submit-btn")
  const errorAlert = document.getElementById("caretaker-error-alert")
  const successBox = document.getElementById("caretaker-success-box")
  const appModal = document.getElementById("caretaker-app-modal")
  const modalAppId = document.getElementById("modal-app-id")
  const closeBtn = document.getElementById("close-caretaker-modal-btn")
  const closeX = document.getElementById("close-caretaker-modal-x")

  function closeModal() {
    if (appModal) appModal.style.display = "none"
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal)
  if (closeX) closeX.addEventListener("click", closeModal)
  if (appModal) {
    appModal.addEventListener("click", (e) => {
      if (e.target === appModal) closeModal()
    })
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault()
      if (errorAlert) errorAlert.textContent = ""

      submitBtn.disabled = true
      submitBtn.textContent = "Saving application…"

      const application = Object.fromEntries(new FormData(form).entries())

      try {
        const response = await fetch("/api/caretaker", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(application),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Could not submit application. Please check all fields.")
        }

        // Show Success Confirmation on Page
        form.style.display = "none"
        if (successBox) successBox.style.display = "block"
        window.scrollTo({ top: 0, behavior: "smooth" })

        // Open Friendly Success Modal
        if (modalAppId && data.id) {
          modalAppId.textContent = `#CS-APP-${String(data.id).slice(0, 8).toUpperCase()}`
        }
        if (appModal) {
          appModal.style.display = "flex"
        }
      } catch (err) {
        if (errorAlert) {
          errorAlert.textContent = err.message
          errorAlert.style.display = "block"
        }
      } finally {
        submitBtn.disabled = false
        submitBtn.textContent = "Submit Application"
      }
    })
  }
})
