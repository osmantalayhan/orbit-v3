"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Mock data removed at user request

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "1";

  const [currentBlog, setCurrentBlog] = React.useState<any>(null);

  React.useEffect(() => {
    fetch(`http://127.0.0.1:8080/api/v1/blog/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Blog not found");
        return res.json();
      })
      .then(data => {
        if (data) {
          let bodyBlocks = [];
          if (data.body_content) {
            if (Array.isArray(data.body_content)) {
              bodyBlocks = data.body_content;
            } else if (data.body_content.blocks) {
              bodyBlocks = data.body_content.blocks;
            }
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
            bodyParagraphs: bodyBlocks
          });
        }
      })
      .catch(err => console.error("Error loading blog details:", err));
  }, [id]);

  if (!currentBlog) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>Makale yükleniyor...</div>
      </main>
    );
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
