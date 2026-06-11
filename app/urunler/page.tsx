"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const STATIC_PRODUCTS = [
  {
    id: "f435",
    name: "Orbit F435",
    role: "Uçuş Kontrol Sistemi",
    desc: "STM32F405 İşlemci & Dual IMU Teknolojisi",
    category: "uçuş kontrol",
    image: "/img/flight-control.png",
    badge: "en çok satan",
    index: "01",
  },
  {
    id: "e50",
    name: "Orbit E50",
    role: "50A 4-in-1 ESC",
    desc: "BLHeli_32 & 128K PWM Desteği",
    category: "esc",
    image: "/img/flight-control.png",
    badge: null,
    index: "02",
  },
  {
    id: "lrs",
    name: "Orbit LRS",
    role: "2.4GHz ELRS Alıcı",
    desc: "30km+ Menzil & 0.6g Ultra Hafif",
    category: "lrs",
    image: "/img/flight-control.png",
    badge: "yeni",
    index: "03",
  },
  {
    id: "gps",
    name: "Orbit M10",
    role: "GPS Modülü",
    desc: "Ublox M10 & Dual Kompas",
    category: "gps",
    image: "/img/flight-control.png",
    badge: null,
    index: "04",
  },
  {
    id: "vtx",
    name: "Orbit Nebula",
    role: "Video Verici",
    desc: "1.2W Güç & SmartAudio Desteği",
    category: "video",
    image: "/img/flight-control.png",
    badge: null,
    index: "05",
  },
  {
    id: "frame",
    name: "Orbit X5",
    role: "Carbon Fiber Frame",
    desc: "T700 Karbon & 5mm Kol Kalınlığı",
    category: "frame",
    image: "/img/flight-control.png",
    badge: null,
    index: "06",
  },
];

export default function UrunlerPage() {
  const [productsList, setProductsList] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("tümü");
  const [searchQuery, setSearchQuery] = useState("");

  React.useEffect(() => {
    // Fetch products from backend API
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((item: any, idx: number) => ({
            id: item.id,
            name: item.name,
            role: item.role,
            desc: item.tagline,
            category: item.category.toLowerCase(),
            image: item.images && item.images.length > 0 ? item.images[0] : "/img/flight-control.png",
            badge: item.badge || null,
            index: String(idx + 1).padStart(2, "0"),
          }));
          setProductsList(mapped);
        }
      })
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  // Dynamically extract categories from the current product list
  const categories = ["tümü", ...Array.from(new Set(productsList.map((p) => p.category)))];

  const filtered = productsList.filter((p) => {
    const matchesCategory = activeCategory === "tümü" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff", overflow: "hidden" }}>
      <style>{`
        @media (max-width: 1024px) {
          .urunler-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .urunler-hero-right {
            min-height: 360px !important;
          }
        }
        @media (max-width: 768px) {
          .page-container {
            padding-top: 120px !important;
            padding-bottom: 40px !important;
          }
          .urunler-hero-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            min-height: auto !important;
            margin-bottom: 40px !important;
            gap: 24px !important;
          }
          .urunler-hero-title {
            font-size: 42px !important;
          }
          .urunler-hero-title br {
            display: none !important;
          }
          .urunler-hero-right {
            width: 100% !important;
            min-height: 260px !important;
          }
          .urunler-hero-right img {
            object-position: center center !important;
          }
          .urunler-filter-row {
            gap: 16px !important;
            margin-bottom: 32px !important;
          }
          .urunler-search-box {
            max-width: 100% !important;
          }
          .urunler-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .urunler-grid > div > a > div {
            padding: 24px 24px 20px !important;
            border-radius: 20px !important;
          }
        }
      `}</style>

      <div className="page-container" style={{ paddingTop: "180px", paddingBottom: "20px", zIndex: 10 }}>

        {/* ── HERO: Sol Başlık + Sağ Devasa Ürün Görseli (Blog sayfasıyla aynı dil) ── */}
        <div className="urunler-hero-row" style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          minHeight: "460px",
          marginBottom: "80px",
          gap: "0",
        }}>
          {/* Sol: Büyük Başlık */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="urunler-hero-left"
            style={{ zIndex: 12, flexShrink: 0 }}
          >
            <h1 className="urunler-hero-title" style={{
              fontSize: "74px",
              fontWeight: "700",
              lineHeight: "0.95",
              letterSpacing: "-0.04em",
              margin: 0,
            }}>
              Orbit<br />
              ürün ailesini<br />
              keşfet.
            </h1>
          </motion.div>

          {/* Sağ: Görsel — flex ile kalan alanı doldurur, sağa yaslı */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="urunler-hero-right"
            style={{
              flexGrow: 1,
              position: "relative",
              alignSelf: "stretch",
              pointerEvents: "none",
              minHeight: "460px",
            }}
          >
            <Image
              src="/img/shop-2.png"
              alt="Orbit Shop"
              fill
              className="object-contain"
              style={{
                objectPosition: "right center",
                filter: "brightness(1.1)",
              }}
              priority
            />
          </motion.div>
        </div>

        {/* ── KATEGORİ FİLTRELEME + ürün sayısı ── */}
        <div className="urunler-filter-row" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "28px",
        }}>
          <div className="urunler-cats-box" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    height: "38px", padding: "0 18px",
                    borderRadius: "99px",
                    backgroundColor: isActive ? "#fff" : "rgba(255,255,255,0.03)",
                    border: isActive ? "none" : "1px solid rgba(255,255,255,0.08)",
                    color: isActive ? "#000" : "rgba(255,255,255,0.45)",
                    fontSize: "13px", fontWeight: "700", cursor: "pointer",
                    textTransform: "lowercase",
                    transition: "all 0.22s ease",
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                    }
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sağ: Arama Input'u */}
          <div className="urunler-search-box" style={{ position: "relative", maxWidth: "320px", width: "100%" }}>
            <input
              type="text"
              placeholder="Ürünlerde arayın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                height: "44px",
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "99px",
                padding: "0 44px 0 20px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
              }}
            />
            <div style={{
              position: "absolute", right: "16px", top: "50%",
              transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.35,
            }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── ÜRÜN GRID ── */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              key="grid"
              className="urunler-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}
            >
              {filtered.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.45, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={`/urunler/${product.id}`} style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}>
                    <div
                      style={{
                        backgroundColor: "#0a0a0a",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "28px",
                        padding: "36px 36px 28px",
                        display: "flex", flexDirection: "column",
                        height: "100%",
                        cursor: "pointer", transition: "all 0.3s ease",
                        position: "relative", overflow: "hidden",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.11)";
                        e.currentTarget.style.backgroundColor = "#0f0f0f";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                        e.currentTarget.style.backgroundColor = "#0a0a0a";
                      }}
                    >
                      {/* Ürün Görseli */}
                      <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", marginBottom: "28px" }}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain"
                          style={{ filter: "brightness(1.05)" }}
                        />
                      </div>

                      {/* Alt bölge: isim + ok */}
                      <div style={{
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                        paddingTop: "20px",
                        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
                        marginTop: "auto",
                      }}>
                        <div>
                          <p style={{
                            fontSize: "11px", color: "rgba(255,255,255,0.25)", fontWeight: "600",
                            textTransform: "lowercase", marginBottom: "5px",
                          }}>
                            {product.role}
                          </p>
                          <h3 style={{
                            fontSize: "24px", fontWeight: "700",
                            letterSpacing: "-0.025em", margin: 0, color: "#fff",
                          }}>
                            {product.name}
                          </h3>
                        </div>
                        <div style={{
                          width: "36px", height: "36px", borderRadius: "50%",
                          border: "1px solid rgba(255,255,255,0.09)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, color: "rgba(255,255,255,0.45)",
                          transition: "all 0.25s ease",
                        }}>
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                gridColumn: "1 / -1",
                padding: "80px 0",
                textAlign: "center",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "12px"
              }}
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.25)", fontWeight: "500", margin: 0 }}>
                aradığınız kriterlere uygun ürün bulunamadı.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
