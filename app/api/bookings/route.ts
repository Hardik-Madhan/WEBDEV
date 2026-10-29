import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { caretakers } from "@/lib/data"
import { appendJsonRecord } from "@/lib/json-store"

export const runtime = "nodejs"

const times = new Set(["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"])

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Please send a valid booking request." }, { status: 400 })
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Please send a valid booking request." }, { status: 400 })
  }

  const values = body as Record<string, unknown>
  const caretakerId = typeof values.caretakerId === "string" ? values.caretakerId : ""
  const date = typeof values.date === "string" ? values.date : ""
  const time = typeof values.time === "string" ? values.time : ""
  const address = typeof values.address === "string" ? values.address.trim() : ""
  const caretaker = caretakers.find((item) => item.id === caretakerId)
  const selectedDate = new Date(date)

  if (!caretaker) return NextResponse.json({ error: "That caretaker is no longer available." }, { status: 404 })
  if (!date || Number.isNaN(selectedDate.getTime()) || selectedDate.toISOString().slice(0, 10) < new Date().toISOString().slice(0, 10)) {
    return NextResponse.json({ error: "Please choose today or a future date." }, { status: 422 })
  }
  if (!times.has(time)) return NextResponse.json({ error: "Please choose an available time." }, { status: 422 })
  if (address.length < 5 || address.length > 500) {
    return NextResponse.json({ error: "Address must be between 5 and 500 characters." }, { status: 422 })
  }

  const booking = {
    id: `CS-${randomUUID().slice(0, 8).toUpperCase()}`,
    caretakerId: caretaker.id,
    caretakerName: caretaker.name,
    date: selectedDate.toISOString(),
    time,
    address,
    hourlyRate: caretaker.price,
    durationHours: 4,
    estimatedTotal: caretaker.price * 4,
    submittedAt: new Date().toISOString(),
  }
  try {
    await appendJsonRecord("bookings.json", booking)
  } catch {
    return NextResponse.json({ error: "We couldn’t save your booking. Please try again." }, { status: 500 })
  }
  return NextResponse.json({ ok: true, booking: { id: booking.id } }, { status: 201 })
}
