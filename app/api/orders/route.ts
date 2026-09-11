import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase-server';

const orderSchema = z.object({ shippingAddress: z.record(z.string(), z.string()), items: z.array(z.object({ variantId: z.string().uuid(), vendorId: z.string().uuid(), productTitle: z.string(), variantName: z.string(), unitPrice: z.number().nonnegative(), quantity: z.number().int().positive() })).min(1), couponCode: z.string().optional() });

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const parsed = orderSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid order payload', details: parsed.error.flatten() }, { status: 400 });
  const subtotal = parsed.data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const { data: order, error } = await supabase.from('orders_v2').insert({ customer_id: user.id, shipping_address: parsed.data.shippingAddress, subtotal, total_amount: subtotal, coupon_code: parsed.data.couponCode ?? null }).select('id,order_number').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const { error: itemError } = await supabase.from('order_items').insert(parsed.data.items.map(item => ({ order_id: order.id, vendor_id: item.vendorId, variant_id: item.variantId, product_title: item.productTitle, variant_name: item.variantName, unit_price: item.unitPrice, quantity: item.quantity, line_total: item.unitPrice * item.quantity })));
  if (itemError) return NextResponse.json({ error: itemError.message }, { status: 500 });
  return NextResponse.json({ order }, { status: 201 });
}
