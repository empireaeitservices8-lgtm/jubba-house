"use client";

/**
 * Jubba House: product view page body (used by app/men/[id] and app/kids/[id]).
 * Save as components/ProductView.tsx. Uses lib/catalog.ts like Catalog.tsx does.
 */

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { COLORS, PRODUCTS, cap, formatPrice, type Audience, type Product } from "../lib/catalog";
import { useCart } from "./CartProvider";

const GOLD = "#C49452";
const serif = { fontFamily: "var(--font-display), Georgia, serif" } as const;

const BANNER = { men: "#3A1620", kids: "#17291F" } as const;

const INFO = [
  {
    title: "Details",
    body: "Tailored in Calicut with a clean finish, reinforced seams and a lining that sits comfortably through long days and longer evenings.",
  },
  {
    title: "Size and fit",
    body: "Pick your usual size. If you are between sizes, message us and we will adjust the fit for you. Kids sizes are by age in years.",
  },
  {
    title: "Care",
    body: "Dry clean for structured pieces. Plain kurtas and pajamas can be gentle hand washed in cold water and dried in the shade.",
  },
];

function Accordion({ title, body }: { title: string; body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-black/15">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#141211]"
      >
        <span className="text-xl" style={{ ...serif, fontWeight: 400 }}>{title}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-2xl leading-none" style={{ color: GOLD }} aria-hidden>
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden pb-5 text-[15px] leading-7 text-black/70"
          >
            {body}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Related({ product, audience }: { product: Product; audience: Audience }) {
  const list = PRODUCTS[audience].filter((p) => p.id !== product.id);
  const same = list.filter((p) => p.category === product.category);
  const items = [...same, ...list.filter((p) => p.category !== product.category)].slice(0, 4);
  if (!items.length) return null;
  return (
    <section className="border-t border-black/10 px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-[1500px]">
        <h2 className="text-3xl sm:text-5xl" style={{ ...serif, fontWeight: 300, letterSpacing: "-.02em" }}>
          You may also like
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {items.map((p) => (
            <Link key={p.id} href={`/${audience}/${p.id}`} className="group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141211]">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#EAE0CD]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-contain object-bottom mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.04]" />
              </div>
              <h3 className="mt-3 text-lg" style={{ ...serif, fontWeight: 400 }}>{cap(p.name)}</h3>
              <p className="text-sm text-black/60">{formatPrice(p.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProductView({ product, audience }: { product: Product; audience: Audience }) {
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string>(product.colors[0]);
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [needSize, setNeedSize] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  const label = audience === "men" ? "Men" : "Kids";

  const addToCart = () => {
    if (!size) {
      setNeedSize(true);
      return;
    }
    add({ id: product.id, audience, name: product.name, price: product.price, image: product.image, size, color });
    setAdded(true);
    setTimeout(() => setAdded(false), 4000);
  };

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: product.name, url: location.href });
      else {
        await navigator.clipboard.writeText(location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <main className="bg-[#F6F1E9] text-[#141211]">
      {/* spacer under the fixed header, with breadcrumb */}
      <div className="px-5 pb-6 pt-28 sm:px-10 sm:pt-32">
        <nav aria-label="Breadcrumb" className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-2 text-sm text-black/55">
          <Link href="/" className="hover:text-[#8a6430]">Home</Link>
          <span aria-hidden>/</span>
          <Link href={`/${audience}`} className="hover:text-[#8a6430]">{label}</Link>
          <span aria-hidden>/</span>
          <Link href={`/${audience}?category=${product.category}`} className="hover:text-[#8a6430]">{cap(product.categoryLabel)}</Link>
          <span aria-hidden>/</span>
          <span aria-current="page" className="text-[#141211]">{cap(product.name)}</span>
        </nav>
      </div>

      <div className="mx-auto grid max-w-[1500px] gap-10 px-5 pb-20 sm:px-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
        {/* image stage */}
        <div className="relative lg:sticky lg:top-28 lg:self-start">
          <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 border sm:translate-x-4 sm:translate-y-4" style={{ borderColor: GOLD }} />
          <div className="relative aspect-[4/5] overflow-hidden" style={{ background: "#EAE0CD" }}>
            <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 50% 60%, rgba(196,148,82,.28) 0%, transparent 70%)" }} />
            {!imgFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.name}
                onError={() => setImgFailed(true)}
                className="absolute inset-0 h-full w-full object-contain object-bottom mix-blend-multiply"
              />
            ) : (
              <div aria-hidden className="absolute inset-0 flex items-center justify-center text-9xl text-black/15" style={{ ...serif, fontWeight: 300 }}>J</div>
            )}
            <span className="absolute left-4 top-4 px-3 py-1.5 text-xs text-white" style={{ background: BANNER[audience] }}>
              {label}
            </span>
          </div>
        </div>

        {/* details */}
        <div className="lg:pt-4">
          <p className="text-lg italic text-[#8a6430]" style={serif}>{cap(product.categoryLabel)}</p>
          <h1 className="mt-2 text-5xl leading-[1] sm:text-7xl" style={{ ...serif, fontWeight: 300, letterSpacing: "-.03em" }}>
            {cap(product.name)}
          </h1>
          <p className="mt-6 text-2xl" style={{ ...serif, fontWeight: 400 }}>{formatPrice(product.price)}</p>
          <p className="mt-1 text-sm text-black/55">Prices include stitching. Alterations are free in store.</p>

          {/* colour */}
          <fieldset className="mt-10">
            <legend className="mb-4 text-xl italic text-[#8a6430]" style={serif}>
              Colour: <span className="not-italic text-[#141211]">{color}</span>
            </legend>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((c) => (
                <label key={c} className="cursor-pointer" title={c}>
                  <input type="radio" name="colour" checked={color === c} onChange={() => setColor(c)} className="peer sr-only" />
                  <span
                    className="block h-9 w-9 rounded-full border border-black/20 transition-shadow peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[#141211]"
                    style={{ background: COLORS.find((x) => x.name === c)?.hex, boxShadow: color === c ? "0 0 0 3px #F6F1E9, 0 0 0 4.5px #141211" : "none" }}
                  />
                  <span className="sr-only">{c}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* size */}
          <fieldset className="mt-9">
            <legend className="mb-4 text-xl italic text-[#8a6430]" style={serif}>
              Size{audience === "kids" && <span className="text-sm not-italic text-black/50"> (age in years)</span>}
            </legend>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <label key={s} className="cursor-pointer">
                  <input
                    type="radio"
                    name="size"
                    checked={size === s}
                    onChange={() => {
                      setSize(s);
                      setNeedSize(false);
                    }}
                    className="peer sr-only"
                  />
                  <span className="flex h-12 min-w-12 items-center justify-center border border-black/25 px-3 text-sm transition-colors hover:border-black/60 peer-checked:border-[#141211] peer-checked:bg-[#141211] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#141211]">
                    {s}
                  </span>
                </label>
              ))}
            </div>
            <p role="alert" className="mt-3 min-h-5 text-sm text-[#9b2c2c]">
              {needSize ? "Choose a size to continue." : ""}
            </p>
          </fieldset>

          {/* actions */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addToCart}
              className="flex-1 px-8 py-4 text-[11px] font-medium uppercase tracking-[.28em] text-[#141211] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141211]"
              style={{ background: GOLD }}
            >
              {added ? "Added to cart" : "Add to cart"}
            </motion.button>
          </div>
          <p role="status" className="mt-3 min-h-5 text-sm text-black/65">
            {added && (
              <>
                Added.{" "}
                <Link href="/cart" className="border-b border-[#141211] pb-0.5 hover:border-[#C49452] hover:text-[#8a6430]">
                  View cart
                </Link>
              </>
            )}
          </p>

          <button onClick={share} className="mt-4 border-b border-[#141211] pb-1 text-[10px] font-medium uppercase tracking-[.3em] hover:border-[#C49452] hover:text-[#8a6430]" aria-live="polite">
            {copied ? "Link copied" : "Share this piece"}
          </button>

          <div className="mt-12 border-b border-black/15">
            {INFO.map((i) => (
              <Accordion key={i.title} {...i} />
            ))}
          </div>
        </div>
      </div>

      <Related product={product} audience={audience} />
    </main>
  );
}
