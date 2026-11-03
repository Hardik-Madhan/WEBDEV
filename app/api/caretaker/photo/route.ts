import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { applications } from '@/lib/applications'

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id') || ''
  try {
    const bytes = await readFile(path.join(process.cwd(), 'data', 'uploads', id, 'photo'))
    return new Response(bytes, {
      headers: {
        'Content-Type': 'image/png',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch {
    // Graceful fallback to default caretaker image so no broken image icon is ever displayed
    try {
      const fallback = await readFile(path.join(process.cwd(), 'public', 'images', 'caretaker-1.png'))
      return new Response(fallback, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400',
        },
      })
    } catch {
      return new Response(null, { status: 404 })
    }
  }
}
