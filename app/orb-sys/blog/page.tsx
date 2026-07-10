"use client";

import React, { useState, useEffect } from "react";
import styles from "../orb-sys.module.css";
import { FileText, Search, Plus, X, Trash2, Edit, Save } from "lucide-react";
import { apiClient } from "@/lib/api";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const baseEditorConfig = {
  theme: 'dark',
  placeholder: 'Makalenizi buraya yazmaya başlayın...',
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  defaultActionOnPaste: 'insert_as_html',
  cleanHTML: {
    fillEmptyParagraph: false,
    removeEmptyElements: false,
    replaceNBSP: false,
  },
  beautifyHTML: false,
  enter: 'P',
  disablePlugins: 'beautifyHTML',
  uploader: {
    insertImageAsBase64URI: true,
  },
  resizer: {
    showSize: true,
    hideSizeTimeout: 1000,
  },
  popup: {
    img: ['imgFullWidth', '|', 'imageProperties', '|', 'left', 'center', 'right', 'justify', '|', 'delete']
  },
  image: {
    editSrc: true,
    editTitle: true,
    editAlt: true,
    editLink: true,
    editSize: true,
    editMargins: true,
    editClass: true,
    editStyle: true,
    editId: true,
    editAlign: true,
    showPreview: true,
    useImageEditor: false
  },
  controls: {
    grid2: {
      name: '2li Grid',
      tooltip: '2li Görsel / Yan Yana İçerik',
      iconURL: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iNyIgaGVpZ2h0PSIxOCIgcng9IjEiLz48cmVjdCB4PSIxNCIgeT0iMyIgd2lkdGg9IjciIGhlaWdodD0iMTgiIHJ4PSIxIi8+PC9zdmc+',
      exec: (editor: any) => {
        editor.s.insertHTML(`
          <div class="editor-grid-container" style="display: flex; flex-wrap: wrap; gap: 16px; margin: 16px 0;">
            <div class="editor-grid-col" style="flex: 1 1 calc(50% - 16px); min-width: 250px;"><p><br></p></div>
            <div class="editor-grid-col" style="flex: 1 1 calc(50% - 16px); min-width: 250px;"><p><br></p></div>
          </div><p><br></p>
        `);
      }
    },
    grid3: {
      name: '3lü Grid',
      tooltip: '3lü Görsel Grubu',
      iconURL: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIyIiB5PSIzIiB3aWR0aD0iNSIgaGVpZ2h0PSIxOCIgcng9IjEiLz48cmVjdCB4PSI5LjUiIHk9IjMiIHdpZHRoPSI1IiBoZWlnaHQ9IjE4IiByeD0iMSIvPjxyZWN0IHg9IjE3IiB5PSIzIiB3aWR0aD0iNSIgaGVpZ2h0PSIxOCIgcng9IjEiLz48L3N2Zz4=',
      exec: (editor: any) => {
        editor.s.insertHTML(`
          <div class="editor-grid-container" style="display: flex; flex-wrap: wrap; gap: 16px; margin: 16px 0;">
            <div class="editor-grid-col" style="flex: 1 1 calc(33.333% - 16px); min-width: 200px;"><p><br></p></div>
            <div class="editor-grid-col" style="flex: 1 1 calc(33.333% - 16px); min-width: 200px;"><p><br></p></div>
            <div class="editor-grid-col" style="flex: 1 1 calc(33.333% - 16px); min-width: 200px;"><p><br></p></div>
          </div><p><br></p>
        `);
      }
    },
    grid4: {
      name: '4lü Grid',
      tooltip: '4lü Görsel Grubu (2 Üst, 2 Alt)',
      iconURL: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iNyIgaGVpZ2h0PSI3IiByeD0iMSIvPjxyZWN0IHg9IjE0IiB5PSIzIiB3aWR0aD0iNyIgaGVpZ2h0PSI3IiByeD0iMSIvPjxyZWN0IHg9IjE0IiB5PSIxNCIgd2lkdGg9IjciIGhlaWdodD0iNyIgaGVpZ2h0PSI3IiByeD0iMSIvPjxyZWN0IHg9IjMiIHk9IjE0IiB3aWR0aD0iNyIgaGVpZ2h0PSI3IiByeD0iMSIvPjwvc3ZnPg==',
      exec: (editor: any) => {
        editor.s.insertHTML(`
          <div class="editor-grid-container" style="display: flex; flex-wrap: wrap; gap: 16px; margin: 16px 0;">
            <div class="editor-grid-col" style="flex: 1 1 calc(50% - 16px); min-width: 250px;"><p><br></p></div>
            <div class="editor-grid-col" style="flex: 1 1 calc(50% - 16px); min-width: 250px;"><p><br></p></div>
            <div class="editor-grid-col" style="flex: 1 1 calc(50% - 16px); min-width: 250px;"><p><br></p></div>
            <div class="editor-grid-col" style="flex: 1 1 calc(50% - 16px); min-width: 250px;"><p><br></p></div>
          </div><p><br></p>
        `);
      }
    },
    imgFullWidth: {
      name: 'Tam Boyut',
      tooltip: 'Resmi Tam Boyut (100%) Yap',
      iconURL: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTUgM2g2djZNOSAzSDN2Nm0xMiAxMmg2di02TTkgMjFIM3YtNiIvPjwvc3ZnPg==',
      exec: (editor: any) => {
        let current = editor.s.current();
        if (!current) return;
        
        if (current.nodeType === 3) {
          current = current.parentNode;
        }
        
        let image = null;
        if (current.nodeName === 'IMG') {
          image = current;
        } else if (current && typeof current.querySelector === 'function') {
          image = current.querySelector('img') || (typeof current.closest === 'function' ? current.closest('img') : null);
        }

        if (image) {
          image.style.width = '100%';
          image.style.height = 'auto';
          image.style.display = 'block';
          image.style.margin = '16px auto';
        }
      }
    }
  },
  buttons: ['bold', 'italic', 'underline', '|', 'ul', 'ol', '|', 'font', 'fontsize', 'brush', 'paragraph', '|', 'image', 'table', 'link', '|', 'grid2', 'grid3', 'grid4', '|', 'align', 'undo', 'redo', '|', 'hr', 'eraser', 'fullsize']
};

interface BlogPost {
  id: string | number;
  title: string;
  category: string;
  date_published: string;
  read_time: string;
  cover_image: string;
  lead_paragraph: string;
  body_content: any;
  author_id: number | string | null;
  author_name: string;
  author_role: string;
  author_avatar: string;
  active: boolean;
}

// === Yardımcı Fonksiyon ===
const getThumbnailUrl = (url: string) => {
  if (!url) return "/img/flight-control.png";
  if (url.startsWith("/img/") || url.includes("thumb_") || url.startsWith("http")) return url;
  const parts = url.split("/");
  const filename = parts.pop();
  return `${parts.join("/")}/thumb_${filename}`;
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [joditConfig, setJoditConfig] = useState<any>(baseEditorConfig);
  useEffect(() => {
    setJoditConfig({
      ...baseEditorConfig,
      uploader: {
        insertImageAsBase64URI: false,
        url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/upload`,
        method: 'POST',
        format: 'json',
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('orb_sys_token') : ''}`
        },
        filesVariableName: function() { return 'image'; },
        isSuccess: function(resp: any) { return !resp.error; },
        getMessage: function(resp: any) { return resp.message; },
        process: function(resp: any) {
          return {
            files: resp.url ? [resp.url] : [],
            isImages: resp.url ? [true] : [],
            path: resp.url,
            baseurl: '',
            error: resp.error ? 1 : 0,
            message: resp.error || resp.message
          };
        }
      }
    });
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  // Drawer / Modal states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | number | null>(null);

  // Form states
  const [newPost, setNewPost] = useState({
    title: "",
    category: "",
    date_published: "",
    read_time: "",
    lead_paragraph: "",
    author_id: "",
    author_name: "",
    author_role: "",
    active: true
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [existingCoverImage, setExistingCoverImage] = useState<string>("");

  const [authorAvatar, setAuthorAvatar] = useState<File | null>(null);
  const [existingAuthorAvatar, setExistingAuthorAvatar] = useState<string>("");

  const [blocks, setBlocks] = useState<{ type: string; content: any }[]>([]);

  const [editorContent, setEditorContent] = useState("");

  // Deletion Modal
  const [deletingPostId, setDeletingPostId] = useState<string | number | null>(null);

  useEffect(() => {
    fetchPosts();
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/authors`);
      if (res.ok) {
        const data = await res.json();
        setAuthors(data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/blog`);
      if (!res.ok) {
        if (res.status === 404) {
          // Backend route might not exist yet
          setPosts([]);
          return;
        }
        throw new Error("Failed to fetch blog posts");
      }
      const data = await res.json();
      setPosts(data || []);
    } catch (err: any) {
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNewDrawer = () => {
    setEditingPostId(null);
    setNewPost({
      title: "",
      category: "Teknoloji",
      date_published: new Date().toISOString().split("T")[0],
      read_time: "5 dk okuma",
      lead_paragraph: "",
      author_id: "",
      author_name: "",
      author_role: "",
      active: true
    });
    setCoverImage(null);
    setExistingCoverImage("");
    setAuthorAvatar(null);
    setExistingAuthorAvatar("");
    setBlocks([{ type: "paragraph", content: "" }]);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (post: BlogPost) => {
    setEditingPostId(post.id);
    setNewPost({
      title: post.title || "",
      category: post.category || "",
      date_published: post.date_published || "",
      read_time: post.read_time || "",
      lead_paragraph: post.lead_paragraph || "",
      author_id: post.author_id || "",
      author_name: post.author_name || "",
      author_role: post.author_role || "",
      active: post.active !== undefined ? post.active : true
    });
    setCoverImage(null);
    setExistingCoverImage(post.cover_image || "");
    setAuthorAvatar(null);
    setExistingAuthorAvatar(post.author_avatar || "");

    let htmlContent = "";
    if (post.body_content && typeof post.body_content === 'string') {
      htmlContent = post.body_content;
    } else if (post.body_content && Array.isArray(post.body_content)) {
      // Migrate old blocks to html
      htmlContent = post.body_content.map((b: any) => {
        if (b.type === 'subtitle') return `<h2>${b.content}</h2>`;
        if (b.type === 'quote') return `<blockquote>${b.content}</blockquote>`;
        if (b.type === 'spec-table') return ``; // Eski tabloları [object Object] olarak basma
        return `<p>${b.content}</p>`;
      }).join("");
    }
    setEditorContent(htmlContent);
    
    setIsDrawerOpen(true);
  };

  const handleSavePost = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newPost.title);
      formData.append("category", newPost.category);
      formData.append("date_published", newPost.date_published);
      formData.append("read_time", newPost.read_time);
      formData.append("lead_paragraph", newPost.lead_paragraph);
      if (newPost.author_id) {
        formData.append("author_id", newPost.author_id.toString());
      }
      formData.append("active", newPost.active ? "true" : "false");

      formData.append("body_content", JSON.stringify(editorContent));

      if (coverImage) formData.append("cover_image", coverImage);
      else if (existingCoverImage) formData.append("existing_cover_image", existingCoverImage);

      const url = editingPostId ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/blog/${editingPostId}` : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/blog`;
      const method = editingPostId ? "PUT" : "POST";

      const res = await apiClient(url, {
        method: method,
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Yazı kaydedilirken bir hata oluştu.");
      }

      setIsDrawerOpen(false);
      fetchPosts();
    } catch (err: any) {
      alert("Hata: " + err.message);
    }
  };

  const confirmDelete = async () => {
    if (!deletingPostId) return;
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/blog/${deletingPostId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silme işlemi başarısız.");
      setDeletingPostId(null);
      fetchPosts();
    } catch (err) {
      alert("Yazı silinirken bir hata oluştu. Sunucu bağlantınızı kontrol edin.");
      setDeletingPostId(null);
    }
  };

  const toggleActiveStatus = async (post: BlogPost) => {
    // Optimistic Update: Kullanıcı tıklayınca anında ekranda değişsin
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, active: !p.active } : p));

    try {
      const formData = new FormData();
      formData.append("title", post.title || "");
      formData.append("category", post.category || "");
      formData.append("date_published", post.date_published || "");
      formData.append("read_time", post.read_time || "");
      formData.append("lead_paragraph", post.lead_paragraph || "");
      if (post.author_id) {
        formData.append("author_id", post.author_id.toString());
      }
      formData.append("active", post.active ? "false" : "true");
      formData.append("body_content", JSON.stringify(post.body_content || ""));
      if (post.cover_image) formData.append("existing_cover_image", post.cover_image);
      if (post.author_avatar) formData.append("existing_author_avatar", post.author_avatar);

      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/blog/${post.id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) {
        // Hata durumunda listeyi eski haline geri getir
        fetchPosts();
      }
    } catch (e) {
      console.error("Toggle Active Status Error:", e);
      // Hata durumunda listeyi eski haline geri getir
      fetchPosts();
    }
  };

  const categories = ["Tümü", ...Array.from(new Set(posts.map(p => p.category)))].filter(Boolean);

  const filteredPosts = posts.filter(post => {
    const matchCat = selectedCategory === "Tümü" || post.category === selectedCategory;
    const matchSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        post.author_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <div>
          <h2 className={styles.pageTitle}>Blog Yönetimi</h2>
          <p className={styles.pageDesc}>
            Yayındaki makalelerinizi ve haberlerinizi buradan düzenleyebilirsiniz.
          </p>
        </div>
        <button className={styles.downloadBtn} onClick={handleOpenNewDrawer}>
          <Plus size={16} />
          Yeni Yazı Ekle
        </button>
      </div>

      <div className={styles.panelCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div className={styles.searchBox}>
              <Search size={18} color="#71717a" />
              <input 
                type="text" 
                placeholder="Yazı adı veya yazar ara..." 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select 
              className={styles.formSelect} 
              style={{ width: '180px', padding: '10px 14px', backgroundColor: '#1a1a1a', border: '1px solid #3f3f46', color: '#d4d4d8', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 600 }}>
            Toplam: {filteredPosts.length} Yazı
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#a1a1aa" }}>Yükleniyor...</div>
        ) : error && posts.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>{error} (Veya Backend Hazır Değil)</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead className={styles.tableHead}>
                <tr>
                  <th style={{ paddingLeft: '24px' }}>YAZI</th>
                  <th>KATEGORİ</th>
                  <th>YAZAR</th>
                  <th>YAYIN TARİHİ</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>İŞLEMLER</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.length > 0 ? (
                  filteredPosts.map(post => (
                    <tr key={post.id} className={styles.tableRow}>
                      <td style={{ paddingLeft: '24px' }}>
                        <div className={styles.productCell}>
                          <div className={styles.productImgBox}>
                            <img 
                              src={getThumbnailUrl(post.cover_image || "/img/flight-control.png")} 
                              className={styles.productImg} 
                              alt="" 
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                if (!target.src.includes("thumb_")) return;
                                target.src = post.cover_image || "/img/flight-control.png";
                              }}
                            />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span className={styles.productName}>{post.title}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.badgePill} style={{ backgroundColor: '#1a1a1a', border: '1px solid #3f3f46', color: '#d4d4d8' }}>
                          {post.category}
                        </span>
                      </td>
                      <td><span className={styles.productRole}>{post.author_name}</span></td>
                      <td><span style={{ color: '#a1a1aa', fontSize: '13px' }}>{post.date_published}</span></td>
                      <td style={{ paddingRight: '24px' }}>
                        <div className={styles.actionBtns} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div 
                            onClick={() => toggleActiveStatus(post)}
                            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '6px' }}
                          >
                            <div style={{
                              width: '36px', height: '20px', borderRadius: '20px', 
                              backgroundColor: post.active ? '#10b981' : '#3f3f46',
                              position: 'relative', transition: 'background-color 0.3s'
                            }}>
                              <div style={{
                                width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#fff',
                                position: 'absolute', top: '3px', left: post.active ? '19px' : '3px',
                                transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                              }} />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: post.active ? '#10b981' : '#a1a1aa', userSelect: 'none' }}>
                              {post.active ? "Aktif" : "Pasif"}
                            </span>
                          </div>
                          <div style={{ width: '1px', height: '16px', backgroundColor: '#3f3f46' }}></div>
                          <button className={styles.actionBtn} title="Düzenle" onClick={() => handleOpenEditDrawer(post)}>
                            <Edit size={15} />
                          </button>
                          <button className={`${styles.actionBtn} ${styles.danger}`} title="Sil" onClick={() => setDeletingPostId(post.id)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "60px", color: "#a1a1aa" }}>
                      Kayıtlı makale bulunamadı veya henüz sunucu bağlantısı yok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- YENİ YAZI MODAL (GENİŞ POPUP) --- */}
      {isDrawerOpen && (
        <div className={styles.drawerOverlay}>
          <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className={styles.drawerHeader}>
              <div>
                <h3 className={styles.drawerTitle}>{editingPostId ? "Blog Yazısını Düzenle" : "Yeni Blog Yazısı Ekle"}</h3>
                <p className={styles.drawerDesc} style={{ marginTop: '4px' }}>{editingPostId ? "Mevcut makaleyi güncelleyin." : "Sisteme yeni bir makale veya haber ekleyin."}</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Body / Form */}
            <div className={styles.drawerBody} data-lenis-prevent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* --- Temel Bilgiler --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div className={styles.formSection}>
                    <h4 className={styles.formSectionTitle}>Yazı Bilgileri</h4>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Başlık</label>
                        <input type="text" className={styles.formInput} placeholder="Örn: Otopilot Sistemleri..." 
                               value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Kategori</label>
                        <input type="text" className={styles.formInput} placeholder="Örn: Teknoloji" 
                               value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value})} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Yayın Tarihi</label>
                        <input type="text" className={styles.formInput} placeholder="12 Mayıs 2026" 
                               value={newPost.date_published} onChange={e => setNewPost({...newPost, date_published: e.target.value})} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Okuma Süresi</label>
                        <input type="text" className={styles.formInput} placeholder="5 dk okuma" 
                               value={newPost.read_time} onChange={e => setNewPost({...newPost, read_time: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <h4 className={styles.formSectionTitle}>Görsel ve Yazar</h4>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Yazar Seçiniz</label>
                        <select 
                          className={styles.formInput} 
                          value={newPost.author_id || ""} 
                          onChange={e => setNewPost({...newPost, author_id: e.target.value})}
                        >
                          <option value="">Yazar Seçiniz</option>
                          {authors.map(a => (
                            <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup} style={{ marginTop: '16px' }}>
                      <label className={styles.formLabel}>Kapak Görseli</label>
                      <label style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
                        border: '1px dashed #3f3f46', borderRadius: '8px', cursor: 'pointer',
                        backgroundColor: '#1a1a1a', transition: 'all 0.2s', color: '#a1a1aa'
                      }} onMouseOver={e => e.currentTarget.style.borderColor = '#52525b'} onMouseOut={e => e.currentTarget.style.borderColor = '#3f3f46'}>
                        <span style={{ fontSize: '13px', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {coverImage ? coverImage.name : existingCoverImage ? "Mevcut Görsel Yüklü" : "Resim Seçin..."}
                        </span>
                        <input type="file" accept="image/*" hidden onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const file = e.target.files[0];
                            if (file.size > 5 * 1024 * 1024) {
                              alert("Dosya boyutu 5MB'dan büyük olamaz!");
                              e.target.value = "";
                              return;
                            }
                            setCoverImage(file);
                          }
                        }} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* --- İçerik ve Bloklar --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div className={styles.formSection}>
                    <h4 className={styles.formSectionTitle}>Makale İçeriği</h4>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Giriş Paragrafı (Lead)</label>
                      <textarea className={styles.formTextarea} rows={3} placeholder="Makalenin ana fikrini özetleyen vurucu bir giriş cümlesi..." 
                                value={newPost.lead_paragraph} onChange={e => setNewPost({...newPost, lead_paragraph: e.target.value})} />
                    </div>

                    <div style={{ border: '1px solid #3f3f46', borderRadius: '8px' }}>
                      <style>{`
                        /* Jodit için Dark Mode ek stilleri */
                        .jodit-container {
                          font-family: inherit !important;
                        }
                        .jodit-wysiwyg {
                          background-color: #09090b !important;
                          color: rgba(255,255,255,0.8) !important;
                          font-size: 16px !important;
                          line-height: 1.7 !important;
                        }
                        
                        /* Resim boyutlandırma Tailwind ve Global CSS çakışması düzeltmesi */
                        .jodit-wysiwyg img {
                          display: inline-block !important;
                          pointer-events: auto !important;
                          user-select: auto !important;
                          -webkit-user-drag: auto !important;
                          -webkit-user-select: auto !important;
                          -moz-user-select: auto !important;
                          -ms-user-select: auto !important;
                        }
                        
                        /* Sadece Editörde Gözükecek Grid Çizgileri */
                        .jodit-wysiwyg .editor-grid-col {
                          border: 1px dashed #52525b !important;
                          min-height: 120px !important;
                          border-radius: 8px;
                          background-color: rgba(255,255,255,0.02);
                          transition: all 0.2s;
                        }
                        .jodit-wysiwyg .editor-grid-col:hover {
                          background-color: rgba(255,255,255,0.05);
                        }
                        
                        .jodit-resizer {
                          z-index: 1000 !important;
                          pointer-events: auto !important;
                        }
                        .jodit-resizer svg {
                          display: block !important;
                        }
                        /* Çift tıklama ipucunu vurgulamak için aktif resme mavi çerçeve */
                        .jodit-wysiwyg img.jodit_active {
                          outline: 2px solid #3b82f6 !important;
                          outline-offset: 2px;
                        }
                        
                        /* Tailwind Reset İptali - Jodit İçeriği İçin */
                        .jodit-wysiwyg h1 { font-size: 2.25em !important; font-weight: 700 !important; color: #fff !important; margin: 0.67em 0 !important; }
                        .jodit-wysiwyg h2 { font-size: 1.75em !important; font-weight: 700 !important; color: #fff !important; margin: 0.83em 0 !important; }
                        .jodit-wysiwyg h3 { font-size: 1.5em !important; font-weight: 700 !important; color: #fff !important; margin: 1em 0 !important; }
                        .jodit-wysiwyg h4 { font-size: 1.25em !important; font-weight: 700 !important; color: #fff !important; margin: 1.33em 0 !important; }
                        .jodit-wysiwyg h5 { font-size: 1em !important; font-weight: 700 !important; color: #fff !important; margin: 1.67em 0 !important; }
                        .jodit-wysiwyg h6 { font-size: 0.875em !important; font-weight: 700 !important; color: #fff !important; margin: 2.33em 0 !important; }
                        
                        .jodit-wysiwyg ul { list-style-type: disc !important; padding-left: 2.5em !important; margin: 1em 0 !important; }
                        .jodit-wysiwyg ol { list-style-type: decimal !important; padding-left: 2.5em !important; margin: 1em 0 !important; }
                        .jodit-wysiwyg li { display: list-item !important; margin-bottom: 0.25em !important; }
                        
                        .jodit-wysiwyg strong, .jodit-wysiwyg b { font-weight: 700 !important; color: #fff !important; }
                        .jodit-wysiwyg em, .jodit-wysiwyg i { font-style: italic !important; }
                        .jodit-wysiwyg u { text-decoration: underline !important; }
                        .jodit-wysiwyg blockquote { border-left: 4px solid #3f3f46 !important; padding-left: 1em !important; font-style: italic !important; margin: 1.5em 0 !important; color: rgba(255,255,255,0.6) !important; }

                        /* Tam ekran düzeltmeleri (CSS :has() ile) */
                        div[class*="drawerOverlay"]:has(.jodit_fullsize) {
                          backdrop-filter: none !important;
                          background: #000 !important;
                        }
                        div[class*="drawerContent"]:has(.jodit_fullsize) {
                          transform: none !important;
                          animation: none !important;
                          overflow: visible !important;
                        }
                        
                        /* Jodit'in kendi hatalı tam ekran hesaplamasını ezip Flexbox ile kusursuz yapıyoruz */
                        .jodit-container.jodit_fullsize {
                          position: fixed !important;
                          top: 0 !important;
                          left: 0 !important;
                          width: 100vw !important;
                          height: 100vh !important;
                          z-index: 999999 !important;
                          border-radius: 0 !important;
                          display: flex !important;
                          flex-direction: column !important;
                          background-color: #09090b !important;
                        }
                        .jodit-container.jodit_fullsize .jodit-toolbar__box {
                          position: static !important;
                          flex-shrink: 0 !important;
                          width: 100% !important;
                          z-index: 10 !important;
                        }
                        .jodit-container.jodit_fullsize .jodit-workplace {
                          flex: 1 !important;
                          height: auto !important;
                          min-height: 0 !important;
                        }
                        .jodit-container.jodit_fullsize .jodit-wysiwyg {
                          height: 100% !important;
                        }
                      `}</style>
                      <JoditEditor
                        value={editorContent}
                        config={joditConfig}
                        onBlur={newContent => setEditorContent(newContent)}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer / Kaydet Butonu */}
            <div className={styles.drawerFooter}>
              <button className={`${styles.formButton} ${styles.btnSecondary}`} onClick={() => setIsDrawerOpen(false)}>
                İptal Et
              </button>
              <button className={`${styles.formButton} ${styles.btnPrimary}`} onClick={handleSavePost}>
                <Save size={16} />
                {editingPostId ? "Değişiklikleri Kaydet" : "Yazıyı Yayınla"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Özel Silme Onayı Modal (Custom Confirm) */}
      {deletingPostId && (
        <div className={styles.drawerOverlay} onClick={() => setDeletingPostId(null)} style={{ zIndex: 999 }}>
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
              Yazıyı Sil
            </h3>
            <p style={{ fontSize: '14px', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
              Bu yazıyı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button 
                onClick={() => setDeletingPostId(null)}
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
