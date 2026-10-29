"use client"

import { AvailabilityBadge, Rating, VerifiedBadge } from "@/components/badges"
import type { Caretaker } from "@/lib/data"
import { Briefcase, MapPin } from "lucide-react"

type Props = {
  caretaker: Caretaker
  onView?: (c: Caretaker) => void
  onBook?: (c: Caretaker) => void
}

export function CaretakerCard({ caretaker, onView, onBook }: Props) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
      <div className="flex gap-4 p-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={caretaker.photo || "/placeholder.svg"}
            alt={`Portrait of ${caretaker.name}`}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-lg font-bold text-foreground">{caretaker.name}</h3>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <Rating rating={caretaker.rating} reviews={caretaker.reviews} />
            {caretaker.verified && <VerifiedBadge />}
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Briefcase className="size-3.5" />
            {caretaker.experience} years experience
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            {caretaker.location} · {caretaker.distance} km away
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 px-4">
        {caretaker.careTypes.map((t) => (
          <span
            key={t}
            className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 p-4">
        <div>
          <AvailabilityBadge availability={caretaker.availability} />
          <p className="mt-2 text-sm">
            <span className="text-xl font-bold text-foreground">₹{caretaker.price}</span>
            <span className="text-muted-foreground">/hour</span>
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => onView?.(caretaker)}
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            View Profile
          </button>
          <button
            onClick={() => onBook?.(caretaker)}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:translate-y-px"
          >
            Book Now
          </button>
        </div>
      </div>
    </article>
  )
}
