"use client"

// ==============================================================================
//  CARESURE - ACCOUNT AUTHENTICATION (HTML / JSX STRUCTURE & BINDING)
//  File: components/account-form.tsx
//  Architecture:
//    1. CSS Styling: Imported from "./account-form.css"
//    2. JavaScript Logic: Imported from "./account-form.logic.ts" (validation & API)
//    3. HTML / JSX Structure: Semantic markup below binding CSS + JS together
// ==============================================================================

import Link from "next/link"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"

// ------------------------------------------------------------------------------
// IMPORT SEPARATED CSS AND JAVASCRIPT LOGIC
// ------------------------------------------------------------------------------
import "./account-form.css"
import { useAccountLogic, type AccountMode } from "./account-form.logic"

export const inputClass = "auth-input"

export function AccountForm({ mode }: { mode: AccountMode }) {
  // BIND JAVASCRIPT LOGIC: Access state and form submission handler
  const { error, busy, ready, handleAuthSubmit } = useAccountLogic(mode)

  return (
    <div className="auth-page-container">
      {/* ==================================================================== */}
      {/* 1. HEADER & NAVIGATION BAR                                           */}
      {/* ==================================================================== */}
      <SiteNavbar />

      <main className="auth-main-wrapper">
        <div className="auth-card-box">
          {/* Tag & Heading */}
          <p className="auth-category-tag">CARE SURE ACCOUNT</p>
          <h1 className="auth-card-title">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="auth-card-desc">
            {mode === "login"
              ? "Log in to manage your care requests and profile."
              : "Tell us about yourself so your care requests include the right details."}
          </p>

          <p className="auth-warning-banner">
            Prototype: information is stored locally in <code>data/users.json</code> on this computer.
          </p>

          {/* ================================================================ */}
          {/* 2. AUTHENTICATION FORM: BOUND TO JAVASCRIPT LOGIC                */}
          {/* ================================================================ */}
          <form method="post" onSubmit={handleAuthSubmit} className="auth-form">
            {/* SIGNUP EXTRA FIELDS */}
            {mode === "signup" && (
              <>
                <Field
                  label="Full name"
                  name="name"
                  required
                  autoComplete="name"
                  minLength={2}
                  maxLength={100}
                />
                <Field
                  label="Phone number"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  minLength={7}
                  maxLength={30}
                />
                <Field
                  label="Area and city"
                  name="location"
                  required
                  autoComplete="address-level2"
                  maxLength={200}
                />
                <label className="auth-field-label">
                  <span>Care needs </span>
                  <span className="auth-field-optional">(optional)</span>
                  <textarea
                    className="auth-textarea"
                    name="careNeeds"
                    rows={3}
                    maxLength={1000}
                    placeholder="What kind of support are you looking for?"
                  />
                </label>
              </>
            )}

            {/* COMMON FIELDS: EMAIL & PASSWORD */}
            <Field
              label="Email"
              name="email"
              type="email"
              required
              autoComplete="email"
              maxLength={254}
            />

            <Field
              label="Password"
              name="password"
              type="password"
              required
              minLength={8}
              maxLength={128}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />

            {/* CONFIRM PASSWORD (SIGNUP ONLY) */}
            {mode === "signup" && (
              <Field
                label="Confirm password"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
              />
            )}

            {/* Error Message Alert */}
            {error && (
              <p role="alert" className="auth-error-alert">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={busy || !ready}
              className="auth-submit-btn"
            >
              {!ready || busy
                ? "Please wait…"
                : mode === "login"
                ? "Log in"
                : "Create account"}
            </button>
          </form>

          {/* Toggle between Login and Signup */}
          <p className="auth-footer-text">
            {mode === "login" ? "New to CareSure? " : "Already have an account? "}
            <Link
              className="auth-footer-link"
              href={mode === "login" ? "/signup" : "/login"}
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </Link>
          </p>
        </div>
      </main>

      {/* ==================================================================== */}
      {/* 3. FOOTER                                                            */}
      {/* ==================================================================== */}
      <SiteFooter />
    </div>
  )
}

/**
 * Reusable HTML Form Input Field Component
 */
export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="auth-field-label">
      {label}
      <input className="auth-input" {...props} />
    </label>
  )
}
