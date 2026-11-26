/** Save as app/men/[id]/page.tsx */
import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductView from "../../../components/ProductView";
import { PRODUCTS, cap } from "../../../lib/catalog";

const menIENCE = "men" as const;
type Params = Promise<{ id: string }>;

/** Products are static data, so every product page can be built ahead of time. */
export function generateStaticParams() {
  return PRODUCTS[menIENCE].map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const p = PRODUCTS[menIENCE].find((x) => x.id === id);
  return { title: p ? `${cap(p.name)} | Jubba House` : "Not found | Jubba House" };
}

/** Reading params is runtime data, so it lives inside <Suspense>. */
async function Product({ params }: { params: Params }) {
  const { id } = await params;
  const product = PRODUCTS[menIENCE].find((x) => x.id === id);
  if (!product) notFound();
  return <ProductView key={product.id} product={product} audience={menIENCE} />;
}

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<main className="min-h-[100svh] bg-[#F6F1E9]" />}>
      <Product params={params} />
    </Suspense>
  );
}
