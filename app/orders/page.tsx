// app/orders/page.tsx
// Order history — Server Component

import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatDate, getStatusColor } from '@/utils/format';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { PLACEHOLDER_IMAGE } from '@/utils/constants';
import Link from 'next/link';

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: orders } = await supabase
    .from('orders')
    .select(`*, order_items(*, product:products(*))`)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl font-bold text-slate-800 mb-8">
        My Orders
      </h1>

      {/* Success Banner */}
      {params.success && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 flex items-center gap-4 animate-fade-in-up">
          <span className="text-3xl">🎉</span>
          <div>
            <p className="font-semibold text-green-800">Order Placed Successfully!</p>
            <p className="text-green-600 text-sm">
              Your cake is being prepared with love. We&apos;ll notify you when it ships.
            </p>
          </div>
        </div>
      )}

      {!orders?.length ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-6">📦</div>
          <h2 className="font-display text-2xl text-slate-600 mb-4">
            No orders yet
          </h2>
          <p className="text-slate-400 mb-8">
            Your order history will appear here once you make a purchase.
          </p>
          <Link
            href="/shop"
            className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-8 py-3 rounded-full transition-colors btn-press"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl shadow-sm overflow-hidden animate-fade-in-up"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-rose-50 bg-rose-50/30">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Order ID</p>
                  <p className="font-mono text-sm text-slate-700">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Date</p>
                  <p className="text-sm text-slate-700">{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Total</p>
                  <p className="text-sm font-bold text-rose-500">
                    {formatPrice(order.total_amount)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4 space-y-3">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product?.image_url ?? PLACEHOLDER_IMAGE}
                        alt={item.product?.name ?? 'Product'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">
                        {item.product?.name ?? 'Deleted Product'}
                      </p>
                      <p className="text-sm text-slate-400">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-800">
                      {formatPrice(item.quantity * item.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
