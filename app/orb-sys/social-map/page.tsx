"use client";

import React, { useState, useEffect } from "react";
import styles from "../orb-sys.module.css";
import { Save, Map, Share2, Mail, Phone, MapPin, Loader2, Plus, Trash2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import Toast from "../../../components/Toast";

interface OfficeLocation {
  name: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface SocialLink {
  name: string;
  url: string;
}

interface SettingsData {
  id: number;
  site_title: string;
  site_description: string;
  logo_url: string;
  favicon_url: string;
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

export default function SocialMapAdminPage() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [offices, setOffices] = useState<OfficeLocation[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" as "success" | "error" });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings?t=${new Date().getTime()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Ayarlar getirilemedi");
      const json = await res.json();
      
      let settingsObj = json.SiteSettings || json;
      setData(settingsObj);
      
      if (json.offices && json.offices.length > 0) {
        setOffices(json.offices);
      } else if (settingsObj.offices_json && settingsObj.offices_json !== "[]") {
        try {
          setOffices(JSON.parse(settingsObj.offices_json));
        } catch (e) {
          setOffices([]);
        }
      } else {
        setOffices([]);
      }

      if (settingsObj.social_links_json && settingsObj.social_links_json !== "[]") {
        try {
          setSocialLinks(JSON.parse(settingsObj.social_links_json));
        } catch (e) {
          setSocialLinks([]);
        }
      } else {
        setSocialLinks([]);
      }
    } catch (err: any) {
      console.error(err);
      setToast({ isVisible: true, message: "Veriler yüklenemedi.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    setSaving(true);
    try {
      // Serialize offices to JSON string before sending
      const payload = {
        ...data,
        offices_json: JSON.stringify(offices),
        social_links_json: JSON.stringify(socialLinks)
      };

      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Kaydedilemedi");
      setToast({ isVisible: true, message: "Ayarlar ve Ofisler başarıyla güncellendi!", type: "success" });
    } catch (err: any) {
      setToast({ isVisible: true, message: "Hata: " + err.message, type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleOfficeChange = (index: number, field: keyof OfficeLocation, value: string | number) => {
    const newOffices = [...offices];
    newOffices[index] = { ...newOffices[index], [field]: value };
    setOffices(newOffices);
  };

  const addOffice = () => {
    setOffices([...offices, { name: "Yeni Ofis", city: "", address: "", latitude: 41.0, longitude: 28.9 }]);
  };

  const removeOffice = (index: number) => {
    const newOffices = offices.filter((_, i) => i !== index);
    setOffices(newOffices);
  };

  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSocialLinks(newLinks);
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { name: "", url: "" }]);
  };

  const removeSocialLink = (index: number) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(newLinks);
  };

  if (loading) return <div style={{ padding: "40px", color: "#a1a1aa", textAlign: "center" }}>Yükleniyor...</div>;
  if (!data) return <div style={{ padding: "40px", color: "#ef4444", textAlign: "center" }}>Veri bulunamadı. Lütfen sayfayı yenileyin.</div>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className={styles.pageTitle}>Sosyal Medya & Harita</h2>
          <p className={styles.pageDesc}>
            Web sitenizin genel iletişim bilgilerini, harita konumlarını (ofisler) ve sosyal medya bağlantılarını yönetin.
          </p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className={styles.formButton} 
          style={{ backgroundColor: '#fff', color: '#000', border: 'none', padding: '10px 20px', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 600 }}
        >
          {saving ? <Loader2 size={16} className={styles.spin} /> : <Save size={16} />}
          {saving ? "Kaydediliyor..." : "Tümünü Kaydet"}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Üst Kısım: Genel İletişim & Sosyal Medya (Yan Yana) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          <div className={styles.panelCard} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #27272a', paddingBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={18} color="#ef4444" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0 }}>Genel İletişim Bilgileri</h3>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>E-Posta Adresi</label>
              <input type="email" name="contact_email" value={data.contact_email || ""} onChange={handleChange} className={styles.formInput} placeholder="ornek@orbit.com.tr" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Telefon Numarası</label>
              <input type="text" name="contact_phone" value={data.contact_phone || ""} onChange={handleChange} className={styles.formInput} placeholder="+90 555 555 5555" />
            </div>
          </div>

          <div className={styles.panelCard} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #27272a', paddingBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Share2 size={18} color="#3b82f6" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0 }}>Sosyal Medya Bağlantıları</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>LinkedIn</label>
                <input type="url" name="social_linkedin" value={data.social_linkedin || ""} onChange={handleChange} className={styles.formInput} placeholder="https://linkedin.com/..." />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>X (Twitter)</label>
                <input type="url" name="social_x" value={data.social_x || ""} onChange={handleChange} className={styles.formInput} placeholder="https://x.com/..." />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>YouTube</label>
                <input type="url" name="social_youtube" value={data.social_youtube || ""} onChange={handleChange} className={styles.formInput} placeholder="https://youtube.com/..." />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>GitHub</label>
                <input type="url" name="social_github" value={data.social_github || ""} onChange={handleChange} className={styles.formInput} placeholder="https://github.com/..." />
              </div>
            </div>
            
            <div style={{ marginTop: '16px', borderTop: '1px dashed #27272a', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', color: '#d4d4d8', margin: 0 }}>Diğer Sosyal Ağlar (İsteğe Bağlı)</h4>
                <button 
                  onClick={addSocialLink}
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', cursor: 'pointer' }}
                >
                  <Plus size={14} /> Ekle
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {socialLinks.map((link, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '8px', alignItems: 'center' }}>
                    <input type="text" value={link.name} onChange={(e) => handleSocialLinkChange(idx, 'name', e.target.value)} className={styles.formInput} placeholder="İsim (Örn: Instagram)" />
                    <input type="url" value={link.url} onChange={(e) => handleSocialLinkChange(idx, 'url', e.target.value)} className={styles.formInput} placeholder="Link (https://...)" />
                    <button onClick={() => removeSocialLink(idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {socialLinks.length === 0 && (
                  <div style={{ fontSize: '12px', color: '#a1a1aa', fontStyle: 'italic' }}>Ek ağ bulunmuyor.</div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Alt Kısım: Ofisler & Haritalar */}
        <div className={styles.panelCard} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #27272a', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={18} color="#10b981" />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0 }}>Ofisler ve Harita Konumları</h3>
                <p style={{ fontSize: '12px', color: '#a1a1aa', margin: '4px 0 0 0' }}>Buraya eklediğiniz her ofis, iletişim sayfasında yan yana yeni bir harita olarak görünecektir.</p>
              </div>
            </div>
            <button 
              onClick={addOffice}
              style={{ backgroundColor: '#fff', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              <Plus size={16} /> Yeni Ofis Ekle
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {offices.map((office, index) => (
              <div key={index} style={{ backgroundColor: '#121212', border: '1px solid #27272a', borderRadius: '12px', padding: '20px', position: 'relative' }}>
                <button 
                  onClick={() => removeOffice(index)}
                  style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: offices.length > 1 ? 1 : 0.3, pointerEvents: offices.length > 1 ? 'auto' : 'none' }}
                  title={offices.length > 1 ? "Ofisi Sil" : "En az 1 ofis kalmalıdır"}
                >
                  <Trash2 size={18} />
                </button>
                
                <h4 style={{ fontSize: '14px', color: '#d4d4d8', margin: '0 0 16px 0' }}>Ofis #{index + 1}</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Ofis İsmi (Haritada Görünür)</label>
                    <input type="text" value={office.name} onChange={(e) => handleOfficeChange(index, "name", e.target.value)} className={styles.formInput} placeholder="Örn: Merkez Ofis" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Şehir / Bölge</label>
                    <input type="text" value={office.city} onChange={(e) => handleOfficeChange(index, "city", e.target.value)} className={styles.formInput} placeholder="Örn: İstanbul" />
                  </div>
                  <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                    <label className={styles.formLabel}>Açık Adres (Haritada Görünür)</label>
                    <textarea value={office.address} onChange={(e) => handleOfficeChange(index, "address", e.target.value)} className={styles.formInput} rows={2} placeholder="Sokak, No, İlçe"></textarea>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Enlem (Latitude)</label>
                    <input type="number" step="any" value={office.latitude} onChange={(e) => handleOfficeChange(index, "latitude", parseFloat(e.target.value) || 0)} className={styles.formInput} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Boylam (Longitude)</label>
                    <input type="number" step="any" value={office.longitude} onChange={(e) => handleOfficeChange(index, "longitude", parseFloat(e.target.value) || 0)} className={styles.formInput} />
                  </div>
                </div>
              </div>
            ))}
            {offices.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px', color: '#a1a1aa', border: '1px dashed #27272a', borderRadius: '12px' }}>
                Hiç ofis eklenmemiş. Harita göstermek için "Yeni Ofis Ekle" butonuna tıklayın.
              </div>
            )}
          </div>
        </div>

      </div>

      <Toast 
        isVisible={toast.isVisible} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />
    </div>
  );
}
