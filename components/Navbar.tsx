"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

const SEARCH_DATABASE = {
  products: [
    { id: "f435", name: "Orbit F435", desc: "Uçuş Kontrol Sistemi — STM32F405 & Dual IMU", url: "/urunler/f435" },
    { id: "e50", name: "Orbit E50", desc: "50A 4-in-1 ESC — BLHeli_32 & 128K PWM Desteği", url: "/urunler/e50" },
    { id: "lrs", name: "Orbit LRS", desc: "2.4GHz ELRS Alıcı — 30km+ Menzil & 0.6g Hafiflik", url: "/urunler/lrs" },
    { id: "gps", name: "Orbit M10", desc: "GPS Modülü — Ublox M10 & Dual Pusula Teknolojisi", url: "/urunler/gps" },
    { id: "vtx", name: "Orbit Nebula", desc: "Video Verici — 1.2W Güç & SmartAudio Desteği", url: "/urunler/vtx" },
    { id: "frame", name: "Orbit X5", desc: "Carbon Fiber Frame — T700 Karbon & 5mm Kol Kalınlığı", url: "/urunler/frame" },
  ],
  blog: [
    { id: 1, title: "Yeni Nesil Kontrolcüler", desc: "Orbit F435 ile uçuş stabilitesi derin teknik analiz.", url: "/blog/1" },
    { id: 2, title: "Otonom Uçuş Yazılımları", desc: "Yapay zeka destekli otonom görev planlama vizyonu.", url: "/blog/2" },
    { id: 3, title: "Yerli Üretim ve Standartlar", desc: "Yüksek teknolojili ESC sistemlerinin üretim hikayesi.", url: "/blog/3" },
    { id: 4, title: "Uzun Menzilli LRS Haberleşme", desc: "30km+ askeri sınıf menzillerde parazit sıfırlama.", url: "/blog/4" },
  ],
  careers: [
    { id: 1, title: "Software Engineer (New Grand)", desc: "Ar-Ge / Yazılım Departmanı (İstanbul Hybrid)", url: "/kariyer" },
    { id: 2, title: "PCB Designer (New Grand)", desc: "Donanım / Üretim Departmanı (İstanbul Yerinde)", url: "/kariyer" },
    { id: 3, title: "Software Engineer (Python)", desc: "Ar-Ge / Yapay Zeka Departmanı (Ankara Hybrid)", url: "/kariyer" },
  ]
};

export default function Navbar() {
  const [lang, setLang] = useState("TR");
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchData, setSearchData] = useState({
    products: SEARCH_DATABASE.products,
    blog: SEARCH_DATABASE.blog,
    careers: SEARCH_DATABASE.careers
  });
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/v1/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSettings(data))
      .catch((err) => console.error("Navbar settings fetch error:", err));
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('http://127.0.0.1:8080/api/v1/products').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('http://127.0.0.1:8080/api/v1/blog').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('http://127.0.0.1:8080/api/v1/careers').then(r => r.ok ? r.json() : null).catch(() => null)
    ]).then(([productsData, blogsData, careersData]) => {
      setSearchData(prev => ({
        products: productsData && Array.isArray(productsData) && productsData.length > 0 ? productsData.map(p => ({
          id: p.id,
          name: p.name,
          desc: p.tagline || p.description || p.role,
          url: `/urunler/${p.id}`
        })) : prev.products,
        blog: blogsData && Array.isArray(blogsData) && blogsData.length > 0 ? blogsData.map(b => ({
          id: b.id,
          title: b.title,
          desc: b.lead_paragraph || b.category,
          url: `/blog/${b.id}`
        })) : prev.blog,
        careers: careersData && Array.isArray(careersData) && careersData.length > 0 ? careersData.map(c => ({
          id: c.id,
          title: c.title,
          desc: `${c.department} (${c.location})`,
          url: `/kariyer`
        })) : prev.careers
      }));
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleItemClick = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const query = searchQuery.trim().toLowerCase();
  const filteredProducts = query ? searchData.products.filter(item => 
    item.name.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)
  ) : [];
  const filteredBlog = query ? searchData.blog.filter(item => 
    item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)
  ) : [];
  const filteredCareers = query ? searchData.careers.filter(item => 
    item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)
  ) : [];

  const allResults = [
    ...filteredProducts.map(p => ({ ...p, url: p.url })),
    ...filteredBlog.map(b => ({ ...b, url: b.url })),
    ...filteredCareers.map(c => ({ ...c, url: c.url }))
  ];

  const hasResults = allResults.length > 0;

  useEffect(() => {
    setActiveIndex(hasResults ? 0 : -1);
  }, [searchQuery, hasResults]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!hasResults) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % allResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + allResults.length) % allResults.length);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < allResults.length) {
        e.preventDefault();
        const target = allResults[activeIndex];
        window.location.href = target.url;
        handleItemClick();
      }
    }
  };
  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Ana menü" style={{ zIndex: 100 }}>
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 99px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
          @media (max-width: 1024px) {
            .mobile-menu-toggle {
              display: flex !important;
            }
            .navbar-cta-blue {
              display: none !important;
            }
          }
        `}</style>
        <div className="navbar-left">
          <Link href="/" className="navbar-logo">
            <Image
              src={settings?.logo_url || "/img/logo.png"}
              alt="Orbit Teknoloji"
              width={90}
              height={27}
              priority
            />
          </Link>

          <ul className="navbar-links">
            <li><Link href="/">Ana Sayfa</Link></li>
            <li><Link href="/urunler">Ürünler</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/kariyer">Kariyer</Link></li>
            <li><Link href="/iletisim">İletişim</Link></li>
          </ul>
        </div>

        <div className="navbar-right">
          <div className="navbar-icon-group">
            {/* Search Slide-out Input */}
            <div ref={searchContainerRef} style={{ display: "flex", alignItems: "center", position: "relative" }}>
              <div
                style={{
                  width: isSearchOpen ? "min(380px, calc(100vw - 160px))" : "0px",
                  opacity: isSearchOpen ? 1 : 0,
                  overflow: "hidden",
                  transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Arama yapın..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  style={{
                    width: "100%",
                    height: "32px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "0.5px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "999px",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "0 14px",
                    outline: "none",
                    marginRight: "8px",
                    transition: "all 0.25s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  }}
                />
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsSearchOpen(!isSearchOpen);
                  if (isSearchOpen) {
                    setSearchQuery("");
                  } else {
                    setTimeout(() => {
                      searchInputRef.current?.focus();
                    }, 100);
                  }
                }}
                className="navbar-icon"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: isSearchOpen ? "#fff" : "var(--accents-7)",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.2s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseOut={(e) => {
                  if (!isSearchOpen) e.currentTarget.style.color = "var(--accents-7)";
                }}
                aria-label="Arama"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>

              {/* Arama Sonuçları Popover */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div
                  data-lenis-prevent
                  className="custom-scrollbar"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 22px)",
                    right: 0,
                    width: "calc(100vw - 32px)",
                    maxWidth: "420px",
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%), rgba(10, 10, 10, 0.96)",
                    backdropFilter: "blur(20px)",
                    border: "0.5px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "16px",
                    padding: "16px",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    zIndex: 100,
                    maxHeight: "380px",
                    overflowY: "auto",
                  }}
                >
                  {/* Popover Header with ESC Badge */}
                  <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "4px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>kapatmak için</span>
                      <span style={{
                        fontSize: "9px",
                        fontFamily: "var(--font-mono)",
                        color: "rgba(255,255,255,0.45)",
                        background: "rgba(255,255,255,0.06)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        fontWeight: "600",
                        textTransform: "uppercase"
                      }}>
                        esc
                      </span>
                    </div>
                  </div>

                  {/* Ürün Sonuçları */}
                  {filteredProducts.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <span style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em", textTransform: "uppercase" }}>ÜRÜNLER</span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        {filteredProducts.map((p, pIdx) => {
                          const globalIdx = pIdx;
                          const isActive = globalIdx === activeIndex;
                          return (
                            <Link 
                              key={p.id} 
                              href={p.url} 
                              onClick={handleItemClick}
                              onMouseOver={() => setActiveIndex(globalIdx)}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "8px 12px",
                                borderRadius: "8px",
                                textDecoration: "none",
                                background: isActive ? "rgba(255, 255, 255, 0.08)" : "transparent",
                                border: isActive ? "1.5px solid rgba(255, 255, 255, 0.06)" : "1.5px solid transparent",
                                transition: "all 0.2s ease"
                              }}
                            >
                              <span style={{ color: "#fff", fontSize: "13px", fontWeight: "600" }}>{p.name}</span>
                              <span style={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "11px", marginTop: "2px" }}>{p.desc}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Blog Sonuçları */}
                  {filteredBlog.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <span style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em", textTransform: "uppercase" }}>BLOG</span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        {filteredBlog.map((b, bIdx) => {
                          const globalIdx = filteredProducts.length + bIdx;
                          const isActive = globalIdx === activeIndex;
                          return (
                            <Link 
                              key={b.id} 
                              href={b.url} 
                              onClick={handleItemClick}
                              onMouseOver={() => setActiveIndex(globalIdx)}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "8px 12px",
                                borderRadius: "8px",
                                textDecoration: "none",
                                background: isActive ? "rgba(255, 255, 255, 0.08)" : "transparent",
                                border: isActive ? "1.5px solid rgba(255, 255, 255, 0.06)" : "1.5px solid transparent",
                                transition: "all 0.2s ease"
                              }}
                            >
                              <span style={{ color: "#fff", fontSize: "13px", fontWeight: "600" }}>{b.title}</span>
                              <span style={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "11px", marginTop: "2px" }}>{b.desc}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Kariyer Sonuçları */}
                  {filteredCareers.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <span style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em", textTransform: "uppercase" }}>KARİYER</span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        {filteredCareers.map((c, cIdx) => {
                          const globalIdx = filteredProducts.length + filteredBlog.length + cIdx;
                          const isActive = globalIdx === activeIndex;
                          return (
                            <Link 
                              key={c.id} 
                              href={c.url} 
                              onClick={handleItemClick}
                              onMouseOver={() => setActiveIndex(globalIdx)}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "8px 12px",
                                borderRadius: "8px",
                                textDecoration: "none",
                                background: isActive ? "rgba(255, 255, 255, 0.08)" : "transparent",
                                border: isActive ? "1.5px solid rgba(255, 255, 255, 0.06)" : "1.5px solid transparent",
                                transition: "all 0.2s ease"
                              }}
                            >
                              <span style={{ color: "#fff", fontSize: "13px", fontWeight: "600" }}>{c.title}</span>
                              <span style={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "11px", marginTop: "2px" }}>{c.desc}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Boş Durum (Empty State) */}
                  {!hasResults && (
                    <div style={{ padding: "16px 8px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "13px", fontWeight: "500" }}>Sonuç bulunamadı</span>
                      <span style={{ color: "rgba(255, 255, 255, 0.25)", fontSize: "11px", maxWidth: "260px", lineHeight: "1.4" }}>
                        Orbit'te aradığınız kriterlere uygun bir içerik bulunamadı.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Region / Language Dropdown */}
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="navbar-icon"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--accents-7)",
                  transition: "color 0.2s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "var(--fg)")}
                onMouseOut={(e) => {
                  if (!isOpen) e.currentTarget.style.color = "var(--accents-7)";
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <span>{lang}</span>
              </button>

              {isOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 22px)",
                    right: 0,
                    width: "140px",
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%), rgba(10, 10, 10, 0.92)",
                    backdropFilter: "blur(20px)",
                    border: "0.5px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "14px",
                    padding: "6px",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    zIndex: 100,
                  }}
                >
                  {["TR", "EN"].map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l);
                        setIsOpen(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        background: lang === l ? "rgba(255, 255, 255, 0.06)" : "transparent",
                        border: "none",
                        borderRadius: "8px",
                        color: lang === l ? "#fff" : "rgba(255, 255, 255, 0.5)",
                        fontSize: "13px",
                        fontWeight: lang === l ? "600" : "500",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = lang === l ? "rgba(255, 255, 255, 0.06)" : "transparent";
                        e.currentTarget.style.color = lang === l ? "#fff" : "rgba(255, 255, 255, 0.5)";
                      }}
                    >
                      <span>{l === "TR" ? "TR (Türkçe)" : "EN (English)"}</span>
                      {lang === l && <span style={{ color: "var(--blue-primary)", fontSize: "11px" }}>●</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Link href="#magaza" className="navbar-cta-blue">
            Mağaza
          </Link>

          {/* Mobil Hamburger Butonu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "#fff",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              position: "relative",
              zIndex: 101,
              marginLeft: "8px"
            }}
            className="mobile-menu-toggle"
            aria-label="Menüyü Aç/Kapat"
          >
            <div style={{ width: "20px", height: "14px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
              <span style={{
                width: "100%",
                height: "2px",
                background: "#fff",
                borderRadius: "99px",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: isMobileMenuOpen ? "translateY(6px) rotate(45deg)" : "none"
              }} />
              <span style={{
                width: "100%",
                height: "2px",
                background: "#fff",
                borderRadius: "99px",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                opacity: isMobileMenuOpen ? 0 : 1,
                transform: isMobileMenuOpen ? "scaleX(0)" : "none"
              }} />
              <span style={{
                width: "100%",
                height: "2px",
                background: "#fff",
                borderRadius: "99px",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: isMobileMenuOpen ? "translateY(-6px) rotate(-45deg)" : "none"
              }} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobil Fullscreen Overlay Menü (Tasarımı bozmadan viewport'a sabitleyen dış katman) */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(10, 10, 10, 0.98)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            zIndex: 99,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "32px",
              width: "100%",
              maxWidth: "320px"
            }}
          >
            {[
              { href: "/", label: "Ana Sayfa" },
              { href: "/urunler", label: "Ürünler" },
              { href: "/blog", label: "Blog" },
              { href: "/kariyer", label: "Kariyer" },
              { href: "/iletisim", label: "İletişim" }
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  color: "#fff",
                  fontSize: "26px",
                  fontWeight: "700",
                  letterSpacing: "-0.03em",
                  textDecoration: "none",
                  textTransform: "lowercase",
                  opacity: 0.85,
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "var(--blue-primary)";
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.opacity = "0.85";
                }}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="#magaza"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                width: "100%",
                textAlign: "center",
                marginTop: "16px",
                background: "var(--blue-primary)",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "600",
                padding: "12px 24px",
                borderRadius: "999px",
                textDecoration: "none",
                boxShadow: "0 10px 25px rgba(64, 96, 255, 0.3)",
                transition: "all 0.25s ease"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "var(--blue-hover)"}
              onMouseOut={(e) => e.currentTarget.style.background = "var(--blue-primary)"}
            >
              Mağaza
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
