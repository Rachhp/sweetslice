import { createAdminClient } from '@/lib/supabase/server';
import { AdminProductForm } from '@/components/AdminProductForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product = null;

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    product = data;
  } catch (err) {
    console.error('Edit page error:', err);
  }

  if (!product) notFound();

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="text-sm text-slate-400 hover:text-rose-500 transition-colors"
        >
          ← Back to Products
        </Link>
        <h1 className="font-display text-3xl font-bold text-slate-800">
          Edit Product
        </h1>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <AdminProductForm mode="edit" product={product} />
      </div>
    </div>
  );
}