'use client';

import { Check, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';

export function OrderRequestPanel({ productTitle, price, moq }: { productTitle: string; price: string; moq: string }) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6"><div className="flex items-center gap-3 text-emerald-800"><span className="grid size-9 place-items-center rounded-full bg-emerald-600 text-white"><Check size={18} /></span><strong>Request received</strong></div><p className="mt-4 text-sm leading-6 text-emerald-800">A ThokIO sourcing specialist will confirm pricing, freight, and payment terms for {productTitle} on WhatsApp.</p></div>;

  return <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5"><div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Starting from</p><strong className="text-3xl">{price}</strong><span className="text-sm text-slate-400"> / unit</span></div><p className="text-right text-xs text-slate-500">Minimum order<br /><b className="text-slate-700">{moq}</b></p></div><div className="mt-6 grid gap-3"><input aria-label="Your name" className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-500" placeholder="Your name" /><input aria-label="WhatsApp number" className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-500" placeholder="WhatsApp number" /></div><button type="button" onClick={() => setSubmitted(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3.5 text-sm font-bold text-white transition hover:bg-indigo-900"><Send size={16} />Request bulk quote</button><button type="button" className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 py-3 text-sm font-bold text-emerald-700"><MessageCircle size={16} />Ask on WhatsApp</button><p className="mt-4 text-center text-[11px] text-slate-400">No payment required. Final quote includes GST and shipping.</p></div>;
}
