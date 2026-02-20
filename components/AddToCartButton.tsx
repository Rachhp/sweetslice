'use client';

// components/AddToCartButton.tsx
// Client component for adding products to cart from product detail page

import { useState } from 'react';
import { useCart } from '@/lib/hooks/useCart';
import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
  productId: string;
  stock: number;
  userId?: string;
}

export function AddToCartButton({ productId, stock, userId }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart(userId);
  const router = useRouter();

  const handleAdd = async () => {
    if (!userId) {
      router.push('/login');
      return;
    }
    setAdding(true);
    await addToCart(productId, quantity);
    setAdding(false);
  };

  if (stock === 0) {
    return (
      <button
        disabled
        className="w-full bg-slate-100 text-slate-400 font-bold py-4 px-6 rounded-2xl cursor-not-allowed text-lg"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Quantity selector */}
      <div className="flex items-center border-2 border-rose-200 rounded-2xl overflow-hidden">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-4 py-3 text-slate-600 hover:bg-rose-50 transition-colors font-bold text-lg"
        >
          −
        </button>
        <span className="px-5 py-3 font-bold text-slate-800 text-lg min-w-[3rem] text-center">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
          className="px-4 py-3 text-slate-600 hover:bg-rose-50 transition-colors font-bold text-lg"
        >
          +
        </button>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAdd}
        disabled={adding}
        className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 btn-press shadow-md hover:shadow-lg text-lg flex items-center justify-center gap-2"
      >
        {adding ? (
          <>
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Adding…
          </>
        ) : (
          <>
            🛒 Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
