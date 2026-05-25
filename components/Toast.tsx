"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | null;

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, isVisible, onClose, duration = 5000 }: ToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  // Sadece client side'da ve mount olduktan sonra render et (Next.js SSR hatasını önler)
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && type && (
        <motion.div
          initial={{ opacity: 0, x: -20, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -20, y: 20, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed",
            bottom: "40px",
            left: "40px",
            zIndex: 99999, // Her şeyin üstünde olmasını garantiler
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "16px 24px",
            backgroundColor: "#0a0a0a", // Minimal, koyu Orbit siyahı
            border: "1px solid rgba(255, 255, 255, 0.08)", // İnce ve zarif sınır çizgisi
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.8)", // Renkli gölgeler (mavi vb.) tamamen kaldırıldı
            maxWidth: "400px"
          }}
        >
          {/* İkon */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.05)", // Minimal gri arka plan
            color: "#fff", // Sadece beyaz, temiz ikon
            flexShrink: 0
          }}>
            {type === "success" ? (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          {/* İçerik (Mevcut Orbit fontunu miras alır) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ 
              color: "#fff", 
              fontSize: "14px", 
              fontWeight: "600",
              letterSpacing: "-0.01em"
            }}>
              {type === "success" ? "İşlem Başarılı" : "Bir Hata Oluştu"}
            </span>
            <span style={{ 
              color: "rgba(255,255,255,0.45)", 
              fontSize: "13px", 
              lineHeight: "1.4",
              fontWeight: "400"
            }}>
              {message}
            </span>
          </div>
          
          {/* Kapatma Butonu */}
          <button 
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.3)",
              cursor: "pointer",
              padding: "4px",
              marginLeft: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#fff"}
            onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
