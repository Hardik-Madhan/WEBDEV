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
      <SiteNavbar />
      <main>
        <p className="bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">Prototype only: profiles and availability are not verified, and no real care or emergency service is provided.</p>
        <Hero />
        <Journeys />
        <HowItWorks />
        <Features />
        <Emergency />
        <Safety />
        <BecomeCta />
      </main>
      <SiteFooter />
    </div>
  )
}
