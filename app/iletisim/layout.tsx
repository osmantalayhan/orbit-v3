import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Orbit Teknoloji ile iletişime geçin. İHA donanımları, teknik destek, özel üretim talepleri ve kurumsal iş birlikleri için mesajınızı gönderin.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
