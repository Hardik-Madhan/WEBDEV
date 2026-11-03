"use client"

// ==============================================================================
//  CARESURE - USER DASHBOARD
//  Code for this page: Renders the authenticated user control center where families
//  can review their submitted bookings, view shortlisted caretakers, and update profile data.
// ==============================================================================

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  CalendarClock,
  Heart,
  CreditCard,
  MessagesSquare,
  Settings,
  Search,
} from "lucide-react"
import { DashboardShell, type NavItem } from "@/components/dashboard/shell"
import { Panel, StatCard } from "@/components/dashboard/widgets"
import { Field, inputClass } from "@/components/account-form"
import { caretakers, type Caretaker } from "@/lib/data"

// Data types representing user records and booking requests loaded from local JSON
type User = {
  id: string
  name: string
  email: string
  phone: string
  location: string
  careNeeds: string
  saved: string[]
}

type Booking = {
  familyName?: string
  familyEmail?: string
  familyPhone?: string
  careNeeds?: string
  id: string
  caretakerId: string
  caretakerName: string
  date: string
  time: string
  address: string
  estimatedTotal: number
}

// Sidebar navigation items for switching dashboard sections
const navItems: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Bookings", icon: CalendarClock },
  { label: "Saved", icon: Heart },
  { label: "Messages", icon: MessagesSquare },
  { label: "Payments", icon: CreditCard },
  { label: "Care requests", icon: CalendarClock },
  { label: "Settings", icon: Settings },
]

const buttonClass =
  "inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"

export default function UserDashboard() {
  const [registered, setRegistered] = useState<Caretaker[]>([])
  const [requests, setRequests] = useState<Booking[]>([])
  const [applicationCount, setApplicationCount] = useState(0)
  const [active, setActive] = useState("Overview")
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [details, setDetails] = useState<string | null>(null)

  // Load user data, bookings, and caretaker applications simultaneously from local JSON files
  useEffect(() => {
    const section = new URLSearchParams(window.location.search).get("section")
    if (navItems.some((n) => n.label === section)) setActive(section!)

    Promise.all([
      fetch("/api/account").then((r) => r.json()),
      fetch("/api/bookings").then((r) => r.json()),
      fetch("/api/caretaker").then((r) => r.json()),
      fetch("/api/caretaker/requests").then((r) => r.json()),
    ])
      .then(([account, result, profiles, caretaker]) => {
        setUser(account.user)
        setRegistered(profiles.caretakers || [])
        setRequests(caretaker.requests || [])
        setApplicationCount((caretaker.applications || []).length)
        if (account.user && result.error) setError(result.error)
        else setBookings(result.bookings || [])
      })
      .catch(() => setError("Could not load your dashboard. Please refresh."))
      .finally(() => setLoading(false))
  }, [])

  // Form submit handler: saves updated user profile into data/users.json
  async function saveProfile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setNotice("")
    setError("")
    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setUser(data.user)
      setNotice("Profile saved successfully to users.json.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save profile.")
    }
  }

  // Interactive handler: removes a caregiver from the user's shortlisted favorites
  async function removeSaved(id: string) {
    try {
      const response = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setUser(data.user)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update saved caretakers.")
    }
  }

  // Signs out the user by clearing the session cookie and session entry in sessions.json
  async function signOut() {
    await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    })
    window.location.href = "/login"
  }

  if (loading) return <main className="p-10">Loading your dashboard…</main>

  // Unauthenticated view: prompts the user to log in if no session cookie exists
  if (!user) {
    return (
      <main className="mx-auto max-w-lg px-5 py-20">
        <h1 className="text-3xl font-bold">Your care dashboard</h1>
        <p className="mt-3 text-muted-foreground">Log in to see your bookings and profile.</p>
        {error && <p role="alert" className="mt-3 text-destructive">{error}</p>}
        <div className="mt-6 flex gap-3">
          <Link href="/login" className={buttonClass}>Log in</Link>
          <Link href="/signup" className="rounded-xl border border-border px-5 py-3 font-semibold">Create account</Link>
        </div>
      </main>
    )
  }

  const saved = [...caretakers, ...registered].filter((c) => user.saved?.includes(c.id))

  // Bookings list table: renders all bookings saved for this user with an expandable details drawer
  const bookingsList = (
    <div className="space-y-3">
      {bookings.length === 0 ? (
        <p className="text-sm text-muted-foreground">No booking requests yet. Find a caretaker to get started.</p>
      ) : (
        bookings.map((b) => (
          <div key={b.id} className="rounded-xl border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{b.caretakerName}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(b.date).toLocaleDateString("en-IN", { dateStyle: "medium" })} · {b.time} · Request saved
                </p>
              </div>
              {/* Interactive toggle: expands or collapses detailed booking info */}
              <button
                onClick={() => setDetails(details === b.id ? null : b.id)}
                className="rounded-lg border border-border px-3 py-2 text-sm font-medium"
              >
                {details === b.id ? "Hide details" : "Details"}
              </button>
            </div>

            {/* Expandable detailed drawer for this booking */}
            {details === b.id && (
              <div className="mt-4 border-t border-border pt-3 text-sm">
                <p><strong>Booking ID:</strong> {b.id}</p>
                <p><strong>Address:</strong> {b.address}</p>
                <p><strong>Estimated total:</strong> ₹{b.estimatedTotal}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Saved locally in data/bookings.json. Caretakers registered on this computer can view requests in their dashboard.
                </p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )

  // Shortlisted Caretakers Grid: shows profiles bookmarked by clicking the heart button
  const savedList = (
    <div className="grid gap-3 sm:grid-cols-2">
      {saved.length === 0 ? (
        <p className="text-sm text-muted-foreground">You haven’t saved any caretakers yet.</p>
      ) : (
        saved.map((c) => (
          <div key={c.id} className="rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <img src={c.photo} alt="" className="h-12 w-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.careTypes[0]} · ₹{c.price}/hr</p>
              </div>
            </div>
            <button onClick={() => removeSaved(c.id)} className="mt-4 text-sm font-semibold text-primary">
              Remove from saved
            </button>
          </div>
        ))
      )}
    </div>
  )

  return (
    <DashboardShell
      role={applicationCount ? "CareSure Account" : "Family Account"}
      navItems={navItems}
      activeLabel={active}
      onNavigate={(label) => {
        setActive(label)
        setError("")
        setNotice("")
      }}
      user={{ name: user.name, photo: "", sub: user.location }}
    >
      {/* Dashboard section heading and quick action button */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {active === "Overview" ? `Welcome back, ${user.name.split(" ")[0]}` : active}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {active === "Overview"
              ? "Your care activity at a glance."
              : ({
                  Bookings: "Your saved care requests.",
                  Saved: "Caretakers you want to find again.",
                  Messages: "Your conversations.",
                  Payments: "Your payment activity.",
                  "Care requests": "Requests for your caretaker profile.",
                  Settings: "Manage the details included with care requests.",
                } as Record<string, string>)[active]}
          </p>
        </div>
        <Link href="/find" className={buttonClass}>
          <Search className="mr-2 size-4" /> Find a Caretaker
        </Link>
      </div>

      {/* Local storage note */}
      <p className="mb-5 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-900 border border-emerald-200">
        Care Portal: Manage your scheduled bookings, caretaker shortlist, and family care profile.
      </p>

      {/* Feedback status messages */}
      {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
      {notice && <p role="status" className="mb-4 text-sm text-emerald-700">{notice}</p>}

      {/* SECTION 1: Overview Summary Cards and Quick Lists */}
      {active === "Overview" && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <StatCard icon={CalendarClock} label="Booking requests" value={String(bookings.length)} hint="Saved locally" />
            <StatCard icon={Heart} label="Saved caretakers" value={String(saved.length)} hint="Your shortlist" />
          </div>
          <div className="space-y-6">
            <Panel title="Your bookings" action={<button onClick={() => setActive("Bookings")} className="text-sm font-semibold text-primary">View all</button>}>
              {bookingsList}
            </Panel>
            <Panel title="Saved caretakers" action={<button onClick={() => setActive("Saved")} className="text-sm font-semibold text-primary">View all</button>}>
              {savedList}
            </Panel>
          </div>
        </>
      )}

      {/* SECTION 2: Dedicated Bookings List View */}
      {active === "Bookings" && (
        <Panel title="Booking requests">
          {bookingsList}
          <Link href="/find" className="mt-5 inline-block text-sm font-semibold text-primary">Find a caretaker →</Link>
        </Panel>
      )}

      {/* SECTION 3: Dedicated Saved Shortlist View */}
      {active === "Saved" && (
        <Panel title="Your shortlist">
          {savedList}
          <Link href="/find" className="mt-5 inline-block text-sm font-semibold text-primary">Explore caretakers →</Link>
        </Panel>
      )}

      {/* SECTION 4: Messages Tab */}
      {active === "Messages" && (
        <Panel title="Messages">
          <p className="text-sm text-muted-foreground">Direct family-to-caregiver messaging is activated once a care booking is confirmed.</p>
        </Panel>
      )}

      {/* SECTION 5: Payments Tab */}
      {active === "Payments" && (
        <Panel title="Payments">
          <p className="text-sm text-muted-foreground">Secure digital invoicing and payment receipts will appear here after shift completion.</p>
        </Panel>
      )}

      {/* SECTION 6: Incoming Care Requests (For Caregiver accounts) */}
      {active === "Care requests" && (
        <Panel title="Requests for you">
          {applicationCount === 0 ? (
            <p className="text-sm text-muted-foreground">You have not created a caretaker profile. <Link href="/caretaker" className="font-semibold text-primary">Apply here</Link>.</p>
          ) : requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming requests yet. New care appointments assigned to you will appear here.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <div key={r.id} className="rounded-xl border border-border p-4 text-sm">
                  <p className="font-semibold">{r.familyName} · {new Date(r.date).toLocaleDateString("en-IN", { dateStyle: "medium" })} · {r.time}</p>
                  <p className="mt-2">Contact: {r.familyEmail} · {r.familyPhone}</p>
                  <p>Care needs: {r.careNeeds || "Not provided"}</p>
                  <p>Address: {r.address}</p>
                  <p className="mt-2 text-muted-foreground">Request {r.id} · Estimated ₹{r.estimatedTotal}</p>
                </div>
              ))}
            </div>
          )}
        </Panel>
      )}

      {/* SECTION 7: Profile Settings Form (Updates data/users.json) */}
      {active === "Settings" && (
        <Panel title="Your profile">
          <p className="mb-4 text-sm text-muted-foreground">Email: {user.email}</p>
          <form onSubmit={saveProfile} className="max-w-xl space-y-4">
            <Field label="Full name" name="name" defaultValue={user.name} minLength={2} maxLength={100} required />
            <Field label="Phone number" name="phone" defaultValue={user.phone} minLength={7} maxLength={30} required />
            <Field label="Area and city" name="location" defaultValue={user.location} minLength={2} maxLength={200} required />
            <label className="block text-sm font-semibold">
              Care needs
              <textarea name="careNeeds" defaultValue={user.careNeeds} className={inputClass} maxLength={1000} rows={3} />
            </label>
            <div className="flex flex-wrap gap-3">
              <button className={buttonClass}>Save changes</button>
              <button type="button" onClick={signOut} className="rounded-xl border border-border px-5 py-3 text-sm font-semibold">Log out</button>
            </div>
          </form>
        </Panel>
      )}
    </DashboardShell>
  )
}
