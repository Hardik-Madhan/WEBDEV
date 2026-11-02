"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { HeartHandshake, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type NavItem = {
  label: string
  icon: React.ComponentType<{ className?: string }>
  active?: boolean
}

export function DashboardShell({
  role,
  navItems,
  activeLabel,
  onNavigate,
  user,
  children,
}: {
  role: string
  navItems: NavItem[]
  activeLabel: string
  onNavigate: (label: string) => void
  user: { name: string; photo: string; sub: string }
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            className="grid h-9 w-9 place-items-center rounded-lg border border-border md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <HeartHandshake className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              Care<span className="text-primary">Sure</span>
            </span>
          </Link>
          <span className="ml-2 hidden rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary md:inline">
            {role}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 font-bold text-primary" aria-hidden="true">{user.name.charAt(0).toUpperCase()}</span>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.sub}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-6">
        {/* Sidebar - desktop */}
        <aside className="hidden w-60 shrink-0 md:block">
          <nav className="sticky top-20 flex flex-col gap-1">
            {navItems.map((item) => (
              <SidebarLink
                key={item.label}
                item={item}
                active={item.label === activeLabel}
                onClick={() => onNavigate(item.label)}
              />
            ))}
          </nav>
        </aside>

        {/* Sidebar - mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 bg-background p-4 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-bold">Menu</span>
                <button onClick={() => setOpen(false)} aria-label="Close menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <SidebarLink
                    key={item.label}
                    item={item}
                    active={item.label === activeLabel}
                    onClick={() => {
                      onNavigate(item.label)
                      setOpen(false)
                    }}
                  />
                ))}
              </nav>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}

function SidebarLink({
  item,
  active,
  onClick,
}: {
  item: NavItem
  active: boolean
  onClick: () => void
}) {
  const Icon = item.icon
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition",
        active ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/70 hover:bg-muted",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {item.label}
    </button>
  )
}
