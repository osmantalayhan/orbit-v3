"use client";
 
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";



import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

export default function ProductVitrin() {
  const { data: apiProducts, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const { data: siteSettings } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const productsList = (apiProducts && apiProducts.length > 0)
    ? apiProducts.map((item: any) => ({
        id: item.id,
        name: item.name,
        role: item.role,
        desc: item.tagline,
        badge: item.badge,
        image: item.images && item.images.length > 0 ? item.images[0] : "/img/ucuskontrol.png",
      }))
    : [];

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    loop: true
  });

  React.useEffect(() => {
    if (!emblaApi) return;
    
    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0); // Sona geldiyse başa dön
      }
    }, 3500); // 3.5 saniyede bir kaysın

    return () => clearInterval(autoplay);
  }, [emblaApi]);

  return (
    <section 
      className="pb-40 w-full bg-black relative overflow-hidden flex flex-col items-center"
      style={{ paddingTop: '130px' }}
    >
      {/* Header Container */}
      <div 
        className="vitrin-header-wrapper max-w-[1304px] px-6 flex flex-col items-start mb-10"
        style={{ width: 'calc(100% - 96px)' }}
      >
        <header className="w-full relative flex flex-col md:flex-row items-start md:items-end justify-start md:justify-between" style={{ marginBottom: '40px' }}>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white text-4xl md:text-5xl font-bold tracking-tight text-left"
          >
            Orbit ürün ailesini <br /> keşfedin.
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="mobile-button-group md:mt-0 flex flex-col sm:flex-row w-full md:w-auto items-start sm:items-center justify-start md:justify-end md:gap-4"
          >
            {/* Dinamik Katalog İndirme Butonu */}
            {siteSettings?.catalog_url && (
              <a 
                href={siteSettings.catalog_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/dl flex md:inline-flex items-center justify-center gap-2 h-10 w-full md:w-auto bg-transparent hover:bg-white/5 border border-white/10 rounded-lg text-white font-semibold transition-all text-[14px] md:text-sm no-underline whitespace-nowrap"
                style={{ paddingLeft: '20px', paddingRight: '20px' }}
              >
                <svg className="w-4 h-4 transition-transform group-hover/dl:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Ürün Kataloğunu İndir
              </a>
            )}

            <Link 
              href="/urunler" 
              className="group/all flex md:inline-flex items-center justify-center gap-2 h-10 w-full md:w-auto bg-transparent hover:bg-white/5 border border-white/10 rounded-lg text-white font-semibold transition-all text-[14px] md:text-sm no-underline whitespace-nowrap"
              style={{ paddingLeft: '30px', paddingRight: '30px' }}
            >
              Tüm Ürünler
              <svg className="w-3.5 h-3.5 transition-transform group-hover/all:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </header>
      </div>
 
      {/* Carousel Area */}
      <div className="vitrin-carousel-wrapper w-full max-w-[1304px] px-6" style={{ width: 'calc(100% - 96px)' }}>
        <div className="w-full overflow-hidden" ref={emblaRef}>
          <div className="flex items-stretch" style={{ marginLeft: '-32px' }}>
            {productsList.map((product: any, index: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 1, 
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="flex-[0_0_100%] md:flex-[0_0_calc(100%/3)] min-w-0 flex flex-col"
                style={{ paddingLeft: '32px' }}
              >
                <Link href={`/urunler/${product.id}`} style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}>
                  <div
                    style={{
                      backgroundColor: "#141414",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "28px",
                      padding: "36px 36px 28px",
                      display: "flex", flexDirection: "column",
                      height: "100%",
                      cursor: "pointer", transition: "all 0.3s ease",
                      position: "relative", overflow: "hidden",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.11)";
                      e.currentTarget.style.backgroundColor = "#1a1a1a";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.backgroundColor = "#141414";
                    }}
                  >
                    {/* Ürün Görseli */}
                    <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", marginBottom: "28px" }}>
                      {product.badge && (
                        <div style={{
                          position: "absolute",
                          top: "0px",
                          right: "0px",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          color: "#fff",
                          padding: "4px 10px",
                          borderRadius: "10px",
                          fontSize: "10px",
                          fontWeight: "600",
                          letterSpacing: "0.5px",
                          zIndex: 10,
                          backdropFilter: "blur(4px)"
                        }}>
                          {product.badge}
                        </div>
                      )}
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain"
                        style={{ filter: "brightness(1.05)" }}
                      />
                    </div>

                    {/* Alt bölge: isim + ok */}
                    <div style={{
                      backgroundColor: "#222222",
                      borderRadius: "18px",
                      padding: "20px 24px",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      marginTop: "auto",
                    }}>
                      <div>
                        <h3 style={{
                          fontSize: "29px", fontWeight: "700",
                          letterSpacing: "-0.025em", margin: 0, marginBottom: "4px", color: "#fff",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>
                          {product.name}
                        </h3>
                        <p style={{
                          fontSize: "13px", color: "rgba(255,255,255,0.35)", fontWeight: "600",
                          textTransform: "lowercase", margin: 0,
                        }}>
                          {product.role}
                        </p>
                      </div>
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, color: "rgba(255,255,255,0.45)",
                        transition: "all 0.25s ease",
                      }}>
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
