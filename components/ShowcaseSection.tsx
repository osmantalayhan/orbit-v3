"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const products = [
  {
    id: 1,
    title: "Orbit F405-HD Pro",
    description: "Yüksek performanslı işlemci ve ultra kararlı uçuş algoritmaları ile donatılmış yeni nesil kontrol kartı.",
    image: "/img/flight-control.png",
  },
  {
    id: 2,
    title: "50A 4-in-1 ESC",
    description: "Endüstriyel sınıf bileşenler ve BLHeli_32 yazılımı ile maksimum verimlilik ve güç.",
    image: "/img/flight-control2.png",
  },
  {
    id: 3,
    title: "ELRS Nano Receiver",
    description: "Düşük gecikme süresi ve 30km+ menzil kapasitesi ile kesintisiz bağlantı.",
    image: "/img/elrs.png",
  },
  {
    id: 4,
    title: "M10-Q Precision GPS",
    description: "Çift uydu sistemi ve yüksek hassasiyetli pusula ile milimetrik konumlandırma.",
    image: "/img/ucuskontrol.png",
  },
  {
    id: 5,
    title: "Link Pro 900",
    description: "Uzak mesafe telemetri ve kontrol için optimize edilmiş profesyonel haberleşme seti.",
    image: "/img/pluto.png",
  },
];

function SliderItem({ item, index, scrollYProgress }: { item: any, index: number, scrollYProgress: any }) {
  const total = products.length;
  const step = 1 / total;
  
  const rangeStart = index * step;
  const rangeEnd = (index + 1) * step;
  const margin = step * 0.5;

  // Normalize progress to 0-1 for this specific item's window
  const itemProgress = useTransform(
    scrollYProgress, 
    [Math.max(0, rangeStart - margin), Math.min(1, rangeEnd + margin)], 
    [0, 1]
  );

  // Use the normalized 0-1 progress for all sub-animations
  const rotateX = useTransform(itemProgress, [0.3, 0.7], [15, -15]);
  const scale = useTransform(itemProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.85]);
  const opacity = useTransform(itemProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });

  return (
    <motion.div 
      className="slider-item"
      style={{ 
        rotateX: springRotateX,
        scale: springScale,
        opacity: springOpacity
      }}
    >
      <img src={item.image} alt={item.title} />
    </motion.div>
  );
}

export default function ShowcaseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} style={{ height: "300vh", position: "relative" }}>
      <section className="showcase-section" style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div className="showcase-left">
          <motion.div 
            className="slider-track"
            style={{
              y: useTransform(scrollYProgress, [0, 1], ["20%", "-60%"])
            }}
          >
            {products.map((item, index) => (
              <SliderItem 
                key={item.id} 
                item={item} 
                index={index} 
                scrollYProgress={scrollYProgress} 
              />
            ))}
          </motion.div>
          
          {/* Indicators like in the screenshot */}
          <div className="absolute left-10 bottom-10 flex items-center gap-4 text-xs font-medium tracking-widest text-accents-5 uppercase">
            <span>Slide</span>
            <div className="w-10 h-[1px] bg-accents-3" />
          </div>
          
          <div className="absolute right-10 bottom-10 text-xs font-medium tracking-widest text-accents-5">
            01 / 05
          </div>
        </div>

        <div className="showcase-right">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-blue-500 font-medium tracking-wider uppercase text-sm mb-4 block">
              Teknoloji & İnovasyon
            </span>
            <h2 className="showcase-title mb-6">
              Sınırları <br /> Zorlayan Donanım.
            </h2>
            <p className="showcase-description mb-8">
              Her bir bileşen, en zorlu koşullarda bile kusursuz performans sergilemek üzere Türk mühendisler tarafından tasarlandı ve test edildi.
            </p>
            
            <div className="flex gap-4">
              <button className="btn-primary">Teknik Dokümanlar</button>
              <button className="btn-secondary">Geliştirici Paneli</button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
