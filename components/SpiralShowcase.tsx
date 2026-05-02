"use client";

import React from "react";
import { motion, useTime, useTransform } from "framer-motion";

const products = [
  { id: 1, image: "/img/flight-control.png" },
  { id: 2, image: "/img/flight-control2.png" },
  { id: 3, image: "/img/elrs.png" },
  { id: 4, image: "/img/ucuskontrol.png" },
  { id: 5, image: "/img/pluto.png" },
  { id: 6, image: "/img/flight-control-1.png" },
];

export default function SpiralShowcase() {
  const time = useTime();
  const spiralRadius = 280;
  const spiralTurns = 1.2;
  const imageSize = 90;
  const totalItems = products.length * 3; // Duplicate for density

  // Map time to rotation angle (Slower: 30 seconds per full rotation)
  const angle = useTransform(time, [0, 30000], [0, 2 * Math.PI], { clamp: false });

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <div className="relative w-full h-full max-w-[1400px] mx-auto flex items-center justify-center">
        {/* Massive Bold White Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 text-[5vw] font-[900] tracking-tighter text-white uppercase select-none"
        >
          ORBIT
        </motion.h1>

        {Array.from({ length: totalItems }).map((_, i) => (
          <SpiralItem
            key={i}
            index={i}
            total={totalItems}
            angle={angle}
            image={products[i % products.length].image}
            spiralRadius={spiralRadius}
            spiralTurns={spiralTurns}
            imageSize={imageSize}
          />
        ))}
      </div>
    </div>
  );
}

function SpiralItem({ 
  index, 
  total, 
  angle, 
  image, 
  spiralRadius, 
  spiralTurns, 
  imageSize 
}: { 
  index: number; 
  total: number; 
  angle: any; 
  image: string; 
  spiralRadius: number; 
  spiralTurns: number; 
  imageSize: number;
}) {
  const step = 1 / total;
  
  // Normalize progress to 0-1 for this specific item's window
  const itemProgress = useTransform(angle, (a: number) => {
    return ((index + 0.5) / total + a / (2 * Math.PI * spiralTurns) + 0.5) % 1;
  });

  const x = useTransform(itemProgress, (t: number) => {
    const a = angle.get(); // Get current global angle
    const theta = 2 * Math.PI * spiralTurns * t + a;
    const r = spiralRadius * (0.5 + t);
    return Math.cos(theta) * r;
  });

  const y = useTransform(itemProgress, (t: number) => {
    const a = angle.get();
    const theta = 2 * Math.PI * spiralTurns * t + a;
    const r = spiralRadius * (0.5 + t);
    return Math.sin(theta) * r;
  });

  const scale = useTransform(itemProgress, [0, 1], [0.6, 1.1]);
  const opacity = useTransform(itemProgress, [0, 0.1, 0.9, 1], [0, 0.9, 0.9, 0]);
  const blur = useTransform(itemProgress, [0, 0.3, 1], [4, 0, 0]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: "50%",
        top: "40%",
        x,
        y,
        scale,
        opacity,
        filter: useTransform(blur, (b) => `blur(${b}px) brightness(${0.6 + (1 - b/8) * 0.4})`),
        width: imageSize,
        height: imageSize,
      }}
      className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 backdrop-blur-sm"
    >
      <img src={image} alt="Product" className="w-full h-full object-cover" />
    </motion.div>
  );
}
