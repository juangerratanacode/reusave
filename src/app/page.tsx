import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import LandingPage from '@/components/LandingPage'

export const dynamic = 'force-dynamic'

export default async function RootPage() {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (session) redirect('/feed')
  } catch {}

  return <LandingPage />
}
