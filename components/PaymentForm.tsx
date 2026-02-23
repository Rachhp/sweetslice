'use client';

import { useState, useEffect } from 'react';
import { loadStripe, StripeCardElement } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  amount: number;
  orderId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentForm({ amount, orderId, onSuccess, onError }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [cardElement, setCardElement] = useState<StripeCardElement | null>(null);
  const [cardReady, setCardReady] = useState(false);

  useEffect(() => {
    const initStripe = async () => {
      const stripe = await stripePromise;
      if (!stripe) return;

      const elements = stripe.elements();
      const card = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#1e293b',
            fontFamily: 'sans-serif',
            '::placeholder': { color: '#94a3b8' },
          },
        },
      });

      card.mount('#card-element');
      card.on('ready', () => setCardReady(true));
      setCardElement(card);
    };

    initStripe();
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardElement) return;
    setLoading(true);

    try {
      // Step 1 — Create payment intent on server
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, orderId }),
      });

      const { clientSecret, error } = await res.json();

      if (error) {
        onError(error);
        return;
      }

      // Step 2 — Confirm payment with Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        onError('Stripe failed to load');
        return;
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { name: 'Customer' },
          },
        }
      );

      if (stripeError) {
        onError(stripeError.message || 'Payment failed');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // Step 3 — Verify on server and update order status
        await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            orderId,
          }),
        });

        onSuccess();
      }
    } catch (err) {
      onError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      {/* Amount */}
      <div className="bg-rose-50 rounded-xl p-4">
        <p className="text-sm text-slate-600">Amount to pay:</p>
        <p className="text-2xl font-bold text-rose-500">₹{amount.toFixed(2)}</p>
      </div>

      {/* Stripe Card Element */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Card Details
        </label>
        <div
          id="card-element"
          className="w-full px-4 py-3 border border-rose-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-rose-300"
        />
      </div>

      {/* Test card hint */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
        <p className="text-xs text-blue-600 font-semibold">🧪 Test Card:</p>
        <p className="text-xs text-blue-500">Card: 4242 4242 4242 4242</p>
        <p className="text-xs text-blue-500">Expiry: 12/28 | CVV: 123</p>
      </div>

      <button
        type="submit"
        disabled={loading || !cardReady}
        className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold py-3 rounded-xl transition-colors"
      >
        {loading ? 'Processing...' : `Pay ₹${amount.toFixed(2)}`}
      </button>
    </form>
  );
}