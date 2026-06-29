export default function ListingSkeleton() {
  return (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 animate-pulse">
      <div className="aspect-square bg-[#252525]" />
      <div className="p-2.5 space-y-2">
        <div className="h-2.5 bg-[#252525] rounded w-1/2" />
        <div className="h-3 bg-[#252525] rounded w-full" />
        <div className="h-3 bg-[#252525] rounded w-3/4" />
        <div className="h-4 bg-[#252525] rounded w-2/5 mt-1" />
      </div>
    </div>
  )
}

export function FeedSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <ListingSkeleton key={i} />
      ))}
    </div>
  )
}
