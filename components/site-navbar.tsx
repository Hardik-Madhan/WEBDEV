"use client"

import { cn } from "@/lib/utils"
import { HeartHandshake, Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Find Caretaker", href: "/find" },
  { label: "Become a Caretaker", href: "/#become" },
  { label: "How It Works", href: "/#how" },
  { label: "Safety", href: "/#safety" },
]

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
        <HeartHandshake className="size-5" />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-foreground">
        Care<span className="text-primary">Sure</span>
      </span>
    </Link>
  )
}

export function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-lg"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8",
          scrolled ? "h-15 py-2" : "h-18 py-3",
        )}
      >
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/dashboard"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Login
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Sign Up
          </Link>
          <Link
            href="/find"
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/30 transition-all hover:bg-primary/90 active:translate-y-px"
          >
            Find a Caretaker
          </Link>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          className="flex size-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted lg:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-x-0 top-[var(--nav-h,4.5rem)] z-40 origin-top bg-background transition-all duration-300 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-4">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-border px-4 py-3 text-center font-semibold text-foreground"
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-border px-4 py-3 text-center font-semibold text-foreground"
            >
              Sign Up
            </Link>
          </div>
          <Link
            href="/find"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-xl bg-primary px-4 py-3 text-center font-semibold text-primary-foreground"
          >
            Find a Caretaker
          </Link>
        </nav>
      </div>
    </header>
  )
}
