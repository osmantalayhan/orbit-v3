"use client";

import React from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

const MapComponent = ({ center, city, address, name }: { center: [number, number], city: string, address: string, name: string }) => {
  const [L, setL] = React.useState<any>(null);

  React.useEffect(() => {
    import("leaflet").then((leaflet) => {
      const DefaultIcon = leaflet.Icon.Default.prototype as any;
      delete DefaultIcon._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });
      setL(leaflet);
    });
  }, []);

  if (!MapContainer || !TileLayer) return null;

  return (
    <div className="map-container-box" style={{
      width: '100%',
      aspectRatio: '1/1',
      borderRadius: '24px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.05)',
      position: 'relative',
      backgroundColor: '#000'
    }}>
      <style>{`
        @media (max-width: 768px) {
          .map-container-box {
            aspect-ratio: 16 / 10 !important;
          }
        }
        .leaflet-popup-content-wrapper {
          background: #111 !important;
          color: #fff !important;
          border-radius: 12px !important;
          padding: 8px !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
        }
        .leaflet-popup-tip {
          background: #111 !important;
        }
        .leaflet-container {
          background: #000 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
      `}</style>
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
        style={{ height: "100%", width: "100%", background: '#000' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={center} eventHandlers={{ add: (e) => e.target.openPopup() }}>
          <Popup autoClose={false} closeOnClick={false}>
            <div style={{ padding: '4px', minWidth: '160px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', marginBottom: '4px', color: '#fff' }}>{name}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5', fontWeight: '500', marginBottom: '12px' }}>{address}</div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${center[0]},${center[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#4060ff',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease'
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Yol Tarifi Al
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default function MapSection({ offices }: { offices?: Array<{ name: string, city: string, address: string, latitude: number, longitude: number }> }) {
  // API'den veri yüklenene kadar veya boşsa varsayılan statik ofis koordinatlarını (mock) kullanır
  const displayOffices = offices && offices.length > 0 ? offices : [
    {
      name: "Orbit İstanbul, Ofis",
      city: "İstanbul",
      address: "Akşemsettin Mah. Akdeniz Cad. No:30 Kat:3 Fatih",
      latitude: 41.019087,
      longitude: 28.946238
    },
    {
      name: "Orbit Ankara, Merkez",
      city: "Ankara",
      address: "Anadolu Blv Corner 2 Plaza No:151/6 Yenimahalle",
      latitude: 40.00089,
      longitude: 32.77203
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px',
      marginTop: '80px',
      width: '100%',
      marginBottom: '60px'
    }}>
      {displayOffices.map((office, idx) => (
        <MapComponent
          key={idx}
          center={[office.latitude, office.longitude]}
          city={office.city}
          name={office.name}
          address={office.address}
        />
      ))}
    </div>
  );
}

