// app/admin/page.tsx
// Admin dashboard with stats overview

import { createAdminClient } from '@/lib/supabase/server';
import { formatPrice } from '@/utils/format';

export default async function AdminDashboard() {
  const supabase = createAdminClient();

  const [
    { count: totalProducts },
    { count: totalOrders },
    { data: revenueData },
    { count: pendingOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total_amount').eq('status', 'paid'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  const totalRevenue = revenueData?.reduce(
    (sum, o) => sum + (o.total_amount ?? 0), 0
  ) ?? 0;

  const stats = [
    { label: 'Total Products',   value: totalProducts ?? 0,          icon: '🎂', color: 'bg-rose-100 text-rose-700' },
    { label: 'Total Orders',     value: totalOrders ?? 0,            icon: '📦', color: 'bg-purple-100 text-purple-700' },
    { label: 'Pending Orders',   value: pendingOrders ?? 0,          icon: '⏳', color: 'bg-amber-100 text-amber-700' },
    { label: 'Revenue (Paid)',   value: formatPrice(totalRevenue),   icon: '💰', color: 'bg-green-100 text-green-700' },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-slate-800 mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl text-2xl ${stat.color} mb-4`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-display text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/admin/products', label: '+ Add Product', color: 'bg-rose-500 text-white' },
            { href: '/admin/orders',   label: 'View Orders',   color: 'bg-slate-100 text-slate-700' },
            { href: '/shop',           label: 'View Shop',     color: 'bg-slate-100 text-slate-700' },
          ].map(({ href, label, color }) => (
            <a
              key={href}
              href={href}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80 ${color}`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
