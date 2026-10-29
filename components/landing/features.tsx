import { Reveal } from "@/components/reveal"
import {
  CalendarCheck,
  MapPin,
  MessagesSquare,
  Map,
  ShieldCheck,
  Siren,
  Smartphone,
  Star,
  UserCheck,
  Wifi,
} from "lucide-react"

const features = [
  { icon: MapPin, title: "Location-based Search", text: "Discover caretakers closest to you." },
  { icon: UserCheck, title: "Verified Profiles", text: "Identity-checked, trusted caregivers." },
  { icon: Star, title: "Ratings & Reviews", text: "Real feedback from real families." },
  { icon: Wifi, title: "Availability", text: "See who's available right now." },
  { icon: CalendarCheck, title: "Easy Booking", text: "Book care in just a few taps." },
  { icon: Map, title: "Map Discovery", text: "Explore caretakers on a live map." },
  { icon: MessagesSquare, title: "Communication", text: "Message before you book." },
  { icon: Siren, title: "Emergency Discovery", text: "Find urgent support fast." },
  { icon: ShieldCheck, title: "Safety & Trust", text: "Protections at every step." },
  { icon: Smartphone, title: "Mobile Friendly", text: "A smooth experience on any device." },
]

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Everything You Need to Find Care
        </h2>
        <p className="mt-3 text-pretty text-lg text-muted-foreground">
          Thoughtful features designed to make care simple, safe, and stress-free.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={(i % 5) * 70}>
            <div className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-bold text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
