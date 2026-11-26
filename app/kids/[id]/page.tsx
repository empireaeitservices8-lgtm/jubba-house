/** Save as app/kids/[id]/page.tsx */
import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductView from "../../../components/ProductView";
import { PRODUCTS, cap } from "../../../lib/catalog";

const kidsIENCE = "kids" as const;
type Params = Promise<{ id: string }>;

/** Products are static data, so every product page can be built ahead of time. */
export function generateStaticParams() {
  return PRODUCTS[kidsIENCE].map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const p = PRODUCTS[kidsIENCE].find((x) => x.id === id);
  return { title: p ? `${cap(p.name)} | Jubba House` : "Not found | Jubba House" };
}

/** Reading params is runtime data, so it lives inside <Suspense>. */
async function Product({ params }: { params: Params }) {
  const { id } = await params;
  const product = PRODUCTS[kidsIENCE].find((x) => x.id === id);
  if (!product) notFound();
  return <ProductView key={product.id} product={product} audience={kidsIENCE} />;
}

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<main className="min-h-[100svh] bg-[#F6F1E9]" />}>
      <Product params={params} />
    </Suspense>
  );
}
