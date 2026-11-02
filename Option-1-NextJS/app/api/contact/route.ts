import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { appendJsonRecord } from "@/lib/json-store"

export const runtime = "nodejs"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const topics = new Set(["Finding care", "Joining as a caretaker", "Partnership", "General question", "Other"])

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Please send a valid form submission." }, { status: 400 })
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Please send a valid form submission." }, { status: 400 })
  }

  const values = body as Record<string, unknown>
  const name = typeof values.name === "string" ? values.name.trim() : ""
  const email = typeof values.email === "string" ? values.email.trim().toLowerCase() : ""
  const phone = typeof values.phone === "string" ? values.phone.trim() : ""
  const topic = typeof values.topic === "string" ? values.topic.trim() : ""
  const message = typeof values.message === "string" ? values.message.trim() : ""

  if (name.length < 2 || name.length > 100) {
    return NextResponse.json({ error: "Name must be between 2 and 100 characters." }, { status: 422 })
  }
  if (email.length > 254 || !emailPattern.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 })
  }
  if (phone.length > 30) return NextResponse.json({ error: "Phone number is too long." }, { status: 422 })
  if (!topics.has(topic)) return NextResponse.json({ error: "Please choose an enquiry type." }, { status: 422 })
  if (message.length < 20 || message.length > 2000) {
    return NextResponse.json({ error: "Message must be between 20 and 2,000 characters." }, { status: 422 })
  }
  if (values.consent !== true) {
    return NextResponse.json({ error: "Please agree to be contacted about your enquiry." }, { status: 422 })
  }

  const submission = { id: randomUUID(), name, email, phone, topic, message, submittedAt: new Date().toISOString() }
  try {
    await appendJsonRecord("contacts.json", submission)
  } catch {
    return NextResponse.json({ error: "We couldn’t save your enquiry. Please try again." }, { status: 500 })
  }
  return NextResponse.json({ ok: true, submission: { id: submission.id } }, { status: 201 })
}
