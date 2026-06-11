"use client";

import React from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { motion } from "framer-motion";

// Mock data removed at user request

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "1";

  const [currentBlog, setCurrentBlog] = React.useState<any>(null);

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog/${id}`)
      .then(res => {
        if (!res.ok) {
          return { notFound: true };
        }
        return res.json();
      })
      .then(data => {
        if (data.notFound) {
          setCurrentBlog({ notFound: true });
          return;
        }

        if (data) {
          let htmlContent = "";
          if (data.body_content) {
            if (typeof data.body_content === 'string') {
              htmlContent = data.body_content;
            } else if (Array.isArray(data.body_content)) {
              // Geriye dönük uyumluluk: eski blokları HTML'e çevir
              htmlContent = data.body_content.map((b: any) => {
                if (b.type === 'subtitle') return `<h2 style="font-size: 28px; font-weight: 700; color: #fff; letter-spacing: -0.025em; margin-top: 32px; margin-bottom: 16px">${b.content}</h2>`;
                if (b.type === 'quote') return `<blockquote style="font-size: 20px; font-style: italic; color: rgba(255,255,255,0.8); border-left: 3px solid #3f3f46; padding-left: 24px; margin: 32px 0">${b.content}</blockquote>`;
                return `<p style="font-size: 18px; color: rgba(255,255,255,0.6); line-height: 1.7; margin-bottom: 24px">${b.content}</p>`;
              }).join("");
            }
          }

          if (data.active === false) {
            setCurrentBlog({ isDraft: true });
            return;
          }

          setCurrentBlog({
            title: data.title,
            category: data.category,
            date: data.date_published,
            readTime: data.read_time,
            image: data.cover_image || "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200",
            leadParagraph: data.lead_paragraph,
            author: {
              name: data.author_name,
              role: data.author_role,
              avatar: data.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
            },
            bodyHTML: htmlContent
          });
        }
      })
      .catch(err => {
        console.error("Error loading blog details:", err);
        setCurrentBlog({ notFound: true });
      });
  }, [id]);

  if (!currentBlog) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>Makale yükleniyor...</div>
      </main>
    );
  }

  if (currentBlog.isDraft) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '24px' }}>
        <div style={{ padding: '24px', backgroundColor: '#1a1a1a', border: '1px solid #3f3f46', borderRadius: '16px', textAlign: 'center', maxWidth: '400px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '12px', fontWeight: 'bold' }}>Erişim Yok</h2>
          <p style={{ color: '#a1a1aa', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
            Bu makale henüz taslak aşamasındadır veya yazar tarafından geçici olarak yayından kaldırılmıştır.
          </p>
          <Link href="/blog" style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', display: 'inline-block' }}>
            Bloglara Dön
          </Link>
        </div>
      </main>
    );
  }

  if (currentBlog.notFound) {
    notFound();
  }

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
          .blog-detail-html-content p {
            font-size: 18px !important;
            line-height: 1.7 !important;
            margin-bottom: 24px !important;
            color: rgba(255,255,255,0.6) !important;
          }
          .blog-detail-html-content h2 {
            font-size: 28px !important;
            margin-top: 32px !important;
            margin-bottom: 16px !important;
            color: #fff !important;
            font-weight: 700 !important;
          }
          .blog-detail-html-content h3 {
            font-size: 24px !important;
            margin-top: 24px !important;
            margin-bottom: 12px !important;
            color: #fff !important;
            font-weight: 600 !important;
          }
          .blog-detail-html-content blockquote {
            font-size: 20px !important;
            font-style: italic !important;
            border-left: 3px solid #3f3f46 !important;
            padding-left: 24px !important;
            margin: 32px 0 !important;
            color: rgba(255,255,255,0.8) !important;
          }
          .blog-detail-html-content ul {
            list-style-type: disc !important;
            padding-left: 24px !important;
            margin-bottom: 24px !important;
            color: rgba(255,255,255,0.6) !important;
          }
          .blog-detail-html-content ol {
            list-style-type: decimal !important;
            padding-left: 24px !important;
            margin-bottom: 24px !important;
            color: rgba(255,255,255,0.6) !important;
          }
          .blog-detail-html-content li {
            margin-bottom: 8px !important;
          }
          @media (max-width: 768px) {
            .blog-detail-html-content p { font-size: 16px !important; }
            .blog-detail-html-content h2 { font-size: 24px !important; }
            .blog-detail-html-content h3 { font-size: 20px !important; }
            .blog-detail-html-content blockquote { font-size: 18px !important; padding-left: 16px !important; }
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

          {/* Zengin Metin (Rich Text) İçeriği */}
          <style>{`
            .blog-detail-html-content { color: rgba(255,255,255,0.6); font-size: 18px; line-height: 1.7; }
            .blog-detail-html-content p:first-of-type { font-size: 20px; line-height: 1.6; color: rgba(255,255,255,0.9); margin-bottom: 32px; font-weight: 400; }
            .blog-detail-html-content p { font-size: 18px; color: rgba(255,255,255,0.6); line-height: 1.7; margin-bottom: 24px; }
            .blog-detail-html-content h2 { font-size: 28px; font-weight: 700; color: #fff; letter-spacing: -0.025em; margin-top: 32px; margin-bottom: 16px; }
            .blog-detail-html-content h3 { font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.025em; margin-top: 24px; margin-bottom: 16px; }
            .blog-detail-html-content p { font-size: 18px; color: rgba(255,255,255,0.6); line-height: 1.7; margin-bottom: 24px; }
            .blog-detail-html-content blockquote { font-size: 20px; font-style: italic; color: rgba(255,255,255,0.8); border-left: 3px solid #3f3f46; padding-left: 24px; margin: 32px 0; }
            .blog-detail-html-content ul { list-style-type: disc; padding-left: 24px; margin-bottom: 24px; font-size: 18px; color: rgba(255,255,255,0.6); line-height: 1.7; }
            .blog-detail-html-content ol { list-style-type: decimal; padding-left: 24px; margin-bottom: 24px; font-size: 18px; color: rgba(255,255,255,0.6); line-height: 1.7; }
            .blog-detail-html-content a { color: #60a5fa; text-decoration: underline; text-underline-offset: 4px; }
            
            .blog-detail-html-content table { width: 100% !important; border-collapse: separate !important; border-spacing: 0 !important; margin: 40px 0 !important; background-color: rgba(255, 255, 255, 0.02) !important; border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 16px !important; overflow: hidden !important; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5) !important; }
            .blog-detail-html-content td { border: none !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; border-right: 1px solid rgba(255,255,255,0.05) !important; padding: 20px 24px !important; font-size: 16px !important; color: rgba(255,255,255,0.8) !important; line-height: 1.6 !important; transition: background-color 0.2s ease !important; }
            .blog-detail-html-content tr:first-child td { background-color: rgba(255,255,255,0.05) !important; font-weight: 600 !important; color: #fff !important; font-size: 15px !important; letter-spacing: 0.03em !important; text-transform: uppercase; }
            .blog-detail-html-content tr:last-child td { border-bottom: none !important; }
            .blog-detail-html-content td:last-child { border-right: none !important; }
            .blog-detail-html-content tr:not(:first-child):hover td { background-color: rgba(255, 255, 255, 0.04) !important; color: #fff !important; }
          `}</style>
          <div 
            className="blog-detail-html-content" 
            dangerouslySetInnerHTML={{ __html: currentBlog.bodyHTML }} 
            style={{ width: '100%' }}
          />


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
