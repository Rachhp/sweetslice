'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { PaymentForm } from '@/components/PaymentForm';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const orderId = searchParams.get('orderId') || '';
  const amount = parseFloat(searchParams.get('amount') || '0');

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      router.push('/orders?payment=success');
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center max-w-md w-full">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-display text-2xl font-bold text-slate-800 mb-2">
            Payment Successful!
          </h2>
          <p className="text-slate-500">
            Your order has been confirmed. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md w-full">
        <h1 className="font-display text-2xl font-bold text-slate-800 mb-6">
          Complete Payment
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4">
            ❌ {error}
          </div>
        )}

        <PaymentForm
          amount={amount}
          orderId={orderId}
          onSuccess={handleSuccess}
          onError={setError}
        />
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-rose-50 flex items-center justify-center">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}