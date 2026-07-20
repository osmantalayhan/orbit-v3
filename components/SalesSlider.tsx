"use client";

import { motion, useAnimationFrame, useMotionValue, animate } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

export default function SalesSlider() {
  const { data: apiChannels } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/sales-channels`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const [contentWidth, setContentWidth] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Custom animation state for smooth slow down
  const xPos = useMotionValue(0);
  const speed = useMotionValue(1.5); // Normal speed multiplier
  const isHovered = useRef(false);

  // Use the fetched channels, or empty array while loading
  const channels = apiChannels || [];

  useEffect(() => {
    const calculateWidth = () => {
      if (scrollRef.current && channels.length > 0) {
        // scrollWidth represents both sets (the original + the clone)
        // so one set is scrollWidth / 2
        setContentWidth(scrollRef.current.scrollWidth / 2);
      }
    };

    calculateWidth();
    // A small delay ensures images are loaded before calculation
    setTimeout(calculateWidth, 500);

    window.addEventListener('resize', calculateWidth);
    return () => window.removeEventListener('resize', calculateWidth);
  }, [channels]);

  useAnimationFrame((t, delta) => {
    if (!contentWidth) return;
    
    // delta is time passed in ms since last frame. Usually ~16.6ms at 60fps.
    // moveBy is the pixel amount to move this frame.
    const moveBy = speed.get() * (delta / 16.6); 
    let newX = xPos.get() - moveBy;

    // Reset loop
    if (newX <= -contentWidth) {
      newX += contentWidth;
    }
    
    xPos.set(newX);
  });

  const handleMouseEnter = () => {
    isHovered.current = true;
    animate(speed, 0.15, { type: "tween", duration: 0.6, ease: "easeOut" }); // Yavaşla (fakat tamamen durma, çok yavaş aksın)
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    animate(speed, 1.5, { type: "tween", duration: 0.6, ease: "easeIn" }); // Hızlan
  };

  const gap = 80;

  // Don't render the slider section at all if there are no active channels
  if (!apiChannels && channels.length === 0) return null; // Loading state (invisible to prevent layout shift)
  if (apiChannels && channels.length === 0) return null; // Empty state

  return (
    <motion.section
      id="satis-kanallari"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-black overflow-hidden flex flex-col items-center"
      style={{ paddingTop: '130px', paddingBottom: '0' }}
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
            Satış <br /> Kanallarımız.
          </motion.h2>
        </header>
      </div>

      <div
        className="relative overflow-hidden"
        style={{ width: '100%', maxWidth: '1304px' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >

        {/* Side Masks for cinematic fading */}
        <div className="sales-slider-mask-left absolute inset-y-0 left-0 z-10 w-[120px] bg-gradient-to-r from-black to-transparent pointer-events-none" />
        <div className="sales-slider-mask-right absolute inset-y-0 right-0 z-10 w-[120px] bg-gradient-to-l from-black to-transparent pointer-events-none" />

        <motion.div
          ref={scrollRef}
          className="flex items-center w-max"
          style={{ x: xPos }}
        >
          {/* We repeat the logos exactly twice. */}
          {[...channels, ...channels].map((channel, index) => {
            // Provide a wrapper, either a <a> or a <div> depending on if it has a URL
            const ContentWrapper = channel.url ? 'a' : 'div';
            
            return (
              <ContentWrapper
                key={`${channel.id}-${index}`}
                href={channel.url || undefined}
                target={channel.url ? "_blank" : undefined}
                rel={channel.url ? "noopener noreferrer" : undefined}
                className="flex-shrink-0 transition-transform duration-300 hover:scale-105 h-[30px] md:h-[50px]"
                style={{
                  paddingRight: `${gap}px`,
                  display: 'flex',
                  alignItems: 'center',
                  cursor: channel.url ? 'pointer' : 'default'
                }}
              >
                <img
                  src={channel.image_url}
                  alt={channel.name}
                  draggable={false}
                  style={{
                    height: '100%',
                    width: 'auto',
                    objectFit: 'contain',
                    opacity: 0.9,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              </ContentWrapper>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
