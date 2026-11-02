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

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault()
      if (errorAlert) errorAlert.textContent = ""

      submitBtn.disabled = true
      submitBtn.textContent = "Saving application to JSON…"

      const formData = new FormData(form)

      try {
        const response = await fetch("/api/caretaker", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Please log in before submitting a caretaker application.")
        }

        form.style.display = "none"
        if (successBox) successBox.style.display = "block"
        window.scrollTo({ top: 0, behavior: "smooth" })
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
