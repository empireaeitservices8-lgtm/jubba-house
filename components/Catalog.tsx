"use client";

/**
 * Jubba House: shop catalog (used by the Men and Kids pages).
 * Save as components/Catalog.tsx. Needs lib/catalog.ts. Uses framer-motion (already installed).
 *
 * Cards link to the product view page: /men/<id> and /kids/<id>.
 *
 * Images: /public/images/men/<category>.jpg and /public/images/kids/<category>.jpg
 * (the same files your Collections section uses). A missing image shows a "J" placeholder.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  CATEGORIES,
  COLORS,
  PRODUCTS,
  SIZES,
  cap,
  formatPrice,
  priceBounds,
  slug,
  type Audience,
  type Product,
} from "../lib/catalog";

const GOLD = "#C49452";
const serif = { fontFamily: "var(--font-display), Georgia, serif" } as const;

const THEME = {
  men: {
    title: "Men",
    blurb: "Kurtas, sherwanis, jodhpuris and everyday jubbas, cut with care.",
    banner: "#3A1620",
    arch: "#6E1F2A",
    archImage: "/images/men/sherwani.jpg",
  },
  kids: {
    title: "Kids",
    blurb: "The same tailoring as the men's range, in sizes for ages two to thirteen.",
    banner: "#17291F",
    arch: "#1F3A2E",
    archImage: "/images/kids/sherwani.jpg",
  },
} as const;

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "low", label: "Price: low to high" },
  { value: "high", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

/** Products per page (9 = three rows of three on desktop). Change freely. */
const PAGE_SIZE = 8;

/** 1 ... 4 5 6 ... 12 style page list. */
function pageRange(current: number, total: number): (number | "gap")[] {
  const nums = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

const pageBtn =
  "flex h-11 min-w-11 items-center justify-center border px-3 text-sm transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141211]";

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-16 flex flex-wrap items-center justify-center gap-2 border-t border-black/10 pt-10">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={`${pageBtn} gap-2 border-black/25 text-[10px] font-medium uppercase tracking-[.24em] hover:border-black/60 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-black/25`}
      >
        <span aria-hidden>&larr;</span>
        <span className="hidden sm:inline">Prev</span>
      </button>

      {pageRange(page, total).map((n, i) =>
        n === "gap" ? (
          <span key={`gap-${i}`} aria-hidden className="px-1 text-black/40">
            &hellip;
          </span>
        ) : (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-label={`Page ${n}`}
            aria-current={n === page ? "page" : undefined}
            className={`${pageBtn} ${
              n === page ? "border-[#141211] bg-[#141211] text-white" : "border-black/25 hover:border-black/60"
            }`}
            style={n === page ? { fontFamily: "var(--font-display), Georgia, serif" } : undefined}
          >
            {n}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === total}
        aria-label="Next page"
        className={`${pageBtn} gap-2 border-black/25 text-[10px] font-medium uppercase tracking-[.24em] hover:border-black/60 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-black/25`}
      >
        <span className="hidden sm:inline">Next</span>
        <span aria-hidden>&rarr;</span>
      </button>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */
function Heart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={filled ? GOLD : "none"} stroke={filled ? GOLD : "currentColor"} strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
      <path d="M12 21s-7.5-4.6-9.5-9.3C1.1 8.4 3 5 6.4 5c2 0 3.7 1.1 5.6 3.2C13.9 6.1 15.6 5 17.6 5 21 5 22.9 8.4 21.5 11.7 19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

function Hangers() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[80px]">
      <div className="h-px w-full" style={{ background: "rgba(196,148,82,.55)" }} />
      <div className="flex justify-around px-6 sm:px-16">
        {Array.from({ length: 9 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 44 34"
            width="44"
            height="34"
            fill="none"
            stroke={GOLD}
            strokeOpacity=".55"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={i > 4 ? "hidden sm:block" : ""}
          >
            <path d="M22 0v6" />
            <path d="M22 6a3.5 3.5 0 1 1 3.5 3.5" />
            <path d="M22 11 3 27h38z" />
          </svg>
        ))}
      </div>
    </div>
  );
}

function Check({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className="flex h-4 w-4 shrink-0 items-center justify-center border transition-colors"
      style={{ borderColor: on ? "#141211" : "rgba(0,0,0,.35)", background: on ? "#141211" : "transparent" }}
    >
      {on && (
        <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 6.5 5 9l5-6" />
        </svg>
      )}
    </span>
  );
}

const groupTitle = "mb-4 text-xl italic text-[#8a6430]";

/* ------------------------------------------------------------------ */
/*  Filters                                                            */
/* ------------------------------------------------------------------ */
type FilterProps = {
  audience: Audience;
  cats: string[];
  setCats: (v: string[]) => void;
  sizes: string[];
  setSizes: (v: string[]) => void;
  colors: string[];
  setColors: (v: string[]) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  activeCount: number;
  onReset: () => void;
};

function FilterPanel(p: FilterProps) {
  const { min, max } = priceBounds(p.audience);
  const products = PRODUCTS[p.audience];

  return (
    <div className="space-y-9">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl" style={{ ...serif, fontWeight: 400 }}>
          Filters
        </h2>
        {p.activeCount > 0 && (
          <button
            onClick={p.onReset}
            className="text-[10px] font-medium uppercase tracking-[.24em] text-black/55 underline-offset-4 hover:text-[#8a6430] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141211]"
          >
            Reset ({p.activeCount})
          </button>
        )}
      </div>

      {/* categories */}
      <fieldset>
        <legend className={groupTitle} style={serif}>
          Category
        </legend>
        <ul className="space-y-3">
          {CATEGORIES[p.audience].map((c) => {
            const s = slug(c);
            const on = p.cats.includes(s);
            const count = products.filter((x) => x.category === s).length;
            return (
              <li key={s}>
                <label className="flex cursor-pointer items-center gap-3 text-[15px]">
                  <input type="checkbox" checked={on} onChange={() => p.setCats(toggle(p.cats, s))} className="peer sr-only" />
                  <span className="flex flex-1 items-center gap-3 peer-focus-visible:[&>span:first-child]:outline peer-focus-visible:[&>span:first-child]:outline-2 peer-focus-visible:[&>span:first-child]:outline-offset-2 peer-focus-visible:[&>span:first-child]:outline-[#141211]">
                    <Check on={on} />
                    <span className={on ? "font-medium" : "text-black/75"}>{cap(c)}</span>
                  </span>
                  <span className="text-xs text-black/40">{count}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      {/* sizes */}
      <fieldset>
        <legend className={groupTitle} style={serif}>
          Size
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {SIZES[p.audience].map((s) => (
            <label key={s} className="cursor-pointer">
              <input type="checkbox" checked={p.sizes.includes(s)} onChange={() => p.setSizes(toggle(p.sizes, s))} className="peer sr-only" />
              <span className="flex h-10 items-center justify-center border border-black/25 text-[13px] transition-colors hover:border-black/60 peer-checked:border-[#141211] peer-checked:bg-[#141211] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#141211]">
                {s}
              </span>
            </label>
          ))}
        </div>
        {p.audience === "kids" && <p className="mt-3 text-xs text-black/50">Sizes are by age in years.</p>}
      </fieldset>

      {/* colours */}
      <fieldset>
        <legend className={groupTitle} style={serif}>
          Colour
        </legend>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-3">
          {COLORS.map((c) => {
            const on = p.colors.includes(c.name);
            return (
              <li key={c.name}>
                <label className="flex cursor-pointer items-center gap-2.5 text-[14px]">
                  <input type="checkbox" checked={on} onChange={() => p.setColors(toggle(p.colors, c.name))} className="peer sr-only" />
                  <span
                    aria-hidden
                    className="h-5 w-5 shrink-0 rounded-full border border-black/20 transition-all peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#141211]"
                    style={{ background: c.hex, boxShadow: on ? `0 0 0 2px #F6F1E9, 0 0 0 3.5px #141211` : "none" }}
                  />
                  <span className={on ? "font-medium" : "text-black/75"}>{c.name}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      {/* price */}
      <fieldset>
        <legend className={groupTitle} style={serif}>
          Price
        </legend>
        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={p.maxPrice}
          onChange={(e) => p.setMaxPrice(Number(e.target.value))}
          aria-label="Maximum price"
          className="w-full"
          style={{ accentColor: GOLD }}
        />
        <div className="mt-2 flex justify-between text-xs text-black/55">
          <span>{formatPrice(min)}</span>
          <span className="font-medium text-[#141211]">Up to {formatPrice(p.maxPrice)}</span>
        </div>
      </fieldset>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Product card                                                       */
/* ------------------------------------------------------------------ */
function Card({ product, audience, liked, onLike }: { product: Product; audience: Audience; liked: boolean; onLike: () => void }) {
  const [failed, setFailed] = useState(false);
  const href = `/${audience}/${product.id}`;

  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#EAE0CD]">
        {!failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-contain object-bottom mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-7xl text-black/15" style={{ ...serif, fontWeight: 300 }} aria-hidden>
            J
          </div>
        )}

        {/* the whole image is a link to the product page */}
        <Link
          href={href}
          aria-label={`View details: ${cap(product.name)}`}
          className="absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#141211]"
        />

        <button
          onClick={onLike}
          aria-pressed={liked}
          aria-label={liked ? `Remove ${product.name} from saved` : `Save ${product.name}`}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F1E9]/90 text-[#141211] backdrop-blur transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141211]"
        >
          <Heart filled={liked} />
        </button>

        <Link
          href={href}
          tabIndex={-1}
          aria-hidden
          className="absolute inset-x-0 bottom-0 bg-[#141211]/90 py-3 text-center text-[10px] font-medium uppercase tracking-[.26em] text-white transition-all duration-500 sm:translate-y-full sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
        >
          View details
        </Link>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-medium uppercase tracking-[.26em] text-[#8a6430]">{cap(product.categoryLabel)}</p>
        <h3 className="mt-1 text-xl leading-snug" style={{ ...serif, fontWeight: 400 }}>
          <Link
            href={href}
            className="transition-colors hover:text-[#8a6430] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141211]"
          >
            {cap(product.name)}
          </Link>
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[15px] font-medium">{formatPrice(product.price)}</span>
          <span className="flex gap-1.5" aria-label={`Colours: ${product.colors.join(", ")}`}>
            {product.colors.map((c) => (
              <span key={c} title={c} className="h-3.5 w-3.5 rounded-full border border-black/20" style={{ background: COLORS.find((x) => x.name === c)?.hex }} />
            ))}
          </span>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function Catalog({ audience, initialCategory }: { audience: Audience; initialCategory?: string }) {
  const theme = THEME[audience];
  const all = PRODUCTS[audience];
  const { max } = priceBounds(audience);

  const validInitial = initialCategory && CATEGORIES[audience].some((c) => slug(c) === initialCategory) ? [initialCategory] : [];

  const [cats, setCats] = useState<string[]>(validInitial);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(max);
  const [sort, setSort] = useState("featured");
  const [liked, setLiked] = useState<string[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLElement>(null);

  const activeCount = cats.length + sizes.length + colors.length + (maxPrice < max ? 1 : 0);
  const reset = () => {
    setCats([]);
    setSizes([]);
    setColors([]);
    setMaxPrice(max);
  };

  const list = useMemo(() => {
    const out = all.filter(
      (p) =>
        (!cats.length || cats.includes(p.category)) &&
        (!sizes.length || p.sizes.some((s) => sizes.includes(s))) &&
        (!colors.length || p.colors.some((c) => colors.includes(c))) &&
        p.price <= maxPrice
    );
    if (sort === "low") out.sort((a, b) => a.price - b.price);
    if (sort === "high") out.sort((a, b) => b.price - a.price);
    if (sort === "name") out.sort((a, b) => a.name.localeCompare(b.name));
    return out;
  }, [all, cats, sizes, colors, maxPrice, sort]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, list.length);
  const visible = list.slice(start, end);

  // back to page 1 whenever the filters or sorting change
  useEffect(() => setPage(1), [cats, sizes, colors, maxPrice, sort]);

  const goToPage = (n: number) => {
    setPage(n);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    topRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  // close drawer with Escape
  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer]);

  const panel = (
    <FilterPanel
      audience={audience}
      cats={cats}
      setCats={setCats}
      sizes={sizes}
      setSizes={setSizes}
      colors={colors}
      setColors={setColors}
      maxPrice={maxPrice}
      setMaxPrice={setMaxPrice}
      activeCount={activeCount}
      onReset={reset}
    />
  );

  const heading = cats.length === 1 ? cap(CATEGORIES[audience].find((c) => slug(c) === cats[0]) ?? "") : "All pieces";

  return (
    <main className="bg-[#F6F1E9] text-[#141211]">
      {/* ---------------- Banner ---------------- */}
      <section className="relative overflow-hidden px-5 pb-16 pt-44 text-white sm:px-10 sm:pb-20 sm:pt-52" style={{ background: theme.banner }}>
        <Hangers />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(45% 60% at 82% 60%, rgba(196,148,82,.22) 0%, transparent 70%)" }}
        />
        <div className="relative mx-auto flex max-w-[1500px] items-end justify-between gap-10">
          <div>
            <p className="text-sm italic" style={{ ...serif, color: GOLD }}>
              The collection
            </p>
            <h1 className="mt-3 leading-[.9]" style={{ ...serif, fontWeight: 300, fontSize: "clamp(4.5rem, 14vw, 11rem)", letterSpacing: "-.03em" }}>
              {theme.title}
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/75 sm:text-xl" style={serif}>
              {theme.blurb}
            </p>
          </div>

          <div className="relative hidden w-[210px] shrink-0 pr-3 lg:block" aria-hidden>
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-[999px] border" style={{ borderColor: GOLD, aspectRatio: "3 / 4", marginRight: 12 }} />
            <div className="relative overflow-hidden rounded-t-[999px]" style={{ aspectRatio: "3 / 4", background: theme.arch }}>
              <div
                className="absolute inset-x-0 bottom-0 h-[92%]"
                style={{ backgroundImage: `url(${theme.archImage})`, backgroundRepeat: "no-repeat", backgroundPosition: "center bottom", backgroundSize: "contain" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Category pills ---------------- */}
      <div className="border-b border-black/10 px-5 py-6 sm:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div role="group" aria-label="Quick category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" data-lenis-prevent>
            {[{ label: "All", s: "" }, ...CATEGORIES[audience].map((c) => ({ label: cap(c), s: slug(c) }))].map((p) => {
              const on = p.s === "" ? cats.length === 0 : cats.length === 1 && cats[0] === p.s;
              return (
                <button
                  key={p.label}
                  onClick={() => setCats(p.s ? [p.s] : [])}
                  aria-pressed={on}
                  className={`shrink-0 rounded-full border px-5 py-2.5 text-[13px] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141211] ${
                    on ? "border-[#141211] bg-[#141211] text-white" : "border-black/25 hover:border-black/60"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------------- Filters + grid ---------------- */}
      <div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-10 sm:px-10 sm:py-14 lg:grid-cols-[260px_1fr] lg:gap-14">
        {/* sidebar (desktop) */}
        <aside className="hidden lg:block">
          <div data-lenis-prevent className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto pr-3">
            {panel}
          </div>
        </aside>

        <section ref={topRef} aria-label={`${theme.title} products`} className="scroll-mt-28">
          {/* toolbar */}
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-black/10 pb-5">
            <div>
              <h2 className="text-3xl sm:text-4xl" style={{ ...serif, fontWeight: 300, letterSpacing: "-.02em" }}>
                {heading}
              </h2>
              <p className="mt-1 text-sm text-black/55" aria-live="polite">
                {list.length === 0
                  ? "No pieces"
                  : `Showing ${start + 1}\u2013${end} of ${list.length} ${list.length === 1 ? "piece" : "pieces"}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawer(true)}
                className="flex items-center gap-2 border border-black/30 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[.24em] lg:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141211]"
              >
                Filters{activeCount > 0 && ` (${activeCount})`}
              </button>

              <label className="flex items-center gap-2 text-sm text-black/60">
                <span className="hidden sm:inline">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-black/30 bg-transparent px-3 py-2.5 text-sm text-[#141211] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141211]"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* grid */}
          {list.length > 0 ? (
            <>
              <motion.div
                key={`${cats}|${sizes}|${colors}|${maxPrice}|${sort}|${safePage}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
                className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3"
              >
                {visible.map((p) => (
                  <Card
                    key={p.id}
                    product={p}
                    audience={audience}
                    liked={liked.includes(p.id)}
                    onLike={() => setLiked((l) => toggle(l, p.id))}
                  />
                ))}
              </motion.div>
              <Pagination page={safePage} total={totalPages} onChange={goToPage} />
            </>
          ) : (
            <div className="py-24 text-center">
              <p className="text-3xl" style={{ ...serif, fontWeight: 300 }}>
                Nothing matches these filters.
              </p>
              <button
                onClick={reset}
                className="mt-6 border-b border-[#141211] pb-1 text-[10px] font-medium uppercase tracking-[.3em] hover:border-[#C49452] hover:text-[#8a6430]"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>
      </div>

      {/* ---------------- Mobile filter drawer ---------------- */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
              className="fixed inset-0 z-[70] bg-black/50"
            />
            <motion.aside
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-y-0 left-0 z-[71] flex w-[88%] max-w-sm flex-col bg-[#F6F1E9]"
            >
              <div data-lenis-prevent className="flex-1 overflow-y-auto px-6 py-8">
                {panel}
              </div>
              <div className="flex gap-3 border-t border-black/10 p-4">
                <button
                  onClick={() => setDrawer(false)}
                  className="flex-1 py-4 text-[11px] font-medium uppercase tracking-[.26em] text-[#141211]"
                  style={{ background: GOLD }}
                >
                  Show {list.length} {list.length === 1 ? "piece" : "pieces"}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
