import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: object) {
          try { cookieStore.set({ name, value, ...options }) } catch {}
        },
        remove(name: string, options: object) {
          try { cookieStore.set({ name, value: '', ...options }) } catch {}
        },
      },
    }
  )

  await supabase.auth.signOut()

  return NextResponse.redirect(new URL('/', request.url))
}
