import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { changeRecords, checkPassword, createSession, currentUser, logout, passwordRecord, publicUser, readRecords, type User } from '@/lib/account-store'
export const runtime = 'nodejs'
export async function GET() { const user = await currentUser(); return NextResponse.json({ user: user ? publicUser(user) : null }) }
export async function POST(request: Request) {
  try {
    const body = await request.json(); const action = body.action
    if (action === 'logout') { await logout(); return NextResponse.json({ ok: true }) }
    if (action === 'login') {
      const email = String(body.email || '').trim().toLowerCase(); const user = (await readRecords<User>('users.json')).find(u => u.email === email)
      if (!user || !checkPassword(String(body.password || ''), user)) return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 })
      await createSession(user.id); return NextResponse.json({ user: publicUser(user) })
    }
    if (action === 'signup') {
      const name = String(body.name || '').trim(), email = String(body.email || '').trim().toLowerCase(), phone = String(body.phone || '').trim(), location = String(body.location || '').trim(), careNeeds = String(body.careNeeds || '').trim(), password = String(body.password || '')
      if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || phone.length < 7 || phone.length > 30 || location.length < 2 || location.length > 200 || careNeeds.length > 1000 || password.length < 8 || password.length > 128) return NextResponse.json({ error: 'Please check your details. Passwords must be at least 8 characters.' }, { status: 422 })
      const user: User = { id: randomUUID(), name, email, phone, location, careNeeds, ...passwordRecord(password), saved: [] }
      const created = await changeRecords<User, boolean>('users.json', users => { if (users.some(u => u.email === email)) return false; users.push(user); return true })
      if (!created) return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
      await createSession(user.id); return NextResponse.json({ user: publicUser(user) }, { status: 201 })
    }
    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
  } catch { return NextResponse.json({ error: 'Unable to complete your request. Please try again.' }, { status: 500 }) }
}
export async function PATCH(request: Request) {
  const user = await currentUser(); if (!user) return NextResponse.json({ error: 'Please log in.' }, { status: 401 })
  try { const body = await request.json(); const name = String(body.name || '').trim(), phone = String(body.phone || '').trim(), location = String(body.location || '').trim(), careNeeds = String(body.careNeeds || '').trim()
    if (name.length < 2 || name.length > 100 || phone.length < 7 || phone.length > 30 || location.length < 2 || location.length > 200 || careNeeds.length > 1000) return NextResponse.json({ error: 'Please check your details.' }, { status: 422 })
    const updated = await changeRecords<User, User>('users.json', users => { const u = users.find(x => x.id === user.id)!; Object.assign(u, { name, phone, location, careNeeds }); return u }); return NextResponse.json({ user: publicUser(updated) })
  } catch { return NextResponse.json({ error: 'Could not save your profile.' }, { status: 500 }) }
}
