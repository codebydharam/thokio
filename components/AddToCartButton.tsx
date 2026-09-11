'use client';

import { Check, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/lib/cart-store';

export function AddToCartButton({ productId, title, price, image }: { productId: string; title: string; price: string; image: string }) {
  const add = useCartStore(state => state.add);
  const [added, setAdded] = useState(false);
  function addItem() {
    add({ variantId: `${productId}-default`, productId, title, variantName: 'Default variant', price: Number(price.replace(/[^0-9.]/g, '')), image, quantity: 1 });
    setAdded(true); window.setTimeout(() => setAdded(false), 1800);
  }
  return <button type="button" onClick={addItem} className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3.5 text-sm font-bold transition ${added ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'}`}>{added ? <Check size={17} /> : <ShoppingCart size={17} />}{added ? 'Added to cart' : 'Add to cart'}</button>;
}
