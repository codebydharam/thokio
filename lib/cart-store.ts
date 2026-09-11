import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartLine = { variantId: string; productId: string; title: string; variantName: string; price: number; image: string; quantity: number };

type CartState = { lines: CartLine[]; add: (line: CartLine) => void; remove: (variantId: string) => void; setQuantity: (variantId: string, quantity: number) => void; clear: () => void };

export const useCartStore = create<CartState>()(persist((set) => ({
  lines: [],
  add: line => set(state => {
    const existing = state.lines.find(item => item.variantId === line.variantId);
    return { lines: existing ? state.lines.map(item => item.variantId === line.variantId ? { ...item, quantity: item.quantity + line.quantity } : item) : [...state.lines, line] };
  }),
  remove: variantId => set(state => ({ lines: state.lines.filter(item => item.variantId !== variantId) })),
  setQuantity: (variantId, quantity) => set(state => ({ lines: quantity > 0 ? state.lines.map(item => item.variantId === variantId ? { ...item, quantity } : item) : state.lines.filter(item => item.variantId !== variantId) })),
  clear: () => set({ lines: [] }),
}), { name: 'thokio-cart' }));
