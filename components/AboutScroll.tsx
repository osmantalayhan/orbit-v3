"use client";

import { motion, useInView } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

const content = [
  {
    id: "engineering",
    title: "Engineering",
    heading: "10+ Yıllık Teknik Miras",
    description: "Türkiye'nin insansız sistemler ekosisteminde, uçuş kontrol kartlarından güç yönetimine kadar uçtan uca donanım mimarisi ve mühendislik çözümleri sunuyoruz.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    heading: "Yüksek Hassasiyetli Üretim",
    description: "Kendi tesislerimizde, en zorlu koşullara dayanıklı ESC ve uçuş kontrol sistemlerini askeri standartlarda üretiyoruz.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "software",
    title: "Software",
    heading: "Akıllı Görev Yazılımları",
    description: "Donanımımızla tam uyumlu çalışan, otonom uçuş ve görev planlama yeteneklerini maksimize eden özelleştirilmiş yazılım ekosistemi.",
    image: "/img/about/terminal.png",
  },
];

function ScrollItem({ item, setActiveId, isActive }: { item: typeof content[0], setActiveId: (id: string) => void, isActive: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.6, margin: "-10% 0px -10% 0px" });

  useEffect(() => {
    if (isInView) {
      setActiveId(item.id);
    }
  }, [isInView, item.id, setActiveId]);

  return (
    <div ref={ref} className="flex items-center justify-center">
      <div 
        className="scroll-item-card w-full h-[400px] md:h-[550px] bg-[#0d0d0d] border border-white/10 rounded-[32px] overflow-hidden relative group transition-all duration-700"
        style={{ 
          opacity: isActive ? 1 : 0.3,
          transform: isActive ? "scale(1)" : "scale(0.98)"
        }}
      >
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div className={`absolute inset-0 bg-black/60 transition-opacity duration-700 ${isActive ? "opacity-0" : "opacity-100"}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Mobile Info Overlay (Hidden on desktop) */}
        <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col items-start text-left md:hidden z-20 bg-gradient-to-t from-black/95 via-black/50 to-transparent">
          <span className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1">{item.title}</span>
          <h3 className="text-xl font-bold text-white mb-2">{item.heading}</h3>
          <p className="text-white/70 text-xs leading-relaxed mb-4">{item.description}</p>
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <span>İncele</span>
            <span>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutScroll() {
  const [activeId, setActiveId] = useState(content[0].id);

  return (
    <section 
      className="bg-black flex justify-center items-center"
      style={{ paddingTop: '130px', paddingBottom: '0' }}
    >
      <div className="max-w-[1304px] w-full px-12 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-20">
        
        {/* Left Side - Sticky Content */}
        <div className="about-scroll-left h-fit sticky top-48 flex flex-col items-start">
          <div 
            className="hero-heading select-none pointer-events-none"
            style={{ marginBottom: '50px' }}
          >
            <span className="text-white">Create,</span>
            <span className="text-white">Engineering,</span>
            <span className="text-white">Orbit</span>
          </div>
          
          <div className="flex flex-col gap-4 w-full max-w-[400px]">
            {content.map((item) => (
              <div key={item.id} className="flex flex-col">
                <button
                  onClick={() => {
                    const el = document.getElementById(item.id);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className={`text-xl md:text-2xl font-bold text-left transition-all duration-300 ${
                    activeId === item.id ? "text-white" : "text-white/20"
                  }`}
                >
                  {item.title}
                </button>
                
                {activeId === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <p className="text-white/50 text-base leading-relaxed my-6">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer group font-bold text-sm">
                      <span>İncele</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Scrollable Images with 15px gap */}
        <div className="about-scroll-right flex flex-col gap-[15px]">
          {content.map((item) => (
            <div id={item.id} key={item.id}>
              <ScrollItem 
                item={item} 
                setActiveId={setActiveId} 
                isActive={activeId === item.id} 
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
