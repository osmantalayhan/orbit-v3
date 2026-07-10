import type { Metadata } from "next";

import { apiClient } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  if (!slug) return { title: "Blog" };
  
  try {
    const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (!data.notFound) {
        return {
          title: data.title,
          description: data.lead_paragraph || `${data.title} - Teknoloji Blog Yazısı`,
        };
      }
    }
  } catch (error) {
    // API'ye erisilemezse sessizce fallback'e dussun
  }

  const fallbackTitle = "Teknoloji Blog Yazısı";
  const fallbackLead = "İnsansız hava araçları ve otonom teknolojiler üzerine uzman teknik yazılar.";
  return {
    title: fallbackTitle,
    description: `${fallbackTitle} - ${fallbackLead}`,
  };
}

export default function BlogDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
