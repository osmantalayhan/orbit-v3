import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import OSDSection from "@/components/OSDSection";
import ProductVitrin from "@/components/ProductVitrin";
import CookieBanner from "@/components/CookieBanner";
import AboutScroll from "@/components/AboutScroll";
import SalesSlider from "@/components/SalesSlider";
import EcosystemSlider from "@/components/EcosystemSlider";
import BlogSection from "@/components/BlogSection";
import CareerSection from "@/components/CareerSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <SalesSlider />
      <AboutScroll />
      {/* <OSDSection /> */}
      <ProductVitrin />
      <EcosystemSlider />
      <BlogSection />
      <CareerSection />
      <Footer />
      <CookieBanner />
    </main>
  );
}
