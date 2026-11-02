import { Reveal } from "@/components/reveal"
import { ArrowRight, Check, HeartHandshake, Search } from "lucide-react"
import Link from "next/link"

const journeys = [
  {
    id: "find",
    icon: Search,
    title: "Find a Caretaker",
    description:
      "Find trusted caretakers based on location, care needs, experience, ratings, availability, and distance.",
    features: ["Nearby caretakers", "Unverified profiles", "Sample ratings", "Availability", "Easy booking"],
    cta: "Find Caretakers",
    href: "/find",
    accent: false,
  },
  {
    id: "become",
    icon: HeartHandshake,
    title: "Become a Caretaker",
    description:
      "Offer your caregiving skills and connect with families who need trusted support in your community.",
    features: ["Create your profile", "Add experience & skills", "Set availability", "View local requests", "Share your skills"],
    cta: "Become a Caretaker",
    href: "/caretaker",
    accent: true,
  },
]

export function Journeys() {
  return (
    <section id="become" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Care That Works Both Ways
        </h2>
        <p className="mt-3 text-pretty text-lg text-muted-foreground">
          Whether you need support or want to provide it, CareSure connects the right people.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {journeys.map((j, i) => (
          <Reveal key={j.id} delay={i * 120}>
            <div
              className={
                "group relative flex h-full flex-col overflow-hidden rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl " +
                (j.accent
                  ? "border-primary/20 bg-gradient-to-br from-primary to-accent text-primary-foreground hover:shadow-primary/25"
                  : "border-border bg-card hover:shadow-primary/5")
              }
            >
              <span
                className={
                  "flex size-14 items-center justify-center rounded-2xl " +
                  (j.accent ? "bg-primary-foreground/15 text-primary-foreground" : "bg-primary/10 text-primary")
                }
              >
                <j.icon className="size-7" />
              </span>
              <h3 className="mt-5 text-2xl font-bold">{j.title}</h3>
              <p className={"mt-2 leading-relaxed " + (j.accent ? "text-primary-foreground/85" : "text-muted-foreground")}>
                {j.description}
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {j.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm font-medium">
                    <span
                      className={
                        "flex size-5 items-center justify-center rounded-full " +
                        (j.accent ? "bg-primary-foreground/20" : "bg-success/15 text-success")
                      }
                    >
                      <Check className="size-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={j.href}
                className={
                  "mt-8 inline-flex items-center gap-2 self-start rounded-2xl px-6 py-3 font-semibold transition-all active:translate-y-px " +
                  (j.accent
                    ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90")
                }
              >
                {j.cta}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
