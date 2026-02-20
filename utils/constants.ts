// utils/constants.ts

export const CATEGORIES = [
  { value: 'all',         label: 'All Cakes' },
  { value: 'classic',     label: 'Classic' },
  { value: 'chocolate',   label: 'Chocolate' },
  { value: 'fruit',       label: 'Fruit' },
  { value: 'specialty',   label: 'Specialty' },
  { value: 'celebration', label: 'Celebration' },
] as const;

export const ORDER_STATUSES = [
  'pending',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1558303911-9a7b59c53cd0?w=800';
