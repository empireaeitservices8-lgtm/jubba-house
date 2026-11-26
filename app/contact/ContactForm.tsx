"use client";

/**
 * Jubba House: contact form (dark version, v2)
 * Save as app/contact/ContactForm.tsx.
 *
 * Fields: name, phone, topic, message.
 *
 * RIGHT NOW the message goes out by email using a mailto: link. When the visitor presses
 * the button, their email app opens with everything already written, addressed to the shop.
 * A "Gmail" link is shown as a backup for people without a mail app set up.
 *
 * LATER, to switch to EmailJS, change only the body of `sendMessage` below
 * (see the EmailJS block in the comments). The rest of the form stays as it is.
 */

import { useState } from "react";

const GOLD = "#C49452";
const serif = { fontFamily: "var(--font-display), Georgia, serif" } as const;

const SHOP_EMAIL = "jjubbahouse@gmail.com";
const TOPICS = ["Men", "Kids", "Something else"];

type FormData = { name: string; phone: string; topic: string; message: string };

const buildSubject = (d: FormData) => `Enquiry from ${d.name.trim()} (${d.topic})`;
const buildBody = (d: FormData) =>
  `Name: ${d.name.trim()}\n` +
  `Phone: ${d.phone.trim()}\n` +
  `Looking for: ${d.topic}\n\n` +
  `${d.message.trim()}`;

const mailtoHref = (d: FormData) =>
  `mailto:${SHOP_EMAIL}?subject=${encodeURIComponent(buildSubject(d))}&body=${encodeURIComponent(buildBody(d))}`;

const gmailHref = (d: FormData) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SHOP_EMAIL)}` +
  `&su=${encodeURIComponent(buildSubject(d))}&body=${encodeURIComponent(buildBody(d))}`;

/**
 * Sends the enquiry. Today: opens the visitor's email app (mailto).
 *
 * ---------------- EmailJS (for later) ----------------
 * 1. npm i @emailjs/browser
 * 2. In EmailJS, create a service and a template that uses these variables:
 *      {{name}}  {{phone}}  {{topic}}  {{message}}
 * 3. Add to .env.local:
 *      NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
 *      NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
 *      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
 * 4. import emailjs from "@emailjs/browser"; then replace the body below with:
 *
 *      await emailjs.send(
 *        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
 *        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
 *        { name: d.name, phone: d.phone, topic: d.topic, message: d.message },
 *        { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY! }
 *      );
 *
 *    Then set the status to "sent" on success and "error" in a catch block
 *    (the UI below already has both messages ready).
 * -----------------------------------------------------
 */
async function sendMessage(d: FormData) {
  window.location.href = mailtoHref(d);
}

const labelCls = "block text-lg italic";
const fieldCls =
  "mt-1 w-full border-0 border-b border-white/30 bg-transparent py-3 text-lg text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#C49452] focus-visible:border-[#C49452]";

export default function ContactForm() {
  const [data, setData] = useState<FormData>({ name: "", phone: "", topic: TOPICS[0], message: "" });
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => setData((d) => ({ ...d, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendMessage(data);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <div className="grid gap-10 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={labelCls} style={{ ...serif, color: GOLD }}>
            Your name
          </label>
          <input
            id="cf-name"
            required
            autoComplete="name"
            value={data.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Full name"
            className={fieldCls}
          />
        </div>

        <div>
          <label htmlFor="cf-phone" className={labelCls} style={{ ...serif, color: GOLD }}>
            Phone number
          </label>
          <input
            id="cf-phone"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            pattern="[0-9+\s\-]{8,16}"
            title="Enter a valid phone number, for example 98954 47254"
            value={data.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="98954 47254"
            className={fieldCls}
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelCls} style={{ ...serif, color: GOLD }}>
          I am looking for
        </legend>
        <div className="mt-4 flex flex-wrap gap-3">
          {TOPICS.map((t) => (
            <label key={t} className="cursor-pointer">
              <input
                type="radio"
                name="topic"
                value={t}
                checked={data.topic === t}
                onChange={() => set("topic", t)}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full border border-white/30 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[.24em] text-white/80 transition-colors duration-300 hover:border-white/70 peer-checked:border-[#C49452] peer-checked:bg-[#C49452] peer-checked:text-[#141211] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-white">
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="cf-message" className={labelCls} style={{ ...serif, color: GOLD }}>
          Your message
        </label>
        <textarea
          id="cf-message"
          required
          rows={4}
          value={data.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Tell us the occasion, size or style you have in mind"
          className={`${fieldCls} resize-none`}
        />
      </div>

      <div>
        <button
          type="submit"
          className="px-8 py-4 text-[10px] font-medium uppercase tracking-[.28em] text-[#141211] transition-transform duration-300 hover:scale-[1.04] active:scale-[.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          style={{ background: GOLD }}
        >
          Send message
        </button>

        <p className="mt-5 text-sm leading-6 text-white/60" role="status" aria-live="polite">
          {status === "idle" && "Your email app will open with the message ready to send. We will call you back on the number above."}
          {status === "sent" && (
            <>
              Your email app should have opened. Press send there to finish. No mail app?{" "}
              <a
                href={gmailHref(data)}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-white"
              >
                Open in Gmail
              </a>{" "}
              or write to{" "}
              <a href={`mailto:${SHOP_EMAIL}`} className="underline underline-offset-4 hover:text-white">
                {SHOP_EMAIL}
              </a>
              .
            </>
          )}
          {status === "error" && (
            <>
              Something went wrong. Please call us or write to{" "}
              <a href={`mailto:${SHOP_EMAIL}`} className="underline underline-offset-4 hover:text-white">
                {SHOP_EMAIL}
              </a>
              .
            </>
          )}
        </p>
      </div>
    </form>
  );
}
