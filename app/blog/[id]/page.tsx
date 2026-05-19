"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Detaylı makale içerikleri
const blogDetails: Record<string, {
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  leadParagraph: string;
  bodyParagraphs: Array<{ type: "text" | "subtitle" | "quote" | "spec-table"; content: any }>;
  author: { name: string; role: string; avatar: string };
}> = {
  "1": {
    title: "İnsansız Hava Araçlarında Yeni Nesil Kontrolcüler",
    category: "Donanım / Ar-Ge",
    date: "24 nisan 2024",
    readTime: "5 dk okuma",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200",
    leadParagraph: "Uçuş stabilitesini %40 artıran çift IMU teknolojisi, yerli ve milli İHA sistemlerimizin rüzgar mukavemeti ve görev kararlılığında yeni bir çağ başlatıyor.",
    author: {
      name: "Osman Talayhan",
      role: "Donanım Ar-Ge Mühendisi",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
    },
    bodyParagraphs: [
      { type: "text", content: "Endüstriyel ve askeri sınıf otonom İHA görevlerinde karşılaşılan en büyük zorluklardan biri, rüzgar darbeleri ve motor titreşimlerinin uçuş kontrol sensörleri üzerinde yarattığı kararsızlıktır. Geleneksel tek IMU (Inertial Measurement Unit) sistemleri, bu gürültü sinyallerini süzmekte yetersiz kalabilmekte ve uçuş güvenliğini riske atmaktadır." },
      { type: "subtitle", content: "Çift IMU ve Akıllı Gürültü Filtreleme" },
      { type: "text", content: "Orbit F435 Uçuş Kontrol Kartı, birbirine 90 derece açıyla yerleştirilmiş çift yedekli askeri sınıf IMU sensör mimarisinden beslenir. Gerçek zamanlı çalışan Kalman Filtresi algoritmalarımız, her iki sensörden gelen verileri milisaniyeler içinde işler. Bir sensördeki gürültü veya sapma toleransı aşarsa, diğeri anında devreye girerek uçağın havada milimetrik olarak asılı kalmasını sağlar." },
      { type: "quote", content: "Yaptığımız rüzgar tüneli testlerinde, 45 knot hıza kadar olan ani rüzgar darbe testlerinde stabilite kaybının tamamen sıfıra indirildiğini raporladık." },
      { type: "subtitle", content: "Teknik Donanım Özellikleri" },
      { type: "text", content: "Yeni F435 serisi, sadece sensör düzeyinde değil, güç katmanlarında da tamamen izole edilmiş bir koruma sunar. Aşağıdaki tablodan donanım bileşenlerinin detaylı parametrelerine erişebilirsiniz." },
      { type: "spec-table", content: [
        { label: "İşlemci", value: "STM32F405 ARM Cortex-M4 @ 168MHz" },
        { label: "IMU Sensörleri", value: "Dual ICM-42688-P (Yedekli ve İzole)" },
        { label: "Barometre", value: "SPL06-001 Yüksek Hassasiyetli" },
        { label: "Giriş Voltajı", value: "2S - 8S LiPo Giriş Desteği" },
        { label: "Kara Kutu Bellek", value: "16MB Onboard Flash Bellek" }
      ]}
    ]
  },
  "2": {
    title: "Otonom Uçuş Yazılımlarının Geleceği",
    category: "Yazılım / Yapay Zeka",
    date: "18 nisan 2024",
    readTime: "7 dk okuma",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    leadParagraph: "Yapay zeka ve makine öğrenimi tabanlı yeni otonom yazılım ekosistemimiz, İHA'ların zorlu rüzgarları ve dinamik engelleri gerçek zamanlı tahmin ederek görev planlamasını optimize etmesini sağlıyor.",
    author: {
      name: "Cem Karayel",
      role: "Yazılım Ekip Lideri",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
    },
    bodyParagraphs: [
      { type: "text", content: "Otonom uçuş, yalnızca önceden belirlenmiş GPS noktalarını (waypoint) takip etmekten ibaret değildir. Operasyon anında karşınıza çıkabilecek engeller, anlık hava akımları veya radar sinyal bozulmaları, İHA'ların gerçek zamanlı karar verme yeteneğine sahip olmasını zorunlu kılar." },
      { type: "subtitle", content: "Derin Öğrenme ile Dinamik Rota Planlama" },
      { type: "text", content: "Geliştirdiğimiz Orbit AI yazılım motoru, donanım kartımızda gömülü olarak çalışan hafifletilmiş yapay zeka modelleri kullanır. İHA üzerindeki sensörler ve kameralar aracılığıyla toplanan anlık çevresel veriler, en verimli rotanın saniyede 30 kare hızla yeniden çizilmesini sağlar." },
      { type: "quote", content: "Akıllı batarya yönetim algoritmalarıyla birleştiğinde, rota optimizasyonu uçuş süresini ortalama %18 oranında uzatıyor." },
      { type: "subtitle", content: "Sistem Modülleri ve Yazılım Katmanları" },
      { type: "spec-table", content: [
        { label: "İşletim Sistemi", value: "Orbit Real-Time RTOS (Gecikmesiz)" },
        { label: "Yapay Zeka Motoru", value: "TensorFlow Lite Gömülü Entegrasyon" },
        { label: "Engel Algılama", value: "3D Lidar ve Stereoskopik Görüş Desteği" },
        { label: "Sürü İHA İletişimi", value: "Ad-Hoc Protokolü ile Peer-to-Peer" }
      ]}
    ]
  },
  "3": {
    title: "Yerli Üretim ve Küresel Standartlar",
    category: "Üretim / Kalite",
    date: "12 nisan 2024",
    readTime: "6 dk okuma",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
    leadParagraph: "Türkiye'nin teknolojik bağımsızlığı yolunda, askeri standartlarda (MIL-STD-810G) ürettiğimiz ESC ve uçuş kontrolörlerinin üretim süreçleri ve zorlu test laboratuvarları.",
    author: {
      name: "Elif Demir",
      role: "Üretim ve Kalite Direktörü",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
    },
    bodyParagraphs: [
      { type: "text", content: "Savunma sanayi donanımları, tüketici elektroniğinden tamamen farklı koşullarda çalışmak üzere tasarlanmalıdır. Nemli tuzlu havalar, -40 dereceden +85 dereceye uzanan sıcaklık şokları ve yüksek titreşim altında tek bir lehim noktasının dahi kopmaması hayati öneme sahiptir." },
      { type: "subtitle", content: "Yüksek Teknoloji SMT Üretim Hattı" },
      { type: "text", content: "Ankara tesislerimizde kurduğumuz tam otonom SMT montaj hattımızda, her lehim noktası otomatik X-ray (AXI) cihazlarıyla mikron düzeyinde taranır. Kartların yüzeyleri neme ve toza karşı özel askeri sınıf Conformal Coating kaplama kimyasallarıyla korunur." },
      { type: "quote", content: "Üretilen her bir ESC kartı, montaj öncesinde 48 saatlik yüksek sıcaklık yaşlandırma (burn-in) testine tabi tutularak erken arıza riskleri sıfırlanmaktadır." },
      { type: "spec-table", content: [
        { label: "Sertifikasyon", value: "MIL-STD-810G / IPC-A-610 Class 3" },
        { label: "Çalışma Sıcaklığı", value: "-40°C ila +85°C Endüstriyel Sınır" },
        { label: "Kaplama Tipi", value: "Askeri Silikon Bazlı Conformal Coating" },
        { label: "Lehimleme Tipi", value: "Yüksek Mukavemetli Kurşunsuz Alaşım" }
      ]}
    ]
  }
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "1";

  // Eğer dinamik id bulunamazsa, kullanıcıya varsayılan olarak 1. makaleyi gösteriyoruz
  const currentBlog = blogDetails[id] || blogDetails["1"];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @media (max-width: 768px) {
          .page-container {
            padding-top: 120px !important;
            padding-bottom: 40px !important;
          }
          .blog-detail-breadcrumb {
            margin-bottom: 12px !important;
          }
          .blog-detail-title {
            font-size: 32px !important;
            margin-bottom: 32px !important;
          }
          .blog-detail-image-box {
            border-radius: 16px !important;
            margin-bottom: 32px !important;
          }
          .blog-detail-meta {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
            padding: 20px 0 !important;
            margin-bottom: 32px !important;
          }
          .blog-detail-lead {
            font-size: 18px !important;
            line-height: 1.55 !important;
            margin-bottom: 8px !important;
          }
          .blog-detail-sub {
            font-size: 22px !important;
            margin-top: 24px !important;
          }
          .blog-detail-quote {
            font-size: 16px !important;
            padding-left: 16px !important;
            margin: 20px 0 !important;
          }
          .blog-detail-table-card {
            padding: 20px !important;
            border-radius: 16px !important;
            margin-top: 16px !important;
            margin-bottom: 16px !important;
          }
          .blog-detail-table-card td {
            font-size: 13px !important;
            padding: 10px 0 !important;
          }
        }
      `}</style>
      
      {/* page-container: Navbar ile tam hizada olan standart sayfa taşıyıcımız */}
      <div className="page-container" style={{ 
        paddingTop: '160px', 
        paddingBottom: '20px',
        zIndex: 10
      }}>
        
        {/* Kategori Linki (Breadcrumb) - SADECE küçük harfli, araları açık olmayan, doğal font spacing */}
        <div className="blog-detail-breadcrumb" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          fontSize: '15px',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '20px',
          textTransform: 'lowercase',
          fontWeight: '500'
        }}>
          <span>blog</span>
          <span style={{ opacity: 0.3 }}>/</span>
          <span style={{ color: '#fff' }}>{currentBlog.category}</span>
        </div>

        {/* Büyük Merkezlenmiş Başlık */}
        <h1 className="blog-detail-title" style={{
          fontSize: '54px',
          fontWeight: '700',
          lineHeight: '1.1',
          letterSpacing: '-0.03em',
          textAlign: 'center',
          maxWidth: '900px',
          margin: '0 auto 60px auto',
          color: '#fff'
        }}>
          {currentBlog.title}
        </h1>

        {/* SADECE GÖRSEL (Sağdaki alan tamamen kaldırıldı) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="blog-detail-image-box"
          style={{
            width: '100%',
            aspectRatio: '16/9', // Muazzam, ferah, standart sinematik kapak oranı
            borderRadius: '32px',
            overflow: 'hidden',
            backgroundColor: '#0d0d0d',
            border: '1px solid rgba(255,255,255,0.05)',
            position: 'relative',
            marginBottom: '60px'
          }}
        >
          <img 
            src={currentBlog.image} 
            alt={currentBlog.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </motion.div>

        {/* METADATA ÇİZGİSİ VE YAZAR ALANI */}
        <div className="blog-detail-meta" style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          padding: '24px 0',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '800px',
          margin: '0 auto 60px auto'
        }}>
          {/* Sol Taraf: Yazar Bilgisi */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative'
            }}>
              <img 
                src={currentBlog.author.avatar} 
                alt={currentBlog.author.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{currentBlog.author.name}</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>{currentBlog.author.role}</span>
            </div>
          </div>

          {/* Sağ Taraf: Tarih ve Okuma Süresi */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>
            <span>{currentBlog.date}</span>
            <span style={{ opacity: 0.3 }}>•</span>
            <span>{currentBlog.readTime}</span>
          </div>
        </div>

        {/* BLOG MAKALE İÇERİĞİ (800px Genişliğinde Lüks Tipografi) */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          
          {/* Giriş (Lead) Paragrafı - Büyük ve Vurgulu */}
          <p className="blog-detail-lead" style={{
            fontSize: '22px',
            color: '#fff',
            lineHeight: '1.6',
            fontWeight: '500',
            letterSpacing: '-0.01em',
            margin: '0 0 16px 0'
          }}>
            {currentBlog.leadParagraph}
          </p>

          {/* Blok Paragraflar */}
          {currentBlog.bodyParagraphs.map((block, idx) => {
            if (block.type === "subtitle") {
              return (
                <h2 key={idx} className="blog-detail-sub" style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#fff',
                  letterSpacing: '-0.025em',
                  marginTop: '32px',
                  marginBottom: '8px'
                }}>
                  {block.content}
                </h2>
              );
            }

            if (block.type === "quote") {
              return (
                <blockquote key={idx} className="blog-detail-quote" style={{
                  borderLeft: '3px solid rgba(255,255,255,0.3)',
                  paddingLeft: '24px',
                  margin: '24px 0',
                  fontSize: '20px',
                  lineHeight: '1.6',
                  color: 'rgba(255,255,255,0.85)',
                  fontStyle: 'italic',
                  fontWeight: '500'
                }}>
                  "{block.content}"
                </blockquote>
              );
            }

            if (block.type === "spec-table") {
              return (
                <div key={idx} className="blog-detail-table-card" style={{
                  backgroundColor: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '24px',
                  padding: '30px',
                  marginTop: '24px',
                  marginBottom: '24px'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {block.content.map((row: any, rIdx: number) => (
                        <tr key={rIdx} style={{
                          borderBottom: rIdx === block.content.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)'
                        }}>
                          <td style={{ padding: '14px 0', fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.4)', width: '35%' }}>
                            {row.label}
                          </td>
                          <td style={{ padding: '14px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }

            // Standart Paragraf
            return (
              <p key={idx} style={{
                fontSize: '17px',
                color: 'rgba(255,255,255,0.6)',
                lineHeight: '1.82',
                fontWeight: '500',
                margin: 0
              }}>
                {block.content}
              </p>
            );
          })}

          {/* Geri Dön Butonu */}
          <div style={{
            marginTop: '60px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '40px',
            display: 'flex'
          }}>
            <button
              onClick={() => router.push("/blog")}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '99px',
                height: '48px',
                padding: '0 24px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Yayınlara Geri Dön
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}
