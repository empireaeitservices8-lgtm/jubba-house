/**
 * Jubba House: catalog data for the Men and Kids pages.
 * Save as lib/catalog.ts (project root, next to app/ and components/).
 *
 * The products below are PLACEHOLDERS generated from your categories so the page works today.
 * Names, prices, sizes and colours are samples. To use real products, replace `buildProducts`
 * with your own array (or fetch from your API / database) in the same `Product` shape.
 */

export type Audience = "men" | "kids";

export type Product = {
  id: string;
  name: string;
  category: string; // slug, matches ?category=
  categoryLabel: string;
  price: number; // rupees
  sizes: string[];
  colors: string[]; // names from COLORS
  image: string;
};

export const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const formatPrice = (n: number) => `\u20B9${n.toLocaleString("en-IN")}`;

export const CATEGORIES: Record<Audience, string[]> = {
  men: ["kurta", "Suit", "Jodhpuri", "Sherwani", "Indo Western", "Thobe", "Kandura", "Jubba", "Pajama"],
  kids: ["kurta", "Suit", "Jodhpuri", "Sherwani", "Thobe", "Kandura", "Jubba Pajama"],
};

export const SIZES: Record<Audience, string[]> = {
  men: ["S", "M", "L", "XL", "XXL", "3XL"],
  kids: ["2-3 Y", "4-5 Y", "6-7 Y", "8-9 Y", "10-11 Y", "12-13 Y"],
};

export const COLORS = [
  { name: "Cream", hex: "#E9DFC8" },
  { name: "White", hex: "#F7F5EF" },
  { name: "Black", hex: "#1B1918" },
  { name: "Maroon", hex: "#6E1F2A" },
  { name: "Green", hex: "#1F3A2E" },
  { name: "Navy", hex: "#1F2A44" },
  { name: "Gold", hex: "#C49452" },
  { name: "Grey", hex: "#9A9A98" },
];

/** Sample starting prices in rupees. Replace with your real prices. */
const BASE: Record<Audience, Record<string, number>> = {
  men: {
    kurta: 1499, Suit: 6999, Jodhpuri: 4999, Sherwani: 11999, "Indo Western": 5499,
    Thobe: 2499, Kandura: 2299, Jubba: 1799, Pajama: 799,
  },
  kids: {
    kurta: 999, Suit: 3999, Jodhpuri: 2999, Sherwani: 5999, Thobe: 1499, Kandura: 1399, "Jubba Pajama": 1199,
  },
};

const STYLES = ["Classic", "Embroidered", "Festive", "Everyday"];

function buildProducts(audience: Audience): Product[] {
  const out: Product[] = [];
  const sizes = SIZES[audience];
  CATEGORIES[audience].forEach((cat, ci) => {
    STYLES.forEach((style, si) => {
      const n = ci * STYLES.length + si;
      const step = audience === "men" ? 300 : 150;
      out.push({
        id: `${audience}-${slug(cat)}-${si}`,
        name: `${style} ${cat.toLowerCase()}`,
        category: slug(cat),
        categoryLabel: cat,
        price: BASE[audience][cat] + si * step,
        sizes: sizes.filter((_, k) => k !== n % sizes.length), // sample: one size missing
        colors: [n % COLORS.length, (n + 3) % COLORS.length, (n + 5) % COLORS.length].map((i) => COLORS[i].name),
        image: `/images/${audience}/${slug(cat)}.jpg`,
      });
    });
  });
  return out;
}

export const PRODUCTS: Record<Audience, Product[]> = {
  men: buildProducts("men"),
  kids: buildProducts("kids"),
};

export const priceBounds = (audience: Audience) => {
  const prices = PRODUCTS[audience].map((p) => p.price);
  return {
    min: Math.floor(Math.min(...prices) / 100) * 100,
    max: Math.ceil(Math.max(...prices) / 500) * 500,
  };
};
