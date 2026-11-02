// ==============================================================================
//  CARESURE - FIND CARETAKER JAVASCRIPT LOGIC
//  File: app/find/find.logic.ts
//  Purpose: Handles search queries, multi-criteria filtering, distance calculation,
//           list/map view toggling, bookmarking, and modal dialog state.
// ==============================================================================

import { useState, useEffect, useMemo } from "react"
import { caretakers, careTypes, type Caretaker } from "@/lib/data"
import { defaultFilters, type Filters } from "@/components/filter-panel"

/**
 * Custom JavaScript logic hook for the Caretaker Directory page:
 * - filters: Current criteria (distance, minRating, minExperience, maxPrice, careType)
 * - view: "list" (grid view) or "map" (interactive pin canvas view)
 * - query: Search bar values (care type, location, date, time)
 * - results: Real-time filtered list of caretakers matching user inputs
 * - toggleSaved: Handler that sends bookmark updates to /api/saved
 */
export function useFindLogic() {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [view, setView] = useState<"list" | "map">("list")
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false)
  const [profile, setProfile] = useState<Caretaker | null>(null)
  const [booking, setBooking] = useState<Caretaker | null>(null)
  const [registered, setRegistered] = useState<Caretaker[]>([])
  const [saved, setSaved] = useState<string[]>([])
  const [saveError, setSaveError] = useState<string>("")
  const [query, setQuery] = useState({
    care: "Elderly Care",
    location: "Koramangala, Bengaluru",
  })

  // Fetch newly submitted local caretaker profiles from data/caretaker-applications.json
  useEffect(() => {
    fetch("/api/caretaker")
      .then((r) => r.json())
      .then((d) => setRegistered(d.caretakers || []))
      .catch(() => {})
  }, [])

  // Fetch the current user's saved shortlist of caretakers
  useEffect(() => {
    fetch("/api/account")
      .then((r) => r.json())
      .then((d) => setSaved(d.user?.saved || []))
      .catch(() => {})
  }, [])

  // Handle URL query parameters if navigated from homepage (e.g. /find?care=Child+Care)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const care = params.get("care")
    const location = params.get("location")

    if (care && (careTypes as readonly string[]).includes(care)) {
      setQuery((q) => ({ ...q, care, location: location || q.location }))
      setFilters((f) => ({ ...f, careType: care }))
    }
  }, [])

  // Interactive Save / Bookmark handler: updates data/users.json
  async function toggleSaved(c: Caretaker) {
    try {
      const response = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setSaved(data.user.saved)
      setSaveError("")
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Could not save caretaker.")
    }
  }

  // JAVASCRIPT EVENT HANDLING & REACTIVE FILTER ALGORITHM:
  // Dynamically filters both static catalog and local registered profiles
  const results = useMemo(() => {
    return [...caretakers, ...registered]
      .filter((c) => c.distance <= filters.maxDistance)
      .filter((c) => c.rating >= filters.minRating)
      .filter((c) => c.experience >= filters.minExperience)
      .filter((c) => c.price <= filters.maxPrice)
      .filter((c) =>
        filters.availableOnly
          ? c.availability === "Available Now" || c.availability === "Available Today"
          : true
      )
      .filter((c) =>
        filters.careType === "All"
          ? true
          : c.careTypes.some(
              (t) => t.toLowerCase() === filters.careType.toLowerCase()
            )
      )
      .sort((a, b) => a.distance - b.distance)
  }, [filters, registered])

  function openBooking(c: Caretaker) {
    setProfile(null)
    setBooking(c)
  }

  return {
    filters,
    setFilters,
    view,
    setView,
    filtersOpen,
    setFiltersOpen,
    profile,
    setProfile,
    booking,
    setBooking,
    saved,
    saveError,
    query,
    setQuery,
    results,
    toggleSaved,
    openBooking,
  }
}
