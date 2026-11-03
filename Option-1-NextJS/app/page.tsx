// ==============================================================================
//  CARESURE - HOMEPAGE (HTML / JSX STRUCTURE)
//  Code for this page: Assembles the main landing experience by binding together
//  our navigation, hero showcase, interactive journeys, trust features, and footer.
// ==============================================================================

import { BecomeCta } from "@/components/landing/become-cta"
import { Emergency } from "@/components/landing/emergency"
import { Features } from "@/components/landing/features"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Journeys } from "@/components/landing/journeys"
import { Safety } from "@/components/landing/safety"
import { SiteFooter } from "@/components/site-footer"
import { SiteNavbar } from "@/components/site-navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation bar: connects all pages and shows login / dashboard status */}
      <SiteNavbar />

      <main>
        {/* Verified Family Care Banner */}
        <p className="bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-900 border-b border-emerald-200">
          Verified Care Network: Over 500+ trusted background-verified caregivers ready to support your family across Bengaluru.
        </p>

        {/* Hero section: first impression with quick care-type search and direct action buttons */}
        <Hero />

        {/* Care Journeys: helps families quickly find care based on specific situations (elderly, post-surgery, childcare) */}
        <Journeys />

        {/* 4-step workflow: walks users through how easy it is to find, compare, and book care */}
        <HowItWorks />

        {/* Core platform highlights: trust indicators, transparent pricing, and local caregiver network */}
        <Features />

        {/* Emergency disclaimer banner: directs urgent medical needs to hospital and emergency helplines */}
        <Emergency />

        {/* Safety and verification guidelines: transparently highlights safety protocols and vetting */}
        <Safety />

        {/* Call-to-action banner: invites experienced caregivers to apply and list their profile */}
        <BecomeCta />
      </main>

      {/* Global footer: multi-column links tying platform, company, and account pages together */}
      <SiteFooter />
    </div>
  )
}
