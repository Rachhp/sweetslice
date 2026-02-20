// components/HeroSection.tsx
// Homepage hero with animated text and CTA

import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-rose-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-64 bg-pink-200 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 flex flex-col lg:flex-row items-center gap-16">
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <span className="inline-block bg-rose-100 text-rose-600 text-sm font-semibold px-4 py-2 rounded-full mb-6 animate-fade-in-up">
            🌸 Handcrafted with Love
          </span>
          <h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-800 leading-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            Life Is Short,
            <br />
            <span className="text-rose-500">Eat More Cake</span>
          </h1>
          <p
            className="text-lg text-slate-500 mb-10 max-w-md mx-auto lg:mx-0 animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            Discover our collection of artisan cakes, lovingly baked with
            seasonal ingredients and delivered fresh to your door.
          </p>
          <div
            className="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in-up"
            style={{ animationDelay: '300ms' }}
          >
            <Link
              href="/shop"
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 btn-press shadow-lg hover:shadow-xl"
            >
              Order Now
            </Link>
            <Link
              href="/shop"
              className="bg-white hover:bg-rose-50 text-slate-700 font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 btn-press shadow-sm border border-rose-100"
            >
              View Menu
            </Link>
          </div>

          {/* Social proof */}
          <div
            className="flex items-center gap-4 justify-center lg:justify-start mt-10 animate-fade-in-up"
            style={{ animationDelay: '400ms' }}
          >
            <div className="flex -space-x-2">
              {['🧑‍🍳', '👩', '👨', '👧'].map((emoji, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full bg-rose-200 border-2 border-white flex items-center justify-center text-base"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">4.9 ★★★★★</p>
              <p className="text-slate-400 text-xs">2,000+ happy customers</p>
            </div>
          </div>
        </div>

        {/* Hero Image / Emoji art */}
        <div
          className="relative animate-fade-in-up flex-shrink-0"
          style={{ animationDelay: '200ms' }}
        >
          <div className="w-72 h-72 sm:w-80 sm:h-80 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-rose-100">
            <span className="text-[10rem] select-none leading-none">🎂</span>
          </div>
          {/* Floating badges */}
          <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 animate-bounce">
            <p className="font-bold text-rose-500 text-sm">Fresh Daily 🌿</p>
          </div>
          <div className="absolute -bottom-4 -left-4 bg-rose-500 text-white rounded-2xl shadow-lg px-4 py-3">
            <p className="font-bold text-sm">Free Delivery 🚀</p>
          </div>
        </div>
      </div>
    </section>
  );
}
