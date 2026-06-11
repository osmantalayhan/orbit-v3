"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasInteracted = localStorage.getItem("cookiesInteracted");
    if (!hasInteracted) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("cookiesInteracted", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="cookie-banner"
          role="dialog"
          aria-label="Çerez Politikası"
        >
          <div className="cookie-content">
            <p className="cookie-text">
              Daha iyi bir deneyim sunabilmek için çerezleri kullanıyoruz.{" "}
              <a href="#gizlilik" className="cookie-link">
                Gizlilik Politikası
              </a>
              .
            </p>
          </div>
          <div className="cookie-actions">
            <button onClick={handleClose} className="cookie-btn-secondary">
              Reddet
            </button>
            <button onClick={handleClose} className="cookie-btn-primary">
              Kabul Et
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
