'use client';

// lib/hooks/useToast.ts

import { useState, useCallback } from 'react';
import type { ToastMessage } from '@/lib/types';

let toastHandlers: ((msg: ToastMessage) => void)[] = [];

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastMessage['type'] = 'info') => {
      const id = Math.random().toString(36).slice(2);
      const toast: ToastMessage = { id, message, type };

      setToasts((prev) => [...prev, toast]);

      // Auto-remove after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}

// Singleton toast for use outside React components
export const toast = {
  show: (message: string, type: ToastMessage['type'] = 'info') => {
    toastHandlers.forEach((handler) =>
      handler({ id: Date.now().toString(), message, type })
    );
  },
  register: (handler: (msg: ToastMessage) => void) => {
    toastHandlers.push(handler);
    return () => {
      toastHandlers = toastHandlers.filter((h) => h !== handler);
    };
  },
};
