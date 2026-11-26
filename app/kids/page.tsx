/** Save as app/kids/page.tsx. Opens with ?category=kurta, ?category=jubba-pajama, etc. */
import { Suspense } from "react";
import type { Metadata } from "next";
import Catalog from "../../components/Catalog";

export const metadata: Metadata = {
  title: "Kids | Jubba House",
  description: "Kurtas, suits, jodhpuris, sherwanis, thobes and more for kids, from Jubba House, Calicut.",
};

type SearchParams = Promise<{ category?: string }>;

/** Reading searchParams is runtime data, so it lives inside <Suspense>. */
async function KidsCatalog({ searchParams }: { searchParams: SearchParams }) {
  const { category } = await searchParams;
  return <Catalog key={category ?? "all"} audience="kids" initialCategory={category} />;
}

export default function KidsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense
      fallback={
        <main className="min-h-[100svh] bg-[#F6F1E9]">
          <div className="h-[420px] bg-[#17291F]" />
        </main>
      }
    >
      <KidsCatalog searchParams={searchParams} />
    </Suspense>
  );
}
