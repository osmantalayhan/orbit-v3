"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "../admin.module.css";
import { FileText, Search, Plus, X, Trash2, Edit, Save, Bold, Italic, Underline, List, ListOrdered, Quote, Table, Link as LinkIcon, Code, Image as ImageIcon } from "lucide-react";

interface BlogPost {
  id: string | number;
  title: string;
  category: string;
  date_published: string;
  read_time: string;
  cover_image: string;
  lead_paragraph: string;
  body_content: any;
  author_name: string;
  author_role: string;
  author_avatar: string;
  active: boolean;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
    author_name: "",
    author_role: ""
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [existingCoverImage, setExistingCoverImage] = useState<string>("");

  const [authorAvatar, setAuthorAvatar] = useState<File | null>(null);
  const [existingAuthorAvatar, setExistingAuthorAvatar] = useState<string>("");

  const [blocks, setBlocks] = useState<{ type: string; content: any }[]>([]);

  const [editorContent, setEditorContent] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [savedSelection, setSavedSelection] = useState<any>(null);

  const [showTableInput, setShowTableInput] = useState(false);
  const [tableRows, setTableRows] = useState(2);
  const [tableCols, setTableCols] = useState(2);

  const [activeFormats, setActiveFormats] = useState({
    bold: false, italic: false, underline: false, h2: false, h3: false, blockquote: false, ul: false, ol: false
  });

  const updateActiveFormats = () => {
    if (!editorRef.current) return;
    const bold = document.queryCommandState('bold');
    const italic = document.queryCommandState('italic');
    const underline = document.queryCommandState('underline');
    const ul = document.queryCommandState('insertUnorderedList');
    const ol = document.queryCommandState('insertOrderedList');
    
    let blockquote = false; let h2 = false; let h3 = false;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let node = selection.getRangeAt(0).commonAncestorContainer as Node | null;
      while (node && node !== editorRef.current) {
        if (node.nodeName === 'BLOCKQUOTE') blockquote = true;
        if (node.nodeName === 'H2') h2 = true;
        if (node.nodeName === 'H3') h3 = true;
        node = node.parentNode;
      }
    }
    setActiveFormats({ bold, italic, underline, h2, h3, blockquote, ul, ol });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      
      const getClosest = (element: Node | null, tagName: string): HTMLElement | null => {
        let current = element?.nodeType === 1 ? element as HTMLElement : element?.parentElement;
        while (current && current !== editorRef.current) {
          if (current.tagName === tagName.toUpperCase()) return current;
          current = current.parentElement;
        }
        return null;
      };

      // Tablo (TD) İçinde Enter
      const tdNode = getClosest(container, 'td');
      if (tdNode) {
        if (!e.shiftKey) {
          e.preventDefault(); // Varsayılanı engelle
          const trNode = getClosest(tdNode, 'tr') as HTMLTableRowElement;
          if (trNode && trNode.parentNode) {
            const newTr = document.createElement('tr');
            for (let i = 0; i < trNode.cells.length; i++) {
              const newTd = document.createElement('td');
              newTd.style.cssText = trNode.cells[i].style.cssText;
              newTd.innerHTML = '<br>';
              newTr.appendChild(newTd);
            }
            trNode.parentNode.insertBefore(newTr, trNode.nextSibling);
            
            const newRange = document.createRange();
            newRange.selectNodeContents(newTr.cells[0]);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
            
            if (editorRef.current) setEditorContent(editorRef.current.innerHTML);
          }
        }
        return; // Eğer shift+enter ise varsayılan davranış (alt satır) çalışsın
      }

      // Alıntı (Blockquote) İçinde Enter
      const blockquoteNode = getClosest(container, 'blockquote');
      if (blockquoteNode && !e.shiftKey) {
        // Eğer bulunduğumuz element boşsa (yani iki kere enter yapılmışsa) alıntıdan çık
        const text = container.textContent || "";
        if (text.trim() === "") {
          e.preventDefault();
          const p = document.createElement('p');
          p.innerHTML = '<br>';
          
          if (blockquoteNode.nextSibling) {
            blockquoteNode.parentNode?.insertBefore(p, blockquoteNode.nextSibling);
          } else {
            blockquoteNode.parentNode?.appendChild(p);
          }
          
          const newRange = document.createRange();
          newRange.selectNodeContents(p);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
          
          // Boş elementi sil (blockquote içinde çöp kalmasın)
          let nodeToRemove: Node | null = container;
          while (nodeToRemove && nodeToRemove.parentNode !== blockquoteNode) {
            nodeToRemove = nodeToRemove.parentNode;
          }
          if (nodeToRemove && nodeToRemove !== blockquoteNode) {
             blockquoteNode.removeChild(nodeToRemove);
          } else if (nodeToRemove === blockquoteNode && container.nodeType === 3) {
             blockquoteNode.removeChild(container);
          }
          
          if (blockquoteNode.textContent?.trim() === "") {
             blockquoteNode.remove();
          }
          
          if (editorRef.current) setEditorContent(editorRef.current.innerHTML);
          setTimeout(updateActiveFormats, 10);
          return;
        }
      }

      // Liste (UL/OL) İçinde Enter (Çıkış)
      const liNode = getClosest(container, 'li');
      if (liNode && !e.shiftKey) {
        const text = liNode.textContent || "";
        if (text.trim() === "") {
          e.preventDefault();
          const listNode = getClosest(liNode, 'ul') || getClosest(liNode, 'ol');
          if (listNode) {
            const p = document.createElement('p');
            p.innerHTML = '<br>';
            
            if (listNode.nextSibling) {
              listNode.parentNode?.insertBefore(p, listNode.nextSibling);
            } else {
              listNode.parentNode?.appendChild(p);
            }
            
            const newRange = document.createRange();
            newRange.selectNodeContents(p);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
            
            liNode.remove();
            if (listNode.children.length === 0) {
              listNode.remove();
            }
            
            // Chrome'un arta kalan font renklerini sıfırla
            document.execCommand('removeFormat', false, '');
            if (editorRef.current) setEditorContent(editorRef.current.innerHTML);
            setTimeout(updateActiveFormats, 10);
            return;
          }
        }
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');

    if (html) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // Tüm elementlerdeki gereksiz stilleri temizle
      const elements = tempDiv.querySelectorAll('*');
      elements.forEach((el) => {
        el.removeAttribute('style');
        el.removeAttribute('class');
        el.removeAttribute('id');
        el.removeAttribute('font');
        el.removeAttribute('dir');
        el.removeAttribute('align');
        
        // Sadece renk/font taşıyan span ve font etiketlerini yok et ama içindeki metni koru
        if (el.tagName === 'SPAN' || el.tagName === 'FONT') {
          const parent = el.parentNode;
          if (parent) {
            while (el.firstChild) {
              parent.insertBefore(el.firstChild, el);
            }
            parent.removeChild(el);
          }
        }
      });

      document.execCommand('insertHTML', false, tempDiv.innerHTML);
    } else if (text) {
      // Eğer HTML yoksa sadece düz metni yapıştır (satır atlamalarını korumak için replace eklenebilir ama insertText çözer)
      document.execCommand('insertText', false, text);
    }
  };

  const handleFormat = (command: string, value?: string) => {
    if (command === 'formatBlock') {
      const isAlreadyActive = 
        (value === 'BLOCKQUOTE' && activeFormats.blockquote) ||
        (value === 'H2' && activeFormats.h2) ||
        (value === 'H3' && activeFormats.h3);
        
      if (isAlreadyActive) {
        document.execCommand('formatBlock', false, 'P');
      } else {
        document.execCommand(command, false, value);
      }
    } else {
      document.execCommand(command, false, value);
    }
    
    editorRef.current?.focus();
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML);
    }
    setTimeout(updateActiveFormats, 10);
  };

  const handleTableClick = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0));
    }
    setShowTableInput(true);
    setShowLinkInput(false); // Link açıksa kapat
  };

  const confirmTable = () => {
    if (savedSelection) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedSelection);

      const rows = Math.max(1, tableRows);
      const cols = Math.max(1, tableCols);

      let tableHTML = `<table style="width: 100%; border-collapse: collapse; margin: 24px 0; border: 1px solid rgba(255,255,255,0.2);"><tbody>`;
      for (let i = 0; i < rows; i++) {
        tableHTML += `<tr>`;
        for (let j = 0; j < cols; j++) {
           const isHeader = i === 0;
           const fw = isHeader ? 'bold' : 'normal';
           tableHTML += `<td style="border: 1px solid rgba(255,255,255,0.2); padding: 12px; font-weight: ${fw};">Hücre</td>`;
        }
        tableHTML += `</tr>`;
      }
      tableHTML += `</tbody></table><p><br></p>`;
      
      handleFormat('insertHTML', tableHTML);
    }
    setShowTableInput(false);
  };

  const insertLink = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      setSavedSelection(selection.getRangeAt(0));
      setShowLinkInput(true);
      setShowTableInput(false); // Tablo açıksa kapat
    } else {
      alert("Lütfen link eklemek için bir metin seçin.");
    }
  };

  const confirmLink = () => {
    if (savedSelection) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedSelection);
      handleFormat('createLink', linkUrl);
    }
    setShowLinkInput(false);
    setLinkUrl("");
  };

  // Deletion Modal
  const [deletingPostId, setDeletingPostId] = useState<string | number | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/blog`);
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
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = htmlContent;
      }
    }, 100);
    
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
      formData.append("author_name", newPost.author_name);
      formData.append("author_role", newPost.author_role);
      formData.append("active", newPost.active ? "true" : "false");

      formData.append("body_content", JSON.stringify(editorContent));

      if (coverImage) formData.append("cover_image", coverImage);
      else if (existingCoverImage) formData.append("existing_cover_image", existingCoverImage);

      if (authorAvatar) formData.append("author_avatar", authorAvatar);
      else if (existingAuthorAvatar) formData.append("existing_author_avatar", existingAuthorAvatar);

      const url = editingPostId ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/blog/${editingPostId}` : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/blog`;
      const method = editingPostId ? "PUT" : "POST";

      const res = await fetch(url, {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/blog/${deletingPostId}`, {
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
      formData.append("author_name", post.author_name || "");
      formData.append("author_role", post.author_role || "");
      formData.append("active", post.active ? "false" : "true");
      formData.append("body_content", JSON.stringify(post.body_content || ""));
      if (post.cover_image) formData.append("existing_cover_image", post.cover_image);
      if (post.author_avatar) formData.append("existing_author_avatar", post.author_avatar);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/blog/${post.id}`, {
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
                            <img src={post.cover_image || "/img/flight-control.png"} className={styles.productImg} alt="" />
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
        <div className={styles.drawerOverlay} onClick={() => setIsDrawerOpen(false)}>
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
                        <label className={styles.formLabel}>Yazar Adı</label>
                        <input type="text" className={styles.formInput} placeholder="Örn: Ahmet Yılmaz" 
                               value={newPost.author_name} onChange={e => setNewPost({...newPost, author_name: e.target.value})} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Yazar Ünvanı</label>
                        <input type="text" className={styles.formInput} placeholder="Örn: Yazılım Mühendisi" 
                               value={newPost.author_role} onChange={e => setNewPost({...newPost, author_role: e.target.value})} />
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
                        <input type="file" accept="image/*" hidden onChange={(e) => { if(e.target.files) setCoverImage(e.target.files[0]) }} />
                      </label>
                    </div>

                    <div className={styles.formGroup} style={{ marginTop: '16px' }}>
                      <label className={styles.formLabel}>Yazar Avatarı</label>
                      <label style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
                        border: '1px dashed #3f3f46', borderRadius: '8px', cursor: 'pointer',
                        backgroundColor: '#1a1a1a', transition: 'all 0.2s', color: '#a1a1aa'
                      }} onMouseOver={e => e.currentTarget.style.borderColor = '#52525b'} onMouseOut={e => e.currentTarget.style.borderColor = '#3f3f46'}>
                        <span style={{ fontSize: '13px', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {authorAvatar ? authorAvatar.name : existingAuthorAvatar ? "Mevcut Avatar Yüklü" : "Resim Seçin..."}
                        </span>
                        <input type="file" accept="image/*" hidden onChange={(e) => { if(e.target.files) setAuthorAvatar(e.target.files[0]) }} />
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

                    <div style={{ border: '1px solid #3f3f46', borderRadius: '8px', overflow: 'hidden' }}>
                      <style>{`
                        .admin-editor-content { color: rgba(255,255,255,0.6); font-size: 18px; line-height: 1.7; font-family: inherit; }
                        .admin-editor-content p:first-of-type { font-size: 20px; line-height: 1.6; color: rgba(255,255,255,0.9); margin-bottom: 32px; font-weight: 400; }
                        .admin-editor-content p { font-size: 18px; color: rgba(255,255,255,0.6); line-height: 1.7; margin-bottom: 24px; }
                        .admin-editor-content h2 { font-size: 28px; font-weight: 700; color: #fff; letter-spacing: -0.025em; margin-top: 32px; margin-bottom: 16px; }
                        .admin-editor-content h3 { font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.025em; margin-top: 24px; margin-bottom: 16px; }
                        .admin-editor-content blockquote { font-size: 20px; font-style: italic; color: rgba(255,255,255,0.8); border-left: 3px solid #3f3f46; padding-left: 24px; margin: 32px 0; }
                        .admin-editor-content ul { list-style-type: disc; padding-left: 24px; margin-bottom: 24px; font-size: 18px; color: rgba(255,255,255,0.6); line-height: 1.7; }
                        .admin-editor-content ol { list-style-type: decimal; padding-left: 24px; margin-bottom: 24px; font-size: 18px; color: rgba(255,255,255,0.6); line-height: 1.7; }
                        .admin-editor-content a { color: #60a5fa; text-decoration: underline; text-underline-offset: 4px; }
                        
                        .admin-editor-content table { width: 100% !important; border-collapse: separate !important; border-spacing: 0 !important; margin: 40px 0 !important; background-color: rgba(255, 255, 255, 0.02) !important; border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 16px !important; overflow: hidden !important; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5) !important; }
                        .admin-editor-content td { border: none !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; border-right: 1px solid rgba(255,255,255,0.05) !important; padding: 20px 24px !important; font-size: 16px !important; color: rgba(255,255,255,0.8) !important; line-height: 1.6 !important; transition: background-color 0.2s ease !important; }
                        .admin-editor-content tr:first-child td { background-color: rgba(255,255,255,0.05) !important; font-weight: 600 !important; color: #fff !important; font-size: 15px !important; letter-spacing: 0.03em !important; text-transform: uppercase; }
                        .admin-editor-content tr:last-child td { border-bottom: none !important; }
                        .admin-editor-content td:last-child { border-right: none !important; }
                        .admin-editor-content tr:not(:first-child):hover td { background-color: rgba(255, 255, 255, 0.04) !important; color: #fff !important; }
                      `}</style>
                      
                      <div style={{ padding: '8px', backgroundColor: '#18181b', borderBottom: '1px solid #3f3f46', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => handleFormat('bold')} style={{ padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', backgroundColor: activeFormats.bold ? '#fff' : '#27272a', color: activeFormats.bold ? '#000' : '#fff' }}><Bold size={16}/></button>
                        <button type="button" onClick={() => handleFormat('italic')} style={{ padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', backgroundColor: activeFormats.italic ? '#fff' : '#27272a', color: activeFormats.italic ? '#000' : '#fff' }}><Italic size={16}/></button>
                        <button type="button" onClick={() => handleFormat('underline')} style={{ padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', backgroundColor: activeFormats.underline ? '#fff' : '#27272a', color: activeFormats.underline ? '#000' : '#fff' }}><Underline size={16}/></button>
                        <span style={{ width: '1px', backgroundColor: '#3f3f46', margin: '0 4px' }}></span>
                        <button type="button" onClick={() => handleFormat('formatBlock', 'H2')} style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: activeFormats.h2 ? '#fff' : '#27272a', color: activeFormats.h2 ? '#000' : '#fff' }}>H2</button>
                        <button type="button" onClick={() => handleFormat('formatBlock', 'H3')} style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: activeFormats.h3 ? '#fff' : '#27272a', color: activeFormats.h3 ? '#000' : '#fff' }}>H3</button>
                        <span style={{ width: '1px', backgroundColor: '#3f3f46', margin: '0 4px' }}></span>
                        <button type="button" onClick={() => handleFormat('insertUnorderedList')} style={{ padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', backgroundColor: activeFormats.ul ? '#fff' : '#27272a', color: activeFormats.ul ? '#000' : '#fff' }} title="Madde İşaretli Liste"><List size={16}/></button>
                        <button type="button" onClick={() => handleFormat('insertOrderedList')} style={{ padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', backgroundColor: activeFormats.ol ? '#fff' : '#27272a', color: activeFormats.ol ? '#000' : '#fff' }} title="Numaralı Liste"><ListOrdered size={16}/></button>
                        <span style={{ width: '1px', backgroundColor: '#3f3f46', margin: '0 4px' }}></span>
                        <button type="button" onClick={() => handleFormat('formatBlock', 'BLOCKQUOTE')} style={{ padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', backgroundColor: activeFormats.blockquote ? '#fff' : '#27272a', color: activeFormats.blockquote ? '#000' : '#fff' }} title="Alıntı"><Quote size={16}/></button>
                        <button type="button" onClick={insertLink} style={{ padding: '6px 10px', color: '#fff', backgroundColor: '#27272a', borderRadius: '6px', cursor: 'pointer' }} title="Bağlantı Ekle"><LinkIcon size={16}/></button>
                        <button type="button" onClick={handleTableClick} style={{ padding: '6px 10px', color: '#fff', backgroundColor: '#27272a', borderRadius: '6px', cursor: 'pointer' }} title="Tablo Ekle"><Table size={16}/></button>
                        
                        <span style={{ width: '1px', backgroundColor: '#3f3f46', margin: '0 4px' }}></span>
                        
                        <button type="button" onClick={() => {
                          const selection = window.getSelection();
                          if (selection && selection.rangeCount > 0) {
                            setSavedSelection(selection.getRangeAt(0));
                          }
                          document.getElementById('editor-image-upload')?.click();
                        }} style={{ padding: '6px 10px', color: '#fff', backgroundColor: '#27272a', borderRadius: '6px', cursor: 'pointer' }} title="Resim Ekle"><ImageIcon size={16}/></button>
                        <input 
                          type="file" 
                          id="editor-image-upload" 
                          hidden 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const base64 = event.target?.result;
                                if (base64) {
                                  if (savedSelection) {
                                    const sel = window.getSelection();
                                    sel?.removeAllRanges();
                                    sel?.addRange(savedSelection);
                                  }
                                  const imgHtml = `<img src="${base64}" style="max-width: 100%; border-radius: 12px; margin: 24px 0; border: 1px solid rgba(255,255,255,0.1);" alt="Blog Görseli" />`;
                                  document.execCommand('insertHTML', false, imgHtml);
                                  
                                  if (editorRef.current) {
                                    setEditorContent(editorRef.current.innerHTML);
                                  }
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                            e.target.value = '';
                          }} 
                        />
                      </div>

                      {showTableInput && (
                        <div style={{ padding: '8px 12px', backgroundColor: '#27272a', borderBottom: '1px solid #3f3f46', display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <label style={{ fontSize: '13px', color: '#a1a1aa' }}>Satır:</label>
                          <input 
                            type="number" 
                            min="1"
                            value={tableRows} 
                            onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                            style={{ width: '60px', padding: '6px', borderRadius: '4px', border: '1px solid #3f3f46', backgroundColor: '#18181b', color: '#fff', fontSize: '13px', outline: 'none' }}
                          />
                          <label style={{ fontSize: '13px', color: '#a1a1aa', marginLeft: '8px' }}>Sütun:</label>
                          <input 
                            type="number" 
                            min="1"
                            value={tableCols} 
                            onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                            style={{ width: '60px', padding: '6px', borderRadius: '4px', border: '1px solid #3f3f46', backgroundColor: '#18181b', color: '#fff', fontSize: '13px', outline: 'none' }}
                          />
                          <button type="button" onClick={confirmTable} style={{ marginLeft: 'auto', padding: '6px 12px', backgroundColor: '#3b82f6', color: '#fff', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', border: 'none', fontWeight: '600' }}>Ekle</button>
                          <button type="button" onClick={() => setShowTableInput(false)} style={{ padding: '6px 12px', backgroundColor: 'transparent', color: '#a1a1aa', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', border: 'none' }}>İptal</button>
                        </div>
                      )}

                      {showLinkInput && (
                        <div style={{ padding: '8px 12px', backgroundColor: '#27272a', borderBottom: '1px solid #3f3f46', display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input 
                            type="url" 
                            placeholder="https://..." 
                            value={linkUrl} 
                            onChange={(e) => setLinkUrl(e.target.value)}
                            style={{ flex: 1, padding: '6px 12px', borderRadius: '4px', border: '1px solid #3f3f46', backgroundColor: '#18181b', color: '#fff', fontSize: '13px', outline: 'none' }}
                            onKeyDown={(e) => {
                              if(e.key === 'Enter') {
                                e.preventDefault();
                                confirmLink();
                              }
                            }}
                          />
                          <button type="button" onClick={confirmLink} style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: '#fff', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', border: 'none', fontWeight: '600' }}>Ekle</button>
                          <button type="button" onClick={() => setShowLinkInput(false)} style={{ padding: '6px 12px', backgroundColor: 'transparent', color: '#a1a1aa', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', border: 'none' }}>İptal</button>
                        </div>
                      )}

                      <div 
                        ref={editorRef}
                        className="admin-editor-content"
                        contentEditable 
                        style={{ minHeight: '300px', padding: '20px', outline: 'none', backgroundColor: '#09090b' }}
                        onInput={(e) => setEditorContent(e.currentTarget.innerHTML)}
                        onKeyDown={handleKeyDown}
                        onKeyUp={updateActiveFormats}
                        onMouseUp={updateActiveFormats}
                        onPaste={handlePaste}
                        suppressContentEditableWarning={true}
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
