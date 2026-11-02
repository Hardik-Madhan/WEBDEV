import { NextResponse } from 'next/server'
import { currentUser, readRecords } from '@/lib/account-store'
import { applications } from '@/lib/applications'
export async function GET() { const user = await currentUser(); if (!user) return NextResponse.json({ error:'Please log in.' }, {status:401}); const own = (await applications()).filter(a => a.userId === user.id); const ids = new Set(own.map(a => `application-${a.id}`)); const bookings = await readRecords<{caretakerId:string}>('bookings.json'); return NextResponse.json({ applications: own, requests: bookings.filter(b => ids.has(b.caretakerId)) }) }
