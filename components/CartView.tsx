"use client";

/** Jubba House: cart page body. Used by app/cart/page.tsx. */

import { useEffect, useState } from "react";
import Link from "next/link";
import { cap, formatPrice } from "../lib/catalog";
import { useCart } from "./CartProvider";

const GOLD = "#C49452";
const serif = { fontFamily: "var(--font-display), Georgia, serif" } as const;

export default function CartView() {
  const cart = useCart();
  const { setQty, remove, clear } = cart;

  // the cart comes from localStorage, so render it only after hydration to match the server HTML
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const items = mounted ? cart.items : [];
  const count = mounted ? cart.count : 0;
  const subtotal = mounted ? cart.subtotal : 0;

  const checkout = () => {
    // TODO: add your order logic here (items, subtotal and count come from useCart()).
  };

  return (
    <main className="min-h-[100svh] bg-[#F6F1E9] px-5 pb-24 pt-32 text-[#141211] sm:px-10 sm:pt-40">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="text-5xl leading-none sm:text-7xl" style={{ ...serif, fontWeight: 300, letterSpacing: "-.03em" }}>
          Your cart
        </h1>
        <p className="mt-4 text-black/60" aria-live="polite">
          {count === 0 ? "Nothing here yet." : `${count} ${count === 1 ? "piece" : "pieces"}`}
        </p>

        {items.length === 0 ? (
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/men" className="px-6 py-3.5 text-[10px] font-medium uppercase tracking-[.28em] text-[#141211]" style={{ background: GOLD }}>
              Shop men
            </Link>
            <Link href="/kids" className="border border-black/30 px-6 py-3.5 text-[10px] font-medium uppercase tracking-[.28em]">
              Shop kids
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
            <ul className="border-b border-black/15">
              {items.map((i) => (
                <li key={i.key} className="flex gap-4 border-t border-black/15 py-6 sm:gap-6">
                  <Link href={`/${i.audience}/${i.id}`} className="relative block aspect-[3/4] w-24 shrink-0 overflow-hidden bg-[#EAE0CD] sm:w-32">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={i.image} alt={i.name} className="absolute inset-0 h-full w-full object-contain object-bottom mix-blend-multiply" />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link href={`/${i.audience}/${i.id}`} className="text-xl hover:text-[#8a6430] sm:text-2xl" style={{ ...serif, fontWeight: 400 }}>
                          {cap(i.name)}
                        </Link>
                        <p className="mt-1 text-sm text-black/60">
                          Size {i.size} · {i.color}
                        </p>
                      </div>
                      <p className="text-[15px] font-medium">{formatPrice(i.price * i.qty)}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-black/25">
                        <button
                          onClick={() => setQty(i.key, i.qty - 1)}
                          aria-label={`Decrease quantity of ${i.name}`}
                          className="flex h-10 w-10 items-center justify-center hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#141211]"
                        >
                          &minus;
                        </button>
                        <span className="w-8 text-center text-sm" aria-live="polite">{i.qty}</span>
                        <button
                          onClick={() => setQty(i.key, i.qty + 1)}
                          disabled={i.qty >= 10}
                          aria-label={`Increase quantity of ${i.name}`}
                          className="flex h-10 w-10 items-center justify-center hover:bg-black/5 disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#141211]"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => remove(i.key)}
                        className="text-[10px] font-medium uppercase tracking-[.24em] text-black/55 underline-offset-4 hover:text-[#8a6430] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141211]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit border border-black/15 p-6 lg:sticky lg:top-28">
              <h2 className="text-2xl" style={{ ...serif, fontWeight: 400 }}>Order summary</h2>
              <div className="mt-6 flex items-baseline justify-between border-t border-black/15 pt-6">
                <span className="text-black/65">Subtotal</span>
                <span className="text-2xl" style={{ ...serif, fontWeight: 400 }}>{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-2 text-sm text-black/55">Prices include stitching.</p>
              <button
                onClick={checkout}
                className="mt-6 w-full px-8 py-4 text-[11px] font-medium uppercase tracking-[.28em] text-[#141211] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141211]"
                style={{ background: GOLD }}
              >
                Proceed to checkout
              </button>
              <button
                onClick={clear}
                className="mt-4 w-full text-center text-[10px] font-medium uppercase tracking-[.24em] text-black/55 hover:text-[#8a6430]"
              >
                Clear cart
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
