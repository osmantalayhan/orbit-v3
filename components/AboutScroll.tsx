"use client";

import { motion, useInView } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

const content = [
  {
    id: "engineering",
    title: "Engineering",
    heading: "10+ Yıllık Teknik Miras",
    description: "İHA ve robotik sistemler için uçuş kontrol kartları, ESC'ler ve elektronik donanımlar tasarlıyor ve geliştiriyoruz.",
    image: "/img/about/engineering-kb.jpeg",
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    heading: "Yüksek Hassasiyetli Üretim",
    description: "ESC ve uçuş kontrol kartları başta olmak üzere, geliştirdiğimiz elektronik donanımların PCB dizgi, montaj ve test süreçlerini kendi tesislerimizde gerçekleştiriyoruz.",
    image: "/img/about/manufacturing-kb.png",
  },
  {
    id: "software",
    title: "Software",
    heading: "Akıllı Görev Yazılımları",
    description: "Gömülü yazılım ve insansız sistem yazılımları alanında çalışmalar yürütüyor, donanımlarımızla uyumlu yazılım çözümleri geliştirmeye odaklanıyoruz.",
    image: "/img/about/terminal.png",
  },
];

function ScrollItem({ item, setActiveId, isActive }: { item: typeof content[0], setActiveId: (id: string) => void, isActive: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: "some", margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (isInView) {
      setActiveId(item.id);
    }
  }, [isInView, item.id, setActiveId]);

  return (
    <div ref={ref} className="flex items-center justify-center">
      <div 
        className="scroll-item-card w-full h-[480px] md:h-[550px] bg-[#0d0d0d] border border-white/10 rounded-[32px] overflow-hidden relative group transition-all duration-700"
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
        {/* Desktop gradient (bottom shadow) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent hidden md:block" />
        {/* Mobile gradient (taller shadow for text readability) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent md:hidden" />

        {/* Mobile Text Overlay (Hidden on Desktop) */}
        <div 
          className="absolute bottom-0 left-0 w-full md:hidden flex flex-col justify-end h-full z-20"
          style={{ padding: '32px', boxSizing: 'border-box' }}
        >
          <h3 
            className="text-3xl font-bold text-white leading-tight"
            style={{ marginBottom: '12px' }}
          >
            {item.title}
          </h3>
          <p 
            className="text-white/80 text-sm leading-relaxed"
            style={{ marginBottom: '24px' }}
          >
            {item.description}
          </p>
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
      <div className="about-scroll-container max-w-[1304px] w-full px-12 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-20">
        
        {/* Left Side - Sticky Content (Desktop Only) */}
        <div className="about-scroll-left hidden md:flex h-fit sticky top-48 flex-col items-start z-30 w-full">
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
                  className={`text-2xl font-bold text-left transition-all duration-300 cursor-pointer ${
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
