"use client";

import React, { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Ürün Veritabanı
const STATIC_PRODUCT_DATA: Record<string, {
  name: string;
  role: string;
  tagline: string;
  description: string;
  images: string[];
  specs: { label: string; value: string }[];
  channels: { name: string; logo?: string; url: string }[];
  pinout_images?: string[];
  downloads?: any[];
}> = {
  "f435": {
    name: "Orbit F435",
    role: "Uçuş Kontrolör Sistemi",
    tagline: "Çift IMU ile sınıfının en kararlı uçuş kontrolörü.",
    description: "Orbit F435, endüstriyel ve askeri sınıf İHA operasyonları için tasarlanmış yüksek performanslı bir uçuş kontrol kartıdır. Birbirine 90° açıyla yerleştirilmiş çift yedekli IMU sensör mimarisi ve gerçek zamanlı Kalman Filtresi algoritmaları sayesinde 45 knot'a kadar ani rüzgar darbelerinde stabilite kaybı sıfıra indirilmiştir. STM32F405 ARM Cortex-M4 işlemcisi üzerinde çalışan Orbit RTOS, tüm sensör verilerini 1kHz frekansında işler.",
    images: ["/img/ucuskontrol.png", "/img/flight-control.png", "/img/ucuskontrol1.png"],
    specs: [
      { label: "İşlemci", value: "STM32F405 ARM Cortex-M4 @ 168MHz" },
      { label: "IMU Sensörleri", value: "Dual ICM-42688-P (Yedekli & İzole)" },
      { label: "Barometre", value: "SPL06-001 Hassas Barometre" },
      { label: "Giriş Voltajı", value: "2S – 8S LiPo (7.4V – 33.6V)" },
      { label: "Kara Kutu", value: "16MB Onboard Flash Bellek" },
      { label: "UART Port", value: "6x UART, 2x I2C, 1x SPI" },
      { label: "PWM Çıkış", value: "8x Motor + 4x Servo" },
      { label: "Boyutlar", value: "38.5 × 38.5 mm" },
      { label: "Ağırlık", value: "8.2g" },
      { label: "Sertifikasyon", value: "MIL-STD-810G / RoHS" },
    ],
    channels: [
      { name: "Trendyol", logo: "/img/saleschanell/trendyol.png", url: "#" },
      { name: "Hepsiburada", logo: "/img/saleschanell/hepsiburada.png", url: "#" },
      { name: "N11", logo: "/img/saleschanell/n11.png", url: "#" },
      { name: "Robolink", logo: "/img/saleschanell/robolink.png", url: "#" },
      { name: "PTT AVM", logo: "/img/saleschanell/pttavm.png", url: "#" },
    ],
  },
  "e50": {
    name: "Orbit E50",
    role: "Güç Sistemleri (ESC)",
    tagline: "BLHeli_32 tabanlı, 50A sürekli akım kapasiteli 4-in-1 ESC.",
    description: "Orbit E50, dört bağımsız ESC'yi tek kompakt kart üzerinde birleştiren yüksek verimli güç elektroniğidir. 128kHz PWM frekansı ve aktif fren özelliği ile motor kontrolünde milisaniyelik hassasiyet sağlar. Özel çok katmanlı bakır mimarisi ile yüksek akım altında sıcaklık yönetimi optimize edilmiştir.",
    images: ["/img/esc.png", "/img/flight-control.png"],
    specs: [
      { label: "Sürekli Akım", value: "50A (Her Kanal)" },
      { label: "Zirve Akım", value: "65A (10 saniye)" },
      { label: "Giriş Voltajı", value: "3S – 6S LiPo" },
      { label: "PWM Frekansı", value: "16kHz – 128kHz" },
      { label: "Protokoller", value: "DSHOT150/300/600/1200" },
      { label: "Boyutlar", value: "38 × 38 mm" },
      { label: "Ağırlık", value: "14.5g" },
    ],
    channels: [
      { name: "Trendyol", logo: "/img/saleschanell/trendyol.png", url: "#" },
      { name: "Hepsiburada", logo: "/img/saleschanell/hepsiburada.png", url: "#" },
      { name: "N11", logo: "/img/saleschanell/n11.png", url: "#" },
      { name: "Robolink", logo: "/img/saleschanell/robolink.png", url: "#" },
      { name: "PTT AVM", logo: "/img/saleschanell/pttavm.png", url: "#" },
    ],
  },
};

const fallbackProduct = STATIC_PRODUCT_DATA["f435"];

export default function UrunDetayPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "f435";
  
  const [product, setProduct] = useState<any>(STATIC_PRODUCT_DATA[id] || fallbackProduct);

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then(data => {
        if (data) {
          const mappedProduct = {
            name: data.name,
            role: data.role,
            tagline: data.tagline,
            description: data.description,
            images: data.images && data.images.length > 0 ? data.images : ["/img/flight-control.png"],
            specs: Array.isArray(data.specs) ? data.specs : (data.specs ? Object.entries(data.specs).map(([label, value]) => ({ label, value: String(value) })) : []),
            channels: Array.isArray(data.channels) ? data.channels : (data.channels ? Object.entries(data.channels).map(([name, url]) => ({ name, url: String(url) })) : []),
            pinout_images: data.pinout_images || [],
            downloads: data.downloads || [],
            is_teknofest_active: data.is_teknofest_active || false,
            teknofest_discount: data.teknofest_discount || "15"
          };
          setProduct(mappedProduct);
          if (data.is_teknofest_active) {
            setShowPromo(true);
          } else {
            setShowPromo(false);
          }
        }
      })
      .catch(err => console.error("Error loading product:", err));
  }, [id]);

  const [activeImage, setActiveImage] = useState(0);
  const [showPromo, setShowPromo] = useState(false);
  const [activeTab, setActiveTab] = useState("specs");
  const salesRef = useRef<HTMLDivElement>(null);

  const scrollToSales = () => {
    salesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const [recommendations, setRecommendations] = useState<any[]>([
    {
      id: "f435",
      name: "Orbit F435",
      role: "Uçuş Kontrol Sistemi",
      desc: "STM32F405 İşlemci & Dual IMU Teknolojisi",
      image: "/img/ucuskontrol.png",
    },
    {
      id: "e50",
      name: "Orbit E50",
      role: "50A 4-in-1 ESC",
      desc: "BLHeli_32 & 128K PWM Desteği",
      image: "/img/esc.png",
    },
    {
      id: "lrs",
      name: "Orbit LRS",
      role: "2.4GHz ELRS Alıcı",
      desc: "30km+ Menzil & 0.6g Ultra Hafif",
      image: "/img/elrs.png",
    },
    {
      id: "gps",
      name: "Orbit M10",
      role: "GPS Modülü",
      desc: "Ublox M10 & Dual Kompas",
      image: "/img/gps.png",
    }
  ].filter(p => p.id !== id).slice(0, 3));

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          const recs = data
            .filter((p: any) => p.id !== id)
            .map((p: any) => ({
              id: p.id,
              name: p.name,
              role: p.role,
              desc: p.tagline || p.description,
              image: p.images && p.images.length > 0 ? p.images[0] : "/img/flight-control.png"
            }))
            .slice(0, 3);
          if (recs.length > 0) {
            setRecommendations(recs);
          }
        }
      })
      .catch(err => console.error("Error loading recommendations:", err));
  }, [id]);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff", overflow: "hidden" }}>
      <style>{`
        @media (max-width: 1024px) {
          .product-main-grid {
            gap: 40px !important;
          }
          .product-recs-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
          }
        }
        @media (max-width: 768px) {
          .page-container {
            padding-top: 120px !important;
            padding-bottom: 40px !important;
          }
          .product-back-btn {
            margin-bottom: 24px !important;
          }
          .product-main-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            margin-bottom: 60px !important;
          }
          .product-img-card {
            padding: 32px 20px !important;
            border-radius: 20px !important;
          }
          .product-info-col {
            gap: 24px !important;
            padding-top: 0 !important;
          }
          .product-title {
            font-size: 32px !important;
          }
          .product-tagline {
            font-size: 22px !important;
          }
          .product-specs-grid {
            grid-template-columns: 1fr !important;
            column-gap: 0 !important;
          }
          .product-recs-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .product-recs-grid > div > div > div {
            padding: 24px !important;
            border-radius: 24px !important;
          }
          .product-recs-grid h3 {
            font-size: 24px !important;
            margin-bottom: 12px !important;
          }
          .product-recs-grid p {
            font-size: 14px !important;
          }
          .product-recs-grid button {
            height: 48px !important;
            font-size: 15px !important;
          }
          .product-promo-widget {
            left: 16px !important;
            bottom: 16px !important;
            width: calc(100% - 32px) !important;
            padding: 20px !important;
            border-radius: 20px !important;
          }
          .product-card-logo-box {
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .product-card-text-container {
            text-align: center !important;
          }
          .product-card-text-container > div {
            margin-bottom: 32px !important;
          }
        }
      `}</style>

      <div className="page-container" style={{ paddingTop: "140px", paddingBottom: "30px", zIndex: 10 }}>



        {/* ── BREADCRUMB / GO BACK (Aynı Şekilde Sade Yazı) ── */}
        <button
          onClick={() => router.push("/urunler")}
          className="product-back-btn"
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.65)",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: 0,
            marginBottom: "40px",
            transition: "color 0.2s ease"
          }}
          onMouseOver={(e) => { e.currentTarget.style.color = "#fff"; }}
          onMouseOut={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Geri Dön
        </button>

        {/* ── 2 KOLONLU ŞABLON (Görsel Kartı solda, Bilgiler sağda) ── */}
        <div className="product-main-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.25fr",
          gap: "64px",
          alignItems: "start",
          marginBottom: "100px",
        }}>

          {/* SOL ALAN: Şık Profil Kartı Formatında Donanım Kartı */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="product-img-card" style={{
              borderRadius: "24px",
              backgroundColor: "#0d0d0d",
              border: "1px solid rgba(255,255,255,0.05)",
              padding: "48px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "24px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
            }}>

              {/* Ürün Resmi (Sadece Yalın Görsel) */}
              <div style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1/1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Image
                  src={product.images[activeImage]}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Küçük Görsel Seçiciler */}
            {product.images.length > 1 && (
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      position: "relative",
                      border: activeImage === i
                        ? "1.5px solid rgba(255,255,255,0.4)"
                        : "1px solid rgba(255,255,255,0.05)",
                      backgroundColor: "#0d0d0d",
                      cursor: "pointer",
                      padding: 0,
                      opacity: activeImage === i ? 1 : 0.4,
                      transition: "all 0.25s ease",
                    }}
                    onMouseOver={(e) => { if (activeImage !== i) e.currentTarget.style.opacity = "0.8"; }}
                    onMouseOut={(e) => { if (activeImage !== i) e.currentTarget.style.opacity = "0.4"; }}
                  >
                    <Image src={img} alt="" fill className="object-contain" style={{ padding: "6px" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SAĞ ALAN: İstihdam/Kart Detayları Formatındaki Ürün Tanıtımı */}
          <div className="product-info-col" style={{ display: "flex", flexDirection: "column", gap: "36px", paddingTop: "12px" }}>

            {/* Bölüm 1: Ürün Başlığı & Sınıfı */}
            <div>
              <h1 className="product-title" style={{
                fontSize: "44px",
                fontWeight: "800",
                letterSpacing: "-0.02em",
                color: "#fff",
                margin: "0 0 8px 0"
              }}>
                {product.name}
              </h1>
              <p style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.65)",
                fontWeight: "500",
                margin: 0
              }}>
                {product.role}
              </p>
            </div>

            {/* Bölüm 2: Deneyim / Slogan & Açıklama */}
            <div>
              <h2 className="product-tagline" style={{
                fontSize: "28px",
                fontWeight: "700",
                letterSpacing: "-0.015em",
                color: "#fff",
                margin: "0 0 12px 0"
              }}>
                {product.tagline}
              </h2>
              <p style={{
                fontSize: "15px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: "1.75",
                fontWeight: "400",
                margin: 0
              }}>
                {product.description}
              </p>
            </div>

            {/* Bölüm 3: Sosyal Ağlar -> Satış Kanalları */}
            <div>
              <h2 style={{
                fontSize: "24px",
                fontWeight: "700",
                letterSpacing: "-0.015em",
                color: "#fff",
                margin: "0 0 20px 0"
              }}>
                Satış Kanalları
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-start" }}>
                {product.channels.map((channel, i) => (
                  <a
                    key={i}
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      textDecoration: "none",
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "16px",
                      fontWeight: "700",
                      transition: "color 0.2s ease",
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.color = "#fff"; }}
                    onMouseOut={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                  >
                    <span>{channel.name}</span>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} style={{ opacity: 0.7, color: "rgba(255,255,255,0.4)" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: "120px" }}
        >
          {/* Sekme Menüsü (Minimalist & Kurumsal) */}
          <div style={{
            display: "flex",
            gap: "28px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            paddingBottom: "16px",
            marginBottom: "32px",
            overflowX: "auto"
          }} className="product-tabs-bar">
            {[
              { id: "specs", label: "Teknik Parametreler" },
              { id: "diagram", label: "Bağlantı Şeması & Pinout" },
              { id: "docs", label: "Belgeler & İndirmeler" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.4)",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  paddingBottom: "12px",
                  position: "relative",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap"
                }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    style={{
                      position: "absolute",
                      bottom: "-1px",
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: "#fff",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Sekme İçerikleri */}
          <AnimatePresence mode="wait">
            {activeTab === "specs" && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="product-specs-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  columnGap: "80px",
                }}
              >
                {product.specs.map((spec, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.09)",
                    }}
                  >
                    <span style={{
                      fontSize: "14px", fontWeight: "500",
                      color: "rgba(255,255,255,0.65)",
                    }}>
                      {spec.label}
                    </span>
                    <span style={{
                      fontSize: "14px", fontWeight: "600",
                      color: "#fff",
                    }}>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "diagram" && (
              <motion.div
                key="diagram"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-8" 
                  style={{ padding: "20px 0" }}
                >
                  {/* Birinci Resim Alanı (Ön Yüz) */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16/10",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      padding: "20px"
                    }}>
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                        opacity: 0.4
                      }} />
                      
                      {/* Image Layer */}
                      <div className="absolute inset-0 p-8 flex items-center justify-center">
                        <Image 
                          src={product.pinout_images && product.pinout_images.length > 0 ? product.pinout_images[0] : `/img/diagrams/${id}-front.png`} 
                          alt={`${product.name} Ön Yüz Bağlantı Şeması`}
                          fill
                          className="object-contain opacity-90 transition-opacity duration-300"
                          style={{ padding: "32px" }}
                        />
                      </div>
                      
                      {/* Technical Blueprint styling inside frame */}
                      <div style={{
                        zIndex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        pointerEvents: "none"
                      }}>
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "rgba(255,255,255,0.2)" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 017.5 0z" />
                        </svg>
                        <span style={{
                          fontSize: "12px",
                          fontFamily: "var(--font-mono)",
                          color: "rgba(255,255,255,0.25)",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase"
                        }}>
                          Bağlantı Şeması (Ön Yüz)
                        </span>
                      </div>
                    </div>
                    <p style={{
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.4)",
                      fontFamily: "var(--font-mono)",
                      margin: 0,
                      textAlign: "center"
                    }}>
                      {product.name} Ön Yüz Şeması
                    </p>
                  </div>

                  {/* İkinci Resim Alanı (Arka Yüz / Pinout) */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16/10",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      padding: "20px"
                    }}>
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                        opacity: 0.4
                      }} />
                      
                      {/* Image Layer */}
                      <div className="absolute inset-0 p-8 flex items-center justify-center">
                        <Image 
                          src={product.pinout_images && product.pinout_images.length > 1 ? product.pinout_images[1] : `/img/diagrams/${id}-back.png`} 
                          alt={`${product.name} Arka Yüz Pinout Şeması`}
                          fill
                          className="object-contain opacity-90 transition-opacity duration-300"
                          style={{ padding: "32px" }}
                        />
                      </div>
                      
                      {/* Technical Blueprint styling inside frame */}
                      <div style={{
                        zIndex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        pointerEvents: "none"
                      }}>
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "rgba(255,255,255,0.2)" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 017.5 0z" />
                        </svg>
                        <span style={{
                          fontSize: "12px",
                          fontFamily: "var(--font-mono)",
                          color: "rgba(255,255,255,0.25)",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase"
                        }}>
                          Pinout Diyagramı (Arka Yüz)
                        </span>
                      </div>
                    </div>
                    <p style={{
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.4)",
                      fontFamily: "var(--font-mono)",
                      margin: 0,
                      textAlign: "center"
                    }}>
                      {product.name} Arka Yüz Pinout Planı
                    </p>
                  </div>
                </div>
              </motion.div>
            ) }

            {activeTab === "docs" && (
              <motion.div
                key="docs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  padding: "10px 0"
                }}>
                  {(product.downloads && product.downloads.length > 0 ? product.downloads : [
                    { title: "Kullanım Kılavuzu & Kurulum Rehberi", type: "PDF", size: "2.4 MB", desc: "Ayrıntılı montaj ve kalibrasyon talimatları." },
                    { title: "Teknik Çizim ve 3D STEP Modeli", type: "ZIP / CAD", size: "8.1 MB", desc: "Şasi entegrasyonu için endüstriyel 3D CAD dosyası." },
                    { title: "Orbit RTOS Firmware Güncellemesi (v1.4.2)", type: "HEX / BIN", size: "512 KB", desc: "En son kararlılık güncellemeleri ve hata düzeltmeleri." }
                  ]).map((doc: any, i: number) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "20px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "16px",
                        transition: "all 0.2s ease"
                      }}
                      className="download-item-row"
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "left" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                          <span style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#fff"
                          }}>
                            {doc.title || doc.name}
                          </span>
                          <span style={{
                            background: "rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "10px",
                            fontFamily: "var(--font-mono)",
                            fontWeight: "bold",
                            padding: "2px 8px",
                            borderRadius: "4px"
                          }}>
                            {doc.type}
                          </span>
                        </div>
                        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                          {doc.desc}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <span style={{ fontSize: "13px", fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
                          {doc.size}
                        </span>
                        <button
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "none",
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)"; }}
                          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                        >
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── 4. BÖLÜM: DİĞER ÜRÜNLER (Anasayfadaki Bire Bir Kart Tasarımı) ── */}
        <motion.div
          ref={salesRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: "30px" }}
        >
          {/* Başlık */}
          <div style={{
            display: "flex", alignItems: "baseline", justifyContent: "space-between",
            marginBottom: "40px",
          }}>
            <h2 style={{
              fontSize: "32px", fontWeight: "700",
              letterSpacing: "-0.02em", margin: 0,
            }}>
              Diğer Ürünlerimizi Keşfedin
            </h2>
          </div>

          {/* 3'lü Kart Izgarası */}
          <div className="product-recs-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "32px",
          }}>
            {recommendations.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                onClick={() => router.push(`/urunler/${item.id}`)}
                style={{ cursor: "pointer" }}
                className="group/card"
              >
                <div
                  className="bg-[#0d0d0d] border border-white/5 rounded-[48px] overflow-hidden transition-all hover:border-white/10 hover:bg-[#111] h-full"
                >
                  <div
                    className="flex flex-col h-full w-full"
                    style={{ padding: '40px' }}
                  >
                    {/* Kart Logosu */}
                    <div style={{ marginBottom: '32px' }}>
                      <div className="product-card-logo-box w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-4 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain filter brightness-125 p-4"
                        />
                      </div>
                    </div>

                    {/* Bilgiler */}
                    <div className="product-card-text-container flex flex-col" style={{ flexGrow: 1 }}>
                      <h3 className="text-white text-3xl font-bold tracking-tight" style={{ marginBottom: '20px' }}>
                        {item.name}
                      </h3>
                      <div style={{ marginBottom: '60px' }}>
                        <p className="text-white/90 text-xl font-medium" style={{ marginBottom: '10px' }}>{item.role}</p>
                        <p className="text-white/40 text-base leading-relaxed">{item.desc}</p>
                      </div>
                    </div>

                    {/* Buton */}
                    <div className="mt-auto">
                      <button className="w-full h-16 bg-white/5 group-hover/card:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/5 flex items-center justify-center gap-3 text-lg">
                        Detayları Görüntüle
                        <svg className="w-5 h-5 transition-transform group-hover/card:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── GERİ DÖN (Eşsiz & Hizalanmış) ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px" }}>
          <button
            onClick={() => router.push("/urunler")}
            className="btn-secondary"
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              cursor: "pointer", height: "40px", padding: "0 20px"
            }}
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ürünlere Geri Dön
          </button>
        </div>

      </div>

      {/* ── SOL ALT KÖŞE ÇEREZ KUTUSU STİLİ KAMPANYA WIDGET'I (Premium Web3 Tarzı) ── */}
      <AnimatePresence>
        {showPromo && (
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="product-promo-widget"
            style={{
              position: "fixed",
              bottom: "40px",
              left: "40px",
              zIndex: 9999,
              width: "300px",
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "28px",
              padding: "24px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Kapatma Butonu */}
            <button
              onClick={() => setShowPromo(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
              onMouseOut={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Büyük Teknofest Logosu */}
            <div style={{ marginTop: "8px", marginBottom: "20px", display: "flex", justifyContent: "center" }}>
              <img
                src="/img/tekno.png"
                alt="Teknofest"
                style={{
                  height: "60px",
                  objectFit: "contain",
                  filter: "brightness(1.15)",
                }}
              />
            </div>

            {/* Açıklama */}
            <p style={{
              fontSize: "13px",
              fontWeight: "500",
              color: "rgba(255,255,255,0.5)",
              lineHeight: "1.6",
              margin: "0 0 20px 0",
            }}>
              Teknofest dönemine özel, <strong>{product.name}</strong> ve tüm uçuş donanımlarımızda sepette <strong style={{ color: "#fff", fontWeight: "800" }}>%{product.teknofest_discount || "15"} indirim</strong> fırsatını kaçırmayın!
            </p>

            {/* Mini Buton */}
            <button
              onClick={() => setShowPromo(false)}
              style={{
                width: "100%",
                height: "44px",
                background: "#4060ff",
                color: "#fff",
                border: "none",
                borderRadius: "14px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 15px rgba(64,96,255,0.3)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#2a4bff";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(64,96,255,0.45)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#4060ff";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(64,96,255,0.3)";
              }}
            >
              Kapat
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
