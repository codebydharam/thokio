import Link from 'next/link';
import { ArrowRight, Heart, Package, ShoppingBag, Store } from 'lucide-react';
import { redirect } from 'next/navigation';
import { AppHeader } from '@/components/AppHeader';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?next=/account');
  return <main className="min-h-screen bg-slate-50 text-ink"><AppHeader mode="buyer" /><div className="mx-auto max-w-7xl px-5 py-10 sm:px-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-amber-700">Account center</p><h1 className="mt-3 text-4xl font-black tracking-[-.05em]">Your ThokIO account</h1><p className="mt-3 text-slate-500">{user.email}</p><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['Orders', '/buyer/dashboard', Package], ['Cart', '/cart', ShoppingBag], ['Sample kit', '/sample-kit', Heart], ['Marketplace', '/products', Store]].map(([label, href, Icon]) => <Link key={String(label)} href={String(href)} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="grid size-10 place-items-center rounded-xl bg-amber-100 text-amber-700"><Icon size={19} /></span><div className="mt-8 flex items-center justify-between"><strong>{String(label)}</strong><ArrowRight size={16} className="text-slate-400 transition group-hover:text-ink" /></div></Link>)}</div></div></main>;
}
