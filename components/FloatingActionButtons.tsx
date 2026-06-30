"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Settings fetch failed");
  return res.json();
});

export default function FloatingActionButtons() {
  const [isVisible, setIsVisible] = useState(false);
  
  const { data: settings } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  // Scroll event dinleyicisi
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // WhatsApp numarası temizleme (boşlukları vb. kaldırıp sadece rakam bırakır)
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    return phone.replace(/[^0-9]/g, "");
  };

  const phoneRaw = settings?.contact_phone || "";
  const whatsappNumber = formatPhoneNumber(phoneRaw);
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "#";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4 pointer-events-none">
      
      {/* Yukarı Çık Butonu */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-md shadow-lg pointer-events-auto hover:bg-white/10 hover:border-white/20 hover:scale-110 transition-all duration-300"
            aria-label="Yukarı Çık"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp Butonu */}
      <motion.a
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_20px_rgba(37,211,102,0.4)] pointer-events-auto hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300 relative group"
        aria-label="WhatsApp üzerinden iletişime geçin"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.81 11.81 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z"/>
        </svg>
        
        {/* Hover Tooltip */}
        <div 
          className="absolute right-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-sm opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-300 whitespace-nowrap"
          style={{ padding: "8px 16px", borderRadius: "50px", marginRight: "12px" }}
        >
          Bize Ulaşın
        </div>
      </motion.a>

    </div>
  );
}
