import { SiteFooter } from "@/components/site-footer"
import { SiteNavbar } from "@/components/site-navbar"
import { BadgeCheck, HeartHandshake, MapPin, ShieldCheck, UsersRound } from "lucide-react"
import Link from "next/link"

const principles = [
  { icon: ShieldCheck, title: "Safety comes first", text: "Profiles highlight identity checks, experience, and community reviews so families can make informed choices." },
  { icon: HeartHandshake, title: "Care is personal", text: "Every family and caretaker is different. We make it easier to compare support and find a good fit." },
  { icon: UsersRound, title: "Communities matter", text: "Care works best close to home. CareSure helps families discover local support in their community." },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-secondary/40 via-background to-background">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground"><HeartHandshake className="size-4 text-primary" /> ABOUT CARESURE</p>
            <h1 className="mt-5 max-w-4xl text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">Trusted care should be easier to <span className="text-primary">find.</span></h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">CareSure connects families with nearby caretakers, bringing profiles, availability, and care options together in one place.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90" href="/find">Explore caretakers</Link><Link className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition hover:bg-muted" href="/contact">Talk to our team</Link></div>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center"><p className="text-xs font-bold uppercase tracking-wider text-primary">OUR PURPOSE</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Helping families make care decisions with more confidence.</h2><p className="mt-5 text-base leading-relaxed text-muted-foreground">Finding dependable care for a parent, a patient, or a child can take time and trust. CareSure brings practical details into view—care types, experience, reviews, location, and availability—so families can compare options and start a conversation.</p><p className="mt-4 text-base leading-relaxed text-muted-foreground">Caretakers can also share their skills and connect with families looking for help in their community. We’re building a more approachable way to find and offer care.</p></div>
          <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-primary/10 via-secondary to-accent/10 p-8"><div className="absolute -right-12 -top-12 size-64 rounded-full bg-primary/10 blur-3xl" /><div className="relative grid size-56 place-items-center rounded-full border border-primary/20 bg-card/80 shadow-xl shadow-primary/10"><div className="grid size-36 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30"><HeartHandshake className="size-16" /></div><span className="absolute -right-5 top-8 rounded-2xl border border-border bg-card p-3 text-primary shadow-md"><BadgeCheck className="size-6" /></span><span className="absolute -bottom-2 left-2 rounded-2xl border border-border bg-card p-3 text-accent shadow-md"><MapPin className="size-6" /></span></div><p className="absolute bottom-5 right-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">CARE THAT FEELS CLOSER</p></div>
        </section>
        <section className="border-y border-border bg-card"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-wider text-primary">WHAT GUIDES US</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">A thoughtful place to begin.</h2></div><div className="mt-8 grid gap-5 md:grid-cols-3">{principles.map(({icon:Icon,title,text})=><article key={title} className="rounded-2xl border border-border bg-background p-6"><span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div></div></section>
      </main>
      <SiteFooter />
    </div>
  )
}
