/**
 * Jubba House: About page
 *
 * Save as app/about/page.tsx (the header already links to /about).
 * Server component, so `metadata` works. No extra packages needed.
 *
 * Images (all optional; each arch falls back to a plain coloured arch if the file is missing):
 *   /public/images/hero1.png            transparent cut-out, used in the hero arch
 *   /public/images/men/sherwani.jpg     used in the Men arch (already in your collections)
 *   /public/images/kids/sherwani.jpg    used in the Kids arch
 *
 * The copy below is written from what is on your site and business card.
 * Edit anything that is not true to your story (founding year, workshop, etc.).
 */

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Jubba House",
  description:
    "Jubba House is a Calicut house for kurtas, sherwanis, thobes and more, tailored for men and kids who dress with intention.",
};

const GOLD = "#C49452";
const GOLD_DARK = "#8a6430";
const serif = { fontFamily: "var(--font-display), Georgia, serif" } as const;

const CONTACT = {
  phones: [
    { display: "96337 21605", tel: "+919633721605" },
    { display: "90611 12553", tel: "+919061112553" },
  ],
  address: ["Grand Bazar, Oyitty Road", "SM Street Cross Road", "Calicut - 673 001"],
  map: "https://www.google.com/maps/search/?api=1&query=Jubba+House+Grand+Bazar+Oyitty+Road+SM+Street+Cross+Road+Calicut+673001",
};

const PRINCIPLES = [
  {
    title: "Cut with care",
    body: "Every sherwani, kurta and thobe is judged by its line: the shoulder, the fall, the finish at the cuff. We would rather get one garment right than ten garments close.",
  },
  {
    title: "Fabric you can feel",
    body: "A good garment should feel as right as it looks. We choose fabrics that sit well on the body and hold up through long days, festivals and many washes.",
  },
  {
    title: "Made for the occasion",
    body: "A wedding, a Friday prayer, a family photograph, an ordinary Tuesday. Each asks for something different, so our range runs from jodhpuris to everyday jubbas.",
  },
];

/** Shared one-time entrance (CSS only, so this page stays a server component). */
const css = `
@keyframes jh-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@keyframes jh-arch { from { opacity: 0; transform: translateY(60px) scale(.97); } to { opacity: 1; transform: none; } }
.jh-rise { opacity: 0; animation: jh-rise 1.1s cubic-bezier(.2,.7,.2,1) forwards; }
.jh-arch { opacity: 0; animation: jh-arch 1.4s cubic-bezier(.2,.7,.2,1) .25s forwards; }
@media (prefers-reduced-motion: reduce) {
  .jh-rise, .jh-arch { animation: none; opacity: 1; transform: none; }
}
`;

/** Arched frame (same shape as the Collections stage) with an offset gold outline. */
function Arch({
  color,
  image,
  alt,
  className = "",
}: {
  color: string;
  image?: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <div
        aria-hidden
        className="absolute inset-0 translate-x-4 translate-y-4 rounded-t-[999px] border"
        style={{ borderColor: GOLD, aspectRatio: "3 / 4" }}
      />
      <div
        role="img"
        aria-label={alt}
        className="relative overflow-hidden rounded-t-[999px]"
        style={{ aspectRatio: "3 / 4", backgroundColor: color }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(60% 50% at 50% 60%, rgba(196,148,82,.35) 0%, transparent 70%)" }}
        />
        {image && (
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[92%]"
            style={{
              backgroundImage: `url(${image})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center bottom",
              backgroundSize: "contain",
              filter: "drop-shadow(0 24px 30px rgba(0,0,0,.4))",
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="bg-[#F6F1E9] text-[#141211]">
      <style>{css}</style>

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden bg-[#141211] px-5 pb-24 pt-36 text-white sm:px-10 sm:pb-32 sm:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(55% 60% at 75% 55%, rgba(196,148,82,.2) 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-[1.15fr_.85fr] lg:gap-10">
          <div>
            <p className="jh-rise text-sm italic" style={{ ...serif, color: GOLD, animationDelay: ".1s" }}>
              About Jubba House
            </p>
            <h1
              className="jh-rise mt-6 leading-[.98]"
              style={{
                ...serif,
                fontWeight: 300,
                fontSize: "clamp(3.2rem, 9vw, 9rem)",
                letterSpacing: "-.03em",
                animationDelay: ".25s",
              }}
            >
              Tailored for the moments that matter.
            </h1>
            <p
              className="jh-rise mt-10 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl"
              style={{ ...serif, animationDelay: ".5s" }}
            >
              Jubba House is a Calicut house for kurtas, sherwanis, thobes and more, made for men and kids who dress
              with intention. Art of perfection is how we cut, finish and fit every piece.
            </p>

            <div className="jh-rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: ".7s" }}>
              <Link
                href="/men"
                className="px-6 py-3.5 text-[10px] font-medium uppercase tracking-[.28em] text-[#141211] transition-transform duration-300 hover:scale-[1.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                style={{ background: GOLD }}
              >
                Shop men
              </Link>
              <Link
                href="/kids"
                className="border border-white/40 px-6 py-3.5 text-[10px] font-medium uppercase tracking-[.28em] text-white transition-colors duration-300 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Shop kids
              </Link>
            </div>
          </div>

          <div className="jh-arch mx-auto w-full max-w-[440px] pr-4 lg:max-w-[460px]">
            <Arch color="#6E1F2A" image="/images/hero1.png" alt="A Jubba House look" />
          </div>
        </div>
      </section>

      {/* ---------------- Story ---------------- */}
      <section className="px-5 py-24 sm:px-10 sm:py-40">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <h2
            className="text-4xl leading-[1.05] sm:text-6xl lg:sticky lg:top-32 lg:self-start"
            style={{ ...serif, fontWeight: 300, letterSpacing: "-.02em" }}
          >
            From the first kurta to the last sherwani.
          </h2>

          <div className="space-y-6 text-lg leading-[1.75] text-black/75" style={serif}>
            <p>
              We work from Grand Bazar on Oyitty Road, in the middle of Calicut&rsquo;s market district, where people
              have always come to buy cloth and clothes for the occasions that count.
            </p>
            <p>
              Families come to us for weddings and festivals, for Friday prayers and for everyday wear. A father
              chooses a jodhpuri; his son is fitted for a small sherwani of the same pattern. Our range is built around
              that idea: one standard of tailoring, in sizes for the whole family.
            </p>
            <p>
              That is why Jubba House carries men&rsquo;s and kids&rsquo; wear side by side, from the plain jubba to the
              full sherwani, and why every piece leaves the shop the way we would want to wear it ourselves.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Principles ---------------- */}
      <section className="border-y border-black/15 px-5 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-[1400px]">
          <h2
            className="max-w-3xl text-3xl leading-tight sm:text-5xl"
            style={{ ...serif, fontWeight: 300, letterSpacing: "-.02em" }}
          >
            What we hold ourselves to.
          </h2>

          <div className="mt-14 grid gap-0 md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <div
                key={p.title}
                className={`py-8 md:px-8 md:py-2 ${i > 0 ? "border-t border-black/15 md:border-l md:border-t-0" : ""} ${
                  i === 0 ? "md:pl-0" : ""
                }`}
              >
                <h3 className="text-3xl italic" style={{ ...serif, color: GOLD_DARK, fontWeight: 400 }}>
                  {p.title}
                </h3>
                <p className="mt-4 max-w-sm text-[15px] leading-7 text-black/70">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Who we dress ---------------- */}
      <section className="overflow-hidden bg-[#EFE7D8] px-5 py-24 sm:px-10 sm:py-36">
        <div className="mx-auto max-w-[1100px]">
          <h2
            className="mx-auto max-w-3xl text-center text-4xl leading-[1.08] sm:text-6xl"
            style={{ ...serif, fontWeight: 300, letterSpacing: "-.02em" }}
          >
            Two collections, one standard.
          </h2>

          <div className="mt-16 grid gap-16 sm:grid-cols-2 sm:gap-14">
            {[
              {
                href: "/men",
                color: "#6E1F2A",
                image: "/images/men/sherwani.jpg",
                title: "Men",
                line: "Nine styles, from everyday kurtas to sherwanis and jodhpuris.",
              },
              {
                href: "/kids",
                color: "#1F3A2E",
                image: "/images/kids/sherwani.jpg",
                title: "Kids",
                line: "Seven styles, with the same tailoring in smaller sizes.",
              },
            ].map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="group block pr-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#141211]"
              >
                <div className="transition-transform duration-700 ease-out group-hover:-translate-y-2">
                  <Arch color={c.color} image={c.image} alt={`${c.title} collection`} />
                </div>
                <div className="mt-10 flex items-end justify-between gap-6">
                  <div>
                    <h3 className="text-5xl" style={{ ...serif, fontWeight: 300, letterSpacing: "-.02em" }}>
                      {c.title}
                    </h3>
                    <p className="mt-2 max-w-[17rem] text-[15px] leading-6 text-black/65">{c.line}</p>
                  </div>
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/30 text-lg transition-all duration-500 group-hover:border-[#C49452] group-hover:bg-[#C49452]"
                    aria-hidden
                  >
                    &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

  
    </main>
  );
}
