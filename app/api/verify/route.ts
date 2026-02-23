import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/server';


export async function POST(request: Request) {
  try {
     
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const { paymentIntentId, orderId } = await request.json();

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const supabase = createAdminClient();
      await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
  } catch (err) {
    console.error('Verify error:', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
