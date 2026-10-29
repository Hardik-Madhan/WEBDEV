import { Reveal } from "@/components/reveal"
import { CalendarCheck, HeartHandshake, ListChecks, Search } from "lucide-react"

const steps = [
  { n: "01", icon: Search, title: "Search", text: "Enter your care requirement and location." },
  { n: "02", icon: ListChecks, title: "Compare", text: "Compare experience, ratings, reviews, distance and availability." },
  { n: "03", icon: CalendarCheck, title: "Book", text: "Select the caretaker, date and time." },
  { n: "04", icon: HeartHandshake, title: "Get Care", text: "Connect and receive trusted support." },
]

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 bg-card py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Getting Care Is Simple
          </h2>
          <p className="mt-3 text-pretty text-lg text-muted-foreground">
            Four easy steps from searching to receiving trusted care.
          </p>
        </Reveal>

        <div className="relative mt-14">
          {/* connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />
          <div className="grid gap-8 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 130} className="relative">
                <div className="flex flex-col items-start lg:items-center lg:text-center">
                  <div className="relative flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                    <s.icon className="size-6" />
                    <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full border-2 border-card bg-accent text-[10px] font-bold text-accent-foreground">
                      {i + 1}
                    </span>
                  </div>
                  <span className="mt-4 text-sm font-bold tracking-widest text-primary/50">{s.n}</span>
                  <h3 className="mt-1 text-xl font-bold text-foreground">{s.title}</h3>
                  <p className="mt-1.5 max-w-[15rem] text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
