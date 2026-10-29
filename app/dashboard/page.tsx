"use client"

import { useState } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  CalendarClock,
  Heart,
  CreditCard,
  MessagesSquare,
  Settings,
  Star,
  MapPin,
  Search,
  ArrowRight,
  Clock,
} from "lucide-react"
import { DashboardShell, type NavItem } from "@/components/dashboard/shell"
import { StatCard, Panel } from "@/components/dashboard/widgets"
import { caretakers } from "@/lib/data"

const navItems: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Bookings", icon: CalendarClock },
  { label: "Saved", icon: Heart },
  { label: "Messages", icon: MessagesSquare },
  { label: "Payments", icon: CreditCard },
  { label: "Settings", icon: Settings },
]

type Booking = {
  caretaker: (typeof caretakers)[number]
  date: string
  time: string
  status: "Upcoming" | "In Progress" | "Completed"
}

const bookings: Booking[] = [
  { caretaker: caretakers[0], date: "Fri, 4 Sep", time: "9:00 AM – 1:00 PM", status: "Upcoming" },
  { caretaker: caretakers[1], date: "Today", time: "2:00 PM – 6:00 PM", status: "In Progress" },
  { caretaker: caretakers[5], date: "Mon, 1 Sep", time: "10:00 AM – 2:00 PM", status: "Completed" },
]

const statusStyles: Record<Booking["status"], string> = {
  Upcoming: "bg-secondary/15 text-secondary",
  "In Progress": "bg-emerald-100 text-emerald-700",
  Completed: "bg-muted text-muted-foreground",
}

export default function UserDashboard() {
  const [active, setActive] = useState("Overview")
  const saved = caretakers.slice(2, 5)

  return (
    <DashboardShell
      role="Family Account"
      navItems={navItems}
      activeLabel={active}
      onNavigate={setActive}
      user={{ name: "Meera Nair", photo: "/images/user-1.png", sub: "Koramangala, Bengaluru" }}
    >
      {/* Greeting */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance">Welcome back, Meera</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your care today.</p>
        </div>
        <Link
          href="/find"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          <Search className="h-4 w-4" />
          Find a Caretaker
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={CalendarClock} label="Active Bookings" value="2" hint="1 in progress now" tone="primary" />
        <StatCard icon={Heart} label="Saved Caretakers" value="3" hint="Ready to rebook" tone="secondary" />
        <StatCard icon={Clock} label="Care Hours" value="126" hint="This year" tone="green" />
        <StatCard icon={CreditCard} label="Spent" value="₹18.4k" hint="Last 30 days" tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Bookings */}
        <div className="lg:col-span-2">
          <Panel
            title="Your Bookings"
            action={
              <button className="text-sm font-semibold text-primary hover:underline">View all</button>
            }
          >
            <ul className="flex flex-col gap-3">
              {bookings.map((b) => (
                <li
                  key={b.caretaker.id + b.date}
                  className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={b.caretaker.photo || "/placeholder.svg"}
                      alt={b.caretaker.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{b.caretaker.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {b.date} · {b.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[b.status]}`}
                    >
                      {b.status}
                    </span>
                    <button className="rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted">
                      Details
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* Care team / next visit */}
        <div className="flex flex-col gap-6">
          <Panel title="Next Visit">
            <div className="rounded-xl bg-primary/5 p-4">
              <div className="flex items-center gap-3">
                <img
                  src={caretakers[0].photo || "/placeholder.svg"}
                  alt={caretakers[0].name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{caretakers[0].name}</p>
                  <div className="flex items-center gap-1 text-sm text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-medium text-foreground">{caretakers[0].rating}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-foreground/80">
                <p className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-primary" /> Fri, 4 Sep · 9:00 AM
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Home visit · Koramangala
                </p>
              </div>
              <button className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                Message Priya
              </button>
            </div>
          </Panel>
        </div>
      </div>

      {/* Saved caretakers */}
      <div className="mt-6">
        <Panel
          title="Saved Caretakers"
          action={
            <Link href="/find" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Explore more <ArrowRight className="h-4 w-4" />
            </Link>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((c) => (
              <div key={c.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <img src={c.photo || "/placeholder.svg"} alt={c.name} className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.careTypes[0]}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-medium text-foreground">{c.rating}</span>
                  </span>
                  <span className="font-semibold text-primary">₹{c.price}/hr</span>
                </div>
                <button className="mt-3 w-full rounded-lg border border-primary py-2 text-sm font-semibold text-primary transition hover:bg-primary/5">
                  Rebook
                </button>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  )
}
