// components/Footer.tsx

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t border-rose-100 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="font-display text-2xl font-bold text-slate-800 flex items-center gap-2 mb-3">
              <span>🎂</span>
              <span>SweetSlice</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Artisan cakes handcrafted with love, delivered fresh to your doorstep every day.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/shop', label: 'Shop' },
                { href: '/cart', label: 'Cart' },
                { href: '/orders', label: 'My Orders' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-400 hover:text-rose-500 text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
              Contact
            </h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>📍 123 Baker Street, Sweet City</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>✉️ cutie@sweetslice.com</li>
              <li>⏰ Mon – Sat, 8am – 8pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-rose-50 mt-10 pt-6 text-center text-slate-300 text-xs">
          © {new Date().getFullYear()} SweetSlice. Made with 🍰 and ❤️
        </div>
      </div>
    </footer>
  );
}
