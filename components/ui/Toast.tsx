'use client';

// components/ui/Toast.tsx
// Toast notification container — mounts globally in layout

import { useEffect, useState } from 'react';
import type { ToastMessage } from '@/lib/types';

const TOAST_ICONS: Record<ToastMessage['type'], string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

const TOAST_STYLES: Record<ToastMessage['type'], string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error:   'bg-red-50 border-red-200 text-red-800',
  info:    'bg-blue-50 border-blue-200 text-blue-800',
};

// Global toast emitter (so it works anywhere in the tree)
type ToastListener = (toast: ToastMessage) => void;
const listeners: ToastListener[] = [];

export const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
  const id = Math.random().toString(36).slice(2);
  listeners.forEach((fn) => fn({ id, message, type }));
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener: ToastListener = (toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3500);
    };

    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 border rounded-2xl shadow-lg animate-slide-in-right pointer-events-auto max-w-xs ${TOAST_STYLES[toast.type]}`}
        >
          <span className="text-lg">{TOAST_ICONS[toast.type]}</span>
          <p className="text-sm font-semibold">{toast.message}</p>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="ml-auto opacity-50 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
