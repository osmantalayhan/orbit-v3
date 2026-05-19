import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kariyer",
  description: "Geleceğin otonom ve havacılık teknolojilerini inşa eden ekibimizin bir parçası olun. Orbit Teknoloji iş ilanları, açık pozisyonlar ve başvuru süreçleri.",
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
