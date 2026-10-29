"use client"

import { Rating } from "@/components/badges"
import type { Caretaker } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Navigation } from "lucide-react"
import { useState } from "react"

export function MapView({
  caretakers,
  onView,
}: {
  caretakers: Caretaker[]
  onView: (c: Caretaker) => void
}) {
  const [active, setActive] = useState<Caretaker | null>(caretakers[0] ?? null)

  return (
    <div className="relative h-[600px] overflow-hidden rounded-3xl border border-border bg-secondary/40">
      {/* stylized map base */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.9 0.02 210 / 0.6) 1px, transparent 1px), linear-gradient(90deg, oklch(0.9 0.02 210 / 0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* fake roads */}
      <div className="absolute left-0 top-1/3 h-3 w-full -rotate-2 bg-card/70" />
      <div className="absolute left-1/4 top-0 h-full w-3 rotate-3 bg-card/70" />
      <div className="absolute bottom-1/4 left-0 h-2.5 w-full rotate-1 bg-card/60" />
      {/* fake park */}
      <div className="absolute bottom-10 right-12 size-32 rounded-3xl bg-success/15" />
      <div className="absolute left-8 top-10 size-24 rounded-2xl bg-accent/10" />

      {/* user location */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="relative flex size-5">
          <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-primary" />
          <span className="relative inline-flex size-5 rounded-full border-2 border-card bg-primary" />
        </span>
        <span className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded-lg bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
          You
        </span>
      </div>

      {/* caretaker pins */}
      {caretakers.map((c) => (
        <button
          key={c.id}
          onClick={() => setActive(c)}
          style={{ left: `${c.map.x}%`, top: `${c.map.y}%` }}
          className={cn(
            "group absolute -translate-x-1/2 -translate-y-1/2 transition-transform",
            active?.id === c.id ? "z-20 scale-110" : "z-10 hover:scale-110",
          )}
          aria-label={`Show ${c.name}`}
        >
          <span
            className={cn(
              "flex items-center gap-1 rounded-full border-2 border-card px-2 py-1 text-xs font-bold shadow-lg",
              active?.id === c.id ? "bg-primary text-primary-foreground" : "bg-card text-foreground",
            )}
          >
            <img src={c.photo || "/placeholder.svg"} alt="" className="size-5 rounded-full object-cover" />
            ₹{c.price}
          </span>
        </button>
      ))}

      {/* recenter */}
      <button className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-md transition-colors hover:bg-muted">
        <Navigation className="size-4" />
      </button>

      {/* active preview card */}
      {active && (
        <div className="absolute inset-x-4 bottom-4 z-30 flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-2xl animate-fade-up sm:left-4 sm:right-auto sm:w-80">
          <img src={active.photo || "/placeholder.svg"} alt="" className="size-16 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-foreground">{active.name}</p>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
              <Rating rating={active.rating} />
              <span>· {active.distance} km</span>
            </div>
            <p className="mt-0.5 text-xs font-medium text-success">{active.availability}</p>
          </div>
          <button
            onClick={() => onView(active)}
            className="shrink-0 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View
          </button>
        </div>
      )}
    </div>
  )
}
