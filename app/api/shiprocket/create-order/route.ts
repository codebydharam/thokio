import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const tokenResponse = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: process.env.SHIPROCKET_EMAIL, password: process.env.SHIPROCKET_PASSWORD }) });
  if (!tokenResponse.ok) return NextResponse.json({ error: 'Shiprocket authentication failed' }, { status: 502 });
  const { token } = await tokenResponse.json();
  const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const result = await response.json();
  if (!response.ok) return NextResponse.json({ error: result }, { status: response.status });
  return NextResponse.json({ orderId: result.order_id, shipmentId: result.shipment_id, trackingNumber: result.awb_code ?? null, shippingLabelUrl: result.label_url ?? null });
}
