import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "İnsansız hava araçları, gömülü sistemler, Ar-Ge teknolojileri ve gökyüzü teknolojisindeki son gelişmeler hakkında uzman mühendislik yazılarımız.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
