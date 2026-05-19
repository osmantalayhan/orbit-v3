import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Orbit Teknoloji — Yerli İHA Elektroniği",
    template: "%s | Orbit Teknoloji"
  },
  description: "Yerli Ar-Ge'den doğan İHA elektroniği. ESC'den GPS'e, tamamen Türk mühendisliğinin ürünü.",
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll"; // Lenis pürüzsüz kaydırma entegrasyonu

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${plusJakartaSans.variable}`}
    >
      <body className="bg-black">
        <SmoothScroll /> {/* Tamamen görünmez pürüzsüz kaydırma yöneticimiz */}
        <Navbar />
        {children}
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
