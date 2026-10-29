"use client"

import { caretakers } from "@/lib/data"
import { AlertTriangle, Loader2, MapPin, Zap } from "lucide-react"
import { useState } from "react"

export function Emergency() {
  const [state, setState] = useState<"idle" | "searching" | "results">("idle")

  const available = caretakers
    .filter((c) => c.availability === "Available Now" || c.availability === "Available Today")
    .slice(0, 3)

  function handleFind() {
    setState("searching")
    setTimeout(() => setState("results"), 1600)
  }

  return (
    <section id="emergency" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-destructive/20 bg-gradient-to-br from-destructive/8 to-destructive/[0.03] p-8 sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-destructive/12 px-3 py-1.5 text-sm font-semibold text-destructive">
              <AlertTriangle className="size-4" /> Urgent Support
            </span>
            <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-foreground">
              Need Care Urgently?
            </h2>
            <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
              Find nearby available caretakers who may be able to respond quickly. This is a prototype
              feature and not a replacement for emergency medical services — call your local emergency
              number for medical emergencies.
            </p>
          </div>
          <button
            onClick={handleFind}
            disabled={state === "searching"}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-destructive px-6 py-4 text-base font-bold text-destructive-foreground shadow-lg shadow-destructive/25 transition-all hover:brightness-110 active:translate-y-px disabled:opacity-70"
          >
            {state === "searching" ? (
              <>
                <Loader2 className="size-5 animate-spin" /> Locating help…
              </>
            ) : (
              <>
                <Zap className="size-5" /> Find Emergency Care
              </>
            )}
          </button>
        </div>

        {state === "results" && (
          <div className="mt-8 grid gap-4 animate-fade-up sm:grid-cols-3">
            {available.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.photo || "/placeholder.svg"} alt="" className="size-14 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-foreground">{c.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" /> {c.distance} km · {c.responseTime.replace("Usually responds in ", "~")}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-success">
                    <span className="size-1.5 rounded-full bg-success" /> Ready to respond
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
