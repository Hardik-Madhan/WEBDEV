import { Counter } from "@/components/counter"
import { Reveal } from "@/components/reveal"
import { stats } from "@/lib/data"

export function Stats() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 90} className="text-center">
            <p className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
              <Counter value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
            </p>
            <p className="mt-1.5 text-sm font-medium text-muted-foreground">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
