"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function OSDSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timer, setTimer] = useState("04:32");
  const [voltage, setVoltage] = useState(22.2);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Simulating live data jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setVoltage(prev => +(prev + (Math.random() * 0.1 - 0.05)).toFixed(1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const horizonRotate = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const horizonY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scaleY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section 
      ref={containerRef}
      className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden"
    >
      {/* 1. CRT SCANLINES & OVERLAY EFFECT */}
      <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 2px)', backgroundSize: '100% 3px' }} 
      />
      <div className="absolute inset-0 z-30 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* 2. SUBTLE TECHNICAL GRID */}
      <div className="absolute inset-0 opacity-[0.03] z-0" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
      />

      {/* 3. OSD TELEMETRY (CENTERED CONTAINER) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
        <div className="w-full max-w-[1400px] h-full max-h-[800px] flex flex-col justify-between p-12 md:p-24 text-white/90" style={{ fontFamily: 'var(--font-osd)' }}>
          {/* Top Row - Inward focused */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 text-[10px] md:text-sm tracking-widest">
              <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}>● ORBIT_SYSTEM_ACTIVE</motion.div>
              <div className="mt-2">BAT: {voltage}V</div>
              <div className="opacity-60 text-[9px]">DRAIN: 12.4A</div>
            </div>
            <div className="flex flex-col gap-1 items-end text-[10px] md:text-sm tracking-widest text-right">
              <div>LQ: 100%</div>
              <div>RSSI: -42dBm</div>
              <div className="opacity-60 text-[9px]">FREQ: 2.4GHZ</div>
            </div>
          </div>

          {/* Bottom Row - Inward focused */}
          <div className="flex justify-between items-end mb-20 md:mb-32">
            <div className="flex flex-col gap-1 text-[10px] md:text-sm tracking-widest">
              <div>TIMER: {timer}</div>
              <div>ALT: 124.5M</div>
              <div className="opacity-60 text-[9px]">SPD: 42KM/H</div>
            </div>
            <div className="flex flex-col gap-1 items-end text-[10px] md:text-sm tracking-widest text-right">
              <div className="bg-white text-black px-1.5 py-0.5 font-bold mb-1">ACRO</div>
              <div>DISARMED</div>
              <div className="opacity-60 text-[9px]">SATS: 18</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CENTRAL HUD SYSTEM */}
      <div className="relative w-full max-w-4xl h-[500px] flex items-center justify-center z-10">
        
        {/* Pitch Ladder (The moving scale) */}
        <motion.div 
          style={{ y: scaleY }}
          className="absolute flex flex-col items-center gap-10 opacity-20 pointer-events-none"
        >
          {[20, 10, 0, -10, -20].map((deg) => (
            <div key={deg} className="flex items-center gap-10">
              <div className="w-10 h-px bg-white" />
              <span className="text-[9px] text-white mono w-6 text-center">{deg}</span>
              <div className="w-10 h-px bg-white" />
            </div>
          ))}
        </motion.div>

        {/* Dynamic Horizon Line */}
        <motion.div 
          style={{ rotate: horizonRotate, y: horizonY }}
          className="absolute w-full flex items-center justify-center px-4 md:px-12"
        >
          <div className="w-[30%] h-[1px] bg-white/40 relative">
            <div className="absolute right-0 top-0 w-[1px] h-4 bg-white/40" />
          </div>
          <div className="w-16" /> {/* Spacer for center */}
          <div className="w-[30%] h-[1px] bg-white/40 relative">
            <div className="absolute left-0 top-0 w-[1px] h-4 bg-white/40" />
          </div>
        </motion.div>

        {/* Center Target Bracket */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/60" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/60" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/60" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/60" />
          
          <div className="w-1 h-1 bg-white rounded-full" />
          
          <div className="absolute w-40 h-40 border border-white/5 rounded-full" />
        </div>
      </div>

      {/* 5. BOTTOM TEXT DESCRIPTION */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center z-40 w-full">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="hero-heading text-2xl md:text-4xl"
        >
          Precision View
        </motion.h2>
      </div>
    </section>
  );
}
