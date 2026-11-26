/**
 * Jubba House: Contact page (v2, "the visiting card")
 *
 * Save as app/contact/page.tsx, with ContactForm.tsx (the dark v2 one) in the same folder.
 * Server component, so `metadata` works. No extra packages needed.
 */

import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | Jubba House",
  description:
    "Visit Jubba House at Grand Bazar, Oyitty Road, Calicut, or call, WhatsApp or email us about kurtas, sherwanis, thobes and more.",
};

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
  embed:
    "https://www.google.com/maps?q=Jubba+House+Grand+Bazar+Oyitty+Road+SM+Street+Cross+Road+Calicut+673001&output=embed",
};

const css = `
@keyframes jh-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@keyframes jh-drop { from { opacity: 0; transform: translateY(-80px) rotate(-9deg); } to { opacity: 1; transform: rotate(-3deg); } }
.jh-rise { opacity: 0; animation: jh-rise 1.1s cubic-bezier(.2,.7,.2,1) forwards; }
.jh-card { opacity: 0; transform: rotate(-3deg); animation: jh-drop 1.3s cubic-bezier(.2,.8,.2,1) .35s forwards; transition: transform .7s cubic-bezier(.2,.7,.2,1); }
.jh-card:hover { transform: rotate(0deg) scale(1.02); }
@media (prefers-reduced-motion: reduce) {
  .jh-rise, .jh-card { animation: none; opacity: 1; }
  .jh-rise { transform: none; }
  .jh-card, .jh-card:hover { transform: rotate(-3deg); }
}
`;

/* ---------- icons ---------- */
const ico = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};
const PhoneIcon = ({ className = "" }: { className?: string }) => (
  <svg {...ico} className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const PinIcon = ({ className = "" }: { className?: string }) => (
  <svg {...ico} className={className}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const MailIcon = ({ className = "" }: { className?: string }) => (
  <svg {...ico} className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);
const InstagramIcon = ({ className = "" }: { className?: string }) => (
  <svg {...ico} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const FacebookIcon = ({ className = "" }: { className?: string }) => (
  <svg {...ico} className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ---------- the visiting card (a typographic copy of the printed one) ---------- */
function VisitingCard() {
  const ink = "#2a2320";
  const brown = "#B9803F";
  return (
    <div className="relative mx-auto w-full max-w-[600px]">
      {/* gold outline card tucked behind */}
      <div
        aria-hidden
        className="absolute inset-0 translate-x-3 translate-y-3 rotate-[4deg] rounded-[4.5%/7.5%] border"
        style={{ borderColor: GOLD }}
      />
      <div
        className="jh-card relative aspect-[1.7/1] w-full rounded-[4.5%/7.5%] shadow-[0_40px_80px_rgba(0,0,0,.45)]"
        style={{ background: "#F2ECCF", containerType: "inline-size" }}
      >
        <div className="absolute inset-0 flex items-center" style={{ padding: "0 5cqw" }}>
          {/* wordmark */}
          <div style={{ width: "38%" }}>
            <p
              style={{ ...serif, fontSize: "10.5cqw", lineHeight: 0.9, color: brown, fontWeight: 500, letterSpacing: ".02em" }}
            >
              JUBBA
            </p>
            <p
              style={{ ...serif, fontSize: "6.4cqw", lineHeight: 1, color: brown, fontWeight: 500, letterSpacing: ".04em", marginTop: "1.2cqw" }}
            >
              HOUSE
            </p>
            <p style={{ ...serif, fontSize: "2.2cqw", fontStyle: "italic", color: ink, marginTop: "2cqw", opacity: 0.75 }}>
              Art of Perfection
            </p>
          </div>

          {/* divider */}
          <div aria-hidden style={{ width: "0.35cqw", height: "56%", background: ink, margin: "0 4cqw", opacity: 0.85 }} />

          {/* details */}
          <div className="flex-1" style={{ color: ink, fontSize: "3.1cqw", lineHeight: 1.35 }}>
            <div className="flex items-start" style={{ gap: "2.2cqw" }}>
              <PinIcon className="shrink-0" />
              <address className="not-italic">
                {CONTACT.address.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </address>
            </div>
            <div className="flex items-start" style={{ gap: "2.2cqw", marginTop: "3cqw" }}>
              <PhoneIcon className="shrink-0" />
              <p>
                {CONTACT.phones[0].display}
                <br />
                {CONTACT.phones[1].display}
              </p>
            </div>
          </div>
        </div>
        <style>{`.jh-card svg{width:4.2cqw;height:4.2cqw;margin-top:.4cqw}`}</style>
      </div>
    </div>
  );
}

/* ---------- quick-action tile ---------- */
const tileCls =
  "group flex flex-col gap-6 border-t border-white/15 px-5 py-8 transition-colors duration-500 hover:bg-white/[.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white sm:px-8 sm:py-10 lg:border-l lg:border-t-0 lg:first:border-l-0";
const circleCls =
  "flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white/85 transition-all duration-500 group-hover:border-[#C49452] group-hover:bg-[#C49452] group-hover:text-[#141211]";

export default function ContactPage() {
  return (
    <main className="bg-[#141211] text-white">
      <style>{css}</style>

      {/* ---------------- Hero: the card ---------------- */}
      <section className="relative overflow-hidden bg-[#3A1620] px-5 pb-24 pt-36 sm:px-10 sm:pb-32 sm:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(50% 60% at 75% 55%, rgba(196,148,82,.28) 0%, transparent 70%)" }}
        />
        <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div>
            <p className="jh-rise text-sm italic" style={{ ...serif, color: GOLD, animationDelay: ".1s" }}>
              Contact Jubba House
            </p>
            <h1
              className="jh-rise mt-6 leading-[.98]"
              style={{
                ...serif,
                fontWeight: 300,
                fontSize: "clamp(3.4rem, 8.5vw, 8.5rem)",
                letterSpacing: "-.03em",
                animationDelay: ".25s",
              }}
            >
              Visit, call or write to us.
            </h1>
            <p
              className="jh-rise mt-8 max-w-md text-lg leading-relaxed text-white/75 sm:text-xl"
              style={{ ...serif, animationDelay: ".5s" }}
            >
              Ask about a style, a size or an occasion. Our door in Grand Bazar, Calicut, is always the easiest way in.
            </p>
          </div>

          <div className="pr-3 pb-3 sm:pr-0 sm:pb-0">
            <VisitingCard />
          </div>
        </div>
      </section>

      {/* ---------------- Quick actions ---------------- */}
      <section className="border-b border-white/15">
        <div className="mx-auto grid max-w-[1400px] lg:grid-cols-4">
          <a href={`tel:${CONTACT.phones[0].tel}`} className={tileCls}>
            <span className={circleCls}>
              <PhoneIcon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-lg italic" style={{ ...serif, color: GOLD }}>
                Call
              </span>
              <span className="mt-1 block text-2xl" style={{ ...serif, fontWeight: 300 }}>
                {CONTACT.phones[0].display}
              </span>
            </span>
          </a>

          <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className={tileCls}>
            <span className={circleCls}>
              <WhatsAppIcon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-lg italic" style={{ ...serif, color: GOLD }}>
                WhatsApp
              </span>
              <span className="mt-1 block text-2xl" style={{ ...serif, fontWeight: 300 }}>
                Message us
              </span>
            </span>
          </a>

          <a href={`mailto:${CONTACT.email}`} className={tileCls}>
            <span className={circleCls}>
              <MailIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-lg italic" style={{ ...serif, color: GOLD }}>
                Email
              </span>
              <span className="mt-1 block break-all text-xl sm:text-2xl" style={{ ...serif, fontWeight: 300 }}>
                {CONTACT.email}
              </span>
            </span>
          </a>

          <div className={`${tileCls} hover:bg-transparent`}>
            <span className="flex gap-3">
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Jubba House on Instagram"
                className={`${circleCls} hover:border-[#C49452] hover:bg-[#C49452] hover:text-[#141211]`}
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={CONTACT.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Jubba House on Facebook"
                className={`${circleCls} hover:border-[#C49452] hover:bg-[#C49452] hover:text-[#141211]`}
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            </span>
            <span>
              <span className="block text-lg italic" style={{ ...serif, color: GOLD }}>
                Follow
              </span>
              <span className="mt-1 block text-2xl" style={{ ...serif, fontWeight: 300 }}>
                @jubba_house
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* ---------------- Form + full-bleed map ---------------- */}
      <section className="grid lg:grid-cols-2">
        <div className="bg-[#1F3A2E] px-5 py-20 sm:px-10 sm:py-28 lg:px-16 xl:px-24">
          <h2
            className="max-w-lg text-4xl leading-[1.05] sm:text-6xl"
            style={{ ...serif, fontWeight: 300, letterSpacing: "-.02em" }}
          >
            Tell us what you are looking for.
          </h2>
          <div className="mt-12 max-w-xl">
            <ContactForm />
          </div>
        </div>

        <div className="relative min-h-[520px] bg-[#e4dccb]">
          <iframe
            title="Jubba House on Google Maps"
            src={CONTACT.embed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
            style={{ filter: "grayscale(.85) sepia(.25) contrast(.95)" }}
          />

          <div className="absolute inset-x-5 bottom-5 bg-[#F6F1E9] p-6 text-[#141211] shadow-[0_20px_50px_rgba(0,0,0,.3)] sm:inset-x-auto sm:bottom-8 sm:left-8 sm:max-w-xs">
            <p className="text-lg italic" style={{ ...serif, color: "#8a6430" }}>
              Find the shop
            </p>
            <address className="mt-2 not-italic">
              {CONTACT.address.map((l) => (
                <p key={l} className="text-[15px] leading-6 text-black/75">
                  {l}
                </p>
              ))}
            </address>
            <a
              href={CONTACT.map}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block px-5 py-3 text-[10px] font-medium uppercase tracking-[.28em] text-[#141211] transition-transform duration-300 hover:scale-[1.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141211]"
              style={{ background: GOLD }}
            >
              Get directions
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
