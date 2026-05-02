"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import LiquidShowcase from "./LiquidShowcase";

const PRODUCTS = [
  {
    id: "f435",
    model: "F435",
    title: "ORBIT F435",
    desc: "Uçuş Kontrol Kartı",
    image: "/img/ucuskontrol.png",
  },
  {
    id: "e50",
    model: "E50",
    title: "ORBIT E50",
    desc: "ESC Güç Yönetimi",
    image: "/img/esc.png",
  },
  {
    id: "lrs",
    model: "LRS",
    title: "ORBIT LRS",
    desc: "Haberleşme Sistemi",
    image: "/img/elrs.png",
  },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Otomatik geçiş şimdilik deneme için kapatıldı
    /*
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PRODUCTS.length);
    }, 10000); // Süre 10 saniyeye uzatılacak
    return () => clearInterval(timer);
    */
  }, []);

  const current = PRODUCTS[index];

  return (
    <section className="hero">
      {/* Background Technical Text (BEHIND EVERYTHING) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={current.model}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 0.4, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[35vw] font-[500] tracking-tighter uppercase select-none whitespace-nowrap"
            style={{
              color: "transparent",
              WebkitTextStroke: "2px rgba(255, 255, 255, 0.5)",
            }}
          >
            {current.model}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Massive Flight Control Card (BEHIND THE HILL) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={current.image}
            src={current.image}
            alt={current.title}
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 20, scale: 1.0 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[75%] max-h-[75%] object-contain select-none opacity-90"
            style={{
              rotate: -5,
            }}
          />
        </AnimatePresence>
      </div>

      {/* Foreground Liquid Effect with Transparent Hill */}
      <LiquidShowcase imageSrc="/img/hero-transparent.png" />

      <div className="absolute bottom-[50px] left-1/2 -translate-x-1/2 w-[calc(100%-96px)] max-w-[1304px] z-20 pointer-events-none">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.h1
              key={current.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="hero-heading"
            >
              <span>{current.title}</span>
              <span>{current.desc}</span>
            </motion.h1>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hero-actions"
          >
            <a href="#urunler" className="btn-primary">
              Ürünleri İncele
            </a>
            <a href="#iletisim" className="btn-secondary">
              Bize Ulaşın
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
