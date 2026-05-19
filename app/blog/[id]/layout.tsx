import type { Metadata } from "next";

const blogMap: Record<string, { title: string; lead: string }> = {
  "1": { 
    title: "İnsansız Hava Araçlarında Yeni Nesil Kontrolcüler", 
    lead: "Uçuş stabilitesini %40 artıran çift IMU teknolojisi, yerli ve milli İHA sistemlerimizin rüzgar mukavemeti ve görev kararlılığında yeni bir çağ başlatıyor." 
  },
  "2": { 
    title: "ESC Teknolojilerinde Verimlilik ve Isı Yönetimi", 
    lead: "Yüksek akım çeken fırçasız motor sürücülerinde ısı dağılımı optimizasyonu ve BLHeli_32 mimarisinin uçuş süresine doğrudan etkileri." 
  },
  "3": { 
    title: "İHA'larda GPS ve Konumlandırma Hassasiyeti", 
    lead: "Çoklu uydu takımı desteği (GNSS) ve RTK teknolojisinin santimetre düzeyinde konumlandırma doğruluğu ile otonom İHA görevlerindeki kritik rolü." 
  }
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id;
  const article = blogMap[id] || { title: "Teknoloji Blog Yazısı", lead: "İnsansız hava araçları ve otonom teknolojiler üzerine uzman teknik yazılar." };

  return {
    title: article.title,
    description: `${article.title} - ${article.lead}`,
  };
}

export default function BlogDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
