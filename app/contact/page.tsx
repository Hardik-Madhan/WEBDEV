"use client"

import { SiteFooter } from "@/components/site-footer"
import { SiteNavbar } from "@/components/site-navbar"
import { ArrowRight, CheckCircle2, HeartHandshake, Mail, MapPin } from "lucide-react"
import { useState, type ChangeEvent, type FormEvent } from "react"

type ContactValues = { name: string; email: string; phone: string; topic: string; message: string; consent: boolean }
type ContactField = keyof ContactValues

const initialValues: ContactValues = { name: "", email: "", phone: "", topic: "", message: "", consent: false }
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values: ContactValues) {
  const errors: Partial<Record<ContactField, string>> = {}
  if (values.name.trim().length < 2) errors.name = "Please enter your name (at least 2 characters)."
  else if (values.name.trim().length > 100) errors.name = "Please keep your name under 100 characters."
  if (!emailPattern.test(values.email.trim())) errors.email = "Enter a valid email, like alex@example.com."
  if (values.phone.trim().length > 30) errors.phone = "Please keep your phone number under 30 characters."
  if (!values.topic) errors.topic = "Choose what you’re getting in touch about."
  if (values.message.trim().length < 20) errors.message = "Tell us a little more (at least 20 characters)."
  else if (values.message.length > 2000) errors.message = "Please keep your message under 2,000 characters."
  if (!values.consent) errors.consent = "Please acknowledge that this enquiry will be stored locally."
  return errors
}

export default function ContactPage() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({})
  const [status, setStatus] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = event.currentTarget
    const name = target.name as ContactField
    const next = { ...values, [name]: target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value }
    setValues(next)
    setStatus("")
    setSent(false)
    if (errors[name]) {
      setErrors((previous) => {
        const updated = { ...previous }
        const message = validate(next)[name]
        if (message) updated[name] = message
        else delete updated[name]
        return updated
      })
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setStatus("Please check the highlighted fields and try again.")
      return
    }

    const submission = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      topic: values.topic,
      message: values.message.trim(),
      consent: values.consent,
      submittedAt: new Date().toISOString(),
    }
    setSending(true)
    setStatus("")
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "We couldn’t save your enquiry.")
      setValues(initialValues)
      setErrors({})
      setSent(true)
      setStatus("Your enquiry has been saved locally. This prototype does not send it or provide a reply.")
    } catch (error) {
      setSent(false)
      setStatus(error instanceof Error ? error.message : "We couldn’t save your enquiry. Please try again.")
    } finally {
      setSending(false)
    }
  }

  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <main>
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary/40 via-background to-background">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground"><HeartHandshake className="size-4 text-primary" /> HERE TO HELP</p>
            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">Let’s find the right care, <span className="text-primary">together.</span></h1>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">Try the contact form below. Enquiries are stored on this computer and are not sent to a support team.</p>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-16">
          <aside className="space-y-5">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold text-foreground">Prototype contact form</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">No support team is connected, and no response will be sent.</p>
              <div className="mt-6 space-y-4">
                <div className="flex gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Mail className="size-5" /></span><div><p className="text-sm font-semibold text-foreground">Email</p><a className="text-sm text-primary hover:underline" href="mailto:hello@caresure.in">hello@caresure.in</a></div></div>
                <div className="flex gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground"><MapPin className="size-5" /></span><div><p className="text-sm font-semibold text-foreground">Currently serving</p><p className="text-sm text-muted-foreground">Bengaluru and nearby communities</p></div></div>
              </div>
            </div>
            <div className="rounded-3xl border border-primary/15 bg-primary/5 p-6"><p className="text-sm font-bold text-foreground">Need urgent medical help?</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">CareSure is not an emergency service. Please contact your local emergency number or go to the nearest hospital for urgent care.</p></div>
          </aside>

          <form className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8" onSubmit={handleSubmit} noValidate>
            <div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">CONTACT CARESURE</p><h2 className="mt-1 text-2xl font-bold text-foreground">How can we help?</h2></div><span className="rounded-full bg-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Required fields *</span></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name" fieldId="name" error={errors.name} errorId="name-error">
                <input id="name" className={inputClass} name="name" value={values.name} onChange={handleChange} autoComplete="name" placeholder="e.g. Alex Morgan" required minLength={2} maxLength={100} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
              </Field>
              <Field label="Email address" fieldId="email" error={errors.email} errorId="email-error">
                <input id="email" className={inputClass} type="email" name="email" value={values.email} onChange={handleChange} autoComplete="email" placeholder="alex@example.com" required maxLength={254} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
              </Field>
              <Field label="Phone number" fieldId="phone" error={errors.phone} errorId="phone-error" optional>
                <input id="phone" className={inputClass} type="tel" name="phone" value={values.phone} onChange={handleChange} autoComplete="tel" placeholder="Optional" maxLength={30} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} />
              </Field>
              <Field label="What is this about?" fieldId="topic" error={errors.topic} errorId="topic-error">
                <select id="topic" className={inputClass} name="topic" value={values.topic} onChange={handleChange} required aria-invalid={!!errors.topic} aria-describedby={errors.topic ? "topic-error" : undefined}>
                  <option value="">Select a topic</option><option>Finding care</option><option>Joining as a caretaker</option><option>Partnership</option><option>General question</option><option>Other</option>
                </select>
              </Field>
            </div>
            <Field label="Your message" fieldId="message" error={errors.message} errorId="message-error">
              <textarea id="message" className={`${inputClass} min-h-36 resize-y`} name="message" value={values.message} onChange={handleChange} placeholder="Tell us what you need help with…" required minLength={20} maxLength={2000} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : "message-count"} />
              <div className="mt-1 flex justify-between text-xs text-muted-foreground"><span id="message-count">At least 20 characters</span><span>{values.message.length}/2000</span></div>
            </Field>
            <div className="mt-5">
              <label className="flex items-start gap-3 text-sm text-muted-foreground"><input className="mt-1 size-4 accent-primary" type="checkbox" name="consent" checked={values.consent} onChange={handleChange} required aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "consent-error" : undefined} /><span>I understand this enquiry is stored locally and will not be sent.</span></label>
              {errors.consent && <p className="mt-1 text-xs text-destructive" id="consent-error" role="alert">{errors.consent}</p>}
            </div>
            {status && <p className={`mt-5 rounded-xl px-4 py-3 text-sm ${sent ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`} role="status" aria-live="polite">{status}</p>}
            <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto" type="submit" disabled={sending}>{sending ? "Saving…" : sent ? <><CheckCircle2 className="size-4" /> Save another enquiry</> : <>Save enquiry <ArrowRight className="size-4" /></>}</button>
          </form>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function Field({ label, fieldId, error, errorId, optional, children }: { label: string; fieldId: string; error?: string; errorId: string; optional?: boolean; children: React.ReactNode }) {
  return <div className="mb-5"><label htmlFor={fieldId} className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-foreground">{label}{optional && <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Optional</span>}</label>{children}{error && <p className="mt-1 text-xs text-destructive" id={errorId} role="alert">{error}</p>}</div>
}
