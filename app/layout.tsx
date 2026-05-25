import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const defaultMetadata: Metadata = {
  title: {
    default: "Orbit Teknoloji — Yerli İHA Elektroniği",
    template: "%s | Orbit Teknoloji"
  },
  description: "Yerli Ar-Ge'den doğan İHA elektroniği.",
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch("http://127.0.0.1:8080/api/v1/settings", { 
      next: { revalidate: 60 } // SEO verilerini 60 saniyede bir yeniler (Performans için)
    });
    
    if (!res.ok) return defaultMetadata;
    const settings = await res.json();
    
    return {
      title: {
        default: settings.site_title || "Orbit Teknoloji",
        template: `%s | ${settings.site_title || "Orbit Teknoloji"}`
      },
      description: settings.site_description || defaultMetadata.description,
      keywords: settings.site_keywords || "",
      icons: {
        icon: settings.favicon_url || "/favicon.ico",
        shortcut: settings.favicon_url || "/favicon.ico",
        apple: settings.favicon_url || "/favicon.ico",
      }
    };
  } catch (err) {
    return defaultMetadata;
  }
}

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
