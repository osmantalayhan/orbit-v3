"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full bg-[#050505] relative overflow-hidden flex flex-col items-center"
      style={{ paddingTop: '150px', paddingBottom: '60px' }}
    >
      {/* 1. Background Large Text (Outlined Doku - Visibility Reduced) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 select-none pointer-events-none whitespace-nowrap">
        <h1
          style={{
            fontSize: '300px',
            fontWeight: '900',
            letterSpacing: '-0.05em',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.06)',
            opacity: 1
          }}
        >
          ORBIT
        </h1>
      </div>

      <div className="max-w-[1304px] w-full px-6 relative z-10" style={{ width: 'calc(100% - 96px)' }}>

        {/* 2. Top Level: Logo & Contact */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-32">
          <div className="max-w-xl">
            <h2
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
              href="mailto:info@orbit.com"
              className="text-white text-2xl md:text-3xl font-bold border-b border-white/10 pb-1 hover:border-white transition-all no-underline tracking-tight"
            >
              info@orbit.com.tr
            </a>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', fontWeight: '500' }}>
              +90 (212) 000 00 00
            </span>
          </div>
        </div>

        {/* 3. Link Grid - Refined Fonts */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-12"
          style={{ marginBottom: '40px' }}
        >
          <div className="flex flex-col gap-6">
            <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', letterSpacing: '-0.02em' }}>
              Sistemler
            </h4>
            <div className="flex flex-col gap-3">
              {["Uçuş Kontrol", "ESC Serisi", "LRS Sistemleri", "GPS Modülleri"].map(item => (
                <a key={item} href="#" className="text-white/40 hover:text-white transition-colors no-underline text-base font-medium">{item}</a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', letterSpacing: '-0.02em' }}>
              Kurumsal
            </h4>
            <div className="flex flex-col gap-3">
              {["Hakkımızda", "Kariyer", "Blog", "Basın Kiti"].map(item => (
                <a key={item} href="#" className="text-white/40 hover:text-white transition-colors no-underline text-base font-medium">{item}</a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', letterSpacing: '-0.02em' }}>
              Destek
            </h4>
            <div className="flex flex-col gap-3">
              {["Dökümantasyon", "Satış Kanalları", "Garanti Koşulları", "SSS"].map(item => (
                <a key={item} href="#" className="text-white/40 hover:text-white transition-colors no-underline text-base font-medium">{item}</a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', letterSpacing: '-0.02em' }}>
              Sosyal
            </h4>
            <div className="flex flex-col gap-3">
              {["LinkedIn", "Instagram", "X / Twitter", "YouTube"].map(item => (
                <a key={item} href="#" className="text-white/40 hover:text-white transition-colors no-underline text-base font-medium">{item}</a>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Final Bottom Bar - Fixed Spacing (40px above, 30px below) */}
        <div
          className="border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8"
          style={{ paddingTop: '30px' }}
        >
          <div className="flex items-center gap-3">
            <img 
              src="/img/logo.png" 
              alt="Orbit Logo" 
              className="h-4 w-auto brightness-0 invert opacity-30"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            />
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', fontWeight: '500' }}>
              © {currentYear} Orbit Teknoloji. All rights reserved.
            </span>
          </div>

          <div className="flex gap-8">
            {["Gizlilik", "Çerezler", "KVKK"].map(item => (
              <a
                key={item}
                href="#"
                className="text-white/20 hover:text-white/40 transition-colors no-underline text-sm font-medium"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
