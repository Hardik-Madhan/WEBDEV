"use client"
import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { SiteNavbar } from '@/components/site-navbar'
import { SiteFooter } from '@/components/site-footer'

// Firefox supports autocomplete on buttons to avoid restoring their dynamic disabled state.
const buttonAutocomplete = { autoComplete: 'off' }

export const inputClass = 'mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
export function AccountForm({ mode }: { mode: 'login' | 'signup' }) {
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); setError(''); setBusy(true); const form = new FormData(e.currentTarget)
    if (mode === 'signup' && form.get('password') !== form.get('confirmPassword')) { setError('Passwords do not match.'); setBusy(false); return }
    try { const response = await fetch('/api/account', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...Object.fromEntries(form), action: mode }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); window.location.assign('/dashboard') } catch (err) { setError(err instanceof Error ? err.message : 'Please try again.'); setBusy(false) }
  }
  return <div className="min-h-screen bg-background"><SiteNavbar/><main className="mx-auto max-w-xl px-4 py-14"><div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-9"><p className="text-sm font-semibold text-primary">CARE SURE ACCOUNT</p><h1 className="mt-2 text-3xl font-bold">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1><p className="mt-2 text-sm text-muted-foreground">{mode === 'login' ? 'Log in to manage your care requests and profile.' : 'Tell us about yourself so your care requests include the right details.'}</p><p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Prototype: information is stored locally on this computer. Do not use real sensitive information.</p>
  <form method="post" onSubmit={submit} className="mt-6 space-y-4">{mode === 'signup' && <><Field label="Full name" name="name" required autoComplete="name" minLength={2} maxLength={100}/><Field label="Phone number" name="phone" type="tel" required autoComplete="tel" minLength={7} maxLength={30}/><Field label="Area and city" name="location" required autoComplete="address-level2" maxLength={200}/><label className="block text-sm font-semibold">Care needs <span className="font-normal text-muted-foreground">(optional)</span><textarea className={inputClass} name="careNeeds" rows={3} maxLength={1000} placeholder="What kind of support are you looking for?" /></label></>}
  <Field label="Email" name="email" type="email" required autoComplete="email" maxLength={254}/><Field label="Password" name="password" type="password" required minLength={8} maxLength={128} autoComplete={mode === 'login' ? 'current-password' : 'new-password'}/>{mode === 'signup' && <Field label="Confirm password" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password"/>}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<button {...buttonAutocomplete} disabled={busy || !ready} className="w-full rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-50">{!ready || busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</button></form><p className="mt-5 text-center text-sm text-muted-foreground">{mode === 'login' ? 'New to CareSure? ' : 'Already have an account? '}<Link className="font-semibold text-primary hover:underline" href={mode === 'login' ? '/signup' : '/login'}>{mode === 'login' ? 'Sign up' : 'Log in'}</Link></p></div></main><SiteFooter/></div>
}
export function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) { return <label className="block text-sm font-semibold">{label}<input className={inputClass} {...props}/></label> }
