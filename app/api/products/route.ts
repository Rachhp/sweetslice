// app/api/products/route.ts

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

function isAdmin(email?: string | null): boolean {
  return email === process.env.ADMIN_EMAIL;
}

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: data });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const admin = createAdminClient();

    const { data, error } = await admin
      .from('products')
      .insert({
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        image_url: body.image_url,
        category: body.category,
        stock: parseInt(body.stock),
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}