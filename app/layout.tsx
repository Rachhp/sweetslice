// app/layout.tsx

import type { Metadata } from 'next';
import { Playfair_Display, Nunito } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ToastContainer } from '@/components/ui/Toast';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SweetSlice — Artisan Cake Shop',
  description:
    'Handcrafted cakes for every occasion. Order online and enjoy same-day delivery.',
  openGraph: {
    title: 'SweetSlice — Artisan Cake Shop',
    description: 'Handcrafted cakes for every occasion.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${nunito.variable}`}>
      <body className="min-h-screen bg-rose-50 font-body text-slate-800 antialiased">
        <Navbar />
        <main className="min-h-[calc(100vh-64px-200px)]">{children}</main>
        <Footer />
        <ToastContainer />
      </body>
    </html>
  );
}
