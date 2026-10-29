"use client"

import { careTypes } from "@/lib/data"
import { cn } from "@/lib/utils"
import { RotateCcw } from "lucide-react"

export type Filters = {
  maxDistance: number
  minRating: number
  minExperience: number
  maxPrice: number
  availableOnly: boolean
  careType: string
}

export const defaultFilters: Filters = {
  maxDistance: 10,
  minRating: 0,
  minExperience: 0,
  maxPrice: 500,
  availableOnly: false,
  careType: "All",
}

export function FilterPanel({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (f: Filters) => void
}) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Filters</h3>
        <button
          onClick={() => onChange(defaultFilters)}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <RotateCcw className="size-3.5" /> Reset
        </button>
      </div>

      <Group label="Care Type">
        <div className="flex flex-wrap gap-2">
          {["All", ...careTypes].map((t) => (
            <button
              key={t}
              onClick={() => set("careType", t)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                filters.careType === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </Group>

      <Group label={`Distance · within ${filters.maxDistance} km`}>
        <input
          type="range"
          min={1}
          max={10}
          value={filters.maxDistance}
          onChange={(e) => set("maxDistance", Number(e.target.value))}
          className="w-full accent-primary"
        />
      </Group>

      <Group label="Minimum Rating">
        <div className="flex gap-2">
          {[0, 4, 4.5, 4.8].map((r) => (
            <button
              key={r}
              onClick={() => set("minRating", r)}
              className={cn(
                "flex-1 rounded-xl border px-2 py-2 text-sm font-semibold transition-colors",
                filters.minRating === r
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40",
              )}
            >
              {r === 0 ? "Any" : `${r}+`}
            </button>
          ))}
        </div>
      </Group>

      <Group label={`Experience · ${filters.minExperience}+ years`}>
        <input
          type="range"
          min={0}
          max={15}
          value={filters.minExperience}
          onChange={(e) => set("minExperience", Number(e.target.value))}
          className="w-full accent-primary"
        />
      </Group>

      <Group label={`Max Price · ₹${filters.maxPrice}/hr`}>
        <input
          type="range"
          min={200}
          max={500}
          step={10}
          value={filters.maxPrice}
          onChange={(e) => set("maxPrice", Number(e.target.value))}
          className="w-full accent-primary"
        />
      </Group>

      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-3">
        <span className="text-sm font-semibold text-foreground">Available today only</span>
        <button
          type="button"
          role="switch"
          aria-checked={filters.availableOnly}
          onClick={() => set("availableOnly", !filters.availableOnly)}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors",
            filters.availableOnly ? "bg-success" : "bg-muted",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 size-5 rounded-full bg-card shadow transition-all",
              filters.availableOnly ? "left-[22px]" : "left-0.5",
            )}
          />
        </button>
      </label>
    </div>
  )
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-sm font-bold text-foreground">{label}</p>
      {children}
    </div>
  )
}
