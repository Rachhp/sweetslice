// components/CartItem.tsx
// Individual cart item row with quantity controls and remove

import Image from 'next/image';
import { formatPrice } from '@/utils/format';
import { PLACEHOLDER_IMAGE } from '@/utils/constants';
import type { CartItem as CartItemType } from '@/lib/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const product = item.product;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 animate-fade-in-up">
      {/* Product Image */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={product?.image_url ?? PLACEHOLDER_IMAGE}
          alt={product?.name ?? 'Product'}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-800 truncate">
          {product?.name ?? 'Unknown Product'}
        </h3>
        <p className="text-rose-500 font-bold mt-0.5">
          {formatPrice(product?.price ?? 0)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2 border border-rose-200 rounded-xl px-1">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-rose-500 transition-colors font-bold"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-6 text-center font-bold text-slate-800 text-sm">
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-rose-500 transition-colors font-bold"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Line Total */}
      <p className="font-bold text-slate-800 min-w-[70px] text-right">
        {formatPrice((product?.price ?? 0) * item.quantity)}
      </p>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        className="text-slate-300 hover:text-red-400 transition-colors ml-1"
        aria-label="Remove item"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
