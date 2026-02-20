// components/ProductCard.tsx
// Product card used in shop and homepage

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/utils/format';
import { PLACEHOLDER_IMAGE } from '@/utils/constants';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-rose-50">
          <Image
            src={product.image_url ?? PLACEHOLDER_IMAGE}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className="bg-white/90 text-rose-600 text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm capitalize">
              {product.category}
            </span>
            {isOutOfStock && (
              <span className="bg-slate-800/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                Sold Out
              </span>
            )}
            {isLowStock && (
              <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                Only {product.stock} left!
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-display font-bold text-slate-800 text-lg leading-tight mb-1 group-hover:text-rose-500 transition-colors">
            {product.name}
          </h3>
          <p className="text-slate-400 text-xs line-clamp-2 mb-3">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-rose-500 text-lg">
              {formatPrice(product.price)}
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400'
                  : 'bg-rose-500 text-white group-hover:bg-rose-600'
              }`}
            >
              {isOutOfStock ? 'Unavailable' : 'Order'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
