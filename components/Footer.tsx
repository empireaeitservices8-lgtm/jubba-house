"use client";

/**
 * Jubba House: footer
 *
 * Save as components/Footer.tsx (next to Header.tsx) and render it once in app/layout.tsx,
 * after {children}:
 *
 *   <Header />
 *   {children}
 *   <Footer />
 *
 * Uses the same fonts (--font-display), gold (#C49452) and dark (#141211) as the header.
 * Logo: /logo.png (same file the header uses).
 */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const GOLD = "#C49452";
const serif = { fontFamily: "var(--font-display), Georgia, serif" } as const;

const CONTACT = {
  phones: [
    { display: "96337 21605", tel: "+919633721605" },
    { display: "90611 12553", tel: "+919061112553" },
  ],
  email: "jjubbahouse@gmail.com",
  instagram: "https://www.instagram.com/jubba_house",
  facebook: "https://www.facebook.com/share/1CYcEriT8K/",
  whatsapp: "https://wa.me/919633721605",
  address: ["Grand Bazar, Oyitty Road", "SM Street Cross Road", "Calicut - 673 001"],
  map: "https://www.google.com/maps/search/?api=1&query=Jubba+House+Grand+Bazar+Oyitty+Road+SM+Street+Cross+Road+Calicut+673001",
};

const SHOP = [
  { label: "Men", href: "/men" },
  { label: "Kids", href: "/kids" },
  { label: "Sherwani", href: "/men?category=sherwani" },
  { label: "Jodhpuri", href: "/men?category=jodhpuri" },
  { label: "Thobe", href: "/men?category=thobe" },
  { label: "Kurta", href: "/men?category=kurta" },
];

const HOUSE = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
];

const linkCls =
  "inline-block text-[15px] text-white/70 transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function InstagramIcon() {
  return (
    <svg {...iconProps}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg {...iconProps}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const socialCls =
  "flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white/80 transition-all duration-300 hover:-translate-y-1 hover:border-[#C49452] hover:text-[#C49452] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-5 text-2xl italic" style={{ ...serif, color: GOLD, fontWeight: 400 }}>
      {children}
    </h3>
  );
}

export default function Footer() {
  const reduce = useReducedMotion();

  // fixed value for the prerender, updated to the real year after mount
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);

  const toTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: { duration?: number }) => void } })
      .__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer id="contact" className="relative z-10 overflow-hidden bg-[#141211] text-white">
      {/* soft gold glow behind the wordmark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
        style={{ background: "radial-gradient(60% 70% at 50% 100%, rgba(196,148,82,.16) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-[1600px] px-5 pt-20 sm:px-10 sm:pt-28">
        {/* statement + CTA */}
        <div className="flex flex-col gap-10 border-b border-white/15 pb-14 md:flex-row md:items-end md:justify-between">
          <p
            className="max-w-3xl text-4xl leading-[1.08] sm:text-6xl"
            style={{ ...serif, fontWeight: 300, letterSpacing: "-.02em" }}
          >
            Come try it on. We are in the heart of Calicut.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={CONTACT.map}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3.5 text-[10px] font-medium uppercase tracking-[.28em] text-[#141211] transition-transform duration-300 hover:scale-[1.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              style={{ background: GOLD }}
            >
              Get directions
            </a>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border border-white/40 px-6 py-3.5 text-[10px] font-medium uppercase tracking-[.28em] text-white transition-colors duration-300 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              WhatsApp us
            </a>
          </div>
        </div>

        {/* columns */}
        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_.8fr_.8fr] lg:gap-8">
          {/* brand */}
          <div>
            <Link
              href="/"
              aria-label="Jubba House, home"
              className="relative block h-14 w-32 overflow-hidden bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Image
                src="/logo.png"
                alt="Jubba House"
                fill
                sizes="128px"
                className="origin-center scale-[2.6] object-contain"
              />
            </Link>
            <p className="mt-6 max-w-[17rem] text-xl leading-snug text-white/80" style={{ ...serif, fontWeight: 400 }}>
              Kurtas, sherwanis, thobes and more, for men and kids.
            </p>
            <p className="mt-3 text-sm italic" style={{ ...serif, color: GOLD }}>
              Art of Perfection
            </p>
          </div>

          {/* visit */}
          <div>
            <ColumnTitle>Visit</ColumnTitle>
            <address className="not-italic">
              {CONTACT.address.map((line) => (
                <p key={line} className="text-[15px] leading-7 text-white/70">
                  {line}
                </p>
              ))}
            </address>
            <a
              href={CONTACT.map}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-4 inline-block py-1 text-[11px] font-medium uppercase tracking-[.28em] text-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Open in Maps
              <span
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-100 transition-transform duration-500 group-hover:scale-x-0"
                style={{ background: GOLD }}
              />
            </a>
          </div>

          {/* reach us */}
          <div>
            <ColumnTitle>Reach us</ColumnTitle>
            <ul className="space-y-2">
              {CONTACT.phones.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`} className={linkCls}>
                    {p.display}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${CONTACT.email}`} className={`${linkCls} break-all`}>
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex gap-3 pt-4">
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Jubba House on Instagram"
                  className={socialCls}
                >
                  <InstagramIcon />
                </a>
                <a
                  href={CONTACT.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Jubba House on Facebook"
                  className={socialCls}
                >
                  <FacebookIcon />
                </a>
              </li>
            </ul>
          </div>

          {/* shop */}
          <div>
            <ColumnTitle>Shop</ColumnTitle>
            <ul className="space-y-2">
              {SHOP.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* the house */}
          <div>
            <ColumnTitle>The house</ColumnTitle>
            <ul className="space-y-2">
              {HOUSE.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* oversized wordmark, cropped at the bottom edge */}
      <div className="relative select-none" aria-hidden>
        <motion.div
          initial={reduce ? false : { y: "35%", opacity: 0 }}
          whileInView={{ y: "0%", opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
          className="whitespace-nowrap text-center leading-[.78]"
          style={{
            ...serif,
            fontWeight: 300,
            fontSize: "clamp(4.5rem, 21vw, 22rem)",
            letterSpacing: "-.03em",
            color: GOLD,
            WebkitMaskImage: "linear-gradient(to bottom, #000 25%, transparent 92%)",
            maskImage: "linear-gradient(to bottom, #000 25%, transparent 92%)",
            marginBottom: "-.08em",
          }}
        >
          Jubba <span className="italic">House</span>
        </motion.div>
      </div>

      {/* bottom bar */}
      <div className="relative border-t border-white/15">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 px-5 py-6 text-xs text-white/55 sm:flex-row sm:px-10">
          <p>&copy; {year} Designed by Empire AE IT Services. All rights reserved.</p>
          <button
            onClick={toTop}
            className="group flex items-center gap-3 text-[10px] font-medium uppercase tracking-[.28em] text-white/80 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Back to top
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#C49452]"
              aria-hidden
            >
              &uarr;
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
