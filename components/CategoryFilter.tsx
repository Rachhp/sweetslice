'use client';

// components/CategoryFilter.tsx
// Client component for filtering products by category

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface CategoryFilterProps {
  categories: readonly { value: string; label: string }[];
  activeCategory: string;
}

export function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete('category');
    } else {
      params.set('category', value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleCategoryChange(value)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 btn-press ${
            activeCategory === value
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-rose-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
