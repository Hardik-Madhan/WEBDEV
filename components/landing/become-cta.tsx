import { Reveal } from "@/components/reveal"
import { BadgeCheck, CalendarClock, MapPin, Sparkles, UserRound } from "lucide-react"
import Link from "next/link"

const process = [
  { icon: UserRound, label: "Personal Details" },
  { icon: Sparkles, label: "Experience & Skills" },
  { icon: MapPin, label: "Location" },
  { icon: CalendarClock, label: "Availability" },
  { icon: BadgeCheck, label: "Verification" },
]

export function BecomeCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary to-accent p-8 text-primary-foreground sm:p-12 lg:p-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Your Care Can Make a Difference.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-primary-foreground/85">
              Join CareSure and connect with families looking for trusted caregiving support in your community.
            </p>
            <Link
              href="/caretaker"
              className="mt-8 inline-flex rounded-2xl bg-primary-foreground px-8 py-4 text-base font-bold text-primary shadow-lg transition-all hover:bg-primary-foreground/90 active:translate-y-px"
            >
              Create Caretaker Profile
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {process.map((p, i) => (
              <div
                key={p.label}
                className="flex flex-col items-center gap-2 rounded-2xl bg-primary-foreground/10 p-4 text-center backdrop-blur"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-foreground/15">
                  <p.icon className="size-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wide text-primary-foreground/70">
                  Step {i + 1}
                </span>
                <span className="text-sm font-semibold leading-tight">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
