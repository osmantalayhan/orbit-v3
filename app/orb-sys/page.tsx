"use client";

import React, { useEffect, useState } from "react";
import {
  Package,
  FileText,
  Briefcase,
  Mail,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import styles from "./orb-sys.module.css";

/* ─── AYLIK B2B TALEP GRAFİĞİ (CSS Modules) ─── */
function TrafficChart({ trafficData }: { trafficData: {name: string, value: number}[] }) {
  const maxTraffic = Math.max(1, ...trafficData.map((d) => d.value)); // Avoid div by zero

  return (
    <div className={styles.chartArea}>
      {trafficData.map((d) => (
        <div key={d.name} className={styles.chartColumn}>
          <div className={styles.chartBarContainer} title={`${d.value} Yeni Talep`}>
            <div
              className={styles.chartBar}
              style={{
                height: `${(d.value / maxTraffic) * 100}%`,
                minHeight: d.value > 0 ? "4px" : "0px",
              }}
            />
          </div>
          <span className={styles.chartLabel}>{d.name}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── SON AKTİVİTELER (Recent Activity) ─── */
function RecentActivities({ activities }: { activities: any[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "message": return Mail;
      case "product": return Package;
      case "career": return Briefcase;
      case "blog": return FileText;
      default: return Package;
    }
  };

  if (!activities || activities.length === 0) {
    return <p style={{ color: "#a1a1aa", fontSize: "14px", marginTop: "1rem" }}>Son aktivite bulunmuyor.</p>;
  }

  return (
    <div className={styles.activityList}>
      {activities.map((activity) => {
        const Icon = getIcon(activity.type);
        return (
          <div key={activity.id} className={styles.activityItem}>
            <div className={styles.activityIcon}>
              <Icon size={18} />
            </div>
            <div className={styles.activityContent}>
              <p className={styles.activityText}>
                <span className={styles.activityUser}>{activity.user}</span> {activity.action}
              </p>
              <p className={styles.activityTime}>{activity.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── METRİK KARTI BİLEŞENİ (CSS Modules) ─── */
function MetricCard({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  icon: React.ElementType;
}) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricHeader}>
        <h3 className={styles.metricTitle}>{title}</h3>
        <div className={styles.metricIconBox}>
          <Icon size={18} />
        </div>
      </div>
      <div>
        <div className={styles.metricValue}>{value}</div>
        <div className={styles.metricTrend}>
          {trendUp ? (
            <TrendingUp size={14} className={styles.trendUp} />
          ) : (
            <TrendingDown size={14} className={styles.trendDown} />
          )}
          <span className={trendUp ? styles.trendUp : styles.trendDown}>{trend}</span>
          <span className={styles.trendDesc}>geçen aya göre</span>
        </div>
      </div>
    </div>
  );
}

/* ─── DASHBOARD SAYFASI ─── */
export default function AdminDashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/dashboard`);
      if (!res.ok) {
        // If it's a 401, apiClient already handles the redirect, so we shouldn't throw an unhandled error here.
        if (res.status === 401) return; 
        const errText = await res.text();
        console.error("Dashboard error:", res.status, errText);
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient || loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", color: "#a1a1aa" }}>
        Yükleniyor...
      </div>
    );
  }

  const metrics = data?.metrics || {
    products: { value: 0, trend: "0", trendUp: true },
    messages: { value: 0, trend: "0", trendUp: true },
    blogs: { value: 0, trend: "0", trendUp: true },
    applications: { value: 0, trend: "0", trendUp: true },
  };

  const trafficData = data?.trafficData || [];
  const recentActivities = data?.recentActivities || [];

  return (
    <div className={styles.dashboardContainer}>
      
      {/* Üst Kısım: Başlık */}
      <div className={styles.dashboardHeader}>
        <div>
          <h2 className={styles.pageTitle}>Genel Bakış</h2>
          <p className={styles.pageDesc}>
            Orbit Teknoloji sistem aktiviteleri ve site performans metrikleri.
          </p>
        </div>
      </div>

      {/* Metrik Kartları (Katalog / Kariyer vs) */}
      <div className={styles.metricsGrid}>
        <MetricCard
          title="Aktif Ürünler"
          value={metrics.products.value}
          trend={metrics.products.trend}
          trendUp={metrics.products.trendUp}
          icon={Package}
        />
        <MetricCard
          title="Okunmamış Mesajlar"
          value={metrics.messages.value}
          trend={metrics.messages.trend}
          trendUp={metrics.messages.trendUp}
          icon={Mail}
        />
        <MetricCard
          title="Yayındaki Bloglar"
          value={metrics.blogs.value}
          trend={metrics.blogs.trend}
          trendUp={metrics.blogs.trendUp}
          icon={FileText}
        />
        <MetricCard
          title="Kariyer Başvuruları"
          value={metrics.applications.value}
          trend={metrics.applications.trend}
          trendUp={metrics.applications.trendUp}
          icon={Briefcase}
        />
      </div>

      {/* Alt İçerik: Grafik ve Aktiviteler */}
      <div className={styles.bottomGrid}>
        
        {/* Ziyaretçi Grafiği */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>B2B Talep Hacmi</h3>
            <span className={styles.panelBadge}>Aylık Dağılım</span>
          </div>
          <p className={styles.panelDesc}>Aylara göre alınan resmi ürün bilgi talepleri ve kurumsal mesajlar.</p>
          <div className={styles.chartArea}>
            <TrafficChart trafficData={trafficData} />
          </div>
        </div>

        {/* Son Aktiviteler */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Son Aktiviteler</h3>
          </div>
          <p className={styles.panelDesc}>Sistemdeki en güncel hareketler.</p>
          <div style={{ flex: 1, marginTop: "8px" }}>
            <RecentActivities activities={recentActivities} />
          </div>
        </div>

      </div>
    </div>
  );
}
