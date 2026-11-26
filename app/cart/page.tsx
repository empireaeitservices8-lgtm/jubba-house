import type { Metadata } from "next";
import CartView from "../../components/CartView";

export const metadata: Metadata = { title: "Cart | Jubba House" };

export default function CartPage() {
  return <CartView />;
}
