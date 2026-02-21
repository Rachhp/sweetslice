// app/admin/products/page.tsx

import { createAdminClient } from '@/lib/supabase/server';
import { AdminProductForm } from '@/components/AdminProductForm';
import { formatPrice } from '@/utils/format';
import Image from 'next/image';
import { PLACEHOLDER_IMAGE } from '@/utils/constants';
import { revalidatePath } from 'next/cache';

async function deleteProduct(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  try {
    const supabase = createAdminClient();
    await supabase.from('products').delete().eq('id', id);
    revalidatePath('/admin/products');
    revalidatePath('/shop');
  } catch (err) {
    console.error('Delete error:', err);
  }
}

export default async function AdminProductsPage() {
  let products = null;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error.message);
    } else {
      products = data;
    }
  } catch (err) {
    console.error('Admin client error:', err);
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="font-display text-2xl text-red-600 mb-2">
          Configuration Error
        </h2>
        <p className="text-slate-500">
          Service role key is missing or invalid. Please check Vercel environment variables.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-800">
          Products
        </h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="font-display text-xl font-bold text-slate-800 mb-6">
          Add New Product
        </h2>
        <AdminProductForm mode="create" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-rose-50 text-slate-600">
            <tr>
              <th className="text-left px-6 py-4 font-semibold">Product</th>
              <th className="text-left px-6 py-4 font-semibold">Category</th>
              <th className="text-left px-6 py-4 font-semibold">Price</th>
              <th className="text-left px-6 py-4 font-semibold">Stock</th>
              <th className="text-left px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50">
            {products?.map((product: any) => (
              <tr key={product.id} className="hover:bg-rose-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image_url ?? PLACEHOLDER_IMAGE}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{product.name}</p>
                      <p className="text-slate-400 text-xs line-clamp-1">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-rose-100 text-rose-700 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700">
                  {formatPrice(product.price)}
                </td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${product.stock > 5 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                    {product.stock}
                  </span>
                </td>
                {/* <td className="px-6 py-4">
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <button
                      type="submit"
                      className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </form>
                </td> */}

<td className="px-6 py-4">
  <div className="flex items-center gap-3">
    <a href={`/admin/products/${product.id}/edit`}
      className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
      Edit
    </a>
    <form action={deleteProduct}>
      <input type="hidden" name="id" value={product.id} />
      <button type="submit"
        className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">
        Delete
      </button>
    </form>
  </div>
</td>


















              </tr>
            ))}
          </tbody>
        </table>

        {!products?.length && (
          <div className="text-center py-16 text-slate-400">
            No products yet. Add your first cake above!
          </div>
        )}
      </div>
    </div>
  );
}