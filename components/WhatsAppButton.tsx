"use client";

/**
 * Jubba House: floating WhatsApp button (bottom right)
 *
 * Save as components/WhatsAppButton.tsx and render it once in app/layout.tsx:
 *
 *   <Header />
 *   {children}
 *   <Footer />
 *   <WhatsAppButton />
 */

import { motion, useReducedMotion } from "framer-motion";

const NUMBER = "919633721605"; // country code + number, no "+" or spaces
const MESSAGE = "Hello Jubba House, I would like to know more about your collection.";
const HREF = `https://wa.me/${NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const reduce = useReducedMotion();

  return (
    <motion.a
      href={HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Jubba House on WhatsApp"
      initial={reduce ? false : { opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: reduce ? 0 : 2, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={reduce ? undefined : { scale: 1.08 }}
      whileTap={reduce ? undefined : { scale: 0.95 }}
      className="group fixed bottom-5 right-5 z-30 flex items-center gap-3 sm:bottom-8 sm:right-8"
    >
      {/* label, desktop hover only */}
      <span className="pointer-events-none hidden translate-x-2 bg-[#141211] px-4 py-2 text-[10px] font-medium uppercase tracking-[.28em] text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block">
        Chat on WhatsApp
      </span>

      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(0,0,0,.35)] group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-white sm:h-16 sm:w-16">
        {/* soft pulse ring */}
        {!reduce && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-[#25D366]"
            animate={{ scale: [1, 1.6], opacity: [0.45, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", repeatDelay: 1.2 }}
          />
        )}
        <span className="relative">
          <WhatsAppIcon />
        </span>
      </span>
    </motion.a>
  );
}
