// app/page.tsx
// Public homepage — Server Component

import { createClient } from '@/lib/supabase/server';
import { HeroSection } from '@/components/HeroSection';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';
import type { Product } from '@/lib/types';

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch 6 featured products
  const { data: featured } = await supabase
    .from('products')
    .select('*')
    .gt('stock', 0)
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <div>
      <HeroSection />

      {/* Featured Cakes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="text-rose-400 font-semibold text-sm uppercase tracking-widest">
            Freshly Baked
          </span>
          <h2 className="font-display text-4xl font-bold text-slate-800 mt-2">
            Featured Creations
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Every cake is handcrafted with love, using only the finest
            ingredients sourced from local farms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(featured as Product[])?.map((product, i) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 btn-press shadow-md hover:shadow-lg"
          >
            View All Cakes
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              {
                emoji: '🌿',
                title: 'Natural Ingredients',
                desc: 'No artificial preservatives. Every cake is made from scratch with organic flour, real butter, and seasonal fruits.',
              },
              {
                emoji: '🎨',
                title: 'Custom Designs',
                desc: 'Tell us your vision and our pastry artists will create a cake that perfectly matches your celebration.',
              },
              {
                emoji: '🚀',
                title: 'Same-Day Delivery',
                desc: 'Order before noon and receive your cake the same day, fresh from our oven to your door.',
              },
            ].map((feature) => (
              <div key={feature.title} className="p-6">
                <div className="text-5xl mb-4">{feature.emoji}</div>
                <h3 className="font-display text-xl font-bold text-slate-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-rose-400 to-pink-500 py-16 text-white text-center">
        <h2 className="font-display text-4xl font-bold mb-4">
          Made with Love, Baked to Perfection
        </h2>
        <p className="text-rose-100 mb-8 text-lg">
          Join thousands of happy customers and order your dream cake today.
        </p>
        <Link
          href="/shop"
          className="bg-white text-rose-500 font-bold px-8 py-3 rounded-full hover:bg-rose-50 transition-colors btn-press inline-block"
        >
          Shop Now
        </Link>
      </section>
    </div>
  );
}
