"use client";

import React, { useState, useEffect } from "react";
import styles from "../orb-sys.module.css";
import { Plus, Edit2, Trash2, Loader2, User, X, Save } from "lucide-react";
import { apiClient } from "@/lib/api";
import Toast from "../../../components/Toast";

interface Author {
  id: number;
  name: string;
  role: string;
  avatar_url: string;
}

export default function AuthorsAdminPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingAuthorId, setDeletingAuthorId] = useState<number | null>(null);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    existing_avatar: ""
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" as "success" | "error" });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/authors`, { cache: "no-store" });
      if (!res.ok) throw new Error("Yazarlar getirilemedi");
      const json = await res.json();
      setAuthors(json || []);
    } catch (err: any) {
      console.error(err);
      setToast({ isVisible: true, message: "Yazarlar yüklenemedi.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "", role: "", existing_avatar: "" });
    setAvatarFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (author: Author) => {
    setEditingId(author.id);
    setFormData({ name: author.name, role: author.role, existing_avatar: author.avatar_url });
    setAvatarFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("Dosya boyutu 5MB'dan büyük olamaz!");
        e.target.value = "";
        return;
      }
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("role", formData.role);
    if (avatarFile) {
      data.append("avatar", avatarFile);
    } else {
      data.append("existing_avatar", formData.existing_avatar);
    }

    const url = editingId 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/authors/${editingId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/authors`;
    
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await apiClient(url, {
        method,
        body: data,
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "İşlem başarısız");
      }

      setToast({ isVisible: true, message: "Yazar başarıyla kaydedildi!", type: "success" });
      closeModal();
      fetchAuthors();
    } catch (err: any) {
      setToast({ isVisible: true, message: "Hata: " + err.message, type: "error" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
    }
  };

  const confirmDelete = async () => {
    if (!deletingAuthorId) return;
    const id = deletingAuthorId;

    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/authors/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Silinemedi");
      }

      setToast({ isVisible: true, message: "Yazar başarıyla silindi", type: "success" });
      setDeletingAuthorId(null);
      fetchAuthors();
    } catch (err: any) {
      setToast({ isVisible: true, message: "Hata: " + err.message, type: "error" });
    } finally {
      setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
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
          <h2 className={styles.pageTitle}>Yazar Yönetimi</h2>
          <p className={styles.pageDesc}>Blog yazılarınız için yazar profillerini yönetin.</p>
        </div>
        <button onClick={openAddModal} className={styles.downloadBtn}>
          <Plus size={16} />
          <span>Yeni Yazar Ekle</span>
        </button>
      </div>

      <div className={styles.panelCard}>

      {loading ? (
        <div className={styles.loadingState}>
          <Loader2 className={styles.spinner} />
          <p>Yazarlar yükleniyor...</p>
        </div>
      ) : authors.length === 0 ? (
        <div className={styles.emptyState}>
          <User size={48} className={styles.emptyIcon} />
          <h3>Henüz yazar eklenmemiş</h3>
          <p>Bloglarınızda kullanmak için hemen bir yazar profili oluşturun.</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead className={styles.tableHead}>
              <tr>
                <th style={{ paddingLeft: '24px' }}>YAZAR</th>
                <th>ÜNVAN</th>
                <th style={{ textAlign: 'right', paddingRight: '24px' }}>İŞLEMLER</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author) => (
                <tr key={author.id} className={styles.tableRow}>
                  <td style={{ paddingLeft: '24px' }}>
                    <div className={styles.productCell}>
                      <div className={styles.productImgBox} style={{ borderRadius: '50%', overflow: 'hidden' }}>
                        {author.avatar_url ? (
                          <img 
                            src={author.avatar_url.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${author.avatar_url}` : author.avatar_url} 
                            alt={author.name} 
                            className={styles.productImg}
                            style={{ borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                            <User size={20} color="#999" />
                          </div>
                        )}
                      </div>
                      <span className={styles.productName}>{author.name}</span>
                    </div>
                  </td>
                  <td><span className={styles.productRole}>{author.role}</span></td>
                  <td style={{ paddingRight: '24px' }}>
                    <div className={styles.actionBtns} style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => openEditModal(author)} className={styles.actionBtn} title="Düzenle">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setDeletingAuthorId(author.id)} className={`${styles.actionBtn} ${styles.actionBtnDelete}`} title="Sil">
                        <Trash2 size={18} />
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

      {isModalOpen && (
        <div className={styles.drawerOverlay} onClick={closeModal}>
          <div className={styles.drawerContent} onClick={e => e.stopPropagation()} style={{ height: 'auto', maxHeight: '90vh', maxWidth: '600px' }}>
            <div className={styles.drawerHeader}>
              <div>
                <h3 className={styles.drawerTitle}>{editingId ? "Yazarı Düzenle" : "Yeni Yazar Ekle"}</h3>
                <p className={styles.drawerDesc} style={{ marginTop: '4px' }}>{editingId ? "Mevcut yazar bilgisini güncelleyin." : "Sisteme yeni bir yazar ekleyin."}</p>
              </div>
              <button onClick={closeModal} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.drawerBody} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Yazar Adı <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Örn: Ahmet Yılmaz"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Yazar Ünvanı</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Örn: Kıdemli Yazılım Geliştirici"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Profil Fotoğrafı (Avatar)</label>
                {formData.existing_avatar && !avatarFile && (
                  <div style={{ marginBottom: '10px' }}>
                    <img src={formData.existing_avatar} alt="Mevcut Avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                  </div>
                )}
                
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
                  border: '1px dashed #3f3f46', borderRadius: '8px', cursor: 'pointer',
                  backgroundColor: '#1a1a1a', transition: 'all 0.2s', color: '#a1a1aa'
                }} onMouseOver={e => e.currentTarget.style.borderColor = '#52525b'} onMouseOut={e => e.currentTarget.style.borderColor = '#3f3f46'}>
                  <span style={{ fontSize: '13px', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {avatarFile ? avatarFile.name : formData.existing_avatar ? "Mevcut Görsel Yüklü" : "Resim Seçin..."}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <div className={styles.drawerFooter}>
                <button type="button" onClick={closeModal} className={`${styles.formButton} ${styles.btnSecondary}`} disabled={isSubmitting}>
                  İptal
                </button>
                <button type="submit" className={`${styles.formButton} ${styles.btnPrimary}`} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 size={16} className={styles.spinner} /> Kaydediliyor...</>
                  ) : (
                    <><Save size={16} /> Kaydet</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Özel Silme Onayı Modal (Custom Confirm) */}
      {deletingAuthorId && (
        <div className={styles.drawerOverlay} onClick={() => setDeletingAuthorId(null)} style={{ zIndex: 999 }}>
          <div 
            style={{
              backgroundColor: '#121212',
              border: '1px solid #27272a',
              borderRadius: '16px',
              padding: '32px',
              width: '400px',
              maxWidth: '90%',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              animation: 'popIn 0.3s forwards cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trash2 size={20} color="#ef4444" />
              Yazarı Sil
            </h3>
            <p style={{ fontSize: '14px', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
              Bu yazarı silmek istediğinize emin misiniz? (Eğer bir blogda kullanılıyorsa silinemez)
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button 
                onClick={() => setDeletingAuthorId(null)}
                style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #27272a', backgroundColor: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                İptal Et
              </button>
              <button 
                onClick={confirmDelete}
                style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
