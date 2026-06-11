"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

export default function ClientLayoutManager({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Eğer /admin rotasındaysak, ana site menülerini GÖSTERME
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <div key={pathname}>
        {children}
      </div>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <CookieBanner />}
    </>
  );
}
