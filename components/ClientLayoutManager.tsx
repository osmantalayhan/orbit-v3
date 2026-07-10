"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import FloatingActionButtons from "@/components/FloatingActionButtons";

export default function ClientLayoutManager({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Eğer /admin rotasındaysak, ana site menülerini GÖSTERME
  const isAdminRoute = pathname?.startsWith("/orb-sys");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <div>
        {children}
      </div>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <CookieBanner />}
      {!isAdminRoute && <FloatingActionButtons />}
    </>
  );
}
