'use client';

import { ArrowUpRight, Check, Search, ShieldCheck, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { CatalogProduct } from '@/lib/catalog';

const categories = ['All products', 'Handloom textiles', 'Rugs & mats', 'Metal craft', 'Agro-commodities', 'Home & lifestyle', 'Fashion accessories'];

function filterByCategory(products: CatalogProduct[], category: string) {
  return category === 'All products' ? products : products.filter(product => product.category === category);
}

export function ProductExplorer({
  initialProducts,
  initialQuery = '',
  initialCategory = 'All products',
}: {
  initialProducts: CatalogProduct[];
  initialQuery?: string;
  initialCategory?: string;
}) {
  const category = categories.includes(initialCategory) ? initialCategory : 'All products';
  const [products, setProducts] = useState(() => filterByCategory(initialProducts, category));
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [loading, setLoading] = useState(false);
  const [aiUsed, setAiUsed] = useState(false);
  const [notice, setNotice] = useState('');

  async function searchProducts(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setNotice('');
    try {
      const response = await fetch(`/api/catalog/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory)}`);
      if (!response.ok) throw new Error('Search failed');
      const result = await response.json() as { products: CatalogProduct[]; aiUsed: boolean };
      setProducts(result.products);
      setAiUsed(result.aiUsed);
    } catch {
      setNotice('Search is temporarily unavailable. Showing the verified catalog.');
    } finally {
      setLoading(false);
    }
  }

  function selectCategory(nextCategory: string) {
    setSelectedCategory(nextCategory);
    setNotice('');
    setProducts(filterByCategory(initialProducts, nextCategory));
    setAiUsed(false);
  }

  return <>
    <form onSubmit={searchProducts} className="relative mt-9 flex w-full max-w-2xl gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-900/5">
      <Search className="ml-3 mt-3.5 shrink-0 text-slate-400" size={19} />
      <input value={query} onChange={event => setQuery(event.target.value)} aria-label="Search Indian wholesale products" className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-slate-400" placeholder="Try “Banarasi silk for boutique”" />
      {query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(''); setProducts(filterByCategory(initialProducts, selectedCategory)); }} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={16} /></button>}
      <button type="submit" disabled={loading} className="rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">{loading ? 'Searching...' : 'Search'}</button>
    </form>
    <div className="mt-4 flex flex-wrap items-center gap-2"><div className="mr-1 flex items-center gap-1 text-xs font-bold text-slate-500"><SlidersHorizontal size={14} /> Filter</div>{categories.map(option => <button type="button" key={option} onClick={() => selectCategory(option)} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${selectedCategory === option ? 'bg-ink text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-amber-300'}`}>{option}</button>)}</div>
    <div className="mt-7 flex min-h-5 items-center justify-between gap-4">{aiUsed ? <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-700"><Sparkles size={14} /> Local AI matched this search</p> : <p className="text-xs font-semibold text-slate-400">{products.length} verified listings</p>}{notice && <p className="text-right text-xs font-semibold text-rose-600">{notice}</p>}</div>
    <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map(product => <article key={product.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10"><Link href={`/products/${product.id}`} className={`relative block aspect-[1.15] overflow-hidden bg-gradient-to-br ${product.tone}`}><img src={product.image} alt={product.title} className="size-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute right-4 top-4 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 backdrop-blur">{product.source}</span><span className="absolute bottom-4 left-4 rounded-full bg-ink/85 px-2.5 py-1 text-[10px] font-bold text-white">View details</span></Link><div className="p-5"><div className="flex items-start justify-between gap-3"><Link href={`/products/${product.id}`} className="font-bold leading-5 hover:text-amber-700">{product.title}</Link><ShieldCheck size={18} className="shrink-0 text-emerald-600" /></div><p className="mt-2 text-xs font-semibold text-slate-400">{product.cluster}</p><div className="mt-5 flex items-end justify-between"><div><p className="text-[11px] text-slate-400">From</p><strong className="text-xl">{product.price}</strong><span className="text-xs text-slate-400"> / unit</span></div><p className="text-right text-[11px] text-slate-500">MOQ<br /><b className="text-slate-700">{product.moq}</b></p></div><Link href={`/products/${product.id}`} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 text-sm font-bold text-ink transition group-hover:bg-amber-100">Request quote <ArrowUpRight size={16} /></Link><p className="mt-3 flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-700"><Check size={13} />GSTIN verified supplier</p></div></article>)}</div></>;
}
