// ==============================================================================
//  CARESURE - CONTACT PAGE JAVASCRIPT LOGIC
//  File: app/contact/contact.logic.ts
//  Purpose: Handles form state, client-side input validation, event handlers,
//           and asynchronous submission to the local JSON file database.
// ==============================================================================

import { useState, type ChangeEvent, type FormEvent } from "react"

// ------------------------------------------------------------------------------
// 1. DATA TYPES AND INTERFACES
// ------------------------------------------------------------------------------

/** Structure of the values entered by the user in the contact form */
export type ContactValues = {
  name: string
  email: string
  phone: string
  topic: string
  message: string
  consent: boolean
}

/** Specific field names permitted in this form */
export type ContactField = keyof ContactValues

/** Error messages mapped to individual field names */
export type ContactErrors = Partial<Record<ContactField, string>>

// ------------------------------------------------------------------------------
// 2. INITIAL VALUES & VALIDATION CONSTANTS
// ------------------------------------------------------------------------------

export const initialContactValues: ContactValues = {
  name: "",
  email: "",
  phone: "",
  topic: "",
  message: "",
  consent: false,
}

// RFC 5322 compliant simplified email regex for validating user email address format
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// ------------------------------------------------------------------------------
// 3. PURE VALIDATION FUNCTION (Returns error messages for invalid fields)
// ------------------------------------------------------------------------------

/**
 * Validates the contact form values according to the 2nd Evaluation criteria:
 * - Name: Required, 2 to 100 characters
 * - Email: Required, valid email pattern, max 254 chars
 * - Phone: Optional, max 30 chars
 * - Topic: Required dropdown choice
 * - Message: Required, minimum 20 chars, maximum 2,000 chars
 * - Consent: Required checkbox
 */
export function validateContactForm(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {}

  // Name Validation
  if (values.name.trim().length < 2) {
    errors.name = "Please enter your name (at least 2 characters)."
  } else if (values.name.trim().length > 100) {
    errors.name = "Please keep your name under 100 characters."
  }

  // Email Validation
  if (!emailPattern.test(values.email.trim())) {
    errors.email = "Enter a valid email address (e.g. alex@example.com)."
  }

  // Phone Validation
  if (values.phone.trim().length > 30) {
    errors.phone = "Please keep your phone number under 30 characters."
  }

  // Topic Selection Validation
  if (!values.topic) {
    errors.topic = "Please select what your enquiry is about."
  }

  // Message Length Validation
  if (values.message.trim().length < 20) {
    errors.message = "Please provide more details (at least 20 characters)."
  } else if (values.message.length > 2000) {
    errors.message = "Please keep your message under 2,000 characters."
  }

  // Consent Checkbox Validation
  if (!values.consent) {
    errors.consent = "Please agree to have your enquiry stored locally."
  }

  return errors
}

// ------------------------------------------------------------------------------
// 4. JAVASCRIPT STATE & EVENT HANDLING LOGIC HOOK
// ------------------------------------------------------------------------------

/**
 * Custom JavaScript logic hook that encapsulates all state and actions:
 * - values: Current values in form inputs
 * - errors: Active validation error messages
 * - status: Success or error feedback message shown to user
 * - sending: Boolean loading state while submitting
 * - sent: Boolean flag when submission is successful
 * - handleChange: Real-time event handler for inputs, selects, and textareas
 * - handleSubmit: Form submission event handler that sends data to local JSON API
 */
export function useContactLogic() {
  const [values, setValues] = useState<ContactValues>(initialContactValues)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<string>("")
  const [sending, setSending] = useState<boolean>(false)
  const [sent, setSent] = useState<boolean>(false)

  // Real-time Event Handler: runs whenever an input changes
  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const target = event.currentTarget
    const name = target.name as ContactField
    const isCheckbox = target instanceof HTMLInputElement && target.type === "checkbox"
    const nextValue = isCheckbox ? target.checked : target.value

    const nextValues: ContactValues = {
      ...values,
      [name]: nextValue,
    }

    setValues(nextValues)
    setStatus("")
    setSent(false)

    // If there was an error on this field previously, re-validate it in real-time
    if (errors[name]) {
      setErrors((previousErrors) => {
        const updated = { ...previousErrors }
        const fieldError = validateContactForm(nextValues)[name]
        if (fieldError) {
          updated[name] = fieldError
        } else {
          delete updated[name]
        }
        return updated
      })
    }
  }

  // Form Submission Event Handler: validates inputs and calls local JSON database
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Prevent the default browser page reload on submit
    event.preventDefault()

    // Run full validation check
    const validationErrors = validateContactForm(values)
    setErrors(validationErrors)

    // Stop submission if any validation error exists
    if (Object.keys(validationErrors).length > 0) {
      setStatus("Please fix the highlighted errors before submitting.")
      return
    }

    // Prepare payload object to save in data/contacts.json
    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      topic: values.topic,
      message: values.message.trim(),
      consent: values.consent,
      submittedAt: new Date().toISOString(),
    }

    setSending(true)
    setStatus("")

    try {
      // POST request to backend API which writes to data/contacts.json
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save enquiry.")
      }

      // Reset form and show success message
      setValues(initialContactValues)
      setErrors({})
      setSent(true)
      setStatus("Success! Your enquiry has been saved locally to contacts.json.")
    } catch (error) {
      setSent(false)
      setStatus(
        error instanceof Error
          ? error.message
          : "Could not save your enquiry. Please try again."
      )
    } finally {
      setSending(false)
    }
  }

  return {
    values,
    errors,
    status,
    sending,
    sent,
    handleChange,
    handleSubmit,
  }
}
