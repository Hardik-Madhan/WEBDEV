import { Logo } from "@/components/site-navbar"
import Link from "next/link"

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Find a Caretaker", href: "/find" },
      { label: "Become a Caretaker", href: "/caretaker" },
      { label: "How It Works", href: "/#how" },
      { label: "Emergency Care", href: "/#emergency" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Safety", href: "/#safety" },
      { label: "Contact", href: "/contact" },
    ],
  },

]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Making trusted care easier to find. Explore care profiles and manage your requests in this prototype.
          </p>

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
