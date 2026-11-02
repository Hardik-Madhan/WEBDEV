"use client"

// ==============================================================================
//  CARESURE - FIND CARETAKER DIRECTORY (HTML / JSX STRUCTURE & BINDING)
//  File: app/find/page.tsx
//  Architecture:
//    1. JavaScript Logic: Imported from "./find.logic.ts" (filtering, state, API)
//    2. Components: FilterPanel, MapView, CaretakerCard, BookingModal
//    3. HTML / JSX Structure: Semantic layout below binding controls & views
// ==============================================================================

import { BookingModal } from "@/components/booking-modal"
import { CaretakerCard } from "@/components/caretaker-card"
import { defaultFilters, FilterPanel } from "@/components/filter-panel"
import { MapView } from "@/components/map-view"
import { Modal } from "@/components/modal"
import { ProfileModal } from "@/components/profile-modal"
import { SiteFooter } from "@/components/site-footer"
import { SiteNavbar } from "@/components/site-navbar"
import { careTypes } from "@/lib/data"
import { cn } from "@/lib/utils"
import { CalendarDays, Clock, List, MapIcon, MapPin, Search, SlidersHorizontal } from "lucide-react"

// ------------------------------------------------------------------------------
// IMPORT SEPARATED JAVASCRIPT LOGIC
// ------------------------------------------------------------------------------
import { useFindLogic } from "./find.logic"

export default function FindPage() {
  // BIND JAVASCRIPT LOGIC: Access filter state, view toggling, and search results
  const {
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
  } = useFindLogic()

  return (
    <div className="min-h-screen bg-background">
      {/* ==================================================================== */}
      {/* 1. HEADER & NAVIGATION BAR                                           */}
      {/* ==================================================================== */}
      <SiteNavbar />

      {/* ==================================================================== */}
      {/* 2. SEARCH HEADER (Care Type, Location, Date, Time inputs)            */}
      {/* ==================================================================== */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Find a trusted caretaker near you
          </h1>
          <p className="mt-1 text-muted-foreground">
            {results.length} matching profiles · {query.location}
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            Directory includes sample profiles and locally submitted caretaker applications.
          </p>

          {saveError && (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {saveError} <a href="/login" className="underline">Log in</a>
            </p>
          )}

          {/* Interactive Search Bar Controls */}
          <div className="mt-5 grid gap-3 rounded-2xl border border-border bg-background p-3 lg:grid-cols-[1.2fr_1.4fr_1fr_1fr_auto]">
            {/* Input 1: Care Type Select */}
            <Field icon={Search} label="Care Type">
              <select
                value={query.care}
                onChange={(e) => setQuery((q) => ({ ...q, care: e.target.value }))}
                className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
              >
                {careTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>

            {/* Input 2: Location Input */}
            <Field icon={MapPin} label="Location">
              <input
                value={query.location}
                onChange={(e) => setQuery((q) => ({ ...q, location: e.target.value }))}
                className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
              />
            </Field>

            {/* Input 3: Date Picker */}
            <Field icon={CalendarDays} label="Date">
              <input
                type="date"
                className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
              />
            </Field>

            {/* Input 4: Time Picker */}
            <Field icon={Clock} label="Time">
              <input
                type="time"
                defaultValue="10:00"
                className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
              />
            </Field>

            {/* Search Action Button */}
            <button
              onClick={() => setFilters((f) => ({ ...f, careType: query.care }))}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:translate-y-px"
            >
              <Search className="size-4" /> Search
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. CONTROLS BAR: Mobile Filter Trigger & View Toggles (List vs Map)  */}
      {/* ==================================================================== */}
      <div className="sticky top-15 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted lg:hidden"
          >
            <SlidersHorizontal className="size-4" /> Filters
          </button>

          {/* Result Count Indicator */}
          <p className="hidden text-sm text-muted-foreground lg:block">
            Showing <span className="font-semibold text-foreground">{results.length}</span> caretakers
          </p>

          {/* Interactive Toggle: Switch between List Grid View and Map View */}
          <div className="inline-flex rounded-xl border border-border bg-card p-1">
            <ToggleBtn
              active={view === "list"}
              onClick={() => setView("list")}
              icon={List}
              label="List View"
            />
            <ToggleBtn
              active={view === "map"}
              onClick={() => setView("map")}
              icon={MapIcon}
              label="Map View"
            />
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. MAIN BODY: FILTER SIDEBAR + DYNAMIC RESULTS                       */}
      {/* ==================================================================== */}
      <div className="mx-auto max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[280px_1fr] lg:px-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-40 rounded-3xl border border-border bg-card p-5">
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>
        </aside>

        {/* Dynamic View: Card Grid OR Interactive Map */}
        <div>
          {view === "list" ? (
            results.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-2">
                {results.map((c) => (
                  <CaretakerCard
                    key={c.id}
                    caretaker={c}
                    onView={setProfile}
                    onBook={setBooking}
                    onSave={toggleSaved}
                    saved={saved.includes(c.id)}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search Results Message */
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-24 text-center">
                <Search className="size-10 text-muted-foreground" />
                <p className="mt-4 text-lg font-bold text-foreground">No caretakers match your filters</p>
                <p className="mt-1 text-sm text-muted-foreground">Try widening your distance or price range.</p>
                <button
                  onClick={() => setFilters(defaultFilters)}
                  className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Reset filters
                </button>
              </div>
            )
          ) : (
            /* Map View Canvas */
            <MapView caretakers={results} onView={setProfile} />
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 5. MODAL DIALOGS (Profile View & 5-Step Booking Wizard)             */}
      {/* ==================================================================== */}
      {/* Mobile filter sheet */}
      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} label="Filters" className="sm:max-w-md">
        <div className="p-6">
          <FilterPanel filters={filters} onChange={setFilters} />
          <button
            onClick={() => setFiltersOpen(false)}
            className="mt-6 w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground"
          >
            Show {results.length} caretakers
          </button>
        </div>
      </Modal>

      {/* Caretaker Profile Modal */}
      <ProfileModal caretaker={profile} open={!!profile} onClose={() => setProfile(null)} onBook={openBooking} />

      {/* 5-Step Interactive Booking Wizard Modal */}
      <BookingModal caretaker={booking} open={!!booking} onClose={() => setBooking(null)} />

      {/* ==================================================================== */}
      {/* 6. FOOTER                                                            */}
      {/* ==================================================================== */}
      <SiteFooter />
    </div>
  )
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2">
      <Icon className="size-4 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        {children}
      </div>
    </div>
  )
}

function ToggleBtn({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ElementType
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-4" /> <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
