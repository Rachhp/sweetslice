// app/admin/layout.tsx
// Admin layout — checks admin access server-side

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL;

  if (!user || user.email !== adminEmail) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-rose-100 min-h-screen p-6 flex flex-col gap-2">
        <div className="mb-6">
          <span className="font-display text-lg font-bold text-slate-800">Admin Panel</span>
          <p className="text-xs text-slate-400 mt-0.5">SweetSlice</p>
        </div>

        {[
          { href: '/admin', label: '📊 Dashboard' },
          { href: '/admin/products', label: '🎂 Products' },
          { href: '/admin/orders', label: '📦 Orders' },
          { href: '/shop', label: '← View Shop' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            {label}
          </Link>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-rose-50/30">
        {children}
      </main>
    </div>
  );
}
