"use client";
 
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";

const STATIC_PRODUCTS = [
  {
    id: "f435",
    name: "Orbit F435",
    role: "Uçuş Kontrol Sistemi",
    desc: "STM32F405 İşlemci & Dual IMU Teknolojisi",
    image: "/img/ucuskontrol.png",
  },
  {
    id: "e50",
    name: "Orbit E50",
    role: "50A 4-in-1 ESC",
    desc: "BLHeli_32 & 128K PWM Desteği",
    image: "/img/esc.png",
  },
  {
    id: "lrs",
    name: "Orbit LRS",
    role: "2.4GHz ELRS Alıcı",
    desc: "30km+ Menzil & 0.6g Ultra Hafif",
    image: "/img/elrs.png",
  },
  {
    id: "gps",
    name: "Orbit M10",
    role: "GPS Modülü",
    desc: "Ublox M10 & Dual Kompas",
    image: "/img/gps.png",
  },
  {
    id: "vtx",
    name: "Orbit Nebula",
    role: "Video Verici",
    desc: "1.2W Güç & SmartAudio Desteği",
    image: "/img/vtx.png",
  },
  {
    id: "frame",
    name: "Orbit X5",
    role: "Carbon Fiber Frame",
    desc: "T700 Karbon & 5mm Kol Kalınlığı",
    image: "/img/frame.png",
  },
];

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

export default function ProductVitrin() {
  const { data: apiProducts, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const productsList = (apiProducts && apiProducts.length > 0)
    ? apiProducts.map((item: any) => ({
        id: item.id,
        name: item.name,
        role: item.role,
        desc: item.tagline,
        image: item.images && item.images.length > 0 ? item.images[0] : "/img/ucuskontrol.png",
      }))
    : STATIC_PRODUCTS;

  const [emblaRef] = useEmblaCarousel({ 
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false
  });

  return (
    <section 
      className="pb-40 w-full bg-black relative overflow-hidden flex flex-col items-center"
      style={{ paddingTop: '130px' }}
    >
      {/* Header Container */}
      <div 
        className="vitrin-header-wrapper max-w-[1304px] px-6 flex flex-col items-start mb-10"
        style={{ width: 'calc(100% - 96px)' }}
      >
        <header className="w-full relative flex flex-col md:flex-row items-start md:items-end justify-start md:justify-between" style={{ marginBottom: '40px' }}>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white text-4xl md:text-5xl font-bold tracking-tight text-left"
          >
            Orbit ürün ailesini <br /> keşfedin.
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="mt-8 md:mt-0 flex justify-center md:justify-end"
          >
            <Link 
              href="/urunler" 
              className="group/all inline-flex items-center justify-center gap-2 h-10 bg-transparent hover:bg-white/5 border border-white/10 rounded-lg text-white font-semibold transition-all text-sm no-underline whitespace-nowrap"
              style={{ paddingLeft: '30px', paddingRight: '30px' }}
            >
              Tüm Ürünler
              <svg className="w-3.5 h-3.5 transition-transform group-hover/all:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </header>
      </div>
 
      {/* Carousel Area */}
      <div className="vitrin-carousel-wrapper w-full max-w-[1304px] px-6" style={{ width: 'calc(100% - 96px)' }}>
        <div className="w-full overflow-hidden" ref={emblaRef}>
          <div className="flex gap-8">
            {productsList.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 1, 
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="flex-[0_0_100%] md:flex-[0_0_calc((100%-64px)/3)] min-w-0"
              >
                <div 
                  className="bg-[#0d0d0d] border border-white/5 rounded-[48px] overflow-hidden transition-all hover:border-white/10 hover:bg-[#111] h-full"
                >
                  <div 
                    className="flex flex-col h-full w-full"
                    style={{ padding: '40px' }}
                  >
                    {/* Card Header */}
                    <div style={{ marginBottom: '32px' }}>
                      <div className="product-vitrin-logo-box w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-4 relative">
                         <Image 
                           src={product.image} 
                           alt="icon" 
                           fill 
                           className="object-contain filter brightness-125 p-4" 
                         />
                      </div>
                    </div>

                    {/* Title & Info */}
                    <div className="product-vitrin-text-container flex flex-col">
                      <h3 className="text-white text-3xl font-bold tracking-tight" style={{ marginBottom: '20px' }}>
                        {product.name}
                      </h3>
                      <div style={{ marginBottom: '60px' }}>
                        <p className="text-white/90 text-xl font-medium" style={{ marginBottom: '10px' }}>{product.role}</p>
                        <p className="text-white/40 text-base leading-relaxed">{product.desc}</p>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="mt-auto">
                      <Link href={`/urunler/${product.id}`} className="w-full h-16 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/5 flex items-center justify-center gap-3 group/btn text-lg no-underline cursor-pointer">
                        Detayları Görüntüle
                        <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
