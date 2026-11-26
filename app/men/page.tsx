/** Save as app/men/page.tsx. Opens with ?category=kurta, ?category=indo-western, etc. */
import { Suspense } from "react";
import type { Metadata } from "next";
import Catalog from "../../components/Catalog";

export const metadata: Metadata = {
  title: "Men | Jubba House",
  description: "Kurtas, suits, jodhpuris, sherwanis, thobes and more for men, from Jubba House, Calicut.",
};

type SearchParams = Promise<{ category?: string }>;

/** Reading searchParams is runtime data, so it lives inside <Suspense>. */
async function MenCatalog({ searchParams }: { searchParams: SearchParams }) {
  const { category } = await searchParams;
  return <Catalog key={category ?? "all"} audience="men" initialCategory={category} />;
}

export default function MenPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense
      fallback={
        <main className="min-h-[100svh] bg-[#F6F1E9]">
          <div className="h-[420px] bg-[#3A1620]" />
        </main>
      }
    >
      <MenCatalog searchParams={searchParams} />
    </Suspense>
  );
}
