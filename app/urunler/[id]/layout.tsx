import type { Metadata } from "next";

const productMap: Record<string, { name: string; tagline: string }> = {
  "f435": { name: "Orbit F435 Uçuş Kontrolör Sistemi", tagline: "Çift IMU ile sınıfının en kararlı uçuş kontrolörü." },
  "e50": { name: "Orbit E50 50A 4-in-1 ESC", tagline: "BLHeli_32 ve 128K PWM desteği ile yüksek verimli motor sürücü." },
  "g50": { name: "Orbit G50 GPS & Pusula", tagline: "U-blox M10 çip seti ile yüksek hassasiyetli konumlandırma." },
  "l500": { name: "Orbit L500 Telemetri Modülü", tagline: "915MHz LoRa teknolojisi ile 15 km+ menzilli veri haberleşmesi." },
  "v50": { name: "Orbit V50 FPV Kamera", tagline: "1200TVL çözünürlük ve ultra düşük gecikmeli gece görüşü." },
  "f450": { name: "Orbit F450 Karbon Frame", tagline: "Hafif ve dayanıklı 3K saf karbon fiber gövde tasarımı." }
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id;
  const product = productMap[id] || { name: "İHA Elektroniği Ürünü", tagline: "Yerli Ar-Ge'den doğan üstün performanslı İHA donanımı." };

  return {
    title: product.name,
    description: `${product.name} - ${product.tagline} Yerli Ar-Ge'den doğan askeri ve endüstriyel sınıf İHA elektroniği.`,
  };
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
