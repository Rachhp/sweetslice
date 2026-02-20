# 🎂 SweetSlice — Cake Shop E-Commerce

A production-ready cake shop e-commerce application built with Next.js 14, Supabase, and Tailwind CSS.

---

## ✨ Features

- **Google OAuth** authentication via Supabase
- **Product catalog** with category filtering
- **Real-time cart** synced across browser tabs
- **Order management** with history
- **Admin dashboard** for product & order management
- **Responsive** mobile-first UI with pastel bakery aesthetic
- **Loading skeletons**, toast notifications, and smooth animations

---

## 🗂 Folder Structure

```
sweetslice/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Homepage (hero + featured cakes)
│   ├── login/
│   │   └── page.tsx            # Google OAuth login page
│   ├── shop/
│   │   └── page.tsx            # Product listing with filters
│   ├── product/
│   │   └── [id]/
│   │       └── page.tsx        # Product detail page
│   ├── cart/
│   │   └── page.tsx            # Cart page with realtime sync
│   ├── orders/
│   │   └── page.tsx            # Order history
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout with guard
│   │   ├── page.tsx            # Admin dashboard
│   │   ├── products/
│   │   │   └── page.tsx        # Manage products
│   │   └── orders/
│   │       └── page.tsx        # Manage orders
│   └── api/
│       ├── cart/
│       │   └── route.ts        # Cart CRUD API
│       ├── orders/
│       │   └── route.ts        # Order management API
│       └── products/
│           └── route.ts        # Product management API
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Skeleton.tsx
│   │   └── Toast.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── CartItem.tsx
│   ├── CategoryFilter.tsx
│   ├── HeroSection.tsx
│   └── AdminProductForm.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   ├── server.ts           # Server Supabase client
│   │   └── middleware.ts       # Auth middleware helpers
│   ├── hooks/
│   │   ├── useCart.ts          # Cart state + realtime
│   │   └── useToast.ts         # Toast notifications
│   └── types.ts                # TypeScript types
├── utils/
│   ├── format.ts               # Currency, date formatters
│   └── constants.ts            # App-wide constants
├── middleware.ts               # Route protection middleware
├── supabase/
│   └── schema.sql              # Full database schema
├── .env.local.example          # Environment variable template
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Setup Guide

### 1. Clone & Install

```bash
git clone https://github.com/your-username/sweetslice.git
cd sweetslice
npm install
```

### 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → Create new project
2. In **SQL Editor**, run the contents of `supabase/schema.sql`
3. Go to **Authentication → Providers** → Enable **Google**
4. Copy your **Project URL** and **Anon Key** from **Settings → API**

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable **Google+ API** under APIs & Services
4. Go to **Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Set **Authorized redirect URIs**:
   - `https://<your-project>.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for local dev)
6. Copy **Client ID** and **Client Secret**
7. In Supabase → **Authentication → Providers → Google**, enter the Client ID and Secret

### 4. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=your-admin@email.com
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ☁️ Vercel Deployment

### Option A: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option B: GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repository
4. Add all environment variables from `.env.local`
5. Set **NEXT_PUBLIC_SITE_URL** to your Vercel production URL
6. Deploy!

### After Deployment

Update Google OAuth redirect URIs to include your Vercel URL:
```
https://your-app.vercel.app/auth/callback
```

Update Supabase → **Authentication → URL Configuration**:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/**`

---

## 🛡 Admin Setup

Set your email as admin in `.env.local`:
```env
ADMIN_EMAIL=youremail@gmail.com
```

The middleware checks this against the authenticated user's email to protect `/admin` routes.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase (PostgreSQL) |
| Realtime | Supabase Realtime |
| Styling | Tailwind CSS |
| Deployment | Vercel |
| Language | TypeScript |

---

## 📄 License

MIT
