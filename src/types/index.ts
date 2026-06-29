export type Category = {
  id: number
  slug: string
  name: string
  icon: string
  color: string
  type: 'emergency' | 'commercial'
  sort_order: number
  is_active: boolean
}

export type Profile = {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  whatsapp: string | null
  bio: string | null
  city: string | null
  state: string | null
  is_verified: boolean
  created_at: string
}

export type ListingImage = {
  id: string
  listing_id: string
  url: string
  is_cover: boolean
  sort_order: number
}

export type Listing = {
  id: string
  user_id: string
  category_id: number
  title: string
  description: string | null
  price: number
  currency: string
  condition: string | null
  pickup_only: boolean
  city: string | null
  state: string | null
  address_hint: string | null
  status: 'active' | 'sold' | 'reserved' | 'paused' | 'deleted'
  views_count: number
  is_urgent: boolean
  is_featured: boolean
  expires_at: string
  created_at: string
  updated_at: string
  // Joined
  profiles?: Profile
  categories?: Category
  listing_images?: ListingImage[]
}

export type ListingCondition = 'nuevo' | 'como_nuevo' | 'bueno' | 'aceptable' | 'para_piezas'

export const CONDITIONS: Record<ListingCondition, string> = {
  nuevo: 'Nuevo',
  como_nuevo: 'Como nuevo',
  bueno: 'Bueno',
  aceptable: 'Aceptable',
  para_piezas: 'Para piezas',
}
