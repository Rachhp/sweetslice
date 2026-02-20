// app/api/orders/route.ts
// Create orders — validates auth and processes checkout

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { CartItem } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cartItems, totalAmount } = await request.json();

    if (!cartItems?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Use admin client for transaction
    const admin = createAdminClient();

    // Create order
    const { data: order, error: orderError } = await admin
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: totalAmount,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Create order items
    const orderItems = (cartItems as CartItem[]).map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product?.price ?? 0,
    }));

    const { error: itemsError } = await admin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      // Rollback order if items fail
      await admin.from('orders').delete().eq('id', order.id);
      return NextResponse.json({ error: 'Failed to save order items' }, { status: 500 });
    }

    // Reduce stock for each product
    for (const item of cartItems as CartItem[]) {
      const { data: product } = await admin
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .single();

      if (product) {
        await admin
          .from('products')
          .update({ stock: Math.max(0, product.stock - item.quantity) })
          .eq('id', item.product_id);
      }
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error('[POST /api/orders]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`*, order_items(*, product:products(*))`)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders });
}
