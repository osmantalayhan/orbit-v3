import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ürünler",
  description: "STM32 tabanlı uçuş kontrolcülerinden, yüksek amperli ESC sistemlerine ve hassas GPS modüllerine kadar, yerli Ar-Ge ile geliştirilen tüm İHA elektroniği ürünlerimiz.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
