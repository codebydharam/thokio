import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  const admin = getSupabaseAdmin();
  const payload = await request.json();
  const lead = {
    source: 'INDIAMART',
    external_lead_id: String(payload.lead_id ?? payload.query_id ?? ''),
    buyer_name: String(payload.sender_name ?? 'IndiaMART buyer'),
    buyer_phone: String(payload.sender_mobile ?? payload.mobile ?? ''),
    requested_item: String(payload.subject ?? payload.product_name ?? ''),
    qty: Math.max(1, Number(payload.quantity ?? 1)),
  } as const;

  if (!lead.external_lead_id || !lead.buyer_phone || !lead.requested_item) {
    return NextResponse.json({ error: 'Missing lead_id, buyer_phone, or requested_item' }, { status: 400 });
  }

  const { data, error } = await admin.from('leads').upsert(lead, { onConflict: 'source,external_lead_id' }).select('id').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Queue WhatsApp/catalog delivery in the worker; the webhook stays fast and idempotent.
  await fetch(process.env.WHATSAPP_LEAD_WORKER_URL!, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ leadId: data.id }) });
  return NextResponse.json({ leadId: data.id, accepted: true }, { status: 202 });
}
