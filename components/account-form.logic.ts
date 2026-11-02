// ==============================================================================
//  CARESURE - ACCOUNT AUTHENTICATION JAVASCRIPT LOGIC
//  File: components/account-form.logic.ts
//  Purpose: Handles Login and Sign Up state, client-side password validation,
//           and asynchronous submission to data/users.json and data/sessions.json.
// ==============================================================================

import { useState, useEffect, type FormEvent } from "react"

export type AccountMode = "login" | "signup"

/**
 * Custom JavaScript logic hook for authentication:
 * - mode: "login" or "signup"
 * - error: Any validation or server error message
 * - busy: Boolean loading state while submitting
 * - ready: Flag when component is mounted
 * - handleAuthSubmit: Form submission handler validating passwords and updating local JSON files
 */
export function useAccountLogic(mode: AccountMode) {
  const [error, setError] = useState<string>("")
  const [busy, setBusy] = useState<boolean>(false)
  const [ready, setReady] = useState<boolean>(false)

  // Ensure button states match client mount
  useEffect(() => {
    setReady(true)
  }, [])

  // Form submission handler: validates fields and calls /api/account
  async function handleAuthSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setBusy(true)

    const form = new FormData(e.currentTarget)

    // Client-side validation: ensure passwords match when signing up
    if (mode === "signup" && form.get("password") !== form.get("confirmPassword")) {
      setError("Passwords do not match. Please verify both entries.")
      setBusy(false)
      return
    }

    try {
      // POST request to backend API which:
      // - If mode='signup': writes new user with hashed password to data/users.json
      // - If mode='login': verifies credentials and creates session in data/sessions.json
      const response = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(form),
          action: mode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed.")
      }

      // Redirect user to the dashboard upon successful account creation or login
      window.location.assign("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.")
      setBusy(false)
    }
  }

  return {
    error,
    busy,
    ready,
    handleAuthSubmit,
  }
}
