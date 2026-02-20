'use client';

// app/cart/page.tsx
// Cart page with Supabase Realtime sync

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/hooks/useCart';
import { CartItem } from '@/components/CartItem';
import { formatPrice } from '@/utils/format';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default function CartPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const { cartItems, loading, cartTotal, updateQuantity, removeFromCart, clearCart } =
    useCart(user?.id);

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) return;
    setCheckingOut(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          cartItems,
          totalAmount: cartTotal,
        }),
      });

      if (response.ok) {
        await clearCart();
        router.push('/orders?success=true');
      } else {
        const err = await response.json();
        alert(err.error || 'Checkout failed. Please try again.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-8 w-32 skeleton rounded-lg mb-8" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 skeleton rounded-2xl mb-4" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl font-bold text-slate-800 mb-8">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="font-display text-2xl text-slate-600 mb-4">
            Your cart is empty
          </h2>
          <p className="text-slate-400 mb-8">
            Looks like you haven&apos;t added any cakes yet!
          </p>
          <Link
            href="/shop"
            className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-8 py-3 rounded-full transition-colors btn-press"
          >
            Browse Cakes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-3xl shadow-sm p-6 h-fit sticky top-6">
            <h2 className="font-display text-xl font-bold text-slate-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="border-t border-rose-100 pt-3 flex justify-between font-bold text-lg text-slate-800">
                <span>Total</span>
                <span className="text-rose-500">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold py-4 rounded-2xl transition-all duration-200 btn-press shadow-md hover:shadow-lg text-lg"
            >
              {checkingOut ? 'Placing Order…' : 'Place Order'}
            </button>

            <Link
              href="/shop"
              className="block text-center text-sm text-slate-400 hover:text-rose-500 transition-colors mt-4"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
