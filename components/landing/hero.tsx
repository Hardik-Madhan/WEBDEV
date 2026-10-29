"use client"

import { careTypes } from "@/lib/data"
import { cn } from "@/lib/utils"
import { BadgeCheck, LocateFixed, MapPin, Search, Star } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function Hero() {
  const [careType, setCareType] = useState<string>("Elderly Care")
  const [location, setLocation] = useState("")

  return (
    <section id="home" className="relative overflow-hidden">
      {/* soft background wash */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-secondary/40 via-background to-background" />
      <div className="pointer-events-none absolute -left-32 -top-32 -z-10 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 -z-10 size-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-24 lg:pt-20 lg:px-8">
        <div>
          <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
            <span className="flex size-2 rounded-full bg-success" />
            Trusted by 10,000+ families
          </span>

          <h1
            className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground animate-fade-up sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            Trusted Care,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Right When You Need It.
            </span>
          </h1>

          <p
            className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground animate-fade-up"
            style={{ animationDelay: "160ms" }}
          >
            Find reliable caretakers near you, compare their profiles, and book the right support for
            yourself or your loved ones.
          </p>

          <div
            className="mt-6 flex flex-wrap gap-3 animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/find"
              className="rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/35 active:translate-y-px"
            >
              Find a Caretaker
            </Link>
            <Link
              href="/#become"
              className="rounded-2xl border border-border bg-card px-6 py-3.5 text-base font-semibold text-foreground transition-all hover:bg-muted active:translate-y-px"
            >
              Become a Caretaker
            </Link>
          </div>

          {/* Search interface */}
          <div
            className="mt-8 rounded-3xl border border-border bg-card p-4 shadow-xl shadow-primary/5 animate-fade-up sm:p-5"
            style={{ animationDelay: "320ms" }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  What care do you need?
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={careType}
                    onChange={(e) => setCareType(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-border bg-background py-3 pl-9 pr-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                  >
                    {careTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Where?
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your area or city"
                    className="w-full rounded-xl border border-border bg-background py-3 pl-9 pr-24 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
                  />
                  <button
                    onClick={() => setLocation("Koramangala, Bengaluru")}
                    className="absolute right-1.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/70"
                  >
                    <LocateFixed className="size-3.5" /> Use my location
                  </button>
                </div>
              </div>
            </div>
            <Link
              href="/find"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:translate-y-px"
            >
              <Search className="size-4" /> Search Nearby Caretakers
            </Link>
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-primary/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-care.png"
              alt="A caregiver warmly assisting a smiling elderly woman in a bright, comfortable home"
              className="aspect-[4/5] size-full object-cover sm:aspect-square lg:aspect-[4/5]"
            />
          </div>

          <FloatingCard
            className="left-2 top-6 sm:-left-4"
            delay="0s"
            icon={<BadgeCheck className="size-4 text-primary" />}
            title="Verified Caretaker"
            subtitle="Identity confirmed"
          />
          <FloatingCard
            className="right-2 top-24 sm:-right-4"
            delay="1.2s"
            icon={<Star className="size-4 fill-chart-4 text-chart-4" />}
            title="4.9 Rating"
            subtitle="126 reviews"
          />
          <FloatingCard
            className="bottom-24 left-2 sm:-left-6"
            delay="0.6s"
            icon={<MapPin className="size-4 text-accent" />}
            title="1.2 km Away"
            subtitle="Nearby & ready"
          />
          <FloatingCard
            className="bottom-6 right-2 sm:-right-4"
            delay="1.8s"
            icon={<span className="flex size-2.5 rounded-full bg-success" />}
            title="Available Now"
            subtitle="Responds in 10 min"
          />
        </div>
      </div>
    </section>
  )
}

function FloatingCard({
  className,
  icon,
  title,
  subtitle,
  delay,
}: {
  className?: string
  icon: React.ReactNode
  title: string
  subtitle: string
  delay: string
}) {
  return (
    <div
      className={cn(
        "absolute flex animate-float items-center gap-2.5 rounded-2xl border border-border bg-card/95 px-3.5 py-2.5 shadow-lg backdrop-blur",
        className,
      )}
      style={{ animationDelay: delay }}
    >
      <span className="flex size-8 items-center justify-center rounded-xl bg-muted">{icon}</span>
      <div className="leading-tight">
        <p className="text-sm font-bold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}
