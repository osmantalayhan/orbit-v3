"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-top-row">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="hero-heading"
        >
          <span>Yeni nesil yerli</span>
          <span>İHA teknolojileri.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="hero-actions"
        >
          <a href="#urunler" className="btn-primary">
            Ürünleri İncele
          </a>
          <a href="#iletisim" className="btn-secondary">
            Bize Ulaşın
          </a>
        </motion.div>
      </div>
    </section>
  );
}
