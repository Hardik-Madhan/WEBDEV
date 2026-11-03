import { Reveal } from "@/components/reveal"
import { Eye, LifeBuoy, ShieldCheck, Lock } from "lucide-react"

const cards = [
  { icon: ShieldCheck, title: "Police & ID Verification", text: "Every caregiver undergoes government ID screening and criminal record verification." },
  { icon: Eye, title: "Transparent Profiles", text: "Review verified certifications, medical experience, and genuine family ratings." },
  { icon: Lock, title: "Confirmed Shifts", text: "Bookings are scheduled with clear hourly rates and guaranteed caregiver arrival." },
  { icon: LifeBuoy, title: "24/7 Care Support", text: "Our dedicated care coordinators are available round-the-clock for family assistance." },
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
          We maintain rigorous vetting standards and continuous monitoring so your family receives safe, dignified care.
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
