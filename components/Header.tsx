"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const GOLD = "#C49452";
const serif = { fontFamily: "var(--font-display), Georgia, serif" } as const;

const NAV = [
  { label: "HOME", href: "/" },
  { label: "MEN", href: "/men" },
  { label: "KIDS", href: "/kids" },
];

type LenisLike = { scrollTo: (target: string | number, opts?: { duration?: number }) => void };

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // transparent over the hero on home, always solid elsewhere
  const solid = !isHome || scrolled;

  // close the mobile menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  // scroll state: works with native scroll and with Lenis (Lenis still scrolls the window)
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

  // close the mobile menu with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /** On the home page: smooth-scroll in place. On other pages: let <Link> navigate to /#section. */
  const handleClick = (e: React.MouseEvent, href: string) => {
    setOpen(false);
    if (!isHome) return;
    e.preventDefault();
    const hash = href === "/" ? "#top" : href.slice(1); // "/#about" -> "#about"
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    if (lenis) lenis.scrollTo(hash, { duration: 1.6 });
    else document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
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
          className={`relative transition-[background,backdrop-filter,border-color] duration-500 ${
            solid || open
              ? "border-b border-white/10 bg-[#141211]/80 backdrop-blur-xl"
              : "border-b border-transparent bg-gradient-to-b from-black/50 to-transparent"
          }`}
        >
          <div className="mx-auto flex h-[80px] max-w-[1600px] items-center justify-between px-5 sm:px-10">
          {/* Logo (white plate, artwork zoomed slightly to crop the PNG's empty padding) */}
<Link
  href="/"
  onClick={(e) => handleClick(e, "/")}
  aria-label="Jubba House, home"
  className="relative z-[60] block h-12 w-28 shrink-0 overflow-hidden bg-white sm:h-14 sm:w-32"
>
  <Image
    src="/logo.png"
    alt="Jubba House"
    fill
    priority
    sizes="128px"
    className="origin-center scale-[2.6] object-contain"
  />
</Link>

            {/* Desktop nav */}
            <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={(e) => handleClick(e, n.href)}
                  className="group relative py-2 text-[11px] font-medium uppercase tracking-[.32em] text-white/85 transition-colors hover:text-white"
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
              <div className="hidden items-center gap-3 sm:flex">
                <Link href="/login">
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className="flex items-center border border-white/40 px-5 py-2.5 text-[10px] font-medium uppercase tracking-[.28em] text-white transition-colors hover:bg-white/10"
                  >
                    Login
                  </motion.span>
                </Link>
                <Link href="/register">
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className="flex items-center px-5 py-2.5 text-[10px] font-medium uppercase tracking-[.28em] text-[#141211]"
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
                  className="block h-px w-6 bg-white"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
                  className="block h-px w-6 bg-white"
                />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-[#141211] px-6 pb-10 pt-32 text-white md:hidden"
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
                    className="flex items-baseline gap-4 border-t border-white/15 py-5"
                  >
                    <span className="w-6 text-[10px] tracking-[.2em] text-white/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-5xl" style={{ ...serif, fontWeight: 300 }}>
                      {n.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <div className="border-t border-white/15" />
            </nav>

            <div>
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[.4em]" style={{ color: GOLD }}>
                Art of Perfection
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center border border-white/40 px-6 py-4 text-[11px] font-medium uppercase tracking-[.28em] text-white"
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
