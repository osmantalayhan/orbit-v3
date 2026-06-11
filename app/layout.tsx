import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, { 
      cache: "no-store",
      next: { revalidate: 0 } // Her request'te taze veri al
    });
    
    if (!res.ok) return defaultMetadata;
    const json = await res.json();
    const settings = json.SiteSettings || json;
    
    // Cache-busting: favicon URL'e timestamp ekle
    const faviconUrl = settings.favicon_url
      ? `${settings.favicon_url}?v=${Date.now()}`
      : "/favicon.ico";
    
    return {
      title: {
        default: settings.site_title || "Orbit Teknoloji",
        template: `%s | ${settings.site_title || "Orbit Teknoloji"}`
      },
      description: settings.site_description || defaultMetadata.description,
      keywords: settings.site_keywords || "",
      icons: {
        icon: faviconUrl,
        shortcut: faviconUrl,
        apple: faviconUrl,
      }
    };
  } catch (err) {
    return defaultMetadata;
  }
}

import SmoothScroll from "@/components/SmoothScroll"; // Lenis pürüzsüz kaydırma entegrasyonu
import ClientLayoutManager from "@/components/ClientLayoutManager";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${plusJakartaSans.variable} font-sans`} // Sitenizin orijinal fontu
    >
      <body className="bg-black">
        <SmoothScroll /> {/* Tamamen görünmez pürüzsüz kaydırma yöneticimiz */}
        <TooltipProvider>
          <ClientLayoutManager>
            {children}
          </ClientLayoutManager>
        </TooltipProvider>
      </body>
    </html>
  );
}
