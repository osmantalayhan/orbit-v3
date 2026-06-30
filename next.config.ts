import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

// Next.js'in statik favicon'ı her sayfada otomatik eklemesini ve tarayıcı cache'iyle 
// çakışmasını önlemek için app/favicon.ico dosyasını otomatik olarak siliyoruz.
// Böylece tamamen layout.tsx'teki dinamik favicon devrede kalır.
try {
  const faviconPath = path.join(process.cwd(), "app", "favicon.ico");
  if (fs.existsSync(faviconPath)) {
    fs.unlinkSync(faviconPath);
    console.log("Statik app/favicon.ico silindi (Dinamik favicon için)");
  }
} catch (e) {}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8080',
      },
      {
        protocol: 'https',
        hostname: 'api.orbit.com', // İleride canlıya çıkınca kullanılacak Backend adresi
      },
    ],
  },
};

export default nextConfig;
