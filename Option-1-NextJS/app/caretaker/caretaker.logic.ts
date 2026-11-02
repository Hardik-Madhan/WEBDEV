// ==============================================================================
//  CARESURE - BECOME A CARETAKER JAVASCRIPT LOGIC
//  File: app/caretaker/caretaker.logic.ts
//  Purpose: Handles caretaker application state, user session check,
//           multipart/form-data upload handling, and local JSON database saving.
// ==============================================================================

import { useState, useEffect, type FormEvent } from "react"

export type CaretakerUser = {
  name: string
  phone: string
  location: string
}

/**
 * Custom JavaScript logic hook for the Caretaker Application form:
 * - user: Active user profile (must be logged in to apply)
 * - loading: Boolean check while verifying user authentication
 * - error: Feedback message if submission fails
 * - busy: Boolean loading flag while sending multipart form
 * - submitted: Flag indicating successful storage in caretaker-applications.json
 * - submitApplication: Form submission handler sending data & files to /api/caretaker
 */
export function useCaretakerLogic() {
  const [user, setUser] = useState<CaretakerUser | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [busy, setBusy] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)

  // On page load, verify if the user has an active login session
  useEffect(() => {
    fetch("/api/account")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {
        setError("Unable to load your account. Please refresh.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Form submission handler: sends text fields and uploaded photo files as multipart FormData
  async function submitApplication(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setBusy(true)

    try {
      const formData = new FormData(e.currentTarget)

      // POST request to backend API which writes to data/caretaker-applications.json
      // and saves photo images into data/uploads/<application-id>/
      const response = await fetch("/api/caretaker", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Unable to submit caretaker application.")
      }

      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit.")
    } finally {
      setBusy(false)
    }
  }

  return {
    user,
    loading,
    error,
    busy,
    submitted,
    submitApplication,
  }
}
