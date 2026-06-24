"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Konsolda detaylı hatayı görebilmemiz için logluyoruz
    console.error("Global Error Boundary yakaladı:", error);
  }, [error]);

  return (
    <div style={{
      minHeight: '60vh',
      backgroundColor: '#000',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 10,
          position: 'relative'
        }}
      >
        {/* Uyarı İkonu */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,60,60,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          color: '#ff4444'
        }}>
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        {/* Başlık */}
        <h1 style={{
          fontSize: '44px',
          fontWeight: '700',
          lineHeight: '1.05',
          letterSpacing: '-0.03em',
          margin: '0 0 16px 0',
          textTransform: 'lowercase'
        }}>
          beklenmeyen bir hata.
        </h1>
        
        {/* Açıklama */}
        <p style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: '16px',
          fontWeight: '500',
          lineHeight: '1.6',
          maxWidth: '420px',
          margin: '0 0 36px 0'
        }}>
          Üzgünüz, bu bölüm yüklenirken bir hata oluştu. Sorun geçici olabilir, sayfayı veya bölümü yeniden yüklemeyi deneyin.
        </p>

        {/* Yeniden Dene Butonu */}
        <button 
          onClick={() => reset()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '48px',
            padding: '0 32px',
            backgroundColor: '#4060ff',
            color: '#fff',
            fontWeight: '700',
            borderRadius: '12px',
            border: 'none',
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(64, 96, 255, 0.15)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#3852de')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4060ff')}
        >
          Tekrar Dene
        </button>
      </motion.div>
    </div>
  );
}
