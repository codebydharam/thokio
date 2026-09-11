'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

export function CartButton() {
  const count = useCartStore(state => state.lines.reduce((total, line) => total + line.quantity, 0));
  return <Link href="/cart" className="relative grid size-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100" aria-label={`Cart with ${count} items`}><ShoppingCart size={19} />{count > 0 && <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-amber-600 px-1 text-[10px] font-black text-white">{count}</span>}</Link>;
}
