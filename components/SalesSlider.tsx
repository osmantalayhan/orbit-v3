"use client";

import { motion } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";

const LOGOS = [
  "/img/saleschanell/hepsiburada.png",
  "/img/saleschanell/n11.png",
  "/img/saleschanell/pttavm.png",
  "/img/saleschanell/robolink.png",
  "/img/saleschanell/trendyol.png",
];

export default function SalesSlider() {
  const [contentWidth, setContentWidth] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This dynamically calculates the width of exactly ONE set of logos
    // no matter what their individual sizes are.
    const calculateWidth = () => {
      if (scrollRef.current) {
        setContentWidth(scrollRef.current.scrollWidth / 2);
      }
    };

    calculateWidth();
    // Re-calculate on window resize to keep it perfect
    window.addEventListener('resize', calculateWidth);
    return () => window.removeEventListener('resize', calculateWidth);
  }, []);

  // You can change this single value to adjust all gaps dynamically
  const gap = 80;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
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
          {/* We repeat the logos exactly twice. 
              The dynamic contentWidth ensures the loop is pixel-perfect. */}
          {[...LOGOS, ...LOGOS].map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{
                height: '50px', // Fixed height keeps the line elegant
                paddingRight: `${gap}px`, // Dynamic gap attached to each item
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <img
                src={logo}
                alt="Sales Channel"
                draggable={false}
                style={{
                  height: '100%',
                  width: 'auto',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  opacity: 0.9
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
