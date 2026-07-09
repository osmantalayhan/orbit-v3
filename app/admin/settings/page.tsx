"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "../admin.module.css";
import { Save, Settings, Users, UploadCloud, Plus, Trash2, KeyRound, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import Toast from "../../../components/Toast";

interface SettingsData {
  id: number;
  site_title: string;
  site_description: string;
  site_keywords: string;
  logo_url: string;
  favicon_url: string;
  // Diğer alanları bozmuyoruz
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  map_latitude: number;
  map_longitude: number;
  social_linkedin: string;
  social_youtube: string;
  social_x: string;
  social_github: string;
  social_links_json: string;
  offices_json: string;
}

interface AdminUser {
  id: number;
  email: string;
  role: string;
  last_login: string;
  created_at: string;
}

export default function SettingsAdminPage() {
  const [activeTab, setActiveTab] = useState<"site" | "admins">("site");
  
  // Site Settings States
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Admin Users States
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState<number | null>(null);
  const [newUser, setNewUser] = useState({ email: "", password: "", confirmPassword: "" });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" as "success" | "error" });
  
  // Current logged in user
  const [currentUser, setCurrentUser] = useState<{id: number, email: string} | null>(null);

  // Refs for hidden file inputs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
    fetchUsers();
    
    try {
      const userStr = localStorage.getItem("admin_user");
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    } catch (e) {}
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings?t=${new Date().getTime()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Ayarlar getirilemedi");
      const json = await res.json();
      setData(json.SiteSettings || json);
    } catch (err: any) {
      console.error(err);
      showToast("Ayarlar yüklenemedi.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users?t=${new Date().getTime()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Yöneticiler getirilemedi");
      const json = await res.json();
      setUsers(json || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
  };

  // --- SITE SETTINGS LOGIC ---
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    setSaving(true);
    try {
      const payloadToSave = {
        site_title: data.site_title,
        site_description: data.site_description,
        site_keywords: data.site_keywords,
        logo_url: data.logo_url,
        favicon_url: data.favicon_url,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        contact_address: data.contact_address,
        map_latitude: parseFloat(String(data.map_latitude)) || 0,
        map_longitude: parseFloat(String(data.map_longitude)) || 0,
        social_linkedin: data.social_linkedin,
        social_youtube: data.social_youtube,
        social_x: data.social_x,
        social_github: data.social_github,
        social_links_json: data.social_links_json,
        offices_json: data.offices_json,
      };

      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadToSave),
      });

      if (!res.ok) throw new Error("Kaydedilemedi");
      showToast("Site ayarları başarıyla güncellendi!", "success");

      // Favicon değiştiyse DOM'u anında güncelle (tarayıcı cache'ini bypass et)
      if (data.favicon_url) {
        const bustUrl = `${data.favicon_url}?_cb=${Date.now()}`;
        document
          .querySelectorAll("link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']")
          .forEach((el) => el.remove());
        const addLink = (rel: string, href: string) => {
          const link = document.createElement("link");
          link.rel = rel;
          link.href = href;
          document.head.appendChild(link);
        };
        addLink("icon", bustUrl);
        addLink("shortcut icon", bustUrl);
        addLink("apple-touch-icon", bustUrl);
      }
    } catch (err: any) {
      showToast("Hata: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logo_url" | "favicon_url") => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu 5MB'dan büyük olamaz!");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload`, {
        method: "POST",
        body: formData,
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Yükleme hatası");

      const updatedData = data ? { ...data, [field]: resData.url } : null;
      setData(updatedData);
      
      if (updatedData) {
        // Strict mapping to avoid Unprocessable Entity from Go
        const payloadToSave = {
          site_title: updatedData.site_title,
          site_description: updatedData.site_description,
          site_keywords: updatedData.site_keywords,
          logo_url: updatedData.logo_url,
          favicon_url: updatedData.favicon_url,
          contact_email: updatedData.contact_email,
          contact_phone: updatedData.contact_phone,
          contact_address: updatedData.contact_address,
          map_latitude: parseFloat(String(updatedData.map_latitude)) || 0,
          map_longitude: parseFloat(String(updatedData.map_longitude)) || 0,
          social_linkedin: updatedData.social_linkedin,
          social_youtube: updatedData.social_youtube,
          social_x: updatedData.social_x,
          social_github: updatedData.social_github,
          social_links_json: updatedData.social_links_json,
          offices_json: updatedData.offices_json,
        };

        // Dosya yüklendikten sonra anında veritabanına kaydet
        const saveRes = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadToSave),
        });
        if (!saveRes.ok) {
          const errData = await saveRes.json().catch(() => ({}));
          throw new Error(errData.error || "Veritabanına kaydedilemedi");
        }

        // Eğer favicon yüklendiyse DOM'u hemen güncelle
        if (field === "favicon_url") {
          const bustUrl = `${resData.url}?_cb=${Date.now()}`;
          document
            .querySelectorAll("link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']")
            .forEach((el) => el.remove());
          const addLink = (rel: string, href: string) => {
            const link = document.createElement("link");
            link.rel = rel;
            link.href = href;
            document.head.appendChild(link);
          };
          addLink("icon", bustUrl);
          addLink("shortcut icon", bustUrl);
          addLink("apple-touch-icon", bustUrl);
        }
      }

      showToast("Dosya başarıyla yüklendi ve kaydedildi", "success");
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // --- ADMIN USERS LOGIC ---
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[a-z]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const handleAddUser = async () => {
    if (newUser.password !== newUser.confirmPassword) {
      showToast("Şifreler eşleşmiyor!", "error");
      return;
    }
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newUser.email, password: newUser.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eklenemedi");
      
      showToast("Yönetici başarıyla eklendi", "success");
      setShowAddUserModal(false);
      setNewUser({ email: "", password: "", confirmPassword: "" });
      fetchUsers();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleChangePassword = async () => {
    if (!showPasswordModal) return;
    if (newPassword !== confirmPassword) {
      showToast("Şifreler eşleşmiyor!", "error");
      return;
    }
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users/${showPasswordModal}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Güncellenemedi");
      
      showToast("Şifre başarıyla güncellendi", "success");
      setShowPasswordModal(null);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (currentUser?.id === id) {
      showToast("Giriş yaptığınız kendi hesabınızı silemezsiniz!", "error");
      return;
    }
    if (!window.confirm("Bu yöneticiyi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Silinemedi");
      
      showToast("Yönetici başarıyla silindi", "success");
      fetchUsers();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  if (loading) return <div style={{ padding: "40px", color: "#a1a1aa", textAlign: "center" }}>Yükleniyor...</div>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <div>
          <h2 className={styles.pageTitle}>Ana Ayarlar</h2>
          <p className={styles.pageDesc}>
            Web sitenizin genel yapılandırmasını ve panel yöneticilerini buradan kontrol edebilirsiniz.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #27272a', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab("site")}
          style={{
            background: 'transparent',
            border: 'none',
            color: activeTab === "site" ? '#fff' : '#a1a1aa',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeTab === "site" ? '2px solid #3b82f6' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <Settings size={18} /> Site Ayarları
        </button>
        <button
          onClick={() => setActiveTab("admins")}
          style={{
            background: 'transparent',
            border: 'none',
            color: activeTab === "admins" ? '#fff' : '#a1a1aa',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeTab === "admins" ? '2px solid #3b82f6' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <Users size={18} /> Yöneticiler
        </button>
      </div>

      {/* TAB CONTENT: SITE SETTINGS */}
      {activeTab === "site" && data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={handleSaveSettings} 
              disabled={saving}
              style={{ backgroundColor: '#fff', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 600, cursor: 'pointer' }}
            >
              {saving ? <Loader2 size={16} className={styles.spin} /> : <Save size={16} />}
              {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Logo & Favicon Upload */}
            <div className={styles.panelCard} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0, paddingBottom: '16px', borderBottom: '1px solid #27272a' }}>Görseller (Logo & Favicon)</h3>
              
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: '#000', border: '1px solid #27272a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '8px' }}>
                  {data.logo_url ? <img src={data.logo_url} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : <span style={{ color: '#52525b', fontSize: '12px' }}>Yok</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.formLabel}>Site Logosu</label>
                  <p style={{ fontSize: '12px', color: '#a1a1aa', margin: '4px 0 12px 0' }}>Sitenin sol üst köşesinde görünecek ana logo. (SVG veya PNG önerilir)</p>
                  <input type="file" accept="image/*" ref={logoInputRef} style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, "logo_url")} />
                  <button onClick={() => logoInputRef.current?.click()} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px dashed rgba(59, 130, 246, 0.3)', padding: '8px 16px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                    <UploadCloud size={16} /> Logo Yükle
                  </button>
                </div>
              </div>

              {/* Favicon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '16px' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: '#000', border: '1px solid #27272a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '8px' }}>
                  {data.favicon_url ? <img src={data.favicon_url} alt="Favicon" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : <span style={{ color: '#52525b', fontSize: '12px' }}>Yok</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.formLabel}>Favicon</label>
                  <p style={{ fontSize: '12px', color: '#a1a1aa', margin: '4px 0 12px 0' }}>Tarayıcı sekmesinde görünecek küçük ikon. (Kare formatında olmalıdır)</p>
                  <input type="file" accept="image/*" ref={faviconInputRef} style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, "favicon_url")} />
                  <button onClick={() => faviconInputRef.current?.click()} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px dashed rgba(59, 130, 246, 0.3)', padding: '8px 16px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                    <UploadCloud size={16} /> Favicon Yükle
                  </button>
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className={styles.panelCard} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0, paddingBottom: '16px', borderBottom: '1px solid #27272a' }}>SEO ve Meta Bilgileri</h3>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Site Başlığı (Title)</label>
                <input type="text" name="site_title" value={data.site_title || ""} onChange={handleSettingsChange} className={styles.formInput} placeholder="Örn: Orbit Teknoloji | Geleceğin Yazılım Çözümleri" />
                <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '6px' }}>Arama motorlarında ve sekmede görünecek ana başlık.</p>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Site Açıklaması (Description)</label>
                <textarea name="site_description" value={data.site_description || ""} onChange={handleSettingsChange} className={styles.formInput} rows={3} placeholder="Sitenizin kısa açıklaması..."></textarea>
                <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '6px' }}>Google aramalarında başlığın altında çıkacak açıklama metni.</p>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Anahtar Kelimeler (Keywords)</label>
                <input type="text" name="site_keywords" value={data.site_keywords || ""} onChange={handleSettingsChange} className={styles.formInput} placeholder="yazılım, teknoloji, web tasarım, yapay zeka" />
                <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '6px' }}>Virgülle ayırarak yazınız.</p>
              </div>
            </div>

            {/* İletişim Bilgileri */}
            <div className={styles.panelCard} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0, paddingBottom: '16px', borderBottom: '1px solid #27272a' }}>Genel İletişim Bilgileri</h3>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>E-Posta Adresi</label>
                <input type="email" name="contact_email" value={data.contact_email || ""} onChange={handleSettingsChange} className={styles.formInput} placeholder="info@orbit.com" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Telefon Numarası</label>
                <input type="text" name="contact_phone" value={data.contact_phone || ""} onChange={handleSettingsChange} className={styles.formInput} placeholder="+90 555 123 4567" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Merkez Adres</label>
                <textarea name="contact_address" value={data.contact_address || ""} onChange={handleSettingsChange} className={styles.formInput} rows={3} placeholder="Merkez ofis adresi..."></textarea>
              </div>
            </div>

            {/* Sosyal Medya */}
            <div className={styles.panelCard} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0, paddingBottom: '16px', borderBottom: '1px solid #27272a' }}>Sosyal Medya Linkleri</h3>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>LinkedIn</label>
                <input type="url" name="social_linkedin" value={data.social_linkedin || ""} onChange={handleSettingsChange} className={styles.formInput} placeholder="https://linkedin.com/company/..." />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>YouTube</label>
                <input type="url" name="social_youtube" value={data.social_youtube || ""} onChange={handleSettingsChange} className={styles.formInput} placeholder="https://youtube.com/..." />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>X (Twitter)</label>
                <input type="url" name="social_x" value={data.social_x || ""} onChange={handleSettingsChange} className={styles.formInput} placeholder="https://x.com/..." />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>GitHub</label>
                <input type="url" name="social_github" value={data.social_github || ""} onChange={handleSettingsChange} className={styles.formInput} placeholder="https://github.com/..." />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ADMIN USERS */}
      {activeTab === "admins" && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => setShowAddUserModal(true)}
              style={{ backgroundColor: '#fff', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 600, cursor: 'pointer' }}
            >
              <Plus size={16} /> Yeni Yönetici Ekle
            </button>
          </div>

          <div className={styles.panelCard} style={{ padding: 0, overflow: 'hidden' }}>
            {usersLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#a1a1aa' }}>Yöneticiler yükleniyor...</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid #27272a' }}>
                    <th style={{ padding: '16px', color: '#a1a1aa', fontWeight: 500, fontSize: '13px' }}>ID</th>
                    <th style={{ padding: '16px', color: '#a1a1aa', fontWeight: 500, fontSize: '13px' }}>E-Posta (Kullanıcı Adı)</th>
                    <th style={{ padding: '16px', color: '#a1a1aa', fontWeight: 500, fontSize: '13px' }}>Rol</th>
                    <th style={{ padding: '16px', color: '#a1a1aa', fontWeight: 500, fontSize: '13px' }}>Son Giriş</th>
                    <th style={{ padding: '16px', color: '#a1a1aa', fontWeight: 500, fontSize: '13px', textAlign: 'right' }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #27272a' }}>
                      <td style={{ padding: '16px', color: '#fff', fontSize: '14px' }}>#{u.id}</td>
                      <td style={{ padding: '16px', color: '#fff', fontSize: '14px', fontWeight: 500 }}>{u.email}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{u.role.toUpperCase()}</span>
                      </td>
                      <td style={{ padding: '16px', color: '#a1a1aa', fontSize: '13px' }}>
                        {new Date(u.last_login).getFullYear() > 2000 ? new Date(u.last_login).toLocaleString('tr-TR') : 'Hiç girmedi'}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button onClick={() => setShowPasswordModal(u.id)} style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '4px', marginRight: '12px' }} title="Şifre Değiştir">
                          <KeyRound size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u.id)} 
                          style={{ background: 'transparent', border: 'none', color: currentUser?.id === u.id ? '#52525b' : '#ef4444', cursor: currentUser?.id === u.id ? 'not-allowed' : 'pointer', padding: '4px' }} 
                          title={currentUser?.id === u.id ? "Kendinizi silemezsiniz" : "Sil"}
                          disabled={currentUser?.id === u.id}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#a1a1aa' }}>Hiç yönetici bulunamadı.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Yeni Yönetici Ekle */}
      {showAddUserModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ margin: '0 0 24px 0', color: '#fff', fontSize: '20px' }}>Yeni Yönetici Ekle</h3>
            <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
              <label className={styles.formLabel}>E-Posta Adresi</label>
              <input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className={styles.formInput} placeholder="admin@sirket.com" />
            </div>
            <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
              <label className={styles.formLabel}>Şifre</label>
              <input type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className={styles.formInput} placeholder="••••••••" />
              {newUser.password.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', gap: '4px', height: '6px' }}>
                    {[1, 2, 3, 4].map(i => {
                      const strength = calculateStrength(newUser.password);
                      const active = strength >= i * 25;
                      let color = '#3f3f46';
                      if (active) {
                        if (strength <= 25) color = '#ef4444'; // red
                        else if (strength <= 50) color = '#f59e0b'; // orange
                        else if (strength <= 75) color = '#eab308'; // yellow
                        else color = '#22c55e'; // green
                      }
                      return <div key={i} style={{ flex: 1, backgroundColor: color, borderRadius: '4px', transition: 'all 0.3s ease' }} />;
                    })}
                  </div>
                  <p style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '8px', lineHeight: '1.4' }}>
                    Şifreniz en az 8 karakter, 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter içermelidir.
                  </p>
                </div>
              )}
            </div>
            <div className={styles.formGroup} style={{ marginBottom: '32px' }}>
              <label className={styles.formLabel}>Şifre (Tekrar)</label>
              <input type="password" value={newUser.confirmPassword} onChange={e => setNewUser({...newUser, confirmPassword: e.target.value})} className={styles.formInput} placeholder="••••••••" />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAddUserModal(false)} style={{ backgroundColor: 'transparent', color: '#a1a1aa', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>İptal</button>
              <button onClick={handleAddUser} style={{ backgroundColor: '#fff', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Ekle</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Şifre Değiştir */}
      {showPasswordModal !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ margin: '0 0 24px 0', color: '#fff', fontSize: '20px' }}>Şifre Güncelle</h3>
            <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
              <label className={styles.formLabel}>Yeni Şifre</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={styles.formInput} placeholder="Yeni şifreyi girin..." />
              {newPassword.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', gap: '4px', height: '6px' }}>
                    {[1, 2, 3, 4].map(i => {
                      const strength = calculateStrength(newPassword);
                      const active = strength >= i * 25;
                      let color = '#3f3f46';
                      if (active) {
                        if (strength <= 25) color = '#ef4444'; // red
                        else if (strength <= 50) color = '#f59e0b'; // orange
                        else if (strength <= 75) color = '#eab308'; // yellow
                        else color = '#22c55e'; // green
                      }
                      return <div key={i} style={{ flex: 1, backgroundColor: color, borderRadius: '4px', transition: 'all 0.3s ease' }} />;
                    })}
                  </div>
                  <p style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '8px', lineHeight: '1.4' }}>
                    Şifreniz en az 8 karakter, 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter içermelidir.
                  </p>
                </div>
              )}
            </div>
            <div className={styles.formGroup} style={{ marginBottom: '32px' }}>
              <label className={styles.formLabel}>Yeni Şifre (Tekrar)</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={styles.formInput} placeholder="Yeni şifreyi tekrar girin..." />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowPasswordModal(null)} style={{ backgroundColor: 'transparent', color: '#a1a1aa', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>İptal</button>
              <button onClick={handleChangePassword} style={{ backgroundColor: '#fff', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Güncelle</button>
            </div>
          </div>
        </div>
      )}

      <Toast 
        isVisible={toast.isVisible} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />
    </div>
  );
}
