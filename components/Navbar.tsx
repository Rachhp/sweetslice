'use client';

// components/Navbar.tsx
// Top navigation with user avatar, cart count, and auth state

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/hooks/useCart';
import { getInitials } from '@/utils/format';
import Image from 'next/image';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const { cartCount } = useCart(user?.id);

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      // Check admin via env (this is client-side indication only; server enforces real protection)
      setIsAdmin(data.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
    setMenuOpen(false);
  };

  const avatarUrl = user?.user_metadata?.avatar_url;
  const displayName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl font-bold text-slate-800 flex items-center gap-2 hover:text-rose-500 transition-colors"
        >
          <span>🎂</span>
          <span>SweetSlice</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/shop"
            className="text-slate-600 hover:text-rose-500 font-medium transition-colors text-sm"
          >
            Shop
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="text-slate-600 hover:text-rose-500 font-medium transition-colors text-sm"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          {user && (
            <Link
              href="/cart"
              className="relative p-2 text-slate-600 hover:text-rose-500 transition-colors"
              aria-label="Cart"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          )}

          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-rose-50 transition-colors"
                aria-label="User menu"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName ?? 'User'}
                    width={34}
                    height={34}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-rose-200 text-rose-700 font-bold flex items-center justify-center text-sm">
                    {getInitials(displayName)}
                  </div>
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-rose-100 py-2 z-50 animate-fade-in-up">
                  <div className="px-4 py-2 border-b border-rose-50">
                    <p className="font-semibold text-slate-800 text-sm truncate">{displayName}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                  {[
                    { href: '/orders', label: 'My Orders' },
                    { href: '/cart', label: 'Cart' },
                    ...(isAdmin ? [{ href: '/admin', label: 'Admin Dashboard' }] : []),
                  ].map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="block px-4 py-2 text-sm text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-2 rounded-full text-sm transition-colors btn-press"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
