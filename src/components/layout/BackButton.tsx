'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
      aria-label="Volver"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  )
}
