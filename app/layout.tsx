import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import CartProvider from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Jubba House",
  description: "Men and kids wear",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-[#F6F1E9] font-[family-name:var(--font-sans)] text-[#141211]"
      >
        <CartProvider>
          {/* Header reads the URL (usePathname), so it must sit inside Suspense */}
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          {children}
          <Footer />
          <Suspense fallback={null}>
            <WhatsAppButton />
          </Suspense>
        </CartProvider>
      </body>
    </html>
  );
}
