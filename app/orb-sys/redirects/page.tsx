"use client";

import React, { useEffect, useState } from "react";
import styles from "../orb-sys.module.css";
import { Link2, Plus, Edit2, Trash2, X, Link } from "lucide-react";
import { apiClient } from "@/lib/api";
import Toast from "../../../components/Toast";

type Redirect = {
  id: number;
  old_url: string;
  new_url: string;
  is_active: boolean;
  created_at: string;
};

export default function AdminRedirectsPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    old_url: "",
    new_url: "",
    is_active: true
  });

  // Delete State
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Toast
  const [toast, setToast] = useState<{ isVisible: boolean, message: string, type: "success" | "error" }>({ isVisible: false, message: "", type: "success" });

  useEffect(() => {
    fetchRedirects();
  }, []);

  const fetchRedirects = async () => {
    try {
      setLoading(true);
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/redirects`);
      if (!res.ok) throw new Error("Yönlendirmeler yüklenirken hata oluştu.");
      const data = await res.json();
      setRedirects(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ old_url: "", new_url: "", is_active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (r: Redirect) => {
    setEditingId(r.id);
    setFormData({ old_url: r.old_url, new_url: r.new_url, is_active: r.is_active });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.old_url.trim() || !formData.new_url.trim()) {
      alert("Lütfen hem eski URL'i hem de yeni URL'i giriniz.");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/redirects/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/redirects`;

      const res = await apiClient(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Hata: ${errorData.error} | Detay: ${errorData.details}`);
        return;
      }

      setToast({ isVisible: true, message: "Yönlendirme başarıyla kaydedildi.", type: "success" });
      setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
      setIsModalOpen(false);
      fetchRedirects();
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu.");
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/redirects/${deletingId}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        alert("Silme işlemi başarısız.");
        return;
      }

      setToast({ isVisible: true, message: "Yönlendirme başarıyla silindi.", type: "success" });
      setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
      setDeletingId(null);
      fetchRedirects();
    } catch (err) {
      console.error(err);
      alert("Silinirken hata oluştu.");
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <Toast 
        message={toast.message} 
        isVisible={toast.isVisible} 
        type={toast.type} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />

      <div className={styles.dashboardHeader}>
        <div>
          <h2 className={styles.pageTitle}>URL Yönlendirmeleri</h2>
          <p className={styles.pageDesc}>
            Eski sayfalara veya broşürlerdeki QR kod linklerine gelen istekleri yeni sayfalara yönlendirin (301 Redirect).
          </p>
        </div>
        <button className={styles.downloadBtn} onClick={openAddModal}>
          <Plus size={16} />
          Yeni Yönlendirme
        </button>
      </div>

      <div className={styles.panelCard} style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#a1a1aa' }}>Yükleniyor...</div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>{error}</div>
        ) : redirects.length === 0 ? (
          <div style={{ padding: '60px 40px', textAlign: 'center', color: '#a1a1aa' }}>
            <Link size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p>Henüz hiçbir URL yönlendirmesi oluşturulmamış.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper} style={{ overflowX: 'auto', padding: '16px' }}>
            <table className={styles.adminTable} style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid #27272a', color: '#a1a1aa' }}>ESKİ URL</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid #27272a', color: '#a1a1aa' }}>YENİ HEDEF URL</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid #27272a', color: '#a1a1aa' }}>DURUM</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid #27272a', color: '#a1a1aa', textAlign: 'right' }}>İŞLEMLER</th>
                </tr>
              </thead>
              <tbody>
                {redirects.map((r) => (
                  <tr key={r.id}>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #27272a', fontWeight: 500, color: '#f87171' }}>{r.old_url}</td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #27272a', fontWeight: 500, color: '#4ade80' }}>{r.new_url}</td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #27272a' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: r.is_active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        color: r.is_active ? '#4ade80' : '#ef4444'
                      }}>
                        {r.is_active ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #27272a' }}>
                      <div className={styles.tableActions}>
                        <button className={styles.actionBtn} onClick={() => openEditModal(r)} title="Düzenle">
                          <Edit2 size={16} />
                        </button>
                        <button className={styles.actionBtn} onClick={() => setDeletingId(r.id)} style={{ color: '#ef4444' }} title="Sil">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#18181b', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px', border: '1px solid #27272a', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <h3 style={{ margin: '0 0 24px 0', color: '#fff', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link2 size={20} color="#3b82f6" />
              {editingId ? "Yönlendirmeyi Düzenle" : "Yeni Yönlendirme Ekle"}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#a1a1aa', display: 'block', marginBottom: '8px' }}>Eski URL (Yakalanacak Link)</label>
                <input 
                  type="text" 
                  value={formData.old_url}
                  onChange={(e) => setFormData({...formData, old_url: e.target.value})}
                  placeholder="Örn: /kampanya-2023"
                  style={{ width: '100%', padding: '12px 16px', backgroundColor: '#09090b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '14px' }} 
                />
                <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '6px', marginBottom: 0, lineHeight: '1.4' }}>
                  Tam domain yazmayın, sadece sayfa uzantısını girin. Örn: <strong>/eski-sayfam</strong>
                </p>
              </div>

              <div>
                <label style={{ fontSize: '13px', color: '#a1a1aa', display: 'block', marginBottom: '8px' }}>Yeni URL (Hedef Link)</label>
                <input 
                  type="text" 
                  value={formData.new_url}
                  onChange={(e) => setFormData({...formData, new_url: e.target.value})}
                  placeholder="Örn: /kampanyalar/2026"
                  style={{ width: '100%', padding: '12px 16px', backgroundColor: '#09090b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '14px' }} 
                />
                <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '6px', marginBottom: 0, lineHeight: '1.4' }}>
                  Yönlendirilecek adres. Site içi için: <strong>/yeni-sayfa</strong>, Dış site için: <strong>https://google.com</strong>
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <input 
                  type="checkbox" 
                  id="isActiveToggle"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  style={{ width: '18px', height: '18px', accentColor: '#3b82f6', cursor: 'pointer' }}
                />
                <label htmlFor="isActiveToggle" style={{ fontSize: '14px', color: '#fff', cursor: 'pointer' }}>
                  Bu yönlendirme kuralı şu an aktif olsun
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: 'transparent', color: '#d4d4d8', cursor: 'pointer', fontWeight: 500 }}>İptal</button>
              <button onClick={handleSave} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* Silme Modal */}
      {deletingId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#18181b', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '400px', border: '1px solid #27272a' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '18px', fontWeight: 600 }}>Silme Onayı</h3>
            <p style={{ color: '#a1a1aa', margin: '0 0 24px 0', fontSize: '14px', lineHeight: '1.5' }}>
              Bu yönlendirme kuralını silmek istediğinize emin misiniz? Silindikten sonra eski linkleri tıklayan ziyaretçiler 404 (Sayfa Bulunamadı) hatası alabilir.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeletingId(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: 'transparent', color: '#d4d4d8', cursor: 'pointer', fontWeight: 500 }}>İptal</button>
              <button onClick={confirmDelete} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
