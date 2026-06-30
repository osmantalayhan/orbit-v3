"use client";

import React, { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { Plus, Edit2, Trash2, X, Image as ImageIcon, CheckCircle, XCircle } from "lucide-react";
import { apiClient } from "@/lib/api";

interface SliderItem {
  id: number;
  product_id?: string;
  model_code: string;
  slide_title: string;
  slide_desc: string;
  image_url: string;
  sort_order: number;
  active: boolean;
}

interface Product {
  id: string;
  name: string;
}

export default function AdminSliderPage() {
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    slide_title: "",
    slide_desc: "",
    model_code: "",
    product_id: "",
    sort_order: 0,
    active: true,
    image_url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSliders();
    fetchProducts();
  }, []);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/slider`);
      if (!res.ok) throw new Error("Slider verileri yüklenirken hata oluştu.");
      const data = await res.json();
      setSliders(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data || []);
      }
    } catch (err: any) {
      console.error("Ürünler yüklenemedi", err);
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({
      slide_title: "",
      slide_desc: "",
      model_code: "",
      product_id: "",
      sort_order: 0,
      active: true,
      image_url: "",
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: SliderItem) => {
    setEditingId(item.id);
    setFormData({
      slide_title: item.slide_title || "",
      slide_desc: item.slide_desc || "",
      model_code: item.model_code || "",
      product_id: item.product_id || "",
      sort_order: item.sort_order || 0,
      active: item.active,
      image_url: item.image_url || "",
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu slaytı silmek istediğinize emin misiniz?")) return;
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/slider/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Silme işlemi başarısız.");
      fetchSliders();
    } catch (err: any) {
      alert("Hata: " + err.message);
    }
  };

  const handleToggleActive = async (item: SliderItem) => {
    try {
      const fd = new FormData();
      fd.append("slide_title", item.slide_title);
      fd.append("slide_desc", item.slide_desc);
      fd.append("model_code", item.model_code);
      fd.append("product_id", item.product_id || "");
      fd.append("sort_order", item.sort_order.toString());
      fd.append("active", (!item.active).toString());
      fd.append("image_url", item.image_url);

      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/slider/${item.id}`, {
        method: "PUT",
        body: fd
      });
      if (!res.ok) throw new Error("Durum güncellenemedi.");
      fetchSliders();
    } catch (err: any) {
      alert("Hata: " + err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("slide_title", formData.slide_title);
      fd.append("slide_desc", formData.slide_desc);
      fd.append("model_code", formData.model_code);
      fd.append("product_id", formData.product_id);
      fd.append("sort_order", formData.sort_order.toString());
      fd.append("active", formData.active ? "true" : "false");
      if (formData.image_url) fd.append("image_url", formData.image_url);
      
      if (imageFile) {
        fd.append("image_file", imageFile);
      } else if (!formData.image_url) {
        throw new Error("Lütfen bir görsel seçin veya yükleyin.");
      }

      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/slider/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/slider`;
      
      const method = editingId ? "PUT" : "POST";

      const res = await apiClient(url, { method, body: fd });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Kaydetme başarısız.");
      }

      setIsModalOpen(false);
      fetchSliders();
    } catch (err: any) {
      alert("Hata: " + err.message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
          <h2 className={styles.pageTitle}>Ana Slider Yönetimi</h2>
          <p className={styles.pageDesc}>
            Web sitesinin ana sayfasındaki 3D veya standart slaytları yönetin.
          </p>
        </div>
        <button className={styles.downloadBtn} onClick={openNewModal}>
          <Plus size={16} />
          Yeni Slayt Ekle
        </button>
      </div>

      <div className={styles.panelCard} style={{ padding: 0, overflow: 'hidden' }}>
        
        <div style={{ padding: '24px', borderBottom: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 600 }}>
            Toplam: {sliders.length} Slayt
          </div>
        </div>

        {loading && <div style={{ padding: '40px', textAlign: 'center', color: '#a1a1aa' }}>Yükleniyor...</div>}
        {error && <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>{error}</div>}

        {!loading && !error && (
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead className={styles.tableHead}>
                <tr>
                  <th style={{ paddingLeft: '24px' }}>Görsel & Başlık</th>
                  <th>Açıklama</th>
                  <th>Bağlı Ürün</th>
                  <th>Model Kodu</th>
                  <th>Sıra</th>
                  <th>Durum</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {sliders.length > 0 ? (
                  sliders.map((item) => (
                    <tr key={item.id} className={styles.tableRow}>
                      <td style={{ paddingLeft: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={item.image_url} alt={item.slide_title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', backgroundColor: '#1a1a1a' }} />
                          <div style={{ fontWeight: 600, color: '#fff' }}>{item.slide_title}</div>
                        </div>
                      </td>
                      <td style={{ color: '#a1a1aa', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.slide_desc}
                      </td>
                      <td style={{ color: '#d4d4d8' }}>
                        {item.product_id ? (products.find(p => p.id === item.product_id)?.name || item.product_id) : "-"}
                      </td>
                      <td style={{ color: '#d4d4d8' }}>{item.model_code || "-"}</td>
                      <td style={{ color: '#d4d4d8' }}>{item.sort_order}</td>
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
                          
                          <button onClick={() => handleEdit(item)} className={styles.actionBtn} style={{ color: '#3b82f6' }}>
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className={styles.actionBtn} style={{ color: '#ef4444' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#a1a1aa' }}>
                      Henüz hiç slayt eklenmemiş.
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
                <h3 className={styles.drawerTitle}>{editingId ? "Slaytı Düzenle" : "Yeni Slayt Ekle"}</h3>
                <p className={styles.drawerDesc} style={{ marginTop: '4px' }}>{editingId ? "Mevcut anasayfa slaytını güncelleyin." : "Anasayfaya yeni bir slayt ekleyin."}</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} className={styles.drawerBody} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Slayt Başlığı *</label>
                <input required type="text" name="slide_title" value={formData.slide_title} onChange={handleChange} className={styles.formInput} placeholder="Örn: Slayt Başlığı" />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Kısa Açıklama</label>
                <input type="text" name="slide_desc" value={formData.slide_desc} onChange={handleChange} className={styles.formInput} placeholder="Örn: Profesyonel Uçuş Kontrol Kartı" />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Slayt Görseli *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {(formData.image_url || imageFile) && (
                    <img 
                      src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url} 
                      alt="Preview" 
                      style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #3f3f46' }} 
                    />
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className={styles.formInput} style={{ padding: '8px' }} />
                </div>
                <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '6px' }}>Masaüstü için yatay, yüksek çözünürlüklü görsel önerilir.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Bağlı Ürün (Opsiyonel)</label>
                  <select name="product_id" value={formData.product_id} onChange={handleChange} className={styles.formInput}>
                    <option value="">-- Ürün Seçin --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '6px' }}>Tıklandığında gideceği ürün detay sayfası.</p>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>3D Model Kodu (Opsiyonel)</label>
                  <input type="text" name="model_code" value={formData.model_code} onChange={handleChange} className={styles.formInput} placeholder="Örn: F435" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Sıralama (Küçükten Büyüğe)</label>
                  <input type="number" name="sort_order" value={formData.sort_order} onChange={handleChange} className={styles.formInput} />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Yayın Durumu</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4d4d8', fontSize: '14px', marginTop: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }} />
                    Slayt Aktif (Anasayfada Görünsün)
                  </label>
                </div>
              </div>

              <div className={styles.drawerFooter} style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '16px 24px', borderTop: '1px solid #27272a', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={`${styles.formButton} ${styles.btnSecondary}`}>
                  İptal Et
                </button>
                <button type="submit" className={`${styles.formButton} ${styles.btnPrimary}`}>
                  <ImageIcon size={16} />
                  Slaytı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
