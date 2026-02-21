'use client';

// components/AdminProductForm.tsx
// Form for creating and editing products (admin only)

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/utils/constants';
import type { Product } from '@/lib/types';

interface AdminProductFormProps {
  mode: 'create' | 'edit';
  product?: Product;
}

export function AdminProductForm({ mode, product }: AdminProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    image_url: product?.image_url ?? '',
    category: product?.category ?? 'classic',
    stock: product?.stock?.toString() ?? '0',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');


  const payload = {
    name: form.name,
    description: form.description,
    price: parseFloat(form.price),
    image_url: form.image_url,
    category: form.category,
    stock: parseInt(form.stock, 10),
  };
  
    try {
      const res = await fetch(
        mode === 'edit' ? `/api/products/${product!.id}` : '/api/products',
        {
          method: mode === 'edit' ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save product');
      } else {
        
        if (mode === 'create') {
          router.refresh();
          setForm({ name: '', description: '', price: '', image_url: '', category: 'classic', stock: '0' });
        }else{
          router.push('/admin/products');
        }
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 border border-rose-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white';

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
          required
          placeholder="Classic Vanilla Dream"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Category *</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className={inputClass}
          required
        >
          {CATEGORIES.filter((c) => c.value !== 'all').map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Price ($) *</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className={inputClass}
          required
          placeholder="34.99"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Stock *</label>
        <input
          type="number"
          min="0"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className={inputClass}
          required
          placeholder="10"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-slate-700 mb-1">Image URL</label>
        <input
          type="url"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          className={inputClass}
          placeholder="https://images.unsplash.com/..."
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={`${inputClass} h-24 resize-none`}
          placeholder="Describe the cake..."
        />
      </div>

      {error && (
        <div className="sm:col-span-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">
          {error}
        </div>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold px-6 py-3 rounded-xl transition-colors btn-press"
        >
          {loading
            ? 'Saving…'
            : mode === 'create'
            ? '+ Add Product'
            : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
