"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileText,
  Briefcase,
  Mail,
  Settings,
  LogOut,
  Search,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";
import styles from "../../app/admin/admin.module.css";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Katalog", url: "/admin/products", icon: Package },
  { title: "Ana Slider", url: "/admin/slider", icon: ImageIcon },
  { title: "Blog", url: "/admin/blog", icon: FileText },
  { title: "Kariyer", url: "/admin/careers", icon: Briefcase },
  { title: "İletişim", url: "/admin/messages", icon: Mail },
  { title: "Sosyal & Harita", url: "/admin/social-map", icon: MapPin },
  { title: "Ayarlar", url: "/admin/settings", icon: Settings },
];

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  
  // GÜVENLİK: Kimlik doğrulama durumu
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Bildirim (Badge) State'leri
  const [unreadCareersCount, setUnreadCareersCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    setIsClient(true);
    
    if (isLoginPage) {
      setIsAuthenticated(false);
      return;
    }

    const token = localStorage.getItem("admin_token");
    const storedUser = localStorage.getItem("admin_user");

    if (!token || !storedUser) {
      window.location.href = "/admin/login";
    } else {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        window.location.href = "/admin/login";
      }
    }

    // GÜVENLİK DUVARI: Tüm fetch isteklerine Token ekle ve 401 gelirse sistemden at
    const originalFetch = window.fetch;
    window.fetch = async function () {
      let [resource, config] = arguments;
      
      // Sadece kendi API'mize giden istekleri yakala
      if (typeof resource === 'string' && resource.includes('/api/v1/')) {
        const currentToken = localStorage.getItem('admin_token');
        if (currentToken) {
          config = config || {};
          config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${currentToken}`
          };
        }
      }
      
      const response = await originalFetch(resource, config);
      
      // Eğer Backend JWT Middleware "401 Unauthorized" verirse
      if (response.status === 401 && !isLoginPage) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        window.location.href = "/admin/login";
      }
      
      return response;
    };

    return () => {
      window.fetch = originalFetch; // Temizlik
    };
  }, [isLoginPage]);

  // Yeni Başvuruları Çek & Event Listener Dinle
  useEffect(() => {
    if (isAuthenticated && !isLoginPage) {
      const fetchUnreadCount = async () => {
        try {
          const [appsRes, msgsRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/applications/unread-count?t=${new Date().getTime()}`, { cache: 'no-store' }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/messages/unread-count?t=${new Date().getTime()}`, { cache: 'no-store' })
          ]);
          
          if (appsRes.ok) {
            const appData = await appsRes.json();
            setUnreadCareersCount(appData.count || 0);
          }
          if (msgsRes.ok) {
            const msgData = await msgsRes.json();
            setUnreadMessagesCount(msgData.unread_count || 0);
          }
        } catch (e) {
          console.error("Unread count error", e);
        }
      };

      fetchUnreadCount();
      
      const handleAppsReadEvent = () => setUnreadCareersCount(0);
      const handleMsgsReadEvent = () => setUnreadMessagesCount(0);
      
      window.addEventListener("orbit_apps_read", handleAppsReadEvent);
      window.addEventListener("orbit_messages_read", handleMsgsReadEvent);

      return () => {
        window.removeEventListener("orbit_apps_read", handleAppsReadEvent);
        window.removeEventListener("orbit_messages_read", handleMsgsReadEvent);
      };
    }
  }, [isAuthenticated, isLoginPage, pathname]);

  // Sunucu tarafında veya istemci (client) yüklenmeden önce hiçbir şey render etme
  if (!isClient) return null;

  if (isLoginPage) {
    return <>{children}</>;
  }

  // EN KRİTİK GÜVENLİK KİLİDİ: Eğer kimlik doğrulanmadıysa ekranı SİMSİYAH yap, içeriğin 1 pikselini bile sızdırma!
  if (isAuthenticated !== true) {
    return <div style={{ backgroundColor: '#0a0a0a', width: '100vw', height: '100vh' }}></div>;
  }

  const currentTitle =
    menuItems.find((m) => m.url === pathname)?.title || "Dashboard";

  return (
    <div className={styles.layoutContainer}>
      
      {/* SIDEBAR - Tamamen CSS Modülleri İle */}
      <aside className={styles.sidebar}>
        
        {/* Logo Alanı */}
        <Link href="/admin" className={styles.logoArea}>
          <img src="/img/logo.png" alt="Orbit Logo" style={{ width: '110px', objectFit: 'contain' }} />
        </Link>

        {/* Menü */}
        <div className={styles.sidebarMenu}>
          <div className={styles.menuLabel}>Menü</div>
          {menuItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <Link
                key={item.title}
                href={item.url}
                className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
              >
                <item.icon size={18} />
                {item.title}
                {item.title === "Kariyer" && unreadCareersCount > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    minWidth: '20px',
                    textAlign: 'center',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)'
                  }}>
                    {unreadCareersCount}
                  </span>
                )}
                {item.title === "İletişim" && unreadMessagesCount > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    minWidth: '20px',
                    textAlign: 'center',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)'
                  }}>
                    {unreadMessagesCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Alt Kısım - Çıkış */}
        <div className={styles.sidebarFooter}>
          <button onClick={() => {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_user");
            window.location.href = "/admin/login";
          }} className={styles.logoutBtn}>
            <LogOut size={18} />
            Oturumu Kapat
          </button>
        </div>
      </aside>

      {/* ANA İÇERİK */}
      <main className={styles.mainArea}>
        
        {/* Üst Bar */}
        <header className={styles.topHeader}>
          <div className={styles.breadcrumb}>
            <span className={styles.breadcrumbText}>Admin</span>
            <span className={styles.breadcrumbDivider}>/</span>
            <span className={styles.breadcrumbCurrent}>{currentTitle}</span>
          </div>
          
          <div className={styles.headerActions}>
            <div className={styles.userProfile}>
              <div className={styles.userInfo}>
                <span className={styles.userEmail}>{user?.email || "admin@orbit.com"}</span>
                <span className={styles.userRole}>Sistem Yöneticisi</span>
              </div>
              <div className={styles.userAvatar}>
                {user?.email?.[0]?.toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Sayfa İçeriği */}
        <div className={styles.pageContent}>
          <div className={styles.contentWrapper}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
