"use client";

import React from "react";
import { motion } from "framer-motion";

const jobs = [
  {
    id: 1,
    title: "Software Engineer (New Grand)",
    department: "Ar-Ge / Yazılım",
    location: "İstanbul (Hybrid)",
    type: "Tam Zamanlı",
  },
  {
    id: 2,
    title: "PCB Designer (New Grand)",
    department: "Donanım / Üretim",
    location: "İstanbul (Yerinde)",
    type: "Tam Zamanlı",
  },
  {
    id: 3,
    title: "Software Engineer (Python)",
    department: "Ar-Ge / Yapay Zeka",
    location: "Ankara (Hybrid)",
    type: "Tam Zamanlı",
  },
];

export default function CareerSection() {
  return (
    <section
      className="pb-40 w-full bg-black relative overflow-hidden flex flex-col items-center"
      style={{ paddingTop: '130px' }}
    >
      {/* Header Container - Same as ProductVitrin & Blog */}
      <div
        className="career-sec-header-wrapper max-w-[1304px] px-6 flex flex-col items-start mb-10"
        style={{ width: 'calc(100% - 96px)' }}
      >
        <header className="w-full relative flex flex-col md:flex-row items-start md:items-end justify-start md:justify-between" style={{ marginBottom: '40px' }}>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white text-4xl md:text-5xl font-bold tracking-tight text-left"
          >
            Geleceği <br /> Birlikte Kuralım.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="mt-8 md:mt-0 flex flex-wrap justify-start md:justify-end gap-4"
          >
            <a
              href="mailto:career@orbit.com"
              className="group/gen inline-flex items-center justify-center gap-2 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-semibold transition-all text-sm no-underline whitespace-nowrap"
              style={{ paddingLeft: '30px', paddingRight: '30px' }}
            >
              Genel Başvuru
              <svg className="w-3.5 h-3.5 transition-transform group-hover/gen:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            <a
              href="/kariyer"
              className="group/all inline-flex items-center justify-center gap-2 h-10 bg-transparent hover:bg-white/5 border border-white/10 rounded-lg text-white font-semibold transition-all text-sm no-underline whitespace-nowrap"
              style={{ paddingLeft: '30px', paddingRight: '30px' }}
            >
              Tüm İlanlar
              <svg className="w-3.5 h-3.5 transition-transform group-hover/all:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </header>
      </div>

      {/* Job Listings List */}
      <div className="career-sec-grid-wrapper w-full max-w-[1304px] px-6" style={{ width: 'calc(100% - 96px)' }}>
        <div className="flex flex-col gap-4">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div
                className="career-sec-card-body bg-[#0d0d0d] border border-white/5 rounded-2xl md:rounded-[24px] overflow-hidden transition-all hover:border-white/20 hover:bg-[#111] flex flex-col md:flex-row items-start md:items-center justify-between"
                style={{ padding: '32px 40px' }}
              >
                {/* Job Title & Department */}
                <div className="flex flex-col gap-2">
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      letterSpacing: '-0.02em',
                      transition: 'color 0.3s ease'
                    }}
                    className="career-sec-card-title group-hover:text-white"
                  >
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: '500' }}>
                      {job.department}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: '500' }}>
                      {job.type}
                    </span>
                  </div>
                </div>

                {/* Location & CTA */}
                <div className="mt-6 md:mt-0 flex items-center justify-between w-full md:w-auto gap-12">
                  <span style={{ color: 'white', fontSize: '16px', fontWeight: '600', opacity: 0.8 }}>
                    {job.location}
                  </span>

                  <div
                    className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-white/10 group-hover:border-white/30 group-hover:bg-white/5 transition-all"
                  >
                    <svg className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
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
