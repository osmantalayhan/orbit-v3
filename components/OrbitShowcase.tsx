"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

const products = [
  { 
    id: 1, 
    name: "Uçuş Kontrol Kartı", 
    subtitle: "Orbit F405-HD Pro V3", 
    images: ["/img/flight-control.png", "/img/flight-control-1.png", "/img/flight-control2.png", "/img/ucuskontrol.png"],
    specs: [{ k: "MCU", v: "STM32F405" }, { k: "IMU", v: "MPU6000" }, { k: "OSD", v: "AT7456E" }, { k: "Giriş", v: "3-6S LiPo" }] 
  },
  { 
    id: 2, 
    name: "ESC Modülü", 
    subtitle: "Orbit 50A 4-in-1 Power", 
    images: ["/img/flight-control.png", "/img/flight-control2.png"],
    specs: [{ k: "Akım", v: "50A (60A Burst)" }, { k: "Firmware", v: "BLHeli_32" }, { k: "Protokol", v: "DShot1200" }, { k: "Ağırlık", v: "12g" }] 
  },
  { 
    id: 3, 
    name: "ELRS Alıcı", 
    subtitle: "Orbit 2.4GHz Nano Rx", 
    images: ["/img/elrs.png", "/img/flight-control.png"],
    specs: [{ k: "Frekans", v: "2.4GHz ISM" }, { k: "Menzil", v: "30km+" }, { k: "Telemetri", v: "Mevcut" }, { k: "Ağırlık", v: "0.6g" }] 
  },
  { 
    id: 4, 
    name: "GPS Modülü", 
    subtitle: "Orbit M10-Q Precision", 
    images: ["/img/flight-control.png", "/img/ucuskontrol.png"],
    specs: [{ k: "Çip", v: "Ublox M10" }, { k: "Uydu", v: "GPS + GLONASS" }, { k: "Baud Rate", v: "115200" }, { k: "Pusula", v: "HMC5883L" }] 
  },
  { 
    id: 5, 
    name: "Hava Modülü", 
    subtitle: "Orbit Air Unit HD", 
    images: ["/img/flight-control.png", "/img/flight-control2.png"],
    specs: [{ k: "Çözünürlük", v: "1080p 60fps" }, { k: "Gecikme", v: "28ms" }, { k: "Güç", v: "25mW - 1200mW" }, { k: "Kayıt", v: "Micro SD" }] 
  },
  { 
    id: 6, 
    name: "Telemetri Seti", 
    subtitle: "Orbit Link Pro 900", 
    images: ["/img/pluto.png", "/img/flight-control.png"],
    specs: [{ k: "Menzil", v: "50km" }, { k: "Frekans", v: "915MHz" }, { k: "Güç", v: "1W" }, { k: "Gecikme", v: "10ms" }] 
  }
];

function ImageGallery({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setIndex((prev) => (prev + newDirection + images.length) % images.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="v17-gallery-container">
      <div className="v17-gallery-viewport">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={index}
            src={images[index]}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="v17-gallery-img"
          />
        </AnimatePresence>
      </div>

      <div className="v17-gallery-dots">
        {images.map((_, i) => (
          <div 
            key={i} 
            className={`v17-dot ${i === index ? "active" : ""}`}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function DockItem({ product, mouseX, onClick, active }: { product: any, mouseX: any, onClick: () => void, active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  const widthSync = useTransform(distance, [-150, 0, 150], [60, 110, 60]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 180, damping: 15 });

  return (
    <motion.div ref={ref} style={{ width }} onClick={onClick} className={`v17-dock-item ${active ? "active" : ""}`}>
      <div className="v17-item-content">
        <img src={product.images[0]} alt={product.name} className="v17-dock-img" />
        {active && <motion.div layoutId="v17-dot" className="v17-active-dot" />}
      </div>
    </motion.div>
  );
}

export default function OrbitShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="v17-layout">
      <div className="v17-window-area">
        <AnimatePresence mode="wait">
          <motion.div
            key={products[activeIndex].id}
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="v17-mac-window"
          >
            <div className="v17-window-header">
              <div className="v17-traffic-lights">
                <span className="light red" />
                <span className="light yellow" />
                <span className="light green" />
              </div>
              <div className="v17-window-title">{products[activeIndex].name}</div>
            </div>

            <div className="v17-window-content">
              <div className="v17-content-grid">
                <div className="v17-visual-pane">
                  <ImageGallery images={products[activeIndex].images} />
                </div>
                <div className="v17-details-pane">
                  <h3 className="v17-detail-title">{products[activeIndex].name}</h3>
                  <p className="v17-detail-subtitle">{products[activeIndex].subtitle}</p>
                  
                  <div className="v17-specs-list">
                    {products[activeIndex].specs.map((s, i) => (
                      <div key={i} className="v17-spec-item">
                        <span className="label">{s.k}</span>
                        <span className="value">{s.v}</span>
                      </div>
                    ))}
                  </div>

                  <button className="v17-cta">Ürünü İncele</button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="v17-dock-wrapper">
        <motion.div
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="v17-dock-bar"
        >
          {products.map((prod, i) => (
            <DockItem
              key={prod.id}
              product={prod}
              mouseX={mouseX}
              active={activeIndex === i}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
