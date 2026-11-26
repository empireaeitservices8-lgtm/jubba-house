"use client";

/**
 * Jubba House: cart state (saved in the browser's localStorage).
 * Wrap the app with <CartProvider> in app/layout.tsx. Read it anywhere with useCart().
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Audience } from "../lib/catalog";

export type CartItem = {
  key: string; // id + size + colour, so the same piece in two sizes is two lines
  id: string;
  audience: Audience;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  qty: number;
};

type NewItem = Omit<CartItem, "key" | "qty">;

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: NewItem, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const STORAGE = "jubba-cart";
const Ctx = createContext<CartCtx | null>(null);

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // load once after mount (keeps server and first client render identical)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore bad data */
    }
    setReady(true);
  }, []);

  // save on every change, and keep other tabs in sync
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify(items));
    } catch {
      /* storage full or blocked */
    }
  }, [items, ready]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE) return;
      try {
        setItems(e.newValue ? JSON.parse(e.newValue) : []);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((item: NewItem, qty = 1) => {
    const key = `${item.id}|${item.size}|${item.color}`;
    setItems((cur) =>
      cur.some((i) => i.key === key)
        ? cur.map((i) => (i.key === key ? { ...i, qty: Math.min(10, i.qty + qty) } : i))
        : [...cur, { ...item, key, qty }]
    );
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((cur) =>
      qty < 1 ? cur.filter((i) => i.key !== key) : cur.map((i) => (i.key === key ? { ...i, qty: Math.min(10, qty) } : i))
    );
  }, []);

  const remove = useCallback((key: string) => setItems((cur) => cur.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.price, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [items, add, setQty, remove, clear]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
