import type { Metadata } from "next";
import { apiClient } from "@/lib/api";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id;
  
  try {
    const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${id}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const product = await res.json();
      return {
        title: product.name,
        description: `${product.name} - ${product.tagline} Yerli Ar-Ge'den doğan askeri ve endüstriyel sınıf İHA elektroniği.`,
      };
    }
  } catch (error) {
    // API'ye erisilemezse hata basmadan (sessizce) fallback'e dussun
  }

  // Fallback (Yedek)
  const fallbackName = "İHA Elektroniği Ürünü";
  const fallbackTagline = "Yerli Ar-Ge'den doğan üstün performanslı İHA donanımı.";
  return {
    title: fallbackName,
    description: `${fallbackName} - ${fallbackTagline} Yerli Ar-Ge'den doğan askeri ve endüstriyel sınıf İHA elektroniği.`,
  };
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
