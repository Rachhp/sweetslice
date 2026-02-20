// components/ui/Skeleton.tsx
// Loading skeleton components for smooth perceived performance

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 skeleton rounded-lg" />
        <div className="h-3 w-full skeleton rounded-lg" />
        <div className="h-3 w-2/3 skeleton rounded-lg" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 w-20 skeleton rounded-lg" />
          <div className="h-8 w-16 skeleton rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
      <div className="w-20 h-20 rounded-xl skeleton flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/2 skeleton rounded-lg" />
        <div className="h-4 w-1/4 skeleton rounded-lg" />
      </div>
      <div className="h-10 w-28 skeleton rounded-xl" />
      <div className="h-5 w-16 skeleton rounded-lg" />
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
      <div className="h-16 skeleton" />
      <div className="p-6 space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl skeleton flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 skeleton rounded-lg" />
              <div className="h-3 w-1/4 skeleton rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Generic inline skeleton bar */
export function Skeleton({
  className = '',
}: {
  className?: string;
}) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}
