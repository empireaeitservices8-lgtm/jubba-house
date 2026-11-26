"use client";

/**
 * Jubba House: home page
 *
 *   npm i gsap lenis framer-motion
 *
 * Fonts are loaded once in app/layout.tsx (--font-display, --font-sans).
 *
 * Assets (all optional, the page has graceful fallbacks):
 *   /public/videos/hero.mp4            full-screen fashion video (muted loop)
 *   /public/images/hero1.png ...       transparent PNG cut-outs for the Lookbook (see LOOK_IMAGES)
 *   /public/jubba-logo-light.png       included
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const GOLD = "#C49452";

const MEN = ["Kurtha", "Suit", "Jodhpuri", "Sherwani", "Indo Western", "Thobe", "Kandura", "Jubba Pajama"];
const KIDS = ["Kurtha", "Suit", "Jodhpuri", "Sherwani", "Thobe", "Kandura", "Jubba Pajama"];

/** Lookbook slider images (transparent PNGs in /public/images). Add or remove freely. */
const LOOK_IMAGES = [
  "/images/hero1.png",
  "/images/hero2.png",
  "/images/hero3.png",
  "/images/hero4.png",
  "/images/hero5.png",
  "/images/hero6.png",
  "/images/hero7.png",
  "/images/hero8.png",
  "/images/hero9.png",
];
const SLIDE_INTERVAL = 3800; // ms between automatic slides (was 5000)

const serif = { fontFamily: "var(--font-display), Georgia, serif" } as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Splits text into masked characters that GSAP staggers in. */
function SplitChars({ text }: { text: string }) {
  return (
    <span aria-label={text} className="inline-block whitespace-nowrap">
      {text.split("").map((c, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden px-[0.02em] pb-[0.06em] align-bottom">
          <span className="hero-char pre inline-block will-change-transform">{c}</span>
        </span>
      ))}
    </span>
  );
}

/** Splits text into words for the scroll-triggered reveal (blur + drift in from the right). */
function SplitWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="mf-word mr-[0.28em] inline-block opacity-0 will-change-transform">
          {w}
        </span>
      ))}
    </>
  );
}

/** Placeholder figure shown when no lookbook image can be loaded. */
function Silhouette() {
  const g = "#6E1F2A", skin = "#c18b62";
  return (
    <svg viewBox="0 0 220 540" className="mx-auto h-full w-auto drop-shadow-[0_30px_40px_rgba(0,0,0,.45)]" aria-hidden>
      <path d="M80 270H110L106 505H82Z M110 270H140L138 505H114Z" fill="#F1E7D0" />
      <ellipse cx="92" cy="512" rx="18" ry="7" fill="#2a2320" />
      <ellipse cx="128" cy="512" rx="18" ry="7" fill="#2a2320" />
      <rect x="100" y="66" width="20" height="32" rx="6" fill={skin} />
      <ellipse cx="110" cy="46" rx="20" ry="25" fill={skin} />
      <path d="M89 42Q90 18 110 18Q131 18 131 42Q121 28 110 28Q99 28 89 42Z" fill="#1d1a19" />
      <path d="M70 98L52 120L40 296L58 300L68 150Z M150 98L168 120L180 296L162 300L152 150Z" fill={g} />
      <circle cx="49" cy="309" r="9" fill={skin} />
      <circle cx="171" cy="309" r="9" fill={skin} />
      <path d="M70 98C90 86 130 86 150 98L158 140L164 372Q110 384 56 372L62 140Z" fill={g} />
      <path d="M96 90Q110 102 124 90L124 100Q110 112 96 100Z" fill={GOLD} />
      <line x1="110" y1="102" x2="110" y2="378" stroke={GOLD} strokeWidth="1.6" opacity=".7" />
      {[124, 168, 212, 256, 300, 344].map((y) => (
        <circle key={y} cx="110" cy={y} r="2.8" fill={GOLD} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero: video + type only                                            */
/* ------------------------------------------------------------------ */
function Hero({ onScrollTo }: { onScrollTo: (target: string) => void }) {
  // raw mouse (-0.5 .. 0.5), smoothed with springs
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 16, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 55, damping: 16, mass: 0.6 });

  // headline drifts gently against the cursor
  const textX = useTransform(sx, [-0.5, 0.5], [28, -28]);
  const textY = useTransform(sy, [-0.5, 0.5], [14, -14]);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      id="top"
      data-hero
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#141211]"
    >
      {/* Video */}
      <div className="video-scale absolute inset-0 will-change-transform">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(70% 60% at 60% 40%, #3a2a1a 0%, #141211 70%)" }}
        />
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/75" />
      </div>

      {/* Giant editorial type */}
      <div className="text-scroll pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <motion.div style={{ x: textX, y: textY }} className="relative -mt-[6vh] text-center">
          <h1
            className="leading-[.8] text-white"
            style={{ ...serif, fontWeight: 300, fontSize: "clamp(5.5rem, 24vw, 25rem)", letterSpacing: "-.03em" }}
          >
            <SplitChars text="JUBBA" />
          </h1>
          <div
            className="-mt-[.18em] pr-[.04em] text-right italic"
            style={{ ...serif, fontWeight: 400, color: GOLD, fontSize: "clamp(3rem, 12vw, 12.5rem)", lineHeight: 0.9 }}
          >
            <SplitChars text="House" />
          </div>
        </motion.div>
      </div>

      {/* Foreground copy */}
      <div className="hero-copy absolute inset-x-0 bottom-0 z-30 flex flex-col gap-6 px-5 pb-8 sm:px-10 md:flex-row md:items-end md:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[150%] bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        />
        <div className="relative max-w-xl">
          <p
            className="hero-fade pre mb-4 text-xs font-medium uppercase tracking-[.45em] sm:text-sm"
            style={{ color: GOLD, textShadow: "0 2px 18px rgba(0,0,0,.75)" }}
          >
            Art of Perfection
          </p>
          <p
            className="hero-fade pre text-xl font-normal leading-snug text-white sm:text-2xl md:text-3xl"
            style={{ ...serif, textShadow: "0 2px 24px rgba(0,0,0,.8)" }}
          >
            Kurthas, sherwanis, thobes and more, tailored for men and kids who dress with intention.
          </p>
        </div>

        <div className="hero-fade pre flex items-center gap-3">
          {["Shop Men", "Shop Kids"].map((label, i) => (
            <motion.button
              key={label}
              onClick={() => onScrollTo("#collections")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className={`group flex items-center gap-3 px-6 py-3.5 text-[10px] font-medium uppercase tracking-[.28em] ${
                i === 0 ? "text-[#141211]" : "border border-white/40 text-white backdrop-blur-sm hover:bg-white/10"
              }`}
              style={i === 0 ? { background: GOLD } : undefined}
            >
              {label}
              <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-fade pre pointer-events-none absolute right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 text-[9px] uppercase tracking-[.4em] text-white/60 sm:flex">
        <span style={{ writingMode: "vertical-rl" }}>Scroll</span>
        <span className="relative h-14 w-px overflow-hidden bg-white/25">
          <motion.span
            className="absolute inset-x-0 h-5 bg-white"
            animate={{ y: [-20, 56] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Lookbook: back-to-front row slider                                 */
/* ------------------------------------------------------------------ */

/**
 * Position of each look in the row, relative to the current one.
 *   rel 0  = front (large, sharp, right)
 *   rel 1+ = further back (smaller, blurrier, to the left)
 *   rel -1 = the look that just stepped off the stage to the right
 */
const SLOT = (rel: number) => {
  const r = Math.min(rel, 5);
  const x = r === -1 ? 108 : [66, 40, 25, 15, 9, 5][r];
  const scale = r === -1 ? 1.08 : [1, 0.78, 0.62, 0.5, 0.42, 0.38][r];
  const blur = r <= 1 ? 0 : [0, 0, 4, 8, 12, 14][r];
  const opacity = r === -1 ? 0 : r >= 4 ? 0 : [1, 0.95, 0.8, 0.5][r];
  return { left: `${x}%`, scale, filter: `blur(${blur}px)`, opacity };
};

const charVariants = {
  hidden: { opacity: 0, filter: "blur(10px)", x: 26 },
  show: { opacity: 1, filter: "blur(0px)", x: 0, transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] as const } }, // was 0.9
};

/** Letters drift in from the right, blurred, then sharpen. */
function BlurChars({ text }: { text: string }) {
  return (
    <motion.span
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      transition={{ staggerChildren: 0.035 }} // was 0.05
      className="inline-block"
    >
      {text.split(" ").map((w, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {w.split("").map((c, i) => (
            <motion.span key={i} variants={charVariants} className="inline-block will-change-transform">
              {c}
            </motion.span>
          ))}
          {"\u00A0"}
        </span>
      ))}
    </motion.span>
  );
}

function Lookbook() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.4 });

  // images that failed to load are skipped
  const [failed, setFailed] = useState<string[]>([]);
  const images = LOOK_IMAGES.filter((src) => !failed.includes(src));

  const [[index], setSlide] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const count = images.length;
  const current = count ? index % count : 0;

  const go = useCallback(
    (step: number) => setSlide(([i]) => [(i + step + Math.max(count, 1)) % Math.max(count, 1), step > 0 ? 1 : -1]),
    [count]
  );
  const goTo = (n: number) => setSlide(([i]) => [n, n >= i ? 1 : -1]);

  // autoplay only while the section is on screen (restarts after every manual change)
  useEffect(() => {
    if (count < 2 || paused || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => go(1), SLIDE_INTERVAL);
    return () => window.clearTimeout(id);
  }, [current, count, paused, inView, go]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      id="looks"
      ref={sectionRef}
      className="relative z-10 flex min-h-[100svh] flex-col overflow-hidden bg-[#3A1620] px-5 py-16 text-white sm:px-10 sm:py-24"
    >
      {/* header row */}
      <div className="relative z-20 flex items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[.4em]" style={{ color: GOLD }}>
            The Lookbook
          </p>
          <h2
            className="mt-3 uppercase leading-[1.15]"
            style={{ ...serif, fontWeight: 400, fontSize: "clamp(1.6rem, 4vw, 3.6rem)", letterSpacing: ".22em" }}
          >
            <BlurChars text="Dressed with intention" />
          </h2>
        </div>
        {count > 0 && (
          <span className="flex items-center gap-2 text-[11px] tracking-[.3em] text-white/70">
            <span>Look</span>
            <span className="relative inline-block h-[1.3em] overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={current}
                  className="block"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }} // was 0.6
                >
                  {pad(current + 1)}
                </motion.span>
              </AnimatePresence>
            </span>
            <span>/ {pad(count)}</span>
          </span>
        )}
      </div>

      {/* stage */}
      <div className="relative mt-8 flex-1">
        {/* soft gold glow + oversized word behind the models */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(45% 55% at 60% 55%, rgba(196,148,82,.28) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center italic text-white/[.05]"
          style={{ ...serif, fontWeight: 300, fontSize: "clamp(8rem, 30vw, 30rem)", lineHeight: 1 }}
        >
          Looks
        </div>

        <div className="relative mx-auto h-[68svh] min-h-[420px] w-full max-w-6xl">
          {count > 0 ? (
            images.map((src, i) => {
              let rel = (i - current + count) % count;
              if (rel === count - 1) rel = -1; // the look that just stepped off to the right
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <motion.img
                  key={src}
                  src={src}
                  alt={`Jubba House look ${i + 1}`}
                  initial={false}
                  animate={SLOT(rel)}
                  transition={{ duration: 0.75, ease: [0.2, 0.7, 0.2, 1] }} // was 0.95
                  style={{ x: "-50%", originX: 0.5, originY: 1, zIndex: 10 - rel }}
                  className="pointer-events-none absolute bottom-0 h-full w-auto object-contain object-bottom drop-shadow-[0_30px_40px_rgba(0,0,0,.45)] will-change-transform"
                  onError={() => setFailed((f) => [...f, src])}
                />
              );
            })
          ) : (
            <Silhouette />
          )}
        </div>
      </div>

      {/* controls */}
      {count > 1 && (
        <div
          className="relative z-20 mt-8 flex items-center justify-center gap-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            onClick={() => go(-1)}
            aria-label="Previous look"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-sm transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            &larr;
          </button>

          <div className="flex items-center">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => goTo(i)}
                aria-label={`Show look ${i + 1}`}
                aria-current={i === current}
                className="flex h-6 w-5 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:w-6"
              >
                <span
                  className="block h-px transition-all duration-500"
                  style={{
                    width: i === current ? 22 : 10,
                    background: i === current ? GOLD : "rgba(255,255,255,.45)",
                  }}
                />
              </button>
            ))}
          </div>

          <button
            onClick={() => go(1)}
            aria-label="Next look"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-sm transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            &rarr;
          </button>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Collections (Framer Motion in-view stagger)                        */
/* ------------------------------------------------------------------ */
const listVariants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.7, 0.2, 1] as const } },
};

function Collection({
  title,
  items,
  dark,
  eyebrow,
}: {
  title: string;
  items: string[];
  dark?: boolean;
  eyebrow: string;
}) {
  return (
    <motion.article
      variants={listVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className={`relative flex min-h-[80svh] flex-col justify-between overflow-hidden px-6 py-14 sm:px-12 sm:py-20 ${
        dark ? "bg-[#141211] text-white" : "bg-[#E9DDC6] text-[#141211]"
      }`}
    >
      <div>
        <motion.p variants={itemVariants} className="text-[10px] font-medium uppercase tracking-[.4em]" style={{ color: dark ? GOLD : "#8a6430" }}>
          {eyebrow}
        </motion.p>
        <motion.h3
          variants={itemVariants}
          className="mt-4 leading-[.85]"
          style={{ ...serif, fontWeight: 300, fontSize: "clamp(5rem, 15vw, 11rem)", letterSpacing: "-.03em" }}
        >
          {title}
        </motion.h3>
      </div>

      <ul className="mt-14">
        {items.map((name, i) => (
          <motion.li
            key={name}
            variants={itemVariants}
            className={`border-t ${dark ? "border-white/15" : "border-black/15"}`}
          >
            <motion.a
              href="#"
              whileHover={{ x: 18 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group flex items-baseline justify-between py-4"
            >
              <span className="flex items-baseline gap-5">
                <span className="w-6 text-[10px] tracking-[.2em] opacity-50">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-3xl transition-colors group-hover:text-[#C49452] sm:text-4xl" style={{ ...serif, fontWeight: 400 }}>
                  {name}
                </span>
              </span>
              <span className="text-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ color: GOLD }}>
                &rarr;
              </span>
            </motion.a>
          </motion.li>
        ))}
        <li className={`border-t ${dark ? "border-white/15" : "border-black/15"}`} />
      </ul>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [hideHeader, setHideHeader] = useState(false);
  const [solidHeader, setSolidHeader] = useState(false);

  const scrollTo = (target: string) => lenisRef.current?.scrollTo(target, { duration: 1.6 });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Lenis, driven by GSAP's ticker ---------- */
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduce,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", (l: Lenis) => {
      ScrollTrigger.update();
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      const h = hero ? hero.offsetHeight : 600;
      setHideHeader(l.direction === 1 && l.scroll > h * 0.6);
      setSolidHeader(l.scroll > h - 90);
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    /* ---------- GSAP animations ---------- */
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".pre, .mf-word", { opacity: 1, filter: "none", x: 0 });
        return;
      }

      // intro: staggered headline, copy, header
      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.2 });
      tl.fromTo(".hero-char", { yPercent: 115, rotate: 7, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, duration: 1.3, stagger: 0.07 })
        .fromTo(".hero-fade", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.14 }, "-=0.7")
        .fromTo(".hdr", { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=1.2");

      // hero scroll scrub: video zooms, headline drifts up and fades
      const hero = { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true };
      gsap.to(".video-scale", { scale: 1.18, ease: "none", scrollTrigger: hero });
      gsap.to(".text-scroll", { yPercent: -28, opacity: 0.1, ease: "none", scrollTrigger: hero });
      gsap.to(".hero-copy", { y: -60, opacity: 0, ease: "none", scrollTrigger: { ...hero, end: "60% top" } });

      // manifesto: words drift in from the right, blurred, and sharpen once the section is in view
      gsap.fromTo(
        ".mf-word",
        { opacity: 0, filter: "blur(12px)", x: 40 },
        {
          opacity: 1,
          filter: "blur(0px)",
          x: 0,
          duration: 1.6,
          ease: "power3.out",
          stagger: 0.16,
          scrollTrigger: { trigger: ".mf", start: "top 70%", toggleActions: "play none none none" },
        }
      );
    }, root);

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <main ref={root} className="bg-[#F6F1E9] text-[#141211]">
      <style>{`
        .pre{opacity:0}
        html.lenis,html.lenis body{height:auto}
        .lenis.lenis-smooth{scroll-behavior:auto!important}
        .lenis.lenis-stopped{overflow:hidden}
      `}</style>

      <Hero onScrollTo={scrollTo} />

      {/* Manifesto */}
      <section id="about" className="mf relative z-10 px-5 py-28 sm:px-10 sm:py-44">
        <p className="mb-10 text-[10px] font-medium uppercase tracking-[.4em] text-[#8a6430]">The House</p>
        <p
          className="mx-auto max-w-6xl leading-[1.08]"
          style={{ ...serif, fontWeight: 400, fontSize: "clamp(2.2rem, 6.2vw, 6rem)" }}
        >
          <SplitWords text="From the first kurtha to the last sherwani, Jubba House dresses every generation in the art of perfection." />
        </p>
      </section>

      {/* Lookbook (back-to-front slider) */}
      <Lookbook />

      {/* Collections */}
      <section id="collections" className="relative z-10 grid lg:grid-cols-2">
        <Collection title="Men" eyebrow="The Men's Collection" items={MEN} dark />
        <Collection title="Kids" eyebrow="The Kids' Collection" items={KIDS} />
      </section>
    </main>
  );
}
