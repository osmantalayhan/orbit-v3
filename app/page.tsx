import HeroSection from "@/components/HeroSection";
import ProductVitrin from "@/components/ProductVitrin";
import AboutScroll from "@/components/AboutScroll";
import SalesSlider from "@/components/SalesSlider";
import EcosystemSlider from "@/components/EcosystemSlider";
import BlogSection from "@/components/BlogSection";
import CareerSection from "@/components/CareerSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <EcosystemSlider />
      <ProductVitrin />
      <AboutScroll />
      <SalesSlider />
      <BlogSection />
      <CareerSection />
    </main>
  );
}
