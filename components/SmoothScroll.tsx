"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Admin panelinde Lenis'i devre dışı bırakıyoruz (native scroll ve overflow sorunlarını engellemek için)
    if (pathname?.startsWith("/admin")) return;
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
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Temizleme (cleanup) işlemi
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [pathname]);

  return null; // Görsel yerleşimi etkilememesi için kesinlikle hiçbir şey render etmez (0px alan kaplar)
}
