// app/product/[id]/page.tsx
// Product detail page — Server Component

import { createClient } from '@/lib/supabase/server';
import { AddToCartButton } from '@/components/AddToCartButton';
import { formatPrice } from '@/utils/format';
import { PLACEHOLDER_IMAGE } from '@/utils/constants';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Related products (same category)
  const { data: related } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .neq('id', id)
    .limit(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
        <Link href="/" className="hover:text-rose-500 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-rose-500 transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-slate-700">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src={product.image_url ?? PLACEHOLDER_IMAGE}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-slate-800 font-bold px-6 py-2 rounded-full text-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="py-4">
          <span className="inline-block bg-rose-100 text-rose-600 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            {product.category}
          </span>
          <h1 className="font-display text-4xl font-bold text-slate-800 mb-4">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-rose-500 mb-6">
            {formatPrice(product.price)}
          </p>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="flex items-center gap-3 mb-8">
            <div className={`w-3 h-3 rounded-full ${product.stock > 5 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
            <span className="text-sm text-slate-600">
              {product.stock > 5
                ? `In Stock (${product.stock} available)`
                : product.stock > 0
                ? `Only ${product.stock} left!`
                : 'Out of Stock'}
            </span>
          </div>

          <AddToCartButton
            productId={product.id}
            stock={product.stock}
            userId={user?.id}
          />

          {!user && (
            <p className="text-sm text-slate-400 mt-3">
              <Link href="/login" className="text-rose-500 hover:underline">
                Sign in
              </Link>{' '}
              to add items to your cart.
            </p>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related && related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-3xl font-bold text-slate-800 mb-8">
            You might also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 card-hover"
              >
                <div className="relative aspect-video">
                  <Image
                    src={p.image_url ?? PLACEHOLDER_IMAGE}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800">{p.name}</h3>
                  <p className="text-rose-500 font-bold mt-1">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
