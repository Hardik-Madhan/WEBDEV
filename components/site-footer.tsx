import { Logo } from "@/components/site-navbar"
import { AtSign, Globe, MessageCircle, Send } from "lucide-react"
import Link from "next/link"

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Find a Caretaker", href: "/find" },
      { label: "Become a Caretaker", href: "/#become" },
      { label: "How It Works", href: "/#how" },
      { label: "Emergency Care", href: "/#emergency" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Safety", href: "/#safety" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Help", href: "#" },
    ],
  },
]

const socials = [AtSign, MessageCircle, Send, Globe]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Making trusted care easier to find. Compare verified caretakers near you and book with confidence.
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-bold text-foreground">{col.title}</h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 CareSure. Built with care.</p>
          <p className="text-xs">A prototype experience · Not a substitute for emergency medical services.</p>
        </div>
      </div>
    </footer>
  )
}
