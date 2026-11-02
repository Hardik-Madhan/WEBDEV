import { Rating } from "@/components/badges"
import { Reveal } from "@/components/reveal"
import { testimonials } from "@/lib/data"
import { Quote } from "lucide-react"

export function Testimonials() {
  return (
    <section className="bg-card py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Trusted by Families
          </h2>
          <p className="mt-3 text-pretty text-lg text-muted-foreground">
            Real stories from families who found the right care with CareSure.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 110}>
              <figure className="flex h-full flex-col rounded-3xl border border-border bg-background p-7 shadow-sm">
                <Quote className="size-8 text-primary/25" />
                <blockquote className="mt-4 flex-1 text-pretty leading-relaxed text-foreground">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.photo || "/placeholder.svg"}
                    alt={`Photo of ${t.name}`}
                    className="size-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.careType}</p>
                  </div>
                  <Rating rating={t.rating} />
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
