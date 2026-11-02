"use client"

// ==============================================================================
//  CARESURE - CONTACT PAGE (HTML / JSX STRUCTURE & BINDING)
//  File: app/contact/page.tsx
//  Architecture:
//    1. CSS Styling: Imported from "./contact.css"
//    2. JavaScript Logic: Imported from "./contact.logic.ts" (validation & API)
//    3. HTML / JSX Structure: Semantic markup below binding CSS + JS together
// ==============================================================================

import Link from "next/link"
import { ArrowRight, CheckCircle2, HeartHandshake, Mail, MapPin } from "lucide-react"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"

// ------------------------------------------------------------------------------
// IMPORT SEPARATED CSS AND JAVASCRIPT LOGIC
// ------------------------------------------------------------------------------
import "./contact.css"
import { useContactLogic } from "./contact.logic"

export default function ContactPage() {
  // BIND JAVASCRIPT LOGIC: Access state, validation errors, and event handlers
  const {
    values,
    errors,
    status,
    sending,
    sent,
    handleChange,
    handleSubmit,
  } = useContactLogic()

  return (
    <div className="contact-page-container">
      {/* ==================================================================== */}
      {/* 1. HEADER & NAVIGATION BAR (Linked to all other pages)               */}
      {/* ==================================================================== */}
      <SiteNavbar />

      <main>
        {/* ================================================================== */}
        {/* 2. HERO BANNER SECTION (HTML Structure + contact.css styling)       */}
        {/* ================================================================== */}
        <section className="contact-hero-section">
          <div className="contact-hero-container">
            <span className="contact-hero-badge">
              <HeartHandshake className="size-4 text-primary" />
              <span>HERE TO HELP</span>
            </span>

            <h1 className="contact-hero-title">
              Let’s find the right care,{" "}
              <span className="contact-hero-title-highlight">together.</span>
            </h1>

            <p className="contact-hero-desc">
              Try the contact form below. Enquiries are stored locally on this computer
              in <code>data/contacts.json</code>.
            </p>
          </div>
        </section>

        {/* ================================================================== */}
        {/* 3. MAIN CONTENT: SIDEBAR INFO + CONTACT FORM                        */}
        {/* ================================================================== */}
        <section className="contact-content-grid">
          {/* ---------------------------------------------------------------- */}
          {/* SIDEBAR: Office & Emergency Details                              */}
          {/* ---------------------------------------------------------------- */}
          <aside className="contact-sidebar">
            <div className="contact-info-card">
              <h2 className="contact-info-card-title">Prototype Contact Form</h2>
              <p className="contact-info-card-subtitle">
                Submissions are stored directly in your local <code>data/contacts.json</code> file.
              </p>

              <div className="contact-info-list">
                {/* Email Info */}
                <div className="contact-info-row">
                  <span className="contact-icon-bubble-primary">
                    <Mail className="size-5" />
                  </span>
                  <div>
                    <p className="contact-info-item-label">Email</p>
                    <a className="contact-info-item-link" href="mailto:hello@caresure.in">
                      hello@caresure.in
                    </a>
                  </div>
                </div>

                {/* Location Info */}
                <div className="contact-info-row">
                  <span className="contact-icon-bubble-secondary">
                    <MapPin className="size-5" />
                  </span>
                  <div>
                    <p className="contact-info-item-label">Serving Community</p>
                    <p className="contact-info-item-text">Bengaluru and nearby neighborhoods</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="contact-urgent-box">
              <p className="contact-urgent-title">Need urgent medical help?</p>
              <p className="contact-urgent-desc">
                CareSure is not an emergency dispatch service. Please contact your local
                emergency number or visit the nearest hospital for critical care.
              </p>
            </div>
          </aside>

          {/* ---------------------------------------------------------------- */}
          {/* CONTACT FORM: BOUND TO JAVASCRIPT VALIDATION & SUBMISSION        */}
          {/* ---------------------------------------------------------------- */}
          <form
            className="contact-form-container"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Form Title & Tag */}
            <div className="contact-form-header">
              <div>
                <p className="contact-form-category">CONTACT CARESURE</p>
                <h2 className="contact-form-heading">How can we help?</h2>
              </div>
              <span className="contact-form-badge">Required fields *</span>
            </div>

            {/* Inputs Grid: Name, Email, Phone, Topic */}
            <div className="contact-fields-grid">
              {/* FIELD 1: Full Name */}
              <div className="contact-field-group">
                <label htmlFor="contact-name" className="contact-field-label">
                  Your name *
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  className="contact-input"
                  placeholder="e.g. Alex Morgan"
                  value={values.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="contact-error-message" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* FIELD 2: Email Address */}
              <div className="contact-field-group">
                <label htmlFor="contact-email" className="contact-field-label">
                  Email address *
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  className="contact-input"
                  placeholder="alex@example.com"
                  value={values.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="contact-error-message" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* FIELD 3: Phone Number (Optional) */}
              <div className="contact-field-group">
                <label htmlFor="contact-phone" className="contact-field-label">
                  <span>Phone number</span>
                  <span className="contact-field-optional">Optional</span>
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  className="contact-input"
                  placeholder="+91 98765 43210"
                  value={values.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p className="contact-error-message" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* FIELD 4: Topic Dropdown */}
              <div className="contact-field-group">
                <label htmlFor="contact-topic" className="contact-field-label">
                  What is this about? *
                </label>
                <select
                  id="contact-topic"
                  name="topic"
                  className="contact-input"
                  value={values.topic}
                  onChange={handleChange}
                  required
                  aria-invalid={!!errors.topic}
                >
                  <option value="">Select a topic</option>
                  <option>Finding care</option>
                  <option>Joining as a caretaker</option>
                  <option>Partnership</option>
                  <option>General question</option>
                  <option>Other</option>
                </select>
                {errors.topic && (
                  <p className="contact-error-message" role="alert">
                    {errors.topic}
                  </p>
                )}
              </div>
            </div>

            {/* FIELD 5: Message Textarea */}
            <div className="contact-field-group">
              <label htmlFor="contact-message" className="contact-field-label">
                Your message *
              </label>
              <textarea
                id="contact-message"
                name="message"
                className="contact-textarea"
                placeholder="Tell us what you need help with (at least 20 characters)…"
                value={values.message}
                onChange={handleChange}
                required
                aria-invalid={!!errors.message}
              />
              <div className="contact-char-count-row">
                <span>At least 20 characters</span>
                <span>{values.message.length} / 2000</span>
              </div>
              {errors.message && (
                <p className="contact-error-message" role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            {/* FIELD 6: Consent Checkbox */}
            <div className="contact-checkbox-row">
              <label className="contact-checkbox-label">
                <input
                  name="consent"
                  type="checkbox"
                  className="contact-checkbox-input"
                  checked={values.consent}
                  onChange={handleChange}
                  required
                />
                <span>I understand this enquiry is saved locally in <code>data/contacts.json</code>.</span>
              </label>
              {errors.consent && (
                <p className="contact-error-message" role="alert">
                  {errors.consent}
                </p>
              )}
            </div>

            {/* Status Feedback Banner */}
            {status && (
              <p
                className={sent ? "contact-status-banner-success" : "contact-status-banner-error"}
                role="status"
              >
                {status}
              </p>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="contact-submit-button"
              disabled={sending}
            >
              {sending ? (
                "Saving…"
              ) : sent ? (
                <>
                  <CheckCircle2 className="size-4" />
                  <span>Save another enquiry</span>
                </>
              ) : (
                <>
                  <span>Save enquiry</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>
        </section>
      </main>

      {/* ==================================================================== */}
      {/* 4. FOOTER (Linked to all other pages)                                 */}
      {/* ==================================================================== */}
      <SiteFooter />
    </div>
  )
}
