"use client";

import React, { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { Plus, Edit2, Trash2, X, Image as ImageIcon, CheckCircle, XCircle } from "lucide-react";
import { apiClient } from "@/lib/api";

interface SalesChannel {
  id: number;
  name: string;
  url: string;
  image_url: string;
  sort_order: number;
  active: boolean;
}

export default function AdminSalesChannelsPage() {
  const [channels, setChannels] = useState<SalesChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    sort_order: 0,
    active: true,
    image_url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/sales-channels`);
      if (!res.ok) throw new Error("Satış kanalları yüklenirken hata oluştu.");
      const data = await res.json();
      setChannels(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({
      name: "",
      url: "",
      sort_order: 0,
      active: true,
      image_url: "",
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: SalesChannel) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || "",
      url: item.url || "",
      sort_order: item.sort_order || 0,
      active: item.active,
      image_url: item.image_url || "",
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu satış kanalını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/sales-channels/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Silme işlemi başarısız.");
      fetchChannels();
    } catch (err: any) {
      alert("Hata: " + err.message);
    }
  };

  const handleToggleActive = async (item: SalesChannel) => {
    try {
      const fd = new FormData();
      fd.append("name", item.name);
      fd.append("url", item.url || "");
      fd.append("sort_order", item.sort_order.toString());
      fd.append("active", (!item.active).toString());
      fd.append("image_url", item.image_url);

      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/sales-channels/${item.id}`, {
        method: "PUT",
        body: fd
      });
      if (!res.ok) throw new Error("Durum güncellenemedi.");
      fetchChannels();
    } catch (err: any) {
      alert("Hata: " + err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("url", formData.url);
      fd.append("sort_order", formData.sort_order.toString());
      fd.append("active", formData.active ? "true" : "false");
      if (formData.image_url) fd.append("image_url", formData.image_url);
      
      if (imageFile) {
        fd.append("image_file", imageFile);
      } else if (!formData.image_url) {
        throw new Error("Lütfen bir logo seçin veya yükleyin.");
      }

      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/sales-channels/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/sales-channels`;
      
      const method = editingId ? "PUT" : "POST";

      const res = await apiClient(url, { method, body: fd });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Kaydetme başarısız.");
      }

      setIsModalOpen(false);
      fetchChannels();
    } catch (err: any) {
      alert("Hata: " + err.message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("Dosya boyutu 5MB'dan büyük olamaz!");
        e.target.value = "";
        return;
      }
      setImageFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      
      <div className={styles.dashboardHeader}>
        <div>
          <h2 className={styles.pageTitle}>Satış Kanalları Yönetimi</h2>
          <p className={styles.pageDesc}>
            Web sitesindeki kayan logolarda yer alacak satış mağazalarını yönetin.
          </p>
        </div>
        <button className={styles.downloadBtn} onClick={openNewModal}>
          <Plus size={16} />
          Yeni Kanal Ekle
        </button>
      </div>

      <div className={styles.panelCard} style={{ padding: 0, overflow: 'hidden' }}>
        
        <div style={{ padding: '24px', borderBottom: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 600 }}>
            Toplam: {channels.length} Kanal
          </div>
        </div>

        {loading && <div style={{ padding: '40px', textAlign: 'center', color: '#a1a1aa' }}>Yükleniyor...</div>}
        {error && <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>{error}</div>}

        {!loading && !error && (
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead className={styles.tableHead}>
                <tr>
                  <th style={{ paddingLeft: '24px' }}>Logo & İsim</th>
                  <th>URL (Link)</th>
                  <th>Sıra</th>
                  <th>Durum</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {channels.length > 0 ? (
                  channels.map((item) => (
                    <tr key={item.id} className={styles.tableRow}>
                      <td style={{ paddingLeft: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ padding: '8px', backgroundColor: '#1a1a1a', borderRadius: '4px' }}>
                            <img src={item.image_url} alt={item.name} style={{ height: '30px', objectFit: 'contain' }} />
                          </div>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{item.name}</div>
                        </div>
                      </td>
                      <td style={{ color: '#a1a1aa' }}>
                        {item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6', textDecoration: 'underline'}}>{item.url}</a> : "-"}
                      </td>
                      <td style={{ color: '#d4d4d8' }}>
                        {item.sort_order}
                      </td>
                      <td>
                        {item.active ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '12px', fontWeight: 600, backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '4px' }}><CheckCircle size={12}/> Aktif</span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontSize: '12px', fontWeight: 600, backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '4px 8px', borderRadius: '4px' }}><XCircle size={12}/> Pasif</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px', borderRight: '1px solid #27272a', paddingRight: '16px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: item.active ? '#10b981' : '#a1a1aa' }}>
                              {item.active ? "Yayında" : "Gizli"}
                            </span>
                            <div style={{
                              position: 'relative', width: '32px', height: '18px', 
                              backgroundColor: item.active ? '#10b981' : '#3f3f46', 
                              borderRadius: '10px', transition: '0.3s',
                            }}>
                              <div style={{
                                position: 'absolute', top: '2px', left: item.active ? '16px' : '2px',
                                width: '14px', height: '14px', backgroundColor: '#fff', 
                                borderRadius: '50%', transition: '0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                              }} />
                            </div>
                            <input type="checkbox" checked={item.active} onChange={() => handleToggleActive(item)} style={{ display: 'none' }} />
                          </label>
                          
                          <button onClick={() => handleEdit(item)} className={styles.actionBtn} style={{ color: '#3b82f6' }} title="Düzenle">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className={styles.actionBtn} style={{ color: '#ef4444' }} title="Sil">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#a1a1aa' }}>
                      Henüz satış kanalı eklenmemiş.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.drawerOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.drawerContent} onClick={e => e.stopPropagation()} style={{ height: 'auto', maxHeight: '90vh', maxWidth: '600px', margin: 'auto', borderRadius: '16px', position: 'relative', top: '5vh' }}>
            <div className={styles.drawerHeader}>
              <div>
                <h3 className={styles.drawerTitle}>{editingId ? "Kanalı Düzenle" : "Yeni Kanal Ekle"}</h3>
                <p className={styles.drawerDesc} style={{ marginTop: '4px' }}>{editingId ? "Mevcut satış kanalını güncelleyin." : "Sisteme yeni bir satış kanalı ekleyin."}</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className={styles.drawerBody} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Kanal/Mağaza Adı *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="Örn: Trendyol"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Mağaza Linki (URL)</label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="https://trendyol.com/magaza/orbit"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Sıralama</label>
                    <input
                      type="number"
                      name="sort_order"
                      value={formData.sort_order}
                      onChange={handleChange}
                      className={styles.formInput}
                    />
                    <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '6px' }}>Küçük sayı önce görünür.</p>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Yayın Durumu</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4d4d8', fontSize: '14px', marginTop: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="active"
                        checked={formData.active}
                        onChange={handleChange}
                        style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }}
                      />
                      Sitede Göster
                    </label>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Logo (Görsel)</label>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {(formData.image_url || imageFile) && (
                      <div style={{ backgroundColor: '#1a1a1a', padding: '8px', borderRadius: '4px', border: '1px solid #3f3f46' }}>
                        <img 
                          src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url} 
                          alt="Preview" 
                          style={{ width: 'auto', height: '40px', objectFit: 'contain' }} 
                        />
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleFileChange} className={styles.formInput} style={{ padding: '8px' }} />
                  </div>
                  <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '6px' }}>PNG, JPG (Şeffaf arkaplanlı SVG/PNG önerilir)</p>
                </div>

              <div className={styles.drawerFooter} style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '16px 24px', borderTop: '1px solid #27272a', marginTop: '12px' }}>
                <button type="button" className={`${styles.formButton} ${styles.btnSecondary}`} onClick={() => setIsModalOpen(false)}>İptal</button>
                <button type="submit" className={`${styles.formButton} ${styles.btnPrimary}`}>
                  <ImageIcon size={16} />
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
