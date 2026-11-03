"use client"

// ==============================================================================
//  CARESURE - 5-STEP BOOKING WIZARD MODAL
//  Code for this modal: Multi-step booking form that walks the user through:
//  Step 1: Choose a Date (Interactive date cards with active selection styling)
//  Step 2: Number of Hours of Work (Quick duration presets + live cost calculator)
//  Step 3: What Time to Begin (Expanded care shift start times)
//  Step 4: Location & Review (Service address and total price summary)
//  Step 5: Confirmation (Booking ID receipt and link to Care Portal Dashboard)
// ==============================================================================

import Link from "next/link"
import { Modal } from "@/components/modal"
import type { Caretaker } from "@/lib/data"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  Minus,
  Plus,
  Timer,
} from "lucide-react"
import { useState } from "react"

// Exact 5 workflow steps displayed across the top progress bar
const steps = ["Date", "Hours", "Time", "Review", "Confirm"]

// Standard available care shift start hours
const times = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
]

// Preset duration options for rapid selection
const durationPresets = [2, 4, 6, 8, 12]

// Generates upcoming 14 calendar days for the interactive date picker
function nextDays(count: number) {
  const out: { key: string; day: string; date: string; month: string }[] = []
  const now = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    out.push({
      key: d.toISOString(),
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate().toString(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
    })
  }
  return out
}

export function BookingModal({
  caretaker,
  open,
  onClose,
}: {
  caretaker: Caretaker | null
  open: boolean
  onClose: () => void
}) {
  const [step, setStep] = useState(0)
  const [date, setDate] = useState<string>("")
  const [durationHours, setDurationHours] = useState<number>(4)
  const [time, setTime] = useState<string>("")
  const [address, setAddress] = useState<string>("")
  const [confirmed, setConfirmed] = useState(false)
  const [bookingId, setBookingId] = useState("")
  const [bookingError, setBookingError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const days = nextDays(14)

  // Resets all input fields when closing the modal
  function reset() {
    setStep(0)
    setDate("")
    setDurationHours(4)
    setTime("")
    setAddress("")
    setConfirmed(false)
    setBookingId("")
    setBookingError("")
    setSubmitting(false)
  }

  function handleClose() {
    onClose()
    setTimeout(reset, 200)
  }

  if (!caretaker) return null

  const selectedDay = days.find((d) => d.key === date)
  const dateLabel = selectedDay ? `${selectedDay.day}, ${selectedDay.month} ${selectedDay.date}` : ""
  const estimatedTotal = caretaker.price * durationHours

  // Validation guards for each step of the 5-step wizard
  const canContinue =
    (step === 0 && Boolean(date)) ||
    (step === 1 && durationHours >= 1 && durationHours <= 24) ||
    (step === 2 && Boolean(time)) ||
    (step === 3 && address.trim().length >= 5) ||
    step === 4

  // Form submission: sends booking details to the backend API
  async function submitBooking() {
    if (!caretaker || !selectedDay || submitting) return
    setSubmitting(true)
    setBookingError("")
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caretakerId: caretaker.id,
          date,
          time,
          address: address.trim(),
          durationHours,
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "We couldn’t confirm your booking.")
      setBookingId(result.booking.id)
      setConfirmed(true)
      setStep(4)
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "We couldn’t confirm your booking.")
    } finally {
      setSubmitting(false)
    }
  }

  // STEP 5: Confirmation view showing the verified booking ID and schedule summary
  if (confirmed) {
    return (
      <Modal open={open} onClose={handleClose} label="Booking Confirmed">
        <div className="flex flex-col items-center px-6 py-8 text-center">
          {/* Stepper Progress Bar */}
          <div className="mb-6 flex w-full items-center gap-1.5">
            {steps.map((s) => (
              <div key={s} className="flex flex-1 flex-col items-center gap-1">
                <div className="h-1.5 w-full rounded-full bg-primary" />
                <span className="text-[10px] font-semibold text-primary">{s}</span>
              </div>
            ))}
          </div>

          <div className="relative mb-4 flex size-20 items-center justify-center rounded-full bg-emerald-500/15">
            <span className="absolute inline-flex size-20 animate-pulse-ring rounded-full bg-emerald-500/30" />
            <CheckCircle2 className="size-11 text-emerald-600" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            Step 5 of 5 · Confirmed
          </span>

          <h2 className="mt-3 text-2xl font-extrabold text-foreground">Booking Confirmed!</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Your care appointment has been reserved and scheduled with your care coordinator.
          </p>

          {/* Booking Summary Box */}
          <div className="mt-6 w-full space-y-2.5 rounded-2xl border border-border bg-muted/40 p-4 text-left">
            <Row label="Booking ID" value={bookingId} highlight />
            <Row label="Caretaker" value={caretaker.name} />
            <Row label="Date" value={dateLabel} />
            <Row label="Shift" value={`Starting at ${time} (${durationHours} hrs)`} />
            <Row label="Service Location" value={address} />
            <div className="border-t border-border pt-2.5">
              <Row label="Hourly Rate" value={`₹${caretaker.price} / hr`} />
              <div className="mt-1 flex items-center justify-between">
                <span className="font-bold text-foreground">Total Estimated Cost</span>
                <span className="text-lg font-black text-primary">₹{estimatedTotal}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex w-full gap-3">
            <Link
              href="/dashboard?section=Bookings"
              className="flex-1 rounded-xl bg-primary px-4 py-3 text-center font-bold text-primary-foreground transition-all hover:bg-primary/90"
            >
              View in Dashboard
            </Link>
            <button
              onClick={handleClose}
              className="flex-1 rounded-xl border border-border px-4 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal open={open} onClose={handleClose} label={`Book ${caretaker.name}`}>
      <div className="p-6">
        {/* Caretaker Avatar & Header */}
        <div className="flex items-center gap-3">
          <img
            src={caretaker.photo || "/placeholder.svg"}
            alt=""
            className="size-11 rounded-full object-cover border border-border"
          />
          <div>
            <p className="text-xs text-muted-foreground">Direct Care Coordination</p>
            <h2 className="text-lg font-bold text-foreground">{caretaker.name}</h2>
          </div>
        </div>

        {/* 5-Step Stepper Progress Bar */}
        <div className="mt-5 flex items-center gap-1.5">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full items-center">
                <div
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    i <= step ? "bg-primary" : "bg-muted"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold transition-colors",
                  i <= step ? "text-primary" : "text-muted-foreground"
                )}
              >
                {i + 1}. {s}
              </span>
            </div>
          ))}
        </div>

        {/* Dynamic Wizard Step Content */}
        <div className="mt-6 min-h-[260px]">
          {/* STEP 1: Choose a Date */}
          {step === 0 && (
            <div>
              <StepHeading icon={CalendarDays} title="1. Choose a date" />
              <p className="text-xs text-muted-foreground mb-3">
                Select your preferred appointment day. Click any date to select it.
              </p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {days.slice(0, 14).map((d) => {
                  const isSelected = date === d.key
                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setDate(d.key)}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-xl border p-2 transition-all cursor-pointer",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-md ring-2 ring-primary/40 font-bold scale-[1.03]"
                          : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "text-[10px] uppercase font-semibold",
                          isSelected ? "text-primary-foreground/90" : "text-muted-foreground"
                        )}
                      >
                        {d.day}
                      </span>
                      <span
                        className={cn(
                          "text-base font-extrabold my-0.5",
                          isSelected ? "text-primary-foreground" : "text-foreground"
                        )}
                      >
                        {d.date}
                      </span>
                      <span
                        className={cn(
                          "text-[10px]",
                          isSelected ? "text-primary-foreground/90" : "text-muted-foreground"
                        )}
                      >
                        {d.month}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Number of Hours of Work */}
          {step === 1 && (
            <div>
              <StepHeading icon={Timer} title="2. Number of hours of work" />
              <p className="text-xs text-muted-foreground mb-3">
                Select how long you will need caregiver assistance.
              </p>

              {/* Duration Presets */}
              <div className="grid grid-cols-5 gap-2">
                {durationPresets.map((hrs) => {
                  const isSelected = durationHours === hrs
                  return (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => setDurationHours(hrs)}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-xl border py-2.5 transition-all cursor-pointer",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-md ring-2 ring-primary/40 font-bold scale-[1.03]"
                          : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted"
                      )}
                    >
                      <span className="text-lg font-extrabold">{hrs}</span>
                      <span
                        className={cn(
                          "text-[10px]",
                          isSelected ? "text-primary-foreground/90" : "text-muted-foreground"
                        )}
                      >
                        {hrs === 1 ? "Hour" : "Hours"}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Stepper for custom duration */}
              <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3">
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block">
                    Custom Duration
                  </span>
                  <span className="text-sm font-bold text-foreground">Adjust shift hours (1 - 24 hrs)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDurationHours((h) => Math.max(1, h - 1))}
                    disabled={durationHours <= 1}
                    className="flex size-8 items-center justify-center rounded-lg border border-border bg-card font-bold hover:bg-muted disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-14 text-center text-sm font-extrabold text-foreground">
                    {durationHours} hrs
                  </span>
                  <button
                    type="button"
                    onClick={() => setDurationHours((h) => Math.min(24, h + 1))}
                    disabled={durationHours >= 24}
                    className="flex size-8 items-center justify-center rounded-lg border border-border bg-card font-bold hover:bg-muted disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>

              {/* Live Cost Calculation Bar */}
              <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Care Shift Cost</p>
                  <p className="text-xs font-semibold text-foreground">
                    ₹{caretaker.price} / hr × {durationHours} hours
                  </p>
                </div>
                <span className="text-xl font-extrabold text-primary">₹{estimatedTotal}</span>
              </div>
            </div>
          )}

          {/* STEP 3: What Time to Begin */}
          {step === 2 && (
            <div>
              <StepHeading icon={Clock} title="3. What time to begin?" />
              <p className="text-xs text-muted-foreground mb-3">
                Choose the exact start time for your caregiver to arrive.
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 max-h-[220px] overflow-y-auto pr-1">
                {times.map((t) => {
                  const isSelected = time === t
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTime(t)}
                      className={cn(
                        "rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer text-center",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-md ring-2 ring-primary/40 font-bold scale-[1.02]"
                          : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted"
                      )}
                    >
                      {t}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Service Location & Review */}
          {step === 3 && (
            <div>
              <StepHeading icon={Home} title="4. Location & review" />
              <label className="mb-1 block text-sm font-medium text-foreground">
                Service Address <span className="text-destructive">*</span>
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat / House no, street, locality, landmark, city"
                rows={2}
                className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
              {address.trim().length > 0 && address.trim().length < 5 && (
                <p className="mt-1 text-xs text-destructive">Address must have at least 5 characters.</p>
              )}

              {/* Booking Summary Box */}
              <div className="mt-3 space-y-2 rounded-2xl border border-border bg-muted/40 p-3.5 text-sm">
                <Row label="Caretaker" value={caretaker.name} />
                <Row label="Date" value={dateLabel} />
                <Row label="Shift" value={`Starting at ${time} (${durationHours} hrs)`} />
                {address.trim().length >= 5 && <Row label="Location" value={address} />}
                <div className="border-t border-border pt-2">
                  <Row label="Rate" value={`₹${caretaker.price} / hr`} />
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-bold text-foreground">Total ({durationHours} hrs)</span>
                    <span className="text-lg font-black text-primary">₹{estimatedTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Navigation Buttons (Back & Continue / Submit) */}
        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-3 font-semibold text-foreground transition-colors hover:bg-muted cursor-pointer"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
          )}
          <button
            disabled={!canContinue || submitting}
            onClick={() => (step === 3 ? void submitBooking() : setStep((s) => s + 1))}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            {submitting ? "Confirming booking…" : step === 3 ? "Confirm & Book Caretaker" : "Continue"}
            {step < 3 && <ArrowRight className="size-4" />}
          </button>
        </div>

        {/* Auth or Validation Warning */}
        {bookingError && (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {bookingError} {bookingError.includes("log in") && <Link className="underline font-semibold" href="/login">Log in here</Link>}
          </p>
        )}
      </div>
    </Modal>
  )
}

function StepHeading({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>
      <h3 className="text-base font-bold text-foreground">{title}</h3>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("text-right font-semibold", highlight ? "text-primary" : "text-foreground")}>
        {value}
      </span>
    </div>
  )
}
