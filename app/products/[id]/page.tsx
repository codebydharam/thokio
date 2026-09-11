import Link from 'next/link';
import { ArrowLeft, Check, Clock3, MapPin, ShieldCheck, Star, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/AddToCartButton';
import { AppHeader } from '@/components/AppHeader';
import { OrderRequestPanel } from '@/components/OrderRequestPanel';
import { getCatalogProduct } from '@/lib/catalog-server';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getCatalogProduct(id);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-slate-50 text-ink">
      <AppHeader />
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-ink"><ArrowLeft size={16} /> Back to marketplace</Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className={`relative aspect-[1.18] bg-gradient-to-br ${product.tone}`}><img src={product.image} alt={product.title} className="size-full object-cover" /><span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700">{product.source}</span></div>
            <div className="grid grid-cols-3 border-t border-slate-100"><div className="p-4"><p className="text-[11px] text-slate-400">HSN code</p><strong className="text-sm">{product.hsn}</strong></div><div className="border-x border-slate-100 p-4"><p className="text-[11px] text-slate-400">GST rate</p><strong className="text-sm">{product.gst}</strong></div><div className="p-4"><p className="text-[11px] text-slate-400">Lead time</p><strong className="text-sm">{product.leadTime}</strong></div></div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-emerald-700"><span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1"><ShieldCheck size={14} /> GSTIN verified</span><span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-amber-800"><Star size={14} /> {product.rating} rating</span></div>
            <h1 className="mt-5 text-4xl font-black tracking-[-.05em] sm:text-5xl">{product.title}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-500">{product.description}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-500"><span className="flex items-center gap-2"><MapPin size={16} className="text-amber-600" />{product.cluster}</span><span className="flex items-center gap-2"><Clock3 size={16} className="text-amber-600" />Ships in {product.leadTime}</span><span className="flex items-center gap-2"><Tag size={16} className="text-amber-600" />MOQ {product.moq}</span></div>
            <div className="mt-8"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">Supplier</p><p className="mt-2 text-lg font-bold">{product.supplier}</p><p className="mt-1 flex items-center gap-1 text-sm text-emerald-700"><Check size={15} /> Quality-checked cluster partner</p></div>
            <div className="mt-8 grid gap-3"><AddToCartButton productId={product.id} title={product.title} price={product.price} image={product.image} /><OrderRequestPanel productTitle={product.title} price={product.price} moq={product.moq} /></div>
          </div>
        </div>
      </div>
    </main>
  );
}
