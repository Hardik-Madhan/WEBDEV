"use client"

// ==============================================================================
//  CARESURE - BECOME A CARETAKER (HTML / JSX STRUCTURE & BINDING)
//  File: app/caretaker/page.tsx
//  Architecture:
//    1. CSS Styling: Imported from "./caretaker.css"
//    2. JavaScript Logic: Imported from "./caretaker.logic.ts" (auth check & API)
//    3. HTML / JSX Structure: Semantic markup below binding CSS + JS together
// ==============================================================================

import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"

// ------------------------------------------------------------------------------
// IMPORT SEPARATED CSS AND JAVASCRIPT LOGIC
// ------------------------------------------------------------------------------
import "./caretaker.css"
import { useCaretakerLogic } from "./caretaker.logic"

export default function CaretakerPage() {
  // BIND JAVASCRIPT LOGIC: Access session, submission state, and submit handler
  const {
    user,
    loading,
    error,
    busy,
    submitted,
    submitApplication,
  } = useCaretakerLogic()

  return (
    <div className="caretaker-page-container">
      {/* ==================================================================== */}
      {/* 1. HEADER & NAVIGATION BAR                                           */}
      {/* ==================================================================== */}
      <SiteNavbar />

      <main className="caretaker-main-content">
        {/* ================================================================== */}
        {/* 2. HERO TITLE & INTRO                                              */}
        {/* ================================================================== */}
        <p className="caretaker-hero-badge">Join our care community</p>
        <h1 className="caretaker-hero-title">Become a caretaker</h1>
        <p className="caretaker-hero-desc">
          Share your experience, skills, and availability to create an application.
        </p>

        {/* Caregiver Onboarding Notice */}
        <div className="caretaker-warning-box">
          <strong>Caregiver Onboarding:</strong> All submitted caregiver applications undergo identity verification, reference validation, and care coordinator orientation before accepting family bookings.
        </div>

        {/* ================================================================== */}
        {/* 3. CONDITIONAL RENDERING: LOADING / SUCCESS / AUTH PROMPT / FORM   */}
        {/* ================================================================== */}
        {loading ? (
          <p className="mt-8 text-sm text-muted-foreground">Checking authentication…</p>
        ) : submitted ? (
          /* STATE A: Application Successfully Saved to JSON */
          <div className="caretaker-card-box">
            <CheckCircle2 className="size-10 text-emerald-600" />
            <h2 className="caretaker-card-title">Application saved</h2>
            <p className="caretaker-card-text">
              Your application has been received and scheduled for onboarding review. Your profile is visible in the directory, and care requests will appear in your dashboard.
            </p>
            <Link className="caretaker-link-primary" href="/dashboard">
              Go to your dashboard →
            </Link>
          </div>
        ) : !user ? (
          /* STATE B: User Not Logged In */
          <div className="caretaker-card-box">
            <h2 className="caretaker-card-title">Start with an account</h2>
            <p className="caretaker-card-text">
              Please create an account or log in to submit your caretaker application.
            </p>
            <div className="caretaker-auth-actions">
              <Link className="caretaker-btn-signup" href="/signup">
                Sign up
              </Link>
              <Link className="caretaker-btn-login" href="/login">
                Log in
              </Link>
            </div>
          </div>
        ) : (
          /* STATE C: Caretaker Application Form */
          <form onSubmit={submitApplication} className="caretaker-form">
            {/* SECTION 1: Personal Details */}
            <section className="caretaker-form-section">
              <h2 className="caretaker-section-title">1. Personal details</h2>
              <p className="caretaker-section-subtitle">
                How families can identify and contact you.
              </p>

              <div className="caretaker-two-col-grid">
                <label className="caretaker-field-block">
                  Full name *
                  <input
                    name="name"
                    defaultValue={user.name}
                    required
                    minLength={2}
                    maxLength={100}
                    className="caretaker-field-input"
                  />
                </label>

                <label className="caretaker-field-block">
                  Phone number *
                  <input
                    name="phone"
                    type="tel"
                    defaultValue={user.phone}
                    required
                    minLength={7}
                    maxLength={30}
                    className="caretaker-field-input"
                  />
                </label>

                <label className="caretaker-field-block">
                  Area and city *
                  <input
                    name="location"
                    defaultValue={user.location}
                    required
                    maxLength={200}
                    className="caretaker-field-input"
                  />
                </label>

                <label className="caretaker-field-block">
                  Languages spoken *
                  <input
                    name="languages"
                    required
                    maxLength={200}
                    placeholder="English, Hindi, Kannada…"
                    className="caretaker-field-input"
                  />
                </label>
              </div>
            </section>

            {/* SECTION 2: Experience & Skills */}
            <section className="caretaker-form-section">
              <h2 className="caretaker-section-title">2. Experience and skills</h2>
              <div className="caretaker-two-col-grid">
                <label className="caretaker-field-block">
                  Years of experience *
                  <input
                    name="experience"
                    type="number"
                    min="0"
                    max="99"
                    required
                    className="caretaker-field-input"
                  />
                </label>

                <label className="caretaker-field-block">
                  Hourly rate (₹) *
                  <input
                    name="price"
                    type="number"
                    min="1"
                    max="99999"
                    required
                    className="caretaker-field-input"
                  />
                </label>

                <label className="caretaker-field-block">
                  Care types *
                  <input
                    name="careTypes"
                    required
                    maxLength={200}
                    placeholder="Elderly Care, Patient Care…"
                    className="caretaker-field-input"
                  />
                </label>

                <label className="caretaker-field-block">
                  Skills & qualifications *
                  <input
                    name="skills"
                    required
                    maxLength={500}
                    placeholder="First aid, physiotherapy, meal prep…"
                    className="caretaker-field-input"
                  />
                </label>

                <label className="caretaker-field-block">
                  Availability schedule *
                  <input
                    name="availability"
                    required
                    maxLength={200}
                    placeholder="Weekdays, 9 AM – 5 PM"
                    className="caretaker-field-input"
                  />
                </label>
              </div>

              <label className="caretaker-field-block mt-4">
                About your caregiving experience *
                <textarea
                  name="about"
                  rows={4}
                  maxLength={2000}
                  required
                  placeholder="Describe your background, specialty, and how you support patients and families."
                  className="caretaker-field-textarea"
                />
              </label>
            </section>

            {/* SECTION 3: Photos & Identification Upload */}
            <section className="caretaker-form-section">
              <h2 className="caretaker-section-title">3. Photos and identification</h2>
              <p className="caretaker-section-subtitle">
                JPG, PNG, or WebP files up to 5 MB each. Saved to <code>data/uploads/</code>.
              </p>

              <div className="caretaker-two-col-grid">
                <label className="caretaker-field-block">
                  Profile photo *
                  <input
                    name="photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required
                    className="caretaker-field-input"
                  />
                </label>

                <label className="caretaker-field-block">
                  ID document type *
                  <select
                    name="idType"
                    required
                    defaultValue=""
                    className="caretaker-field-input"
                  >
                    <option value="" disabled>Select ID type</option>
                    <option>Government ID</option>
                    <option>Passport</option>
                    <option>Driving licence</option>
                    <option>Other</option>
                  </select>
                </label>

                <label className="caretaker-field-block">
                  Photo of ID *
                  <input
                    name="idPhoto"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required
                    className="caretaker-field-input"
                  />
                </label>
              </div>
            </section>

            {/* Error Message Alert */}
            {error && (
              <p role="alert" className="caretaker-error-alert">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={busy}
                className="caretaker-submit-btn"
              >
                {busy ? "Saving application to local JSON…" : "Submit application"}
              </button>
            </div>
          </form>
        )}
      </main>

      {/* ==================================================================== */}
      {/* 4. FOOTER                                                            */}
      {/* ==================================================================== */}
      <SiteFooter />
    </div>
  )
}
