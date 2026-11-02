import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { randomUUID, randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto'
import path from 'node:path'
import { cookies } from 'next/headers'

export type User = { id: string; name: string; email: string; phone: string; location: string; careNeeds: string; salt: string; passwordHash: string; saved: string[] }
export type Session = { hash: string; userId: string; expires: number }
const base = path.join(process.cwd(), 'data')
let queue: Promise<unknown> = Promise.resolve()
export async function readRecords<T>(name: string): Promise<T[]> {
  try { const value = JSON.parse(await readFile(path.join(base, name), 'utf8')); if (!Array.isArray(value)) throw new Error('Invalid data'); return value }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []; throw error }
}
export function changeRecords<T, R>(name: string, fn: (records: T[]) => R): Promise<R> {
  const task = queue.then(async () => { await mkdir(base, { recursive: true }); const records = await readRecords<T>(name); const result = fn(records); const file = path.join(base, name); const temp = `${file}.${randomUUID()}.tmp`; await writeFile(temp, JSON.stringify(records, null, 2), { mode: 0o600 }); await rename(temp, file); return result })
  queue = task.catch(() => {}); return task
}
export function passwordRecord(password: string) { const salt = randomBytes(16).toString('hex'); return { salt, passwordHash: scryptSync(password, salt, 64).toString('hex') } }
export function checkPassword(password: string, user: User) { const expected = Buffer.from(user.passwordHash, 'hex'); const actual = scryptSync(password, user.salt, 64); return expected.length === actual.length && timingSafeEqual(expected, actual) }
const digest = (token: string) => createHash('sha256').update(token).digest('hex')
export async function createSession(userId: string) { const token = randomBytes(32).toString('hex'); await changeRecords<Session, void>('sessions.json', sessions => { sessions.push({ hash: digest(token), userId, expires: Date.now() + 7 * 86400000 }) }); (await cookies()).set('care_session', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 7 * 86400 }) }
export async function currentUser() { const token = (await cookies()).get('care_session')?.value; if (!token) return null; const session = (await readRecords<Session>('sessions.json')).find(s => s.hash === digest(token) && s.expires > Date.now()); if (!session) return null; return (await readRecords<User>('users.json')).find(u => u.id === session.userId) || null }
export async function logout() { const store = await cookies(); const token = store.get('care_session')?.value; if (token) await changeRecords<Session, void>('sessions.json', sessions => { const i = sessions.findIndex(s => s.hash === digest(token)); if (i >= 0) sessions.splice(i, 1) }); store.delete('care_session') }
export function publicUser(user: User) { return { id: user.id, name: user.name, email: user.email, phone: user.phone, location: user.location, careNeeds: user.careNeeds, saved: user.saved || [] } }
