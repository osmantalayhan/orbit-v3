"use client";

import { motion } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";

const LOGOS = [
  { path: "/img/eco/BetaFlight.png", scale: 1.15 },
  { path: "/img/eco/ardupilot.png", scale: 1 },
  { path: "/img/eco/blheli.png", scale: 1 },
  { path: "/img/eco/bluejay.png", scale: 1 },
  { path: "/img/eco/easyeda.png", scale: 1 },
  { path: "/img/eco/inav.png", scale: 1 },
  { path: "/img/eco/kicad.png", scale: 1.15 },
];

export default function EcosystemSlider() {
  const [contentWidth, setContentWidth] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateWidth = () => {
      if (scrollRef.current) {
        setContentWidth(scrollRef.current.scrollWidth / 2);
      }
    };

    calculateWidth();
    window.addEventListener('resize', calculateWidth);
    return () => window.removeEventListener('resize', calculateWidth);
  }, []);

  const gap = 80;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-black overflow-hidden flex justify-center items-center"
      style={{ paddingTop: '130px', paddingBottom: '0' }}
    >
      <div
        className="relative overflow-hidden"
        style={{ width: '100%', maxWidth: '1304px' }}
      >

        {/* Side Masks for cinematic fading */}
        <div className="absolute inset-y-0 left-0 z-10 w-[120px] bg-gradient-to-r from-black to-transparent" />
        <div className="absolute inset-y-0 right-0 z-10 w-[120px] bg-gradient-to-l from-black to-transparent" />

        <motion.div
          ref={scrollRef}
          className="flex items-center w-max"
          animate={{
            x: contentWidth ? [0, -contentWidth] : 0,
          }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[...LOGOS, ...LOGOS].map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{
                height: '50px',
                paddingRight: `${gap}px`,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <img
                src={logo.path}
                alt="Ecosystem Partner"
                draggable={false}
                style={{
                  height: '100%',
                  width: 'auto',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  opacity: 0.9,
                  transform: `scale(${logo.scale})`
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
