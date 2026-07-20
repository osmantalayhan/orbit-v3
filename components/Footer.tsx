"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Settings fetch failed");
  return res.json();
});

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const { data: settings } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const { data: productsData } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const footerCategories = Array.from(new Set((productsData || []).map((p: any) => p.category?.toLowerCase()).filter(Boolean)));

  return (
    <footer
      className="w-full bg-black relative overflow-hidden flex flex-col items-center"
      style={{ paddingTop: '150px', paddingBottom: '60px' }}
    >
      <style>{`
        @media (max-width: 1024px) {
          .footer-container {
            width: calc(100% - 48px) !important;
          }
          .footer-bg-text h1 {
            font-size: 180px !important;
          }
          .footer-top-row {
            margin-bottom: 60px !important;
          }
        }
        @media (max-width: 768px) {
          footer {
            padding-top: 80px !important;
            padding-bottom: 40px !important;
          }
          .footer-container {
            width: calc(100% - 32px) !important;
          }
          .footer-bg-text h1 {
            font-size: 100px !important;
            -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2) !important;
            letter-spacing: 0em !important;
          }
          .footer-title {
            font-size: 32px !important;
          }
          .footer-title br {
            display: none !important;
          }
          .footer-top-row {
            margin-bottom: 40px !important;
            gap: 24px !important;
          }
          .footer-bottom-bar {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
        }
      `}</style>

      {/* 1. Background Large Text (Outlined Doku - 2.2px Solid) */}
      <div className="footer-bg-text absolute top-0 left-1/2 -translate-x-1/2 select-none pointer-events-none whitespace-nowrap">
        <h1
          style={{
            fontSize: '300px',
            fontWeight: '900',
            letterSpacing: '-0.05em',
            color: 'transparent',
            WebkitTextStroke: '2.2px rgba(255,255,255,0.2)',
            opacity: 1
          }}
        >
          ORBIT
        </h1>
      </div>

      <div className="footer-container max-w-[1304px] w-full px-6 relative z-10" style={{ width: 'calc(100% - 96px)' }}>

        {/* 2. Top Level: Logo & Contact */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-32 footer-top-row">
          <div className="max-w-xl">
            <h2
              className="footer-title"
              style={{
                color: 'white',
                fontSize: '48px',
                fontWeight: 'bold',
                lineHeight: '1.0',
                letterSpacing: '-0.04em',
                marginBottom: '32px'
              }}
            >
              havacılığın geleceğini <br />
              yazıyoruz.
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <a
              href={`mailto:${settings?.contact_email || "info@orbitteknoloji.com"}`}
              className="text-white text-2xl md:text-3xl font-bold border-b border-white/10 pb-1 hover:border-white transition-all no-underline tracking-tight"
            >
              {settings?.contact_email || "info@orbitteknoloji.com"}
            </a>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', fontWeight: '500' }}>
              {settings?.contact_phone || "+90 212 000 00 00"}
            </span>
          </div>
        </div>

        {/* 3. Link Grid - Refined Fonts */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-12"
          style={{ marginBottom: '40px' }}
        >
          <div className="flex flex-col gap-6">
            <h4 style={{ color: 'white', fontSize: '17px', fontWeight: 'bold', letterSpacing: '-0.02em' }}>
              Ürünler
            </h4>
            <div className="flex flex-col gap-3">
              <Link 
                href="/urunler?kategori=tümü" 
                className="text-white/40 hover:text-white transition-colors no-underline font-medium capitalize" 
                style={{ fontSize: "15px" }}
              >
                Tümü
              </Link>
              {(footerCategories as string[]).slice(0, 8).map((cat, idx) => (
                <Link 
                  key={idx} 
                  href={`/urunler?kategori=${encodeURIComponent(cat)}`} 
                  className="text-white/40 hover:text-white transition-colors no-underline font-medium capitalize" 
                  style={{ fontSize: "15px" }}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 style={{ color: 'white', fontSize: '17px', fontWeight: 'bold', letterSpacing: '-0.02em' }}>
              Kurumsal
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { name: "Kariyer", href: "/kariyer" },
                { name: "Blog", href: "/blog" },
                { name: "İletişim", href: "/iletisim" }
              ].map(item => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className="text-white/40 hover:text-white transition-colors no-underline font-medium"
                  style={{ fontSize: "15px" }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 style={{ color: 'white', fontSize: '17px', fontWeight: 'bold', letterSpacing: '-0.02em' }}>
              Destek
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { name: "Bize Ulaşın", href: "/iletisim" },
                { name: settings?.contact_email || "info@orbitteknoloji.com", href: `mailto:${settings?.contact_email || "info@orbitteknoloji.com"}` },
                { name: settings?.contact_phone || "+90 212 000 00 00", href: `tel:${(settings?.contact_phone || "+90 212 000 00 00").replace(/\\s+/g, '')}` }
              ].map(item => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  className="text-white/40 hover:text-white transition-colors no-underline font-medium" 
                  style={{ fontSize: "15px" }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 style={{ color: 'white', fontSize: '17px', fontWeight: 'bold', letterSpacing: '-0.02em' }}>
              Sosyal
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { name: "LinkedIn", url: settings?.social_linkedin || "https://linkedin.com/company/orbitteknoloji" },
                { name: "X / Twitter", url: settings?.social_x || "https://x.com/orbitteknoloji" },
                { name: "YouTube", url: settings?.social_youtube || "https://youtube.com/c/orbitteknoloji" },
                { name: "GitHub", url: settings?.social_github || "https://github.com/orbitteknoloji" },
                ...(settings?.social_links_json && settings?.social_links_json !== "[]" 
                  ? (() => {
                      try {
                        return JSON.parse(settings.social_links_json);
                      } catch (e) {
                        return [];
                      }
                    })()
                  : [])
              ].filter(item => item.url && item.url.trim() !== "").map((item: any) => (
                <a 
                  key={item.name} 
                  href={item.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors no-underline font-medium flex items-center group/social"
                  style={{ fontSize: "15px" }}
                >
                  {item.name}
                  <svg 
                    className="opacity-40 group-hover/social:opacity-100 transition-opacity" 
                    style={{ width: '13px', height: '13px', marginLeft: '4px' }} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2.8}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Final Bottom Bar - Fixed Spacing (40px above, 30px below) */}
        <div
          className="border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 footer-bottom-bar"
          style={{ paddingTop: '30px' }}
        >
          <div className="flex items-center gap-3">
            <img 
              src={settings?.logo_url || "/img/logo.png"} 
              alt="Orbit Logo" 
              className="h-4 w-auto brightness-0 invert opacity-30"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            />
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', fontWeight: '500' }}>
              © {currentYear} Orbit Teknoloji. All rights reserved.
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
}
