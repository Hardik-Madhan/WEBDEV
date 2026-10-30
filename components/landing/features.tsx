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
  { icon: MapPin, title: "Location-based Search", text: "Browse sample and locally submitted profiles." },
  { icon: UserCheck, title: "Caretaker Profiles", text: "View self-submitted skills and experience." },
  { icon: Star, title: "Ratings & Reviews", text: "Ratings on sample profiles are illustrative." },
  { icon: Wifi, title: "Availability", text: "Availability is self-reported and not live." },
  { icon: CalendarCheck, title: "Easy Booking", text: "Save a care request to a local account." },
  { icon: Map, title: "Map Discovery", text: "Explore an illustrative map, not live locations." },
  { icon: MessagesSquare, title: "Communication", text: "Messaging is not connected yet." },
  { icon: Siren, title: "Emergency Discovery", text: "Call local emergency services for urgent help." },
  { icon: ShieldCheck, title: "Safety & Trust", text: "Profiles and identity are not verified." },
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
          Explore the features available in this local prototype.
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
