"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import LiquidShowcase from "./LiquidShowcase";

const PRODUCTS_FALLBACK = [
  {
    id: "default",
    model: "ORBIT",
    title: "Yükleniyor...",
    desc: "Veriler sunucudan alınıyor, lütfen bekleyin.",
    image: "/img/flight-control.png",
  }
];

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  const { data: sliderData, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/slider`, fetcher, {
    revalidateOnFocus: false, // Sayfa odağı değiştiğinde arka planda sürekli istek atmasını engeller
    dedupingInterval: 60000, // Aynı veriyi 1 dk içinde tekrar çekmez
  });

  const products = (sliderData && sliderData.length > 0) 
    ? sliderData.map((item: any) => ({
        id: item.product_id || String(item.id),
        model: item.model_code,
        title: item.slide_title,
        desc: item.slide_desc,
        image: item.image_url,
        productId: item.product_id
      }))
    : [];

  useEffect(() => {
    const timer = setInterval(() => {
      if(products.length > 0) {
        setIndex((prev) => (prev + 1) % products.length);
      }
    }, 5000); // Otomatik geçiş süresini 5 saniye yaptım
    return () => clearInterval(timer);
  }, [products]);

  // Veriler yükleniyorsa hiçbir şey gösterme, yüklendiyse ve boşsa fallback göster
  const isLoading = sliderData === undefined && !error;
  const displayProducts = products.length > 0 ? products : (isLoading ? [] : PRODUCTS_FALLBACK);
  const currentIndex = index >= displayProducts.length ? 0 : index;
  const current = displayProducts.length > 0 ? displayProducts[currentIndex] : null;

  return (
    <section className="hero">
      {/* Background Technical Text (BEHIND EVERYTHING) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {current && (
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
          )}
        </AnimatePresence>
      </div>

      {/* Massive Flight Control Card (BEHIND THE HILL) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          {current && (
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
          )}
        </AnimatePresence>
      </div>

      {/* Foreground Liquid Effect with Transparent Hill */}
      <LiquidShowcase imageSrc="/img/hero-transparent.png" />

      <div className="hero-content-wrapper absolute bottom-[50px] left-1/2 -translate-x-1/2 w-[calc(100%-96px)] max-w-[1304px] z-20 pointer-events-none">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 pointer-events-auto">
          <AnimatePresence mode="wait">
            {current && (
              <div className="max-w-4xl" key={`text-${current.id || current.title}`}>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="hero-heading"
                >
                  <span>{current.title}</span>
                  <span>{current.desc}</span>
                </motion.h1>
              </div>
            )}
            
            {current && (
              <motion.div
                key={`action-${current.id || current.title}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                className="hero-actions"
              >
                <Link href={current.productId ? `/urunler/${current.productId}` : "#urunler"} className="btn-primary">
                  {current.productId ? "Ürünü İncele" : "Ürünleri İncele"}
                </Link>
                <Link href="/iletisim" className="btn-secondary">
                  Bize Ulaşın
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
