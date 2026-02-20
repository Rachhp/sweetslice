'use client';

// lib/hooks/useCart.ts
// Manages cart state with Supabase Realtime sync across tabs

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { CartItem } from '@/lib/types';
import { showToast } from '@/components/ui/Toast';

export function useCart(userId?: string) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
//  const { showToast } = useToast();

  /** Fetch cart items with product details */
  const fetchCart = useCallback(async () => {
    if (!userId) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`*, product:products(*)`)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setCartItems(data as CartItem[]);
    }
    setLoading(false);
  }, [userId]);

  /** Add item to cart or increment quantity */
  const addToCart = async (productId: string, quantity = 1) => {
    if (!userId) {
      showToast('Please log in to add items to your cart', 'error');
      return;
    }

    // Check if item already in cart
    const existing = cartItems.find((i) => i.product_id === productId);

    if (existing) {
      await updateQuantity(existing.id, existing.quantity + quantity);
    } else {
      const { error } = await supabase.from('cart_items').insert({
        user_id: userId,
        product_id: productId,
        quantity,
      });

      if (error) {
        showToast('Failed to add item to cart', 'error');
      } else {
        showToast('Added to cart! 🎂', 'success');
        await fetchCart();
      }
    }
  };

  /** Update item quantity */
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (error) {
      showToast('Failed to update quantity', 'error');
    } else {
      await fetchCart();
    }
  };

  /** Remove item from cart */
  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      showToast('Failed to remove item', 'error');
    } else {
      showToast('Item removed from cart', 'info');
      await fetchCart();
    }
  };

  /** Clear entire cart (after order placed) */
  const clearCart = async () => {
    if (!userId) return;
    await supabase.from('cart_items').delete().eq('user_id', userId);
    setCartItems([]);
  };

  /** Cart totals */
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Initial fetch
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Realtime subscription — syncs across browser tabs
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`cart:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchCart();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchCart]);

  return {
    cartItems,
    loading,
    cartTotal,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refetch: fetchCart,
  };
}
