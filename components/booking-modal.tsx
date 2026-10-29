"use client"

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
} from "lucide-react"
import { useState } from "react"

const steps = ["Date", "Time", "Location", "Review", "Confirm"]
const times = ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"]

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
  const [time, setTime] = useState<string>("")
  const [address, setAddress] = useState<string>("")
  const [confirmed, setConfirmed] = useState(false)
  const [bookingId, setBookingId] = useState("")
  const [bookingError, setBookingError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const days = nextDays(14)

  function reset() {
    setStep(0)
    setDate("")
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
  const canContinue =
    (step === 0 && date) || (step === 1 && time) || (step === 2 && address.trim().length > 3) || step === 3

  async function submitBooking() {
    if (!caretaker || !selectedDay || submitting) return
    setSubmitting(true)
    setBookingError("")
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caretakerId: caretaker.id, date, time, address: address.trim() }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "We couldn’t save your booking.")
      setBookingId(result.booking.id)
      setConfirmed(true)
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "We couldn’t save your booking.")
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmed) {
    return (
      <Modal open={open} onClose={handleClose} label="Booking confirmed">
        <div className="flex flex-col items-center px-6 py-10 text-center">
          <div className="relative mb-5 flex size-20 items-center justify-center rounded-full bg-success/15">
            <span className="absolute inline-flex size-20 animate-pulse-ring rounded-full bg-success/40" />
            <CheckCircle2 className="size-11 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Booking Confirmed</h2>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Your care request has been sent to {caretaker.name}. You&apos;ll get a confirmation shortly.
          </p>

          <div className="mt-6 w-full space-y-3 rounded-2xl border border-border bg-muted/40 p-4 text-left">
            <Row label="Caretaker" value={caretaker.name} />
            <Row label="Date" value={dateLabel} />
            <Row label="Time" value={time} />
            <Row label="Location" value={address} />
            <Row label="Booking ID" value={bookingId} highlight />
          </div>

          <div className="mt-6 flex w-full gap-3">
            <button className="flex-1 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90">
              View Booking
            </button>
            <button
              onClick={handleClose}
              className="flex-1 rounded-xl border border-border px-4 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Back to Home
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal open={open} onClose={handleClose} label={`Book ${caretaker.name}`}>
      <div className="p-6">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={caretaker.photo || "/placeholder.svg"}
            alt=""
            className="size-11 rounded-full object-cover"
          />
          <div>
            <p className="text-xs text-muted-foreground">Booking</p>
            <h2 className="text-lg font-bold text-foreground">{caretaker.name}</h2>
          </div>
        </div>

        {/* Stepper */}
        <div className="mt-6 flex items-center gap-1.5">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full items-center">
                <div
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    i <= step ? "bg-primary" : "bg-muted",
                  )}
                />
              </div>
              <span className={cn("text-[10px] font-medium", i <= step ? "text-primary" : "text-muted-foreground")}>
                {s}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 min-h-[220px]">
          {step === 0 && (
            <div>
              <StepHeading icon={CalendarDays} title="Choose a date" />
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {days.slice(0, 14).map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setDate(d.key)}
                    className={cn(
                      "flex flex-col items-center rounded-xl border px-1 py-2 transition-all",
                      date === d.key
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/40 hover:bg-muted",
                    )}
                  >
                    <span className="text-[10px] uppercase opacity-70">{d.day}</span>
                    <span className="text-base font-bold">{d.date}</span>
                    <span className="text-[10px] opacity-70">{d.month}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <StepHeading icon={Clock} title="Choose a time" />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {times.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={cn(
                      "rounded-xl border px-3 py-3 text-sm font-semibold transition-all",
                      time === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/40 hover:bg-muted",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <StepHeading icon={MapPin} title="Where is the care needed?" />
              <label className="mb-1.5 block text-sm font-medium text-foreground">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat / House no, street, area, city"
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
              <button
                onClick={() => setAddress("Koramangala 4th Block, Bengaluru 560034")}
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <MapPin className="size-4" /> Use my current location
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <StepHeading icon={Home} title="Review details" />
              <div className="space-y-3 rounded-2xl border border-border bg-muted/40 p-4">
                <Row label="Caretaker" value={caretaker.name} />
                <Row label="Date" value={dateLabel} />
                <Row label="Time" value={time} />
                <Row label="Location" value={address} />
                <div className="border-t border-border pt-3">
                  <Row label="Rate" value={`₹${caretaker.price}/hour`} />
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-semibold text-foreground">Estimated (4 hrs)</span>
                    <span className="text-lg font-bold text-primary">₹{caretaker.price * 4}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
          )}
          <button
            disabled={!canContinue || submitting}
            onClick={() => (step === 3 ? void submitBooking() : setStep((s) => s + 1))}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Saving booking…" : step === 3 ? "Confirm Booking" : "Continue"}
            {step < 3 && <ArrowRight className="size-4" />}
          </button>
        </div>
        {bookingError && <p className="mt-3 text-sm text-destructive" role="alert">{bookingError}</p>}
      </div>
    </Modal>
  )
}

function StepHeading({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>
      <h3 className="text-base font-bold text-foreground">{title}</h3>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("text-right font-semibold", highlight ? "text-primary" : "text-foreground")}>
        {value}
      </span>
    </div>
  )
}
