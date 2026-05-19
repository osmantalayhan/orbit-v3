"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

const initialJobs = [
  {
    id: 1,
    title: "Software Engineer (New Grand)",
    department: "Ar-Ge / Yazılım",
    location: "İstanbul (Hybrid)",
    type: "Tam Zamanlı",
  },
  {
    id: 2,
    title: "PCB Designer (New Grand)",
    department: "Donanım / Üretim",
    location: "İstanbul (Yerinde)",
    type: "Tam Zamanlı",
  },
  {
    id: 3,
    title: "Software Engineer (Python)",
    department: "Ar-Ge / Yapay Zeka",
    location: "Ankara (Hybrid)",
    type: "Tam Zamanlı",
  },
];

// ==========================================
// 1. ARAMA VE LİSTELEME BÖLÜMÜ (Ayrı Bileşen)
// State buraya hapsedildi; böylece yazılan harfler ana sayfayı re-render etmeyecek.
// ==========================================
function JobListSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredJobs = initialJobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="job-list-section" style={{ width: '100%', marginTop: '60px', marginBottom: '140px' }}>

      {/* Başlık ve Arama Kutusu Yan Yana */}
      <div className="job-search-row" style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '48px'
      }}>
        {/* Arama Başlığı */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="job-search-title"
          style={{
            fontSize: '44px',
            fontWeight: '700',
            letterSpacing: '-0.03em',
            margin: 0,
            textTransform: 'lowercase'
          }}
        >
          açık pozisyonları arayın.
        </motion.h2>

        {/* Arama Kutusu (Search Bar) */}
        <motion.div
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
            placeholder="Pozisyon, departman veya konum arayın..."
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

      {/* İlan Kartları Listesi */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="job-card"
              style={{
                cursor: 'pointer',
                backgroundColor: '#0d0d0d',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '24px',
                padding: '32px 40px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.backgroundColor = '#111';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.backgroundColor = '#0d0d0d';
              }}
            >
              {/* Sol Taraf: İlan Başlığı ve Departmanı */}
              <div className="job-card-left" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#fff',
                  letterSpacing: '-0.02em',
                  margin: 0
                }}>
                  {job.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: '500' }}>
                    {job.department}
                  </span>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: '500' }}>
                    {job.type}
                  </span>
                </div>
              </div>

              {/* Sağ Taraf: Konum ve Ok Butonu */}
              <div className="job-card-right" style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', fontWeight: '600' }}>
                  {job.location}
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.3s ease'
                }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '15px' }}>
            Aradığınız kriterlere uygun açık pozisyon bulunamadı.
          </div>
        )}
      </div>

    </div>
  );
}

// ==========================================
// 2. GENEL BAŞVURU FORMU (Ayrı Bileşen)
// ==========================================
function GeneralApplicationSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // Gönderim durumu eklendi
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true); // Gönderim durumunu aktif ediyoruz
  };

  return (
    <div className="genel-basvuru-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '100px',
      alignItems: 'start',
      width: '100%'
    }}>

      {/* Sol Sütun: Başlık & Açıklama */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="genel-basvuru-title" style={{
          fontSize: '54px',
          fontWeight: '700',
          lineHeight: '1.05',
          letterSpacing: '-0.03em',
          margin: '0 0 24px 0',
          textTransform: 'lowercase'
        }}>
          genel <br />
          başvuru.
        </h2>

        <p style={{
          fontSize: '16px',
          color: 'rgba(255,255,255,0.4)',
          fontWeight: '500',
          lineHeight: '1.6',
          maxWidth: '380px',
          margin: 0
        }}>
          Açık ilanlar arasında size uygun bir pozisyon bulamadıysanız, genel yeteneklerinizi ve CV'nizi bizimle paylaşın. Ekibimiz mutlaka inceleyecektir.
        </p>
      </motion.div>

      {/* Sağ Sütun: Form veya Başarı Bildirimi */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '24px',
              padding: '60px 40px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              minHeight: '400px'
            }}
          >
            {/* Orbit Mavisinde Parlayan Check İkonu */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(64, 96, 255, 0.1)',
              border: '1px solid rgba(64, 96, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4060ff',
              boxShadow: '0 0 30px rgba(64, 96, 255, 0.2)'
            }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#fff',
              letterSpacing: '-0.02em',
              margin: 0,
              textTransform: 'lowercase'
            }}>
              başvurunuz alındı.
            </h3>
            <p style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: '1.6',
              maxWidth: '320px',
              margin: 0
            }}>
              özgeçmişiniz ve bilgileriniz ekibimize ulaştı. en kısa sürede dönüş sağlayacağız.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Satır 1: İsim Soyisim & Meslek */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,0.4)' }}>İsim Soyisim</label>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '14px',
                    height: '52px',
                    padding: '0 18px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '15px'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,0.4)' }}>Meslek</label>
                <input
                  type="text"
                  placeholder="Software Developer"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '14px',
                    height: '52px',
                    padding: '0 18px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '15px'
                  }}
                />
              </div>
            </div>

            {/* Satır 2: Employment Type & LinkedIn */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,0.4)' }}>Employment Type</label>
                <div style={{ position: 'relative' }}>
                  <select style={{
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '14px',
                    height: '52px',
                    padding: '0 18px',
                    color: 'rgba(255,255,255,0.4)',
                    outline: 'none',
                    fontSize: '15px',
                    cursor: 'pointer',
                    appearance: 'none',
                    colorScheme: 'dark'
                  }}>
                    <option style={{ backgroundColor: '#111', color: '#fff' }}>Select...</option>
                    <option style={{ backgroundColor: '#111', color: '#fff' }}>Tam Zamanlı</option>
                    <option style={{ backgroundColor: '#111', color: '#fff' }}>Yarı Zamanlı</option>
                    <option style={{ backgroundColor: '#111', color: '#fff' }}>Stajyer</option>
                  </select>
                  <div style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.3 }}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,0.4)' }}>LinkedIn URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '14px',
                    height: '52px',
                    padding: '0 18px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '15px'
                  }}
                />
              </div>
            </div>

            {/* Satır 3: CV Yükleme Alanı */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,0.4)' }}>CV (Özgeçmiş Yükle)</label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
              />

              <div
                onClick={triggerFileSelect}
                style={{
                  border: '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255,255,255,0.01)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)';
                }}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ opacity: 0.4 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>

                <div style={{ fontSize: '14px', fontWeight: '600', color: selectedFile ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                  {selectedFile ? selectedFile.name : "CV dosyanızı sürükleyin veya seçmek için tıklayın"}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                  PDF, DOC, DOCX (Max: 10MB)
                </div>
              </div>
            </div>

            {/* Gönder Butonu */}
            <button className="genel-basvuru-btn" style={{
              height: '48px',
              width: '180px',
              alignSelf: 'flex-end',
              backgroundColor: '#4060ff',
              color: '#fff',
              fontWeight: '700',
              borderRadius: '12px',
              border: 'none',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '10px',
              boxShadow: '0 10px 20px rgba(64, 96, 255, 0.15)'
            }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#3852de')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4060ff')}
            >
              Başvuruyu Gönder
            </button>

          </form>
        )}
      </motion.div>

    </div>
  );
}

// ==========================================
// 3. ANA SAYFA BİLEŞENİ (Page Component)
// ==========================================
export default function KariyerPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @media (max-width: 1024px) {
          .kariyer-hero-row {
            min-height: auto !important;
            margin-bottom: 80px !important;
          }
          .kariyer-uav-container {
            left: 45% !important;
          }
          .job-list-section {
            margin-bottom: 80px !important;
          }
          .genel-basvuru-grid {
            gap: 60px !important;
          }
        }
        @media (max-width: 768px) {
          .page-container {
            padding-top: 120px !important;
            padding-bottom: 60px !important;
          }
          .kariyer-hero-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            min-height: auto !important;
            margin-bottom: 60px !important;
            gap: 40px !important;
          }
          .kariyer-hero-left {
            width: 100% !important;
          }
          .kariyer-hero-title {
            font-size: 42px !important;
          }
          .kariyer-uav-container {
            position: relative !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            margin-top: 20px !important;
            transform: none !important;
          }
          .kariyer-uav-container > div {
            width: 100% !important;
          }
          .job-list-section {
            margin-top: 40px !important;
            margin-bottom: 60px !important;
          }
          .job-search-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
            margin-bottom: 24px !important;
          }
          .job-search-title {
            font-size: 28px !important;
          }
          .job-card {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 24px !important;
            gap: 20px !important;
          }
          .job-card-left h3 {
            font-size: 20px !important;
          }
          .job-card-right {
            width: 100% !important;
            justify-content: space-between !important;
            gap: 16px !important;
          }
          .genel-basvuru-grid {
            gap: 40px !important;
            grid-template-columns: 1fr !important;
          }
          .genel-basvuru-title {
            font-size: 32px !important;
            margin-bottom: 16px !important;
          }
          .genel-basvuru-title br {
            display: none !important;
          }
          .genel-basvuru-btn {
            width: 100% !important;
            align-self: center !important;
          }
        }
      `}</style>

      {/* page-container: Navbar ile tam hizada olan standart sayfa taşıyıcımız */}
      <div className="page-container" style={{
        paddingTop: '180px',
        paddingBottom: '120px',
        zIndex: 10
      }}>

        {/* 1. KISIM: İHA ve Slogan Alanı */}
        <div className="kariyer-hero-row" style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          width: '100%',
          minHeight: '500px',
          marginBottom: '120px'
        }}>

          {/* Sol Taraf: Marka Sloganımız */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="kariyer-hero-left"
            style={{
              zIndex: 12,
              flexShrink: 0
            }}
          >
            <h1 className="kariyer-hero-title" style={{
              fontSize: '74px',
              fontWeight: '700',
              lineHeight: '0.95',
              letterSpacing: '-0.04em',
              margin: 0,
              textTransform: 'lowercase'
            }}>
              bu kariyer <br />
              göklere <br />
              değer.
            </h1>
          </motion.div>

          {/* Sağ Taraf: Sınırları Olmayan ve Yazıya Yaklaşan Devasa İHA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: 18 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 18
            }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="kariyer-uav-container"
            style={{
              position: 'absolute',
              right: '-10%',
              left: '35%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          >
            <div style={{
              width: '115%',
              display: 'flex',
              // drop-shadow filtresi GPU yükünü sıfırlamak için tamamen kaldırıldı!
            }}>
              <img
                src="/img/uav.png"
                alt="Orbit UAV"
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

        {/* 2. KISIM: Arama ve İlan Listeleme Bölümü (Kendi İçinde İzole) */}
        <JobListSection />

        {/* 3. KISIM: Genel Başvuru Formu (Kendi İçinde İzole) */}
        <GeneralApplicationSection />

      </div>
    </main>
  );
}
