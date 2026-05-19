"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main 
      data-lenis-prevent
      style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        overflow: 'hidden'
      }}
    >
      {/* Bu sayfa özelinde footer'ı gizle ve kaydırmayı tamamen devre dışı bırak */}
      <style>{`
        footer {
          display: none !important;
        }
        body, html {
          overflow: hidden !important;
          height: 100vh !important;
        }
      `}</style>

      {/* 
        1. Radar Görseli Alanı (Çok az daha büyütüldü ve arkada konumlandırıldı)
      */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative',
          width: '410px',
          height: '350px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'hidden',
          zIndex: 1
        }}
      >
        <Image
          src="/img/radar.png"
          alt="Orbit Radar"
          width={390}
          height={390}
          priority
          style={{
            objectFit: 'contain',
            opacity: 0.95,
            filter: 'brightness(0.95)',
            transform: 'translateY(30px)' /* Konumu korundu */
          }}
        />
        {/* Kalın degrade geçiş maskesi */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000000 85%)',
          pointerEvents: 'none'
        }} />
      </motion.div>

      {/* 
        2. Yazı ve Buton Bloğu (Önde ve negatif marjlı konumu tam olarak korundu)
      */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginTop: '-80px', /* Konumu tam olarak korundu */
          zIndex: 10,
          position: 'relative'
        }}
      >
        <h1 style={{
          fontSize: '64px',
          fontWeight: '700',
          lineHeight: '0.95',
          letterSpacing: '-0.04em',
          margin: '0 0 20px 0',
          textTransform: 'lowercase'
        }}>
          not found
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: '16px',
          fontWeight: '500',
          lineHeight: '1.6',
          maxWidth: '380px',
          margin: '0 0 36px 0'
        }}>
          Aradığınız sayfa taşınmış, silinmiş veya geçici olarak erişilemez durumda olabilir.
        </p>

        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '48px',
          padding: '0 32px',
          backgroundColor: '#4060ff',
          color: '#fff',
          fontWeight: '700',
          borderRadius: '12px',
          fontSize: '15px',
          textDecoration: 'none',
          boxShadow: '0 10px 20px rgba(64, 96, 255, 0.15)',
          transition: 'all 0.3s ease'
        }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#3852de')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4060ff')}
        >
          Ana Sayfaya Dön
        </Link>
      </motion.div>
    </main>
  );
}
