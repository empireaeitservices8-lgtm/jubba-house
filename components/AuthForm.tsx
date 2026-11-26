"use client";

/**
 * Jubba House: login + register.
 * Save as components/AuthForm.tsx. Used by app/login/page.tsx and app/register/page.tsx.
 * Connect your backend inside `submit` (marked TODO).
 */

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const GOLD = "#C49452";
const serif = { fontFamily: "var(--font-display), Georgia, serif" } as const;

type Mode = "login" | "register";
type Values = { name: string; phone: string; email: string; password: string; confirm: string };

const COPY = {
  login: {
    title: "Welcome back",
    blurb: "Sign in to see your saved pieces and past enquiries.",
    cta: "Sign in",
    switchText: "New to Jubba House?",
    switchLabel: "Create an account",
    switchHref: "/register",
  },
  register: {
    title: "Join the house",
    blurb: "Create an account to save pieces and enquire faster.",
    cta: "Create account",
    switchText: "Already have an account?",
    switchLabel: "Sign in",
    switchHref: "/login",
  },
} as const;

function validate(mode: Mode, v: Values) {
  const e: Partial<Record<keyof Values, string>> = {};
  if (mode === "register" && v.name.trim().length < 2) e.name = "Enter your full name.";
  if (mode === "register" && !/^[+\d][\d\s-]{8,14}$/.test(v.phone.trim())) e.phone = "Enter a valid phone number.";
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = "Enter an email like name@example.com.";
  if (v.password.length < 8) e.password = "Use at least 8 characters.";
  if (mode === "register" && v.confirm !== v.password) e.confirm = "Passwords do not match.";
  return e;
}

function Field({
  id, label, type = "text", value, onChange, error, autoComplete, right,
}: {
  id: string; label: string; type?: string; value: string; onChange: (v: string) => void;
  error?: string; autoComplete?: string; right?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm text-black/65">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className="w-full border-b bg-transparent py-3 pr-12 text-[17px] outline-none transition-colors placeholder:text-black/30 focus:border-[#141211]"
          style={{ borderColor: error ? "#9b2c2c" : "rgba(0,0,0,.3)" }}
        />
        {right && <div className="absolute inset-y-0 right-0 flex items-center">{right}</div>}
      </div>
      <p id={`${id}-err`} role="alert" className="mt-1.5 min-h-5 text-sm text-[#9b2c2c]">{error}</p>
    </div>
  );
}

export default function AuthForm({ mode }: { mode: Mode }) {
  const c = COPY[mode];
  const [v, setV] = useState<Values>({ name: "", phone: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState("");

  const set = (k: keyof Values) => (val: string) => {
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(mode, v);
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      // TODO: call your API here, e.g.
      // const res = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
      // if (!res.ok) throw new Error((await res.json()).message);
      await new Promise((r) => setTimeout(r, 700));
      setDone(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const toggle = (
    <button
      type="button"
      onClick={() => setShow((s) => !s)}
      aria-pressed={show}
      className="px-1 text-xs text-black/55 hover:text-[#8a6430] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#141211]"
    >
      {show ? "Hide" : "Show"}
    </button>
  );

  return (
    <main className="grid min-h-[100svh] bg-[#F6F1E9] text-[#141211] lg:grid-cols-[.9fr_1.1fr]">
      {/* brand panel */}
      <section className="relative hidden overflow-hidden bg-[#3A1620] px-12 pb-14 pt-40 text-white lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(55% 45% at 50% 62%, rgba(196,148,82,.3) 0%, transparent 70%)" }} />
        <p className="relative max-w-sm text-4xl leading-[1.1]" style={{ ...serif, fontWeight: 300, letterSpacing: "-.02em" }}>
          Dressed with intention, from the first kurta to the last sherwani.
        </p>
        <div className="relative mx-auto w-[260px]" aria-hidden>
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-t-[999px] border" style={{ borderColor: GOLD, aspectRatio: "3 / 4" }} />
          <div className="relative overflow-hidden rounded-t-[999px] bg-[#6E1F2A]" style={{ aspectRatio: "3 / 4" }}>
            <div className="absolute inset-x-0 bottom-0 h-[92%]" style={{ backgroundImage: "url(/images/men/sherwani.jpg)", backgroundRepeat: "no-repeat", backgroundPosition: "center bottom", backgroundSize: "contain" }} />
          </div>
        </div>
        <p className="relative mt-10 text-sm italic" style={{ ...serif, color: GOLD }}>Art of Perfection</p>
      </section>

      {/* form */}
      <section className="flex items-center justify-center px-5 pb-16 pt-32 sm:px-10 lg:pt-28">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-10" role="status">
                <p className="text-5xl leading-none" style={{ ...serif, fontWeight: 300, letterSpacing: "-.02em" }}>
                  {mode === "login" ? "You are signed in." : "Your account is ready."}
                </p>
                <p className="mt-5 text-black/65">Continue browsing the collection.</p>
                <div className="mt-8 flex gap-3">
                  <Link href="/men" className="px-6 py-3.5 text-[10px] font-medium uppercase tracking-[.28em] text-[#141211]" style={{ background: GOLD }}>Shop men</Link>
                  <Link href="/kids" className="border border-black/30 px-6 py-3.5 text-[10px] font-medium uppercase tracking-[.28em]">Shop kids</Link>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}>
                <h1 className="text-5xl leading-none sm:text-6xl" style={{ ...serif, fontWeight: 300, letterSpacing: "-.03em" }}>{c.title}</h1>
                <p className="mt-4 text-black/65">{c.blurb}</p>

                <div className="mt-10 space-y-2">
                  {mode === "register" && (
                    <>
                      <Field id="name" label="Full name" value={v.name} onChange={set("name")} error={errors.name} autoComplete="name" />
                      <Field id="phone" label="Phone number" type="tel" value={v.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" />
                    </>
                  )}
                  <Field id="email" label="Email" type="email" value={v.email} onChange={set("email")} error={errors.email} autoComplete="email" />
                  <Field id="password" label="Password" type={show ? "text" : "password"} value={v.password} onChange={set("password")} error={errors.password} autoComplete={mode === "login" ? "current-password" : "new-password"} right={toggle} />
                  {mode === "register" && (
                    <Field id="confirm" label="Confirm password" type={show ? "text" : "password"} value={v.confirm} onChange={set("confirm")} error={errors.confirm} autoComplete="new-password" />
                  )}
                </div>

                {mode === "login" && (
                  <div className="-mt-1 mb-2 text-right">
                    <Link href="/forgot-password" className="text-sm text-black/60 underline-offset-4 hover:text-[#8a6430] hover:underline">Forgot password?</Link>
                  </div>
                )}

                <p role="alert" className="min-h-5 text-sm text-[#9b2c2c]">{formError}</p>

                <motion.button
                  type="submit"
                  disabled={busy}
                  whileHover={{ scale: busy ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-3 w-full px-8 py-4 text-[11px] font-medium uppercase tracking-[.28em] text-[#141211] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141211]"
                  style={{ background: GOLD }}
                >
                  {busy ? "Please wait" : c.cta}
                </motion.button>

                <p className="mt-8 text-center text-[15px] text-black/65">
                  {c.switchText}{" "}
                  <Link href={c.switchHref} className="border-b border-[#141211] pb-0.5 text-[#141211] hover:border-[#C49452] hover:text-[#8a6430]">{c.switchLabel}</Link>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
