// ==============================================================================
//  CARESURE - ABOUT US PAGE (HTML / JSX STRUCTURE & BINDING)
//  File: app/about/page.tsx
//  Architecture:
//    1. CSS Styling: Imported from "./about.css"
//    2. Data Constants: Imported from "./about.data.ts"
//    3. HTML / JSX Structure: Semantic markup below binding CSS + Data together
// ==============================================================================

import Link from "next/link"
import { BadgeCheck, HeartHandshake, MapPin } from "lucide-react"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"

// ------------------------------------------------------------------------------
// IMPORT SEPARATED CSS AND DATA
// ------------------------------------------------------------------------------
import "./about.css"
import { principles } from "./about.data"

export default function AboutPage() {
  return (
    <div className="about-page-container">
      {/* ==================================================================== */}
      {/* 1. HEADER & NAVIGATION BAR (Linked to all other pages)               */}
      {/* ==================================================================== */}
      <SiteNavbar />

      <main>
        {/* ================================================================== */}
        {/* 2. HERO BANNER SECTION                                             */}
        {/* ================================================================== */}
        <section className="about-hero-section">
          <div className="about-hero-container">
            <span className="about-hero-badge">
              <HeartHandshake className="size-4 text-primary" />
              <span>ABOUT CARESURE</span>
            </span>

            <h1 className="about-hero-title">
              Trusted care should be easier to{" "}
              <span className="about-hero-title-highlight">find.</span>
            </h1>

            <p className="about-hero-desc">
              CareSure connects families with nearby caretakers, bringing profiles,
              availability, and care options together in one place.
            </p>

            <div className="about-hero-actions">
              <Link className="about-btn-primary" href="/find">
                Explore caretakers
              </Link>
              <Link className="about-btn-secondary" href="/contact">
                Contact form
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* 3. PURPOSE & MISSION SECTION                                       */}
        {/* ================================================================== */}
        <section className="about-purpose-grid">
          {/* Left Column: Purpose Narrative */}
          <div className="flex flex-col justify-center">
            <p className="about-purpose-label">OUR PURPOSE</p>
            <h2 className="about-purpose-heading">
              Helping families make care decisions with more confidence.
            </h2>
            <p className="about-purpose-text">
              Finding dependable care for a parent, a patient, or a child can take time
              and trust. CareSure brings practical details into view—care types,
              experience, reviews, location, and availability—so families can compare
              options and start a conversation.
            </p>
            <p className="about-purpose-text">
              Caretakers can also share their skills and connect with families looking
              for help in their community. We’re building a more approachable way to find
              and offer care.
            </p>
          </div>

          {/* Right Column: Visual Graphical Badge */}
          <div className="about-visual-box">
            <div className="about-visual-glow" />
            <div className="about-visual-circle-outer">
              <div className="about-visual-circle-inner">
                <HeartHandshake className="size-16" />
              </div>
              <span className="about-visual-badge-top">
                <BadgeCheck className="size-6" />
              </span>
              <span className="about-visual-badge-bottom">
                <MapPin className="size-6" />
              </span>
            </div>
            <p className="about-visual-caption">CARE THAT FEELS CLOSER</p>
          </div>
        </section>

        {/* ================================================================== */}
        {/* 4. GUIDING PRINCIPLES SECTION                                      */}
        {/* ================================================================== */}
        <section className="about-principles-section">
          <div className="about-principles-container">
            <div className="max-w-2xl">
              <p className="about-purpose-label">WHAT GUIDES US</p>
              <h2 className="about-purpose-heading">A thoughtful place to begin.</h2>
            </div>

            {/* Principles Cards Grid: Generated from principles array */}
            <div className="about-principles-grid">
              {principles.map(({ icon: Icon, title, text }) => (
                <article key={title} className="about-principle-card">
                  <span className="about-principle-icon-bubble">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="about-principle-title">{title}</h3>
                  <p className="about-principle-text">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ==================================================================== */}
      {/* 5. FOOTER (Linked to all other pages)                                 */}
      {/* ==================================================================== */}
      <SiteFooter />
    </div>
  )
}
