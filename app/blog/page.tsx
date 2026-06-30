"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, User, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { apiClient } from "@/lib/api";

// Mock data removed at user request

const CARDS_PER_PAGE = 6;

// ==========================================================
// BLOG ARAMA, GRID LİSTELEME VE SAYFALAMA BÖLÜMÜ
// ==========================================================
function BlogListSection() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          // Taslak olanları (active: false) kullanıcılardan gizle
          const activeData = data.filter((b: any) => b.active !== false);
          
          const mapped = activeData.map((b: any) => ({
            id: b.id,
            title: b.title,
            excerpt: b.lead_paragraph || b.category,
            date: b.date_published,
            image: b.cover_image || "/img/placeholder.png"
          }));
          setBlogs(mapped);
        }
      })
      .catch(err => console.error("Error fetching blogs for list:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Arama filtresi uyguluyoruz
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toplam sayfa sayısını buluyoruz
  const totalPages = Math.ceil(filteredBlogs.length / CARDS_PER_PAGE);

  // Sayfalama aralığını belirliyoruz
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + CARDS_PER_PAGE);

  // Arama sorgusu değiştiğinde sayfayı her zaman 1. sayfaya sıfırlıyoruz
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Sayfa değiştiğinde listenin başına yumuşak bir şekilde kaydırıyoruz
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    if (sectionRef.current) {
      // 100px ofset vererek navbar'ın altına tam hizalanmasını sağlıyoruz
      const yOffset = -100; 
      const element = sectionRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div ref={sectionRef} className="blog-list-section" style={{ width: '100%', marginTop: '60px', marginBottom: '40px' }}>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        .skeleton-box {
          animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          background-color: rgba(255,255,255,0.05);
        }
      `}</style>
      
      {/* Başlık ve Arama Kutusu Yan Yana */}
      <div className="blog-section-header" style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '60px'
      }}>
        {/* Başlık */}
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ 
            fontSize: '44px', 
            fontWeight: '700', 
            letterSpacing: '-0.03em', 
            margin: 0,
            textTransform: 'lowercase'
          }}
        >
          tüm yayınlar.
        </motion.h2>

        {/* Arama Kutusu (Search Bar) */}
        <motion.div 
          className="blog-search-container"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{ 
            position: 'relative', 
            maxWidth: '420px', 
            width: '100%'
          }}
        >
          <input 
            type="text"
            placeholder="Yayınlarda arayın..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '99px',
              padding: '0 54px 0 24px',
              color: '#fff',
              fontSize: '15px',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
            }}
          />
          {/* Arama İkonu */}
          <div style={{ 
            position: 'absolute', 
            right: '20px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            pointerEvents: 'none',
            opacity: 0.4
          }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* 3 Sütunlu Grid Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={`skeleton-${i}`} className="bg-[#0d0d0d] border border-white/5 rounded-[32px] overflow-hidden h-full flex flex-col" style={{ minHeight: '400px' }}>
              <div className="skeleton-box relative aspect-[16/10] overflow-hidden w-full" />
              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div className="skeleton-box" style={{ width: "30%", height: "12px", marginBottom: "16px", borderRadius: "4px" }} />
                <div className="skeleton-box" style={{ width: "90%", height: "24px", marginBottom: "8px", borderRadius: "4px" }} />
                <div className="skeleton-box" style={{ width: "70%", height: "24px", marginBottom: "24px", borderRadius: "4px" }} />
                <div className="skeleton-box" style={{ width: "100%", height: "14px", marginTop: "auto", borderRadius: "4px" }} />
                <div className="skeleton-box" style={{ width: "80%", height: "14px", marginTop: "8px", borderRadius: "4px" }} />
              </div>
            </div>
          ))
        ) : paginatedBlogs.length > 0 ? (
          paginatedBlogs.map((blog, index) => (
            <Link 
              href={`/blog/${blog.id}`} 
              key={blog.id} 
              style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', color: 'inherit' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: (index % CARDS_PER_PAGE) * 0.05,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="group cursor-pointer"
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
              <div 
                className="bg-[#0d0d0d] border border-white/5 rounded-[32px] overflow-hidden transition-all hover:border-white/10 hover:bg-[#111] h-full flex flex-col"
              >
                {/* Large Blog Image */}
                <div className="relative aspect-[16/10] overflow-hidden w-full">
                  <Image 
                    src={blog.image} 
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Blog Info */}
                <div 
                  style={{ 
                    padding: '32px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    flexGrow: 1 
                  }}
                >
                  <span 
                    style={{ 
                      color: 'rgba(255,255,255,0.3)', 
                      fontSize: '12px', 
                      fontWeight: 'bold', 
                      letterSpacing: '0.1em', 
                      textTransform: 'uppercase',
                      marginBottom: '16px' 
                    }}
                  >
                    {blog.date}
                  </span>
                  
                  <h3 
                    className="group-hover:text-blue-400 transition-colors"
                    style={{ 
                      color: 'white', 
                      fontSize: '30px', 
                      fontWeight: 'bold', 
                      lineHeight: '1.2',
                      letterSpacing: '-0.025em',
                      marginBottom: '20px' 
                    }}
                  >
                    {blog.title}
                  </h3>
                  
                  <p 
                    className="line-clamp-2"
                    style={{ 
                      color: 'rgba(255,255,255,0.4)', 
                      fontSize: '16px', 
                      lineHeight: '1.625', 
                      marginBottom: '24px' 
                    }}
                  >
                    {blog.excerpt}
                  </p>
                  
                  <div 
                    className="group/link"
                    style={{ 
                      marginTop: 'auto', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      color: 'rgba(255,255,255,0.8)', 
                      fontSize: '14px', 
                      fontWeight: 'bold' 
                    }}
                  >
                    <span>Devamını Oku</span>
                    <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '15px' }}>
            Aradığınız kriterlere uygun makale bulunamadı.
          </div>
        )}
      </div>

      {/* LÜKS GLASSMORPHIC SAYFALAMA SİSTEMİ (Pagination) */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '70px'
        }}>
          {/* Önceki Sayfa Butonu */}
          <button
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.25 : 0.7,
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.opacity = '1';
              }
            }}
            onMouseOut={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.opacity = '0.7';
              }
            }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Sayfa Numaraları */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
            const isActive = pageNumber === currentPage;
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#4060ff' : 'rgba(255,255,255,0.02)',
                  border: isActive ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  opacity: isActive ? 1 : 0.7,
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? '0 10px 20px rgba(64, 96, 255, 0.2)' : 'none'
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.opacity = '1';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.opacity = '0.7';
                  }
                }}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Sonraki Sayfa Butonu */}
          <button
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.25 : 0.7,
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.opacity = '1';
              }
            }}
            onMouseOut={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.opacity = '0.7';
              }
            }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

    </div>
  );
}

// ==========================================
// ANA SAYFA BİLEŞENİ (Page Component)
// ==========================================
export default function BlogPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @media (max-width: 991px) {
          .blog-hero {
            flex-direction: column !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
            min-height: auto !important;
            margin-bottom: 60px !important;
            gap: 40px !important;
          }
          .blog-hero-text {
            width: 100% !important;
            text-align: left !important;
          }
          .blog-hero-text h1 {
            font-size: 48px !important;
            line-height: 1.05 !important;
          }
          .blog-hero-img-container {
            position: relative !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            margin-top: 20px !important;
            display: flex !important;
            justify-content: center !important;
            transform: none !important;
          }
          .blog-hero-img-container img {
            max-width: 450px !important;
            width: 100% !important;
            height: auto !important;
          }
        }
        @media (max-width: 768px) {
          .blog-page-container {
            padding-top: 100px !important;
          }
          .blog-hero {
            margin-bottom: 30px !important;
            gap: 20px !important;
          }
          .blog-section-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
            margin-bottom: 24px !important;
          }
          .blog-list-section {
            margin-top: 20px !important;
            margin-bottom: 40px !important;
          }
          .blog-search-container {
            max-width: 100% !important;
          }
          .blog-hero-text h1 {
            font-size: 40px !important;
            line-height: 1.1 !important;
          }
        }
        @media (max-width: 480px) {
          .blog-hero-text h1 {
            font-size: 38px !important;
          }
        }
      `}</style>
      
      {/* page-container: Navbar ile tam hizada olan standart sayfa taşıyıcımız */}
      <div className="page-container blog-page-container" style={{ 
        paddingTop: '180px', 
        paddingBottom: '20px',
        zIndex: 10
      }}>
        
        {/* 1. KISIM: Sol Yazı ve Sağ Devasa Resim */}
        <div className="blog-hero" style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          width: '100%',
          minHeight: '460px',
          marginBottom: '80px'
        }}>
          
          {/* Sol Taraf: Marka Sloganımız */}
          <motion.div
            className="blog-hero-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              zIndex: 12,
              flexShrink: 0
            }}
          >
            <h1 style={{
              fontSize: '74px',
              fontWeight: '700',
              lineHeight: '0.95',
              letterSpacing: '-0.04em',
              margin: 0
            }}>
              Insights & <br />
              Gelişmeler.
            </h1>
          </motion.div>

          {/* Sağ Taraf: Sınırları Olmayan Devasa Blog Görseli */}
          <motion.div
            className="blog-hero-img-container"
            initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: -5
            }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              position: 'absolute',
              right: '-5%', 
              left: '40%',   
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          >
            <div style={{
              width: '90%',
              display: 'flex',
            }}>
              <img
                src="/img/blog.png"
                alt="Orbit Blog"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
          </motion.div>

        </div>

        {/* 2. KISIM: Blog Arama ve 3 Sütunlu Grid Listeleme (Anasayfa Tasarımıyla Bire Bir Aynı) */}
        <BlogListSection />
        
      </div>
    </main>
  );
}
