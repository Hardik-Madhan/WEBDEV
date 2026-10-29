import { BecomeCta } from "@/components/landing/become-cta"
import { Emergency } from "@/components/landing/emergency"
import { Features } from "@/components/landing/features"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Journeys } from "@/components/landing/journeys"
import { Safety } from "@/components/landing/safety"
import { Stats } from "@/components/landing/stats"
import { Testimonials } from "@/components/landing/testimonials"
import { SiteFooter } from "@/components/site-footer"
import { SiteNavbar } from "@/components/site-navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <main>
        <Hero />
        <Stats />
        <Journeys />
        <HowItWorks />
        <Features />
        <Emergency />
        <Safety />
        <Testimonials />
        <BecomeCta />
      </main>
      <SiteFooter />
    </div>
  )
}
