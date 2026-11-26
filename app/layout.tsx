import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

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
        <Header />
        {children}
      </body>
    </html>
  );
}
