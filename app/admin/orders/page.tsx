// app/admin/orders/page.tsx

import { createAdminClient } from '@/lib/supabase/server';
import { formatPrice, formatDate } from '@/utils/format';
import { ORDER_STATUSES } from '@/utils/constants';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function updateOrderStatus(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const status = formData.get('status') as string;
  const supabase = createAdminClient();
  await supabase.from('orders').update({ status }).eq('id', id);
  revalidatePath('/admin/orders');
}

export default async function AdminOrdersPage() {
  let orders: any[] = [];

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Orders fetch error:', error.message);
    } else {
      orders = data ?? [];
    }
  } catch (err) {
    console.error('Admin orders error:', err);
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="font-display text-2xl text-red-600 mb-2">
          Error loading orders
        </h2>
        <p className="text-slate-500">Please check your environment variables.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-slate-800 mb-8">
        All Orders ({orders.length})
      </h1>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <p className="font-mono text-sm text-slate-500">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-slate-400 text-sm">
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Customer ID: {order.user_id.slice(0, 8)}...
                </p>
                <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-1 rounded-full capitalize
                  ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'paid' ? 'bg-purple-100 text-purple-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'}`}>
                  {order.status}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <p className="font-bold text-rose-500 text-lg">
                  {formatPrice(order.total_amount)}
                </p>
                <form action={updateOrderStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={order.id} />
                  <select
                    name="status"
                    defaultValue={order.status}
                    className="text-sm border border-rose-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Update
                  </button>
                </form>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-rose-50 pt-4">
              <p className="text-xs font-semibold text-slate-500 mb-2">
                ORDER ITEMS:
              </p>
              <div className="flex flex-wrap gap-2">
                {order.order_items?.map((item: any) => (
                  <span
                    key={item.id}
                    className="bg-rose-50 text-rose-700 text-xs px-3 py-1 rounded-full"
                  >
                    {item.product?.name ?? 'Deleted Product'} ×{item.quantity} — {formatPrice(item.price)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-16 text-slate-400 bg-white rounded-2xl">
            No orders yet.
          </div>
        )}
      </div>
    </div>
  );
}