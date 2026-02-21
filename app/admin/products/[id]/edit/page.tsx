// app/admin/products/[id]/edit/page.tsx

import { createAdminClient } from '@/lib/supabase/server';
import { AdminProductForm } from '@/components/AdminProductForm';
import { notFound } from 'next/navigation';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-slate-800 mb-8">
        Edit Product
      </h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <AdminProductForm mode="edit" product={product} />
      </div>
    </div>
  );
}


