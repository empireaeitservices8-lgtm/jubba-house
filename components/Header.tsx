"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./CartProvider";

const GOLD = "#C49452";
const INK = "#141211";
const serif = { fontFamily: "var(--font-display), Georgia, serif" } as const;

const NAV = [
  { label: "HOME", href: "/" },
  { label: "MEN", href: "/men" },
  { label: "KIDS", href: "/kids" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

type LenisLike = { scrollTo: (target: string | number, opts?: { duration?: number }) => void };

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { count: cartCount } = useCart();

  // the cart comes from localStorage, so show it only after this component has hydrated
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount : 0;

  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // frosted white glass: lighter over the hero on home, a bit more opaque once scrolled / on other pages
  const solid = !isHome || scrolled;

  // close the mobile menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      const threshold = isHome ? h * 0.6 : 200;
      setHidden(y > last && y > threshold);
      setScrolled(y > h - 90);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleClick = (e: React.MouseEvent, href: string) => {
    setOpen(false);
    if (!isHome || href !== "/") return;
    e.preventDefault();
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: isHome ? 1.2 : 0.1, ease: [0.2, 0.7, 0.2, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <motion.div
          animate={{ y: hidden && !open ? "-110%" : "0%" }}
          transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
          className={`relative border-b backdrop-blur-xl backdrop-saturate-150 transition-[background-color,border-color,box-shadow] duration-500 ${
            solid || open
              ? "border-white/60 bg-white/75 shadow-[0_8px_30px_-12px_rgba(20,18,17,0.25)]"
              : "border-white/30 bg-white/50 shadow-none"
          }`}
        >
          {/* soft light sheen across the glass */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-white/10 to-transparent"
          />

          <div className="relative mx-auto flex h-[80px] max-w-[1600px] items-center justify-between px-5 sm:px-10">
            {/* Logo: no white plate now; multiply blends the PNG's white into the glass */}
            <Link
              href="/"
              onClick={(e) => handleClick(e, "/")}
              aria-label="Jubba House, home"
              className="relative z-[60] block h-12 w-28 shrink-0 overflow-hidden sm:h-14 sm:w-32"
            >
              <Image
                src="/logo.png"
                alt="Jubba House"
                fill
                priority
                sizes="128px"
                className="origin-center scale-[2.6] object-contain mix-blend-multiply"
              />
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={(e) => handleClick(e, n.href)}
                  className="group relative py-2 text-[11px] font-medium uppercase tracking-[.32em] text-[#141211]/75 transition-colors hover:text-[#141211]"
                >
                  {n.label}
                  <span
                    className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                    style={{ background: GOLD }}
                  />
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Link
                href="/cart"
                aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
                className="relative flex h-11 w-11 items-center justify-center text-[#141211]/75 transition-colors hover:text-[#141211] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#141211]"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 8h14l-1 12H6L5 8z" />
                  <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                </svg>
                {count > 0 && (
                  <span
                    className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium text-[#141211]"
                    style={{ background: GOLD }}
                  >
                    {count}
                  </span>
                )}
              </Link>
              <div className="hidden items-center gap-3 sm:flex">
                <Link href="/login">
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className="flex items-center border border-[#141211]/40 px-5 py-2.5 text-[10px] font-medium uppercase tracking-[.28em] text-[#141211] transition-colors hover:bg-[#141211]/5"
                  >
                    Login
                  </motion.span>
                </Link>
                <Link href="/register">
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className="flex items-center px-5 py-2.5 text-[10px] font-medium uppercase tracking-[.28em] text-[#141211] shadow-sm"
                    style={{ background: GOLD }}
                  >
                    Register
                  </motion.span>
                </Link>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="relative z-[60] flex h-11 w-11 flex-col items-center justify-center gap-[6px] md:hidden"
              >
                <motion.span
                  animate={open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
                  className="block h-px w-6 bg-[#141211]"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
                  className="block h-px w-6 bg-[#141211]"
                />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Mobile full-screen menu (frosted white to match the header) */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-white/90 px-6 pb-10 pt-32 text-[#141211] backdrop-blur-2xl md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV.map((n, i) => (
                <motion.div
                  key={n.href}
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <Link
                    href={n.href}
                    onClick={(e) => handleClick(e, n.href)}
                    className="flex items-baseline gap-4 border-t border-[#141211]/15 py-5"
                  >
                    <span className="w-6 text-[10px] tracking-[.2em] text-[#141211]/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-5xl" style={{ ...serif, fontWeight: 300 }}>
                      {n.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <div className="border-t border-[#141211]/15" />
            </nav>

            <div>
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[.4em]" style={{ color: GOLD }}>
                Art of Perfection
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center border border-[#141211]/40 px-6 py-4 text-[11px] font-medium uppercase tracking-[.28em] text-[#141211]"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center px-6 py-4 text-[11px] font-medium uppercase tracking-[.28em] text-[#141211]"
                  style={{ background: GOLD }}
                >
                  Register
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
