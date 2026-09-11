import Link from 'next/link';
import { AppHeader } from '@/components/AppHeader';
import { ProductExplorer } from '@/components/ProductExplorer';
import { getCatalogProducts } from '@/lib/catalog-server';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const products = await getCatalogProducts();
  const { q, category } = await searchParams;
  return (
    <main className="min-h-screen bg-slate-50 text-ink">
      <AppHeader />
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14"><div className="flex items-center gap-2 text-sm text-slate-400"><Link href="/" className="hover:text-ink">Home</Link><span>/</span><span className="font-semibold text-slate-600">Marketplace</span></div><div className="mt-9"><p className="text-xs font-bold uppercase tracking-[.16em] text-amber-700">Verified clusters</p><h1 className="mt-3 text-4xl font-black tracking-[-.05em] sm:text-6xl">Wholesale catalog</h1><p className="mt-4 max-w-xl text-slate-500">Search published products from ThokIO, IndiaMART, and partner marketplace feeds.</p></div><ProductExplorer initialProducts={products} initialQuery={q ?? ''} initialCategory={category ?? 'All products'} /></div>
    </main>
  );
}
