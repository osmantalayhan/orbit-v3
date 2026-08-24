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
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://orbit_backend:8080';
    return [
      {
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
      {
        source: '/api-proxy/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ]
  },
};

export default nextConfig;
