"use client";

import { motion } from "framer-motion";

const channels = [
  { name: "Trendyol", logo: "/img/trendyol.png", link: "#", color: "#f27a1a" },
  { name: "Hepsiburada", logo: "/img/hepsiburada.png", link: "#", color: "#ff6000" },
  { name: "N11", logo: "/img/n11.png", link: "#", color: "#e31e24" },
  { name: "RoboLink", logo: "/img/robolink.png", link: "#", color: "#00a8e1" },
  { name: "Robotistan", logo: "/img/robotistan.png", link: "#", color: "#f39200" },
];

export default function SalesChannels() {
  return (
    <section className="py-20 bg-[#050505] border-y border-white/5 overflow-hidden">
      <div className="max-w-[1304px] mx-auto px-6">
        <div className="text-center mb-12">
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase mb-8"
          >
            Resmi Satış Kanallarımız
          </motion.h3>
          
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 hover:opacity-100 transition-opacity duration-500">
            {channels.map((channel, i) => (
              <motion.a
                key={channel.name}
                href={channel.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              >
                <div className="h-8 md:h-10 flex items-center">
                  <span className="text-white text-xl md:text-2xl font-bold tracking-tight opacity-80">{channel.name}</span>
                  {/* Note: In a real app, replace with actual <img> tags for logos */}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
