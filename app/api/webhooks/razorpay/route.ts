import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  const admin = getSupabaseAdmin();
  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature') ?? '';
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!).update(rawBody).digest('hex');
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

  const event = JSON.parse(rawBody);
  if (event.event !== 'payment.captured') return NextResponse.json({ received: true });
  const payment = event.payload.payment.entity;
  const { data: orderPayment, error } = await admin.from('payments').update({ status: 'SUCCESS', payment_gateway_id: payment.id }).eq('payment_gateway_id', payment.order_id).select('order_id').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await admin.from('orders').update({ status: 'SUPPLIER_NOTIFIED', advance_amount_paid: payment.amount / 100 }).eq('id', orderPayment.order_id);
  await fetch(process.env.PO_WORKER_URL!, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ orderId: orderPayment.order_id }) });
  return NextResponse.json({ received: true });
}
