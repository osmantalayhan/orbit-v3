"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll() {
  useEffect(() => {
    // Lenis pürüzsüz kaydırma motorunu başlatıyoruz
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple/Vercel tarzı ipeksi ivmelenme eğrisi
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.05, // İnce ayar yapılmış kaydırma hızı çarpanı
      touchMultiplier: 2,
      infinite: false,
    });

    // Her animasyon karesinde Lenis'i güncelliyoruz (RequestAnimationFrame)
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Temizleme (cleanup) işlemi
    return () => {
      lenis.destroy();
    };
  }, []);

  return null; // Görsel yerleşimi etkilememesi için kesinlikle hiçbir şey render etmez (0px alan kaplar)
}
