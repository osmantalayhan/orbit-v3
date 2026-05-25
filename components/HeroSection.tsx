"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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
  const [products, setProducts] = useState(PRODUCTS);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/v1/slider")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch slider items");
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((item: any) => ({
            id: item.product_id || String(item.id),
            model: item.model_code,
            title: item.slide_title,
            desc: item.slide_desc,
            image: item.image_url
          }));
          setProducts(mapped);
        }
      })
      .catch((err) => console.error("Error loading slider items:", err));
  }, []);

  useEffect(() => {
    // Otomatik geçiş şimdilik deneme için kapatıldı
    /*
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length);
    }, 10000); // Süre 10 saniyeye uzatılacak
    return () => clearInterval(timer);
    */
  }, [products]);

  // Hata Toleranslı Koruma: Dizi eleman sayısı azaldığında index taşmasını önler
  const currentIndex = index >= products.length ? 0 : index;
  const current = products[currentIndex];


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
          <motion.div
            key={current.image}
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 20, scale: 1.0 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-[75%] h-[75%] relative select-none opacity-90"
            style={{
              rotate: -5,
            }}
          >
            <Image
              src={current.image}
              alt={current.title}
              fill
              priority
              className="object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Foreground Liquid Effect with Transparent Hill */}
      <LiquidShowcase imageSrc="/img/hero-transparent.png" />

      <div className="hero-content-wrapper absolute bottom-[50px] left-1/2 -translate-x-1/2 w-[calc(100%-96px)] max-w-[1304px] z-20 pointer-events-none">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 pointer-events-auto">
          <AnimatePresence mode="wait">
            <div className="max-w-4xl" key="hero-text-content">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="hero-heading"
              >
                <span>{current.title}</span>
                <span>{current.desc}</span>
              </motion.h1>
            </div>

            <motion.div
              key="hero-actions-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="hero-actions"
            >
              <a href="#urunler" className="btn-primary">
                Ürünleri İncele
              </a>
              <a href="#iletisim" className="btn-secondary">
                Bize Ulaşın
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
