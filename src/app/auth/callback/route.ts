import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as 'email' | 'recovery' | 'invite' | 'email_change' | null

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

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  } else if (token_hash && type) {
    await supabase.auth.verifyOtp({ token_hash, type })
  }

  // Auto-crear perfil si es el primer login
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existing) {
      const username = user.email?.split('@')[0]?.replace(/[^a-z0-9_]/gi, '') ?? `user_${Date.now()}`
      await supabase.from('profiles').insert({
        id: user.id,
        username,
        full_name: user.user_metadata?.full_name ?? null,
        avatar_url: user.user_metadata?.avatar_url ?? null,
      })
    }
  }

  return NextResponse.redirect(`${origin}/feed`)
}
