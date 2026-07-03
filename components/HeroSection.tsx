"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import LiquidShowcase from "./LiquidShowcase";



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

  const products = useMemo(() => {
    return (sliderData && sliderData.length > 0) 
      ? sliderData.map((item: any) => ({
          id: item.product_id || String(item.id),
          model: item.model_code,
          title: item.slide_title,
          desc: item.slide_desc,
          image: item.image_url,
          productId: item.product_id
        }))
      : [];
  }, [sliderData]);

  const handleNext = () => {
    if (products.length > 0) setIndex((prev) => (prev + 1) % products.length);
  };

  const handlePrev = () => {
    if (products.length > 0) setIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if(products.length > 0) {
        setIndex((prev) => (prev + 1) % products.length);
      }
    }, 5000); // Otomatik geçiş süresini 5 saniye yaptım
    return () => clearInterval(timer);
  }, [products, index]);

  // Veriler yükleniyorsa hiçbir şey gösterme
  const isLoading = sliderData === undefined && !error;
  const displayProducts = products.length > 0 ? products : [];
  const currentIndex = index >= displayProducts.length ? 0 : index;
  const current = displayProducts.length > 0 ? displayProducts[currentIndex] : null;

  return (
    <section className="hero group/slider relative">
      <style>{`
        @media (max-width: 768px) {
          .hero-bg-text { font-size: 60vw !important; }
          .hero-img-container { 
            width: 130vw !important; 
            height: 130vh !important;
            min-width: 130vw !important;
            min-height: 130vh !important;
            flex-shrink: 0 !important;
            top: 0% !important;
            margin-top: 0 !important;
          }
        }
      `}</style>
      
      {/* Sol Ok (Birden fazla slayt varsa ve üzerine gelince çıkar) */}
      {products.length > 1 && (
        <button 
          onClick={handlePrev}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-[60] p-2 text-white/40 opacity-0 group-hover/slider:opacity-100 hover:text-white transition-all duration-500 hover:-translate-x-1 cursor-pointer pointer-events-auto"
          aria-label="Önceki Slayt"
        >
          <ChevronLeft size={40} strokeWidth={1} />
        </button>
      )}

      {/* Sağ Ok (Birden fazla slayt varsa ve üzerine gelince çıkar) */}
      {products.length > 1 && (
        <button 
          onClick={handleNext}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-[60] p-2 text-white/40 opacity-0 group-hover/slider:opacity-100 hover:text-white transition-all duration-500 hover:translate-x-1 cursor-pointer pointer-events-auto"
          aria-label="Sonraki Slayt"
        >
          <ChevronRight size={40} strokeWidth={1} />
        </button>
      )}

      {/* Background Technical Text (BEHIND EVERYTHING) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {current && (
            <motion.span
              key={`bg-${index}`}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 0.4, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="hero-bg-text text-[35vw] font-[500] tracking-tighter uppercase select-none whitespace-nowrap"
              style={{
                color: "transparent",
                WebkitTextStroke: "2px rgba(255, 255, 255, 0.5)",
                textIndent: "-0.05em",
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
              key={`img-${index}`}
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={{ opacity: 1, y: 20, scale: 1.0 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="hero-img-container w-[75%] h-[75%] relative select-none opacity-90"
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
        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                className="max-w-4xl pointer-events-auto"
                key={`text-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              >
                <h1 className="hero-heading">
                  <span>{current.title}</span>
                  <span>{current.desc}</span>
                </h1>
              </motion.div>
            )}
            
            {current && (
              <motion.div
                key={`action-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                className="hero-actions pointer-events-auto"
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
