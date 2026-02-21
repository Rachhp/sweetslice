// app/admin/orders/page.tsx
// Admin orders view with status management

import { createAdminClient } from '@/lib/supabase/server';
import { formatPrice, formatDate, getStatusColor } from '@/utils/format';
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
  const supabase = createAdminClient();

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*, product:products(name)),
      user:auth.users!user_id(email)
    `)
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-slate-800 mb-8">
        All Orders
      </h1>

      <div className="space-y-4">
        {orders?.map((order: any) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <p className="font-mono text-sm text-slate-500">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-slate-400 text-sm">{formatDate(order.created_at)}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Customer: {order.user?.email ?? order.user_id.slice(0, 8)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-rose-500 text-lg">
                  {formatPrice(order.total_amount)}
                </p>
                {/* Status Update Form */}
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

            {/* Items */}
            <div className="border-t border-rose-50 pt-4">
              <div className="flex flex-wrap gap-2">
                {order.order_items?.map((item: any) => (
                  <span
                    key={item.id}
                    className="bg-rose-50 text-rose-700 text-xs px-3 py-1 rounded-full"
                  >
                    {item.product?.name ?? 'Deleted'} ×{item.quantity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {!orders?.length && (
          <div className="text-center py-16 text-slate-400 bg-white rounded-2xl">
            No orders yet.
          </div>
        )}
      </div>
    </div>
  );
}
