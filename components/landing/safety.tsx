import { Reveal } from "@/components/reveal"
import { Eye, LifeBuoy, ShieldCheck, Lock } from "lucide-react"

const cards = [
  { icon: ShieldCheck, title: "Verified Caretakers", text: "Every caretaker completes identity and profile verification before joining." },
  { icon: Eye, title: "Transparent Profiles", text: "Experience, skills, ratings and reviews are always visible upfront." },
  { icon: Lock, title: "Secure Booking", text: "Clear booking information and confirmation for total peace of mind." },
  { icon: LifeBuoy, title: "Support", text: "Easy access to help whenever you need a hand along the way." },
]

export function Safety() {
  return (
    <section id="safety" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-success/12 px-3 py-1.5 text-sm font-semibold text-success">
          <ShieldCheck className="size-4" /> Trust & Safety
        </span>
        <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Your Safety Comes First.
        </h2>
        <p className="mt-3 text-pretty text-lg text-muted-foreground">
          Built-in protections at every step so you can focus on what matters — care.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 90}>
            <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <c.icon className="size-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-foreground">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
