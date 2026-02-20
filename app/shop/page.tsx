// app/shop/page.tsx
// Product listing page — Server Component with category filtering

import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Suspense } from 'react';
import type { Product } from '@/lib/types';
import { CATEGORIES } from '@/utils/constants';

interface ShopPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

async function ProductGrid({
  category,
  query,
}: {
  category: string;
  query: string;
}) {
  const supabase = await createClient();

  let dbQuery = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (category && category !== 'all') {
    dbQuery = dbQuery.eq('category', category);
  }

  if (query) {
    dbQuery = dbQuery.ilike('name', `%${query}%`);
  }

  const { data: products, error } = await dbQuery;

  if (error || !products?.length) {
    return (
      <div className="col-span-full text-center py-20">
        <div className="text-6xl mb-4">🎂</div>
        <h3 className="font-display text-2xl text-slate-600">No cakes found</h3>
        <p className="text-slate-400 mt-2">Try a different category or search term.</p>
      </div>
    );
  }

  return (
    <>
      {(products as Product[]).map((product, i) => (
        <div
          key={product.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </>
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';
  const query = params.q ?? '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="font-display text-5xl font-bold text-slate-800">
          Our Cakes
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Handcrafted daily with love and the finest ingredients.
        </p>
      </div>

      {/* Search Bar */}
      <form className="mb-6 flex gap-3 max-w-md">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search cakes..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white text-sm"
        />
        <button
          type="submit"
          className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors btn-press"
        >
          Search
        </button>
      </form>

      {/* Category Filter */}
      <CategoryFilter categories={CATEGORIES} activeCategory={category} />

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        <Suspense
          fallback={Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        >
          <ProductGrid category={category} query={query} />
        </Suspense>
      </div>
    </div>
  );
}
