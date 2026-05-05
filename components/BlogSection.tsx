"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const blogs = [
  {
    id: 1,
    title: "İnsansız Hava Araçlarında Yeni Nesil Kontrolcüler",
    excerpt: "Orbit F435 ile uçuş stabilitesini nasıl %40 artırdık? Teknik bir derin dalış.",
    date: "24 Nisan 2024",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Otonom Uçuş Yazılımlarının Geleceği",
    excerpt: "Yapay zeka destekli otonom görev planlama sistemlerinde Orbit'in vizyonu.",
    date: "18 Nisan 2024",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Yerli Üretim ve Küresel Standartlar",
    excerpt: "Türkiye'den dünyaya ihraç edilen yüksek teknolojili ESC sistemlerinin üretim hikayesi.",
    date: "12 Nisan 2024",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
  },
];

export default function BlogSection() {
  return (
    <section 
      className="pb-40 w-full bg-black relative overflow-hidden flex flex-col items-center"
      style={{ paddingTop: '130px' }}
    >
      {/* Header Container - Same as ProductVitrin */}
      <div 
        className="max-w-[1304px] px-6 flex flex-col items-start mb-10"
        style={{ width: 'calc(100% - 96px)' }}
      >
        <header className="w-full relative flex flex-col md:flex-row items-start md:items-end justify-start md:justify-between" style={{ marginBottom: '40px' }}>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white text-4xl md:text-5xl font-bold tracking-tight text-left"
          >
            Insights & <br /> Gelişmeler.
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="mt-8 md:mt-0 flex justify-center md:justify-end"
          >
            <a 
              href="/blog" 
              className="group/all inline-flex items-center justify-center gap-2 h-10 bg-transparent hover:bg-white/5 border border-white/10 rounded-lg text-white font-semibold transition-all text-sm no-underline whitespace-nowrap"
              style={{ paddingLeft: '30px', paddingRight: '30px' }}
            >
              Tüm Bloglar
              <svg className="w-3.5 h-3.5 transition-transform group-hover/all:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </header>
      </div>
 
      {/* Blog Cards Grid */}
      <div className="w-full max-w-[1304px] px-6" style={{ width: 'calc(100% - 96px)' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="group cursor-pointer"
            >
              <div 
                className="bg-[#0d0d0d] border border-white/5 rounded-[32px] overflow-hidden transition-all hover:border-white/10 hover:bg-[#111] h-full flex flex-col"
              >
                {/* Large Blog Image */}
                <div className="relative aspect-[16/10] overflow-hidden w-full">
                  <Image 
                    src={blog.image} 
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Blog Info - Using Inline Styles for Padding/Gaps */}
                <div 
                  style={{ 
                    padding: '32px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    flexGrow: 1 
                  }}
                >
                  <span 
                    style={{ 
                      color: 'rgba(255,255,255,0.3)', 
                      fontSize: '12px', 
                      fontWeight: 'bold', 
                      letterSpacing: '0.1em', 
                      textTransform: 'uppercase',
                      marginBottom: '16px' 
                    }}
                  >
                    {blog.date}
                  </span>
                  
                  <h3 
                    className="group-hover:text-blue-400 transition-colors"
                    style={{ 
                      color: 'white', 
                      fontSize: '30px', 
                      fontWeight: 'bold', 
                      lineHeight: '1.2',
                      letterSpacing: '-0.025em',
                      marginBottom: '20px' 
                    }}
                  >
                    {blog.title}
                  </h3>
                  
                  <p 
                    className="line-clamp-2"
                    style={{ 
                      color: 'rgba(255,255,255,0.4)', 
                      fontSize: '16px', 
                      lineHeight: '1.625', 
                      marginBottom: '24px' 
                    }}
                  >
                    {blog.excerpt}
                  </p>
                  
                  <div 
                    className="group/link"
                    style={{ 
                      marginTop: 'auto', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      color: 'rgba(255,255,255,0.8)', 
                      fontSize: '14px', 
                      fontWeight: 'bold' 
                    }}
                  >
                    <span>Devamını Oku</span>
                    <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
