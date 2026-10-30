import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { appendJsonRecord } from '@/lib/json-store'
import { currentUser } from '@/lib/account-store'
import { applications, profile } from '@/lib/applications'
export const runtime = 'nodejs'
export async function GET() { return NextResponse.json({ caretakers: (await applications()).map(profile) }) }
export async function POST(request: Request) {
  const user = await currentUser(); if (!user) return NextResponse.json({ error: 'Please log in before applying.' }, { status: 401 })
  try {
    const form = await request.formData()
    const fields = ['name', 'phone', 'location', 'idType', 'experience', 'skills', 'careTypes', 'availability', 'languages', 'about', 'price'] as const
    const values = Object.fromEntries(fields.map(key => [key, String(form.get(key) || '').trim()])) as Record<typeof fields[number], string>
    if (fields.some(key => !values[key] || values[key].length > 2000) || values.name.length < 2 || values.phone.length < 7 || !/^\d{1,2}$/.test(values.experience) || !/^\d{1,5}$/.test(values.price) || Number(values.price) < 1) return NextResponse.json({ error: 'Please complete every field with valid details.' }, { status: 422 })
    const photo = form.get('photo'), idPhoto = form.get('idPhoto')
    if (!(photo instanceof File) || !(idPhoto instanceof File) || [photo, idPhoto].some(f => !['image/jpeg', 'image/png', 'image/webp'].includes(f.type) || f.size < 1 || f.size > 5 * 1024 * 1024)) return NextResponse.json({ error: 'Upload a profile photo and ID image (JPG, PNG, or WebP, up to 5 MB each).' }, { status: 422 })
    if ((await applications()).some(a => a.userId === user.id)) return NextResponse.json({ error: 'You already submitted a caretaker application.' }, { status: 409 })
    const id = randomUUID(), folder = path.join(process.cwd(), 'data', 'uploads', id); await mkdir(folder, { recursive: true })
    await Promise.all([writeFile(path.join(folder, 'photo'), Buffer.from(await photo.arrayBuffer()), { mode: 0o600 }), writeFile(path.join(folder, 'id-photo'), Buffer.from(await idPhoto.arrayBuffer()), { mode: 0o600 })])
    await appendJsonRecord('caretaker-applications.json', { id, userId: user.id, email: user.email, ...values, submittedAt: new Date().toISOString(), photoType: photo.type, status: 'Submitted' })
    return NextResponse.json({ ok: true, id }, { status: 201 })
  } catch { return NextResponse.json({ error: 'Unable to save your application. Please try again.' }, { status: 500 }) }
}
