'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown, LayoutDashboard, Menu, Search, ShieldCheck, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { CartButton } from '@/components/CartButton';

type AppHeaderProps = { mode?: 'public' | 'ops' | 'buyer' };

const publicLinks = [
  { label: 'All categories', href: '/products' },
  { label: 'Wholesale deals', href: '/products?sort=deals' },
  { label: 'New arrivals', href: '/products?sort=new' },
  { label: 'Sample first', href: '/sample-kit' },
];

export function AppHeader({ mode = 'public' }: AppHeaderProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const links = mode === 'ops'
    ? [{ label: 'Overview', href: '/admin' }, { label: 'Leads', href: '/admin/leads' }, { label: 'Orders', href: '/admin/orders' }, { label: 'Vendor view', href: '/vendor/dashboard' }]
    : mode === 'buyer'
      ? [{ label: 'My orders', href: '/buyer/dashboard' }, { label: 'Marketplace', href: '/products' }, { label: 'Sample kit', href: '/sample-kit' }]
      : publicLinks;

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    if (query.trim()) window.location.href = `/products?q=${encodeURIComponent(query.trim())}`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-[0_1px_10px_rgba(15,23,42,.05)]">
      <div className="hidden bg-ink text-[11px] text-indigo-100 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 sm:px-8">
          <span>India&apos;s verified retail + wholesale marketplace</span>
          <span className="flex items-center gap-5"><Link href="/vendor/dashboard" className="hover:text-white">Sell on ThokIO</Link><Link href="/sample-kit" className="hover:text-white">₹499 sample kit</Link><span>Help &amp; support</span></span>
        </div>
      </div>
      <div className="mx-auto flex min-h-[68px] max-w-7xl items-center gap-3 px-4 sm:px-8 lg:gap-5">
        <button type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 lg:hidden">{open ? <X size={20} /> : <Menu size={20} />}</button>
        <BrandLogo />
        <form onSubmit={submitSearch} className="hidden min-w-0 flex-1 items-center rounded-xl bg-slate-100 px-3 lg:flex"><Search size={18} className="shrink-0 text-slate-400" /><input value={query} onChange={event => setQuery(event.target.value)} aria-label="Search products" placeholder="Search for products, brands and categories" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400" /><button type="submit" className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white">Search</button></form>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-slate-600 xl:flex" aria-label="Primary navigation">{links.slice(0, 3).map(link => <Link key={link.href} href={link.href} className="whitespace-nowrap hover:text-ink">{link.label}</Link>)}</nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2"><Link href={mode === 'ops' ? '/admin' : mode === 'buyer' ? '/account' : '/auth/login'} className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 sm:flex"><UserRound size={18} />{mode === 'ops' ? 'Admin' : mode === 'buyer' ? 'Account' : 'Login'}<ChevronDown size={14} /></Link><CartButton /><Link href={mode === 'ops' ? '/admin/orders' : '/products'} className="hidden items-center gap-2 rounded-xl bg-ink px-3.5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-900 sm:inline-flex"><span className="hidden xl:inline">{mode === 'ops' ? 'Order board' : mode === 'buyer' ? 'Shop again' : 'Browse'}</span><ArrowRight size={16} /></Link></div>
      </div>
      <div className="border-t border-slate-100 px-4 py-2 lg:hidden"><form onSubmit={submitSearch} className="flex items-center rounded-xl bg-slate-100 px-3"><Search size={17} className="text-slate-400" /><input value={query} onChange={event => setQuery(event.target.value)} aria-label="Search products" placeholder="Search products and brands" className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none" /><button type="submit" className="text-xs font-bold text-amber-700">Go</button></form></div>
      {open && <div id="mobile-menu" className="border-t border-slate-200 bg-white px-4 pb-5 shadow-xl lg:hidden"><div className="grid gap-1 pt-3">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-xl px-3 py-3.5 text-sm font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-800"><span>{link.label}</span><ArrowRight size={16} className="text-slate-400" /></Link>)}</div><div className="mt-3 grid gap-2 border-t border-slate-100 pt-3"><Link href={mode === 'ops' ? '/admin' : '/account'} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 text-sm font-bold"><UserRound size={17} />{mode === 'ops' ? 'Admin dashboard' : 'My account'}</Link>{mode === 'public' && <Link href="/vendor/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 text-sm font-bold"><ShieldCheck size={17} />Sell on ThokIO</Link>}<Link href="/buyer/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 text-sm font-bold"><LayoutDashboard size={17} />Track orders</Link></div></div>}
    </header>
  );
}
