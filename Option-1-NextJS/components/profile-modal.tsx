"use client"

import { AvailabilityBadge, Rating, VerifiedBadge } from "@/components/badges"
import { Modal } from "@/components/modal"
import type { Caretaker } from "@/lib/data"
import {
  BadgeCheck,
  CalendarCheck,
  Globe,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

const trustPoints = [
  { icon: BadgeCheck, label: "Identity verified" },
  { icon: Sparkles, label: "Experience verified" },
  { icon: ShieldCheck, label: "Reviews verified" },
  { icon: CalendarCheck, label: "Availability confirmed" },
]

const sampleReviews = [
  { name: "Meera N.", rating: 5, text: "Punctual, patient, and genuinely caring. Highly recommend." },
  { name: "Rahul S.", rating: 5, text: "Made my father feel comfortable from day one. Wonderful support." },
]

export function ProfileModal({
  caretaker,
  open,
  onClose,
  onBook,
}: {
  caretaker: Caretaker | null
  open: boolean
  onClose: () => void
  onBook: (c: Caretaker) => void
}) {
  if (!caretaker) return null

  return (
    <Modal open={open} onClose={onClose} label={`${caretaker.name} profile`} className="sm:max-w-2xl">
      <div className="relative h-32 bg-gradient-to-br from-primary to-accent" />
      <div className="px-6 pb-6">
        <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="size-28 shrink-0 overflow-hidden rounded-3xl border-4 border-card bg-muted shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={caretaker.photo || "/placeholder.svg"}
              alt={`Portrait of ${caretaker.name}`}
              className="size-full object-cover"
            />
          </div>
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-foreground">{caretaker.name}</h2>
              {caretaker.verified && <VerifiedBadge />}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <Rating rating={caretaker.rating} reviews={caretaker.reviews} />
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" /> {caretaker.location}
              </span>
            </div>
          </div>
          <AvailabilityBadge availability={caretaker.availability} className="self-start sm:self-auto" />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { k: "Experience", v: `${caretaker.experience} yrs` },
            { k: "Rate", v: `₹${caretaker.price}/hr` },
            { k: "Reviews", v: `${caretaker.reviews}` },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl bg-muted/60 p-3 text-center">
              <p className="text-lg font-bold text-foreground">{s.v}</p>
              <p className="text-xs text-muted-foreground">{s.k}</p>
            </div>
          ))}
        </div>

        <Section title="About">
          <p className="text-sm leading-relaxed text-muted-foreground">{caretaker.about}</p>
        </Section>

        <Section title="Skills">
          <div className="flex flex-wrap gap-2">
            {caretaker.skills.map((s) => (
              <span key={s} className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                {s}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Services">
          <ul className="grid gap-2 sm:grid-cols-2">
            {caretaker.services.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-foreground">
                <BadgeCheck className="size-4 text-primary" /> {s}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Languages">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="size-4" /> {caretaker.languages.join(" · ")}
          </p>
        </Section>

        {caretaker.verified && <Section title="Why this caretaker?">
          <div className="grid gap-2 sm:grid-cols-2">
            {trustPoints.map((t) => (
              <div key={t.label} className="flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2 text-sm font-medium text-foreground">
                <t.icon className="size-4 text-primary" /> {t.label}
              </div>
            ))}
          </div>
        </Section>}

        {caretaker.verified && <Section title="Sample reviews">
          <div className="space-y-3">
            {sampleReviews.map((r) => (
              <div key={r.name} className="rounded-2xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{r.name}</span>
                  <Rating rating={r.rating} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </Section>}
        {!caretaker.verified && <p className="mt-6 text-sm text-muted-foreground">This profile is self-submitted and has not been verified. No reviews yet.</p>}

        <div className="sticky bottom-0 mt-6 flex gap-3 bg-card pt-2">
          <button
            onClick={() => onBook(caretaker)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:translate-y-px"
          >
            Book Now
          </button>
        </div>
      </div>
    </Modal>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">{title}</h3>
      {children}
    </div>
  )
}
