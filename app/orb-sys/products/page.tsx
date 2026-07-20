"use client";

import React, { useEffect, useState } from "react";
import styles from "../orb-sys.module.css";
import { Package, Plus, Search, Edit2, Trash2, X, Trash, UploadCloud, GripVertical } from "lucide-react";
import { apiClient } from "@/lib/api";
import Toast from "../../../components/Toast";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const baseEditorConfig = {
  theme: 'dark',
  placeholder: 'Ürün detaylarını buraya yazın...',
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  defaultActionOnPaste: 'insert_as_html' as any,
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

interface Product {
  id: string;
  name: string;
  role: string;
  category: string;
  tagline: string;
  description: string;
  images: string[];
  specs: any[];
  channels: any[];
  pinout_images: string[];
  downloads: any[];
  is_teknofest_active: boolean;
  teknofest_discount: string;
  badge: string | null;
  details?: any;
}

type GalleryItem = {
  id: string;
  type: 'existing' | 'new';
  url?: string;
  file?: File;
  title?: string;
};

// === Yardımcı Fonksiyon ===
const getThumbnailUrl = (url: string) => {
  if (!url) return "/img/flight-control.png";
  if (url.startsWith("/img/") || url.includes("thumb_") || url.startsWith("http")) return url;
  const parts = url.split("/");
  const filename = parts.pop();
  return `${parts.join("/")}/thumb_${filename}`;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("TÜMÜ");

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Categories State
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Global Catalog State
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [catalogFile, setCatalogFile] = useState<File | null>(null);
  const [uploadingCatalog, setUploadingCatalog] = useState(false);
  
  // Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    role: "",
    category: "OTOPİLOT",
    badge: "",
    tagline: "",
    description: "",
    isTeknofestActive: false,
    teknofestDiscount: "",
    details: "",
    specs: [{ label: "", value: "" }],
    channels: [{ name: "", url: "" }],
    downloads: [{ title: "", type: "", size: "", desc: "", file_name: "" }]
  });

  // File States
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [draggedGalleryIndex, setDraggedGalleryIndex] = useState<number | null>(null);
  
  const [pinoutItems, setPinoutItems] = useState<GalleryItem[]>([]);
  const [draggedPinoutIndex, setDraggedPinoutIndex] = useState<number | null>(null);

  const [downloadFiles, setDownloadFiles] = useState<(File | null)[]>([null]);

  // Edit States
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Delete Confirm State
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [deletingCategoryName, setDeletingCategoryName] = useState<string | null>(null);

  // Toast State
  const [toast, setToast] = useState<{ isVisible: boolean, message: string, type: "success" | "error" }>({ isVisible: false, message: "", type: "success" });

  const getImageUrl = (url: string) => {
    if (!url) return "";
    return url; // Next.js 'public' klasöründeki dosyaları kendi portundan (3000) sunar. 8080 eklememize gerek yok.
  };

  const truncateFileName = (name: string, maxLen = 30) => {
    if (!name) return "";
    if (name.length <= maxLen) return name;
    const parts = name.split('.');
    const ext = parts.length > 1 ? '.' + parts.pop() : '';
    const base = parts.join('.');
    return base.substring(0, maxLen - 10) + '...' + base.substring(base.length - 5) + ext;
  };

  const openNewProductDrawer = () => {
    setEditingProductId(null);
    setNewProduct({
      name: "", role: "", category: "OTOPİLOT", badge: "", tagline: "", description: "",
      isTeknofestActive: false, teknofestDiscount: "", details: "",
      specs: [{ label: "", value: "" }], channels: [{ name: "", url: "" }],
      downloads: [{ title: "", type: "", size: "", desc: "", file_name: "" }]
    });
    setGalleryItems([]);
    setPinoutItems([]);
    setDownloadFiles([null]);
    setIsDrawerOpen(true);
  };

  const parseDynamicField = (fieldData: any, key1: string, key2: string) => {
    if (!fieldData) return [];
    if (Array.isArray(fieldData)) return fieldData;
    let obj = fieldData;
    if (typeof fieldData === 'string') {
      try { obj = JSON.parse(fieldData); } catch (e) { return []; }
    }
    return Object.entries(obj).map(([k, v]) => ({ [key1]: k, [key2]: v }));
  };

  const handleEditClick = (product: Product) => {
    setEditingProductId(product.id);
    
    const parsedSpecs = parseDynamicField(product.specs, "label", "value");
    const parsedChannels = parseDynamicField(product.channels, "name", "url");

    setNewProduct({
      name: product.name || "",
      role: product.role || "",
      category: product.category || "OTOPİLOT",
      badge: product.badge || "",
      tagline: product.tagline || "",
      description: product.description || "",
      details: product.details || "",
      isTeknofestActive: product.is_teknofest_active || false,
      teknofestDiscount: product.teknofest_discount || "",
      specs: parsedSpecs.length > 0 ? parsedSpecs : [{ label: "", value: "" }],
      channels: parsedChannels.length > 0 ? parsedChannels : [{ name: "", url: "" }],
      downloads: product.downloads && product.downloads.length > 0 ? product.downloads : [{ title: "", type: "", size: "", desc: "" }]
    });
    setGalleryItems(product.images ? product.images.map(img => ({ id: Math.random().toString(), type: 'existing', url: img })) : []);
    setPinoutItems(product.pinout_images ? product.pinout_images.map(img => {
      const parts = img.split('|');
      return { id: Math.random().toString(), type: 'existing', url: parts[0], title: parts.length > 1 ? parts[1] : '' };
    }) : []);
    setDownloadFiles(new Array(product.downloads?.length || 1).fill(null));
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    fetchProducts();
    fetchSettings();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data || []);
      }
    } catch (err) {
      console.error("Kategoriler yüklenemedi:", err);
    }
  };

  const handleAddCategory = () => {
    setNewCategoryName("");
    setIsCategoryModalOpen(true);
  };

  const confirmAddCategory = async () => {
    if (!newCategoryName || !newCategoryName.trim()) {
      alert("Kategori adı boş olamaz.");
      return;
    }
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(`Hata: ${errorData.error} | Detay: ${errorData.details}`);
        return;
      }
      fetchCategories();
      setNewProduct({ ...newProduct, category: newCategoryName.trim() });
      setIsCategoryModalOpen(false);
    } catch (err) {
      console.error("Kategori ekleme hatası:", err);
      alert("Kategori eklenirken bir hata oluştu.");
    }
  };

  const promptDeleteCategory = () => {
    const selectedCatName = newProduct.category;
    if (!selectedCatName) {
      alert("Lütfen silmek için önce listeden bir kategori seçin.");
      return;
    }
    setDeletingCategoryName(selectedCatName);
  };

  const confirmDeleteCategory = async () => {
    if (!deletingCategoryName) return;
    
    const catObj = categories.find((c: any) => c.name === deletingCategoryName);
    if (!catObj) {
      alert("Seçili kategori sistemde bulunamadı.");
      setDeletingCategoryName(null);
      return;
    }

    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/categories/${catObj.id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const errorData = await res.json();
        setToast({ isVisible: true, message: `Hata: ${errorData.error}`, type: "error" });
        setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 5000);
        setDeletingCategoryName(null);
        return;
      }

      setNewProduct({...newProduct, category: ""});
      fetchCategories();
      setDeletingCategoryName(null);
    } catch (err) {
      console.error(err);
      alert("Kategori silinirken bir hata oluştu.");
      setDeletingCategoryName(null);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`);
      if (res.ok) {
        const data = await res.json();
        setSiteSettings(data);
      }
    } catch (err) {
      console.error("Ayarlar yüklenemedi:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`);
      if (!res.ok) throw new Error("Ürünler yüklenirken hata oluştu.");
      const data = await res.json();
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    try {
      const formData = new FormData();
      
      const trMap: { [key: string]: string } = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };
      const slug = newProduct.name.replace(/[çğışöüÇĞİŞÖÜ]/g, m => trMap[m]).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      formData.append("id", slug || "prod_" + Date.now());
      formData.append("name", newProduct.name);
      formData.append("role", newProduct.role);
      formData.append("category", newProduct.category);
      formData.append("badge", newProduct.badge || "");
      formData.append("tagline", newProduct.tagline);
      formData.append("description", newProduct.description);
      formData.append("is_teknofest_active", newProduct.isTeknofestActive ? "true" : "false");
      formData.append("teknofest_discount", newProduct.teknofestDiscount);
      formData.append("details", JSON.stringify(newProduct.details || ""));

      // JSON'a çevrilen tablolar
      formData.append("specs", JSON.stringify(newProduct.specs));
      formData.append("channels", JSON.stringify(newProduct.channels));
      formData.append("downloads", JSON.stringify(newProduct.downloads));

      // Sürükle-Bırak ile sıralanan Galeri Resimleri
      const layout: string[] = [];
      let newFileCount = 0;
      galleryItems.forEach((item) => {
        if (item.type === 'existing') {
          layout.push(item.url!);
        } else {
          formData.append("gallery", item.file!);
          layout.push("FILE:" + newFileCount);
          newFileCount++;
        }
      });
      formData.append("gallery_layout", JSON.stringify(layout));

      // Pinout şemaları
      const pinoutLayout: string[] = [];
      let newPinoutCount = 0;
      pinoutItems.forEach((item) => {
        const itemTitle = item.title || "";
        const titleSuffix = itemTitle ? "|" + itemTitle : "";
        if (item.type === 'existing') {
          pinoutLayout.push(item.url! + titleSuffix);
        } else {
          formData.append("pinouts", item.file!);
          pinoutLayout.push("FILE:" + newPinoutCount + titleSuffix);
          newPinoutCount++;
        }
      });
      formData.append("pinout_layout", JSON.stringify(pinoutLayout));

      // İndirmeler (Belgeler) Dosya Upload'ı
      newProduct.downloads.forEach((doc, idx) => {
        if (downloadFiles[idx]) {
          formData.append(`download_file_${idx}`, downloadFiles[idx] as File);
        }
      });

      const url = editingProductId ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${editingProductId}` : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`;
      const method = editingProductId ? "PUT" : "POST";

      const res = await apiClient(url, {
        method: method,
        body: formData, // JSON stringify değil, doğrudan form data objesi (files upload için)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Ürün kaydedilirken bir hata oluştu.");
      }

      setIsDrawerOpen(false);
      
      // Formu bir sonraki ekleme işlemi için tertemiz sıfırlıyoruz
      setNewProduct({
        name: "",
        role: "",
        category: "OTOPİLOT",
        badge: "",
        tagline: "",
        description: "",
        isTeknofestActive: false,
        teknofestDiscount: "",
        details: "",
        specs: [{ label: "", value: "" }],
        channels: [{ name: "", url: "" }],
        downloads: [{ title: "", type: "", size: "", desc: "", file_name: "" }]
      });
      setGalleryItems([]);
      setPinoutItems([]);
      setDownloadFiles([null]);

      // Listeyi güncellemek için
      fetchProducts();
    } catch (err: any) {
      alert("Hata: " + err.message);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setDeletingProductId(id);
  };

  const handleCatalogUpload = async () => {
    if (!catalogFile) return;
    try {
      setUploadingCatalog(true);
      const formData = new FormData();
      formData.append("file", catalogFile);
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload-doc`, {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Dosya yükleme hatası");
      const uploadData = await res.json();
      
      const updatedSettings = { ...siteSettings, catalog_url: uploadData.url };
      
      const saveRes = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings)
      });
      
      if (!saveRes.ok) throw new Error("Katalog URL kaydedilemedi");
      setSiteSettings(updatedSettings);
      setCatalogFile(null);
      alert("Genel Katalog başarıyla güncellendi!");
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setUploadingCatalog(false);
    }
  };

  const handleRemoveCatalog = async () => {
    try {
      setUploadingCatalog(true);
      const updatedSettings = { ...siteSettings, catalog_url: "" };
      const saveRes = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings)
      });
      if (!saveRes.ok) throw new Error("Katalog kaldırılamadı");
      setSiteSettings(updatedSettings);
      alert("Katalog kaldırıldı!");
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setUploadingCatalog(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingProductId) return;
    
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${deletingProductId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== deletingProductId));
        setDeletingProductId(null);
      } else {
        alert("Ürün silinirken bir hata oluştu.");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Sunucuya bağlanılamadı.");
    }
  };

  // --- Galeri & Sürükle Bırak Fonksiyonları ---
  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validFiles = Array.from(e.target.files).filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`"${file.name}" boyutu 5MB'dan büyük olamaz!`);
          return false;
        }
        return true;
      });
      const newFiles = validFiles.map(file => ({
        id: Math.random().toString(),
        type: 'new' as const,
        file
      }));
      setGalleryItems((prev) => [...prev, ...newFiles]);
      e.target.value = ""; // Reset input
    }
  };

  const handleRemoveGalleryItem = (index: number) => {
    setGalleryItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragStartGallery = (e: React.DragEvent, index: number) => setDraggedGalleryIndex(index);
  const handleDragOverGallery = (e: React.DragEvent) => e.preventDefault();
  const handleDropGallery = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedGalleryIndex === null) return;
    const items = [...galleryItems];
    const draggedItem = items[draggedGalleryIndex];
    items.splice(draggedGalleryIndex, 1);
    items.splice(targetIndex, 0, draggedItem);
    setGalleryItems(items);
    setDraggedGalleryIndex(null);
  };

  // --- Pinout Fonksiyonları ---
  const handlePinoutSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validFiles = Array.from(e.target.files).filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`"${file.name}" boyutu 5MB'dan büyük olamaz!`);
          return false;
        }
        return true;
      });
      const newFiles = validFiles.map(file => ({
        id: Math.random().toString(),
        type: 'new' as const,
        file,
        title: truncateFileName(file.name)
      }));
      setPinoutItems((prev) => [...prev, ...newFiles]);
      e.target.value = ""; // Reset input
    }
  };

  const handlePinoutTitleChange = (index: number, newTitle: string) => {
    const updated = [...pinoutItems];
    updated[index].title = newTitle;
    setPinoutItems(updated);
  };

  const handleRemovePinoutItem = (index: number) => {
    setPinoutItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragStartPinout = (e: React.DragEvent, index: number) => setDraggedPinoutIndex(index);
  const handleDragOverPinout = (e: React.DragEvent) => e.preventDefault();
  const handleDropPinout = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedPinoutIndex === null) return;
    const items = [...pinoutItems];
    const draggedItem = items[draggedPinoutIndex];
    items.splice(draggedPinoutIndex, 1);
    items.splice(targetIndex, 0, draggedItem);
    setPinoutItems(items);
    setDraggedPinoutIndex(null);
  };
  // ---------------------------------------------

  // Dinamik Alan Fonksiyonları
  const handleAddSpec = () => setNewProduct({ ...newProduct, specs: [...newProduct.specs, { label: "", value: "" }] });
  const handleRemoveSpec = (index: number) => {
    const updated = [...newProduct.specs];
    updated.splice(index, 1);
    setNewProduct({ ...newProduct, specs: updated });
  };
  const handleSpecChange = (index: number, field: "label"|"value", val: string) => {
    const updated = [...newProduct.specs];
    updated[index][field] = val;
    setNewProduct({ ...newProduct, specs: updated });
  };

  const handleAddChannel = () => setNewProduct({ ...newProduct, channels: [...newProduct.channels, { name: "", url: "" }] });
  const handleRemoveChannel = (index: number) => {
    const updated = [...newProduct.channels];
    updated.splice(index, 1);
    setNewProduct({ ...newProduct, channels: updated });
  };
  const handleChannelChange = (index: number, field: "name"|"url", val: string) => {
    const updated = [...newProduct.channels];
    updated[index][field] = val;
    setNewProduct({ ...newProduct, channels: updated });
  };

  const handleAddDownload = () => {
    setNewProduct({ ...newProduct, downloads: [...newProduct.downloads, { title: "", type: "", size: "", desc: "", file_name: "" }] });
    setDownloadFiles([...downloadFiles, null]);
  };
  const handleRemoveDownload = (index: number) => {
    const updated = [...newProduct.downloads];
    updated.splice(index, 1);
    setNewProduct({ ...newProduct, downloads: updated });

    const updatedFiles = [...downloadFiles];
    updatedFiles.splice(index, 1);
    setDownloadFiles(updatedFiles);
  };
  const handleDownloadChange = (index: number, field: keyof typeof newProduct.downloads[0], val: string) => {
    const updated = [...newProduct.downloads];
    updated[index][field] = val;
    setNewProduct({ ...newProduct, downloads: updated });
  };
  const handleDownloadFileChange = (index: number, file: File | null) => {
    const updatedFiles = [...downloadFiles];
    updatedFiles[index] = file;
    setDownloadFiles(updatedFiles);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === "TÜMÜ" || 
                            p.category.toLocaleLowerCase('tr-TR') === filterCategory.toLocaleLowerCase('tr-TR');

    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.dashboardContainer}>
      <style>{`
        .jodit-wysiwyg h1, .jodit-container h1 { font-size: 2.25rem !important; font-weight: 800 !important; margin: 1em 0 0.5em 0 !important; color: #fff !important; }
        .jodit-wysiwyg h2, .jodit-container h2 { font-size: 1.875rem !important; font-weight: 700 !important; margin: 1em 0 0.5em 0 !important; color: #fff !important; }
        .jodit-wysiwyg h3, .jodit-container h3 { font-size: 1.5rem !important; font-weight: 600 !important; margin: 1em 0 0.5em 0 !important; color: #fff !important; }
        .jodit-wysiwyg h4, .jodit-container h4 { font-size: 1.25rem !important; font-weight: 600 !important; margin: 1em 0 0.5em 0 !important; color: #fff !important; }
        .jodit-wysiwyg p, .jodit-container p { margin-bottom: 1em !important; font-size: 1rem !important; line-height: 1.6 !important; }
        .jodit-wysiwyg ul, .jodit-container ul { list-style-type: disc !important; padding-left: 2rem !important; margin-bottom: 1em !important; }
        .jodit-wysiwyg ol, .jodit-container ol { list-style-type: decimal !important; padding-left: 2rem !important; margin-bottom: 1em !important; }
        .jodit-wysiwyg blockquote, .jodit-container blockquote { border-left: 4px solid #3f3f46 !important; padding-left: 1rem !important; margin: 1em 0 !important; font-style: italic !important; color: #a1a1aa !important; }
        .jodit-wysiwyg table { width: 100% !important; border-collapse: separate !important; border-spacing: 0 !important; margin: 40px 0 !important; background-color: rgba(255, 255, 255, 0.02) !important; border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 16px !important; overflow: hidden !important; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5) !important; }
        .jodit-wysiwyg td { border: none !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; border-right: 1px solid rgba(255,255,255,0.05) !important; padding: 20px 24px !important; font-size: 16px !important; color: rgba(255,255,255,0.8) !important; line-height: 1.6 !important; transition: background-color 0.2s ease !important; }
        .jodit-wysiwyg tr:first-child td { background-color: rgba(255,255,255,0.05) !important; font-weight: 600 !important; color: #fff !important; font-size: 15px !important; letter-spacing: 0.03em !important; text-transform: uppercase; }
        .jodit-wysiwyg tr:last-child td { border-bottom: none !important; }
        .jodit-wysiwyg td:last-child { border-right: none !important; }
        .jodit-wysiwyg tr:not(:first-child):hover td { background-color: rgba(255, 255, 255, 0.04) !important; color: #fff !important; }
        .jodit-wysiwyg img, .jodit-container img { width: 100% !important; height: auto !important; border-radius: 12px !important; margin: 24px 0 !important; object-fit: contain !important; }
      `}</style>
      <Toast 
        message={toast.message} 
        isVisible={toast.isVisible} 
        type={toast.type} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />
      
      {/* Üst Alan */}
      <div className={styles.dashboardHeader}>
        <div>
          <h2 className={styles.pageTitle}>Katalog Yönetimi</h2>
          <p className={styles.pageDesc}>
            Web sitesinde sergilenen tüm İHA ve otopilot ürünlerini yönetin.
          </p>
        </div>
        <button className={styles.downloadBtn} onClick={openNewProductDrawer}>
          <Plus size={16} />
          Yeni Ürün Ekle
        </button>
      </div>

      {/* Tablo Kartı */}
      <div className={styles.panelCard} style={{ padding: 0, overflow: 'hidden', marginBottom: '24px' }}>
        
        {/* Tablo Araç Çubuğu */}
        <div style={{ padding: '24px', borderBottom: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div className={styles.searchBox}>
              <Search size={14} />
              <input
                type="text"
                placeholder="Ürün adı veya donanım ara..."
                className={styles.searchInput}
                style={{ width: '250px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select 
              className={styles.formSelect} 
              style={{ width: '180px', padding: '10px 14px', backgroundColor: '#1a1a1a', border: '1px solid #3f3f46', color: '#d4d4d8', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="TÜMÜ">Tüm Kategoriler</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 600 }}>
            Toplam: {filteredProducts.length} Ürün
          </div>
        </div>

        {/* Yükleniyor / Hata Durumları */}
        {loading && <div style={{ padding: '40px', textAlign: 'center', color: '#a1a1aa' }}>Ürünler yükleniyor...</div>}
        {error && <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>{error}</div>}

        {/* Veri Tablosu */}
        {!loading && !error && (
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead className={styles.tableHead}>
                <tr>
                  <th style={{ paddingLeft: '24px' }}>Ürün</th>
                  <th>Donanım Tipi</th>
                  <th>Kategori</th>
                  <th>Etiket</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className={styles.tableRow}>
                      <td style={{ paddingLeft: '24px' }}>
                        <div className={styles.productCell}>
                          <div className={styles.productImgBox}>
                            <img
                              src={getThumbnailUrl(product.images?.[0] || "/img/flight-control.png")}
                              alt={product.name}
                              className={styles.productImg}
                              onError={(e) => {
                                // Eğer thumbnail yoksa (eski resimse), orjinal resme dön
                                const target = e.currentTarget as HTMLImageElement;
                                if (!target.src.includes("thumb_")) return; // Sonsuz döngüyü engelle
                                target.src = getImageUrl(product.images?.[0] || "/img/flight-control.png");
                              }}
                            />
                          </div>
                          <span className={styles.productName}>{product.name}</span>
                        </div>
                      </td>
                      <td><span className={styles.productRole}>{product.role}</span></td>
                      <td>
                        <span className={styles.badgePill} style={{ backgroundColor: '#1a1a1a', border: '1px solid #3f3f46', color: '#d4d4d8' }}>
                          {product.category}
                        </span>
                      </td>
                      <td>
                        {product.badge ? (
                          <span className={`${styles.badgePill} ${product.badge.toLowerCase() === 'yeni' ? styles.badgeGreen : styles.badgeGray}`}>
                            {product.badge}
                          </span>
                        ) : (
                          <span style={{ color: '#52525b', fontSize: '13px' }}>-</span>
                        )}
                      </td>
                      <td style={{ paddingRight: '24px' }}>
                        <div className={styles.actionBtns}>
                          <button className={styles.actionBtn} title="Düzenle" onClick={() => handleEditClick(product)}><Edit2 size={15} /></button>
                          <button className={`${styles.actionBtn} ${styles.danger}`} title="Sil" onClick={() => handleDeleteProduct(product.id)}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '60px', textAlign: 'center', color: '#a1a1aa' }}>Kritere uygun ürün bulunamadı.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- GENEL ÜRÜN KATALOĞU BÖLÜMÜ --- */}
      <div className={styles.panelCard} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0, marginBottom: '8px' }}>Genel Ürün Kataloğu (Ana Sayfa)</h3>
          <p style={{ fontSize: '13px', color: '#a1a1aa', margin: 0 }}>
            Ana sayfadaki "Ürün Kataloğunu İndir" butonunun yönlendireceği global PDF dosyasını buradan yükleyebilirsiniz.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <label style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            border: '1px dashed #3f3f46', borderRadius: '8px', cursor: 'pointer',
            backgroundColor: '#1a1a1a', color: '#a1a1aa', flex: 1, minWidth: '250px'
          }}>
            <UploadCloud size={16} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '13px', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {catalogFile ? catalogFile.name : (siteSettings?.catalog_url ? "Mevcut: " + siteSettings.catalog_url.split('/').pop() : "Yeni Katalog Seç (PDF vb.)...")}
            </span>
            <input type="file" accept=".pdf" hidden onChange={e => setCatalogFile(e.target.files?.[0] || null)} />
          </label>

          {catalogFile && (
            <button 
              className={`${styles.formButton} ${styles.btnPrimary}`} 
              onClick={handleCatalogUpload} 
              disabled={uploadingCatalog}
            >
              {uploadingCatalog ? "Yükleniyor..." : "Kataloğu Kaydet"}
            </button>
          )}

          {siteSettings?.catalog_url && !catalogFile && (
            <>
              <a href={siteSettings.catalog_url} target="_blank" rel="noopener noreferrer" className={styles.actionBtn} style={{ padding: '0 16px', width: 'auto', borderRadius: '8px' }}>
                Kataloğu Görüntüle
              </a>
              <button className={`${styles.actionBtn} ${styles.danger}`} style={{ padding: '0 16px', width: 'auto', borderRadius: '8px' }} onClick={handleRemoveCatalog} disabled={uploadingCatalog}>
                {uploadingCatalog ? "Siliniyor..." : "Kataloğu Kaldır"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* --- YENİ ÜRÜN MODAL (GENİŞ POPUP) --- */}
      {isDrawerOpen && (
        <div className={styles.drawerOverlay}>
          <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className={styles.drawerHeader}>
              <div>
                <h3 className={styles.drawerTitle}>{editingProductId ? `Ürünü Düzenle: ${newProduct.name}` : "Yeni Ürün Ekle"}</h3>
                <p className={styles.drawerDesc}>{editingProductId ? "Mevcut ürünün bilgilerini güncelleyin." : "Kataloga yeni bir donanım veya sistem ekleyin."}</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Body / Form (3 Sütunlu Grid Yapısı) */}
            <div className={styles.drawerBody} data-lenis-prevent>
              <div className={styles.modalGrid}>
                
                {/* --- 1. SÜTUN: Temel Bilgiler & Pazarlama --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div className={styles.formSection}>
                    <h4 className={styles.formSectionTitle}>Kimlik Bilgileri</h4>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Ürün Adı</label>
                        <input type="text" className={styles.formInput} placeholder="Örn: Yeni Ürün" 
                               value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Donanım Tipi (Role)</label>
                        <input type="text" className={styles.formInput} placeholder="Örn: Uçuş Kontrol..." 
                               value={newProduct.role} onChange={e => setNewProduct({...newProduct, role: e.target.value})} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Kategori</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <select className={styles.formSelect} value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} style={{ flex: 1 }}>
                            <option value="">Seçiniz...</option>
                            {categories.map((cat: any) => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                          <button type="button" onClick={handleAddCategory} style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '24px' }} title="Yeni Kategori Ekle">
                            +
                          </button>
                          <button type="button" onClick={promptDeleteCategory} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Seçili Kategoriyi Sil">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Etiket</label>
                        <select className={styles.formSelect} value={newProduct.badge} onChange={e => setNewProduct({...newProduct, badge: e.target.value})}>
                          <option value="">(Boş)</option>
                          <option value="YENİ">YENİ</option>
                          <option value="POPÜLER">POPÜLER</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <h4 className={styles.formSectionTitle}>Vitrin & Galeri</h4>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Kısa Slogan (Tagline)</label>
                      <input type="text" className={styles.formInput} placeholder="Kısa ve çarpıcı açıklama..." 
                             value={newProduct.tagline} onChange={e => setNewProduct({...newProduct, tagline: e.target.value})} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Uzun Ürün Açıklaması</label>
                      <textarea className={styles.formTextarea} placeholder="Detaylı açıklama..." 
                                value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                    </div>
                    
                    {/* Galeri ve Sürükle Bırak Alanı */}
                    <div className={styles.formGroup} style={{ marginTop: '8px' }}>
                      <label className={styles.formLabel}>Ürün Görselleri (Çoklu Seçim)</label>
                      <label style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
                        border: '1px dashed #3f3f46', borderRadius: '8px', cursor: 'pointer',
                        backgroundColor: '#1a1a1a', transition: 'all 0.2s', color: '#a1a1aa',
                        marginBottom: '16px'
                      }} onMouseOver={e => e.currentTarget.style.borderColor = '#52525b'} onMouseOut={e => e.currentTarget.style.borderColor = '#3f3f46'}>
                        <UploadCloud size={20} />
                        <span style={{ fontSize: '13px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Bilgisayardan bir veya birden fazla görsel seçin...
                        </span>
                        <input type="file" accept="image/*" multiple hidden onChange={handleGallerySelect} />
                      </label>

                      {galleryItems.length > 0 && (
                        <div className={styles.galleryGrid}>
                          {galleryItems.map((item, index) => (
                            <div 
                              key={item.id} 
                              draggable 
                              onDragStart={(e) => handleDragStartGallery(e, index)}
                              onDragOver={handleDragOverGallery}
                              onDrop={(e) => handleDropGallery(e, index)}
                              className={styles.galleryItem}
                              title="Ana kapak yapmak için en başa sürükleyin"
                            >
                              <img src={item.type === 'existing' ? getImageUrl(item.url!) : URL.createObjectURL(item.file!)} className={styles.galleryImg} alt={`Galeri ${index}`} />
                              <button className={styles.galleryRemoveBtn} onClick={(e) => { e.preventDefault(); handleRemoveGalleryItem(index); }}>
                                <X size={12} />
                              </button>
                              {index === 0 && <div className={styles.mainCoverBadge}>ANA KAPAK</div>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Teknofest Kampanyası */}
                  <div className={styles.formSection} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '8px', border: '1px solid #3f3f46' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="checkbox" id="teknofestToggle" 
                             checked={newProduct.isTeknofestActive} 
                             onChange={e => setNewProduct({...newProduct, isTeknofestActive: e.target.checked})} 
                             style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#3b82f6' }} />
                      <label htmlFor="teknofestToggle" className={styles.formLabel} style={{ cursor: 'pointer', margin: 0, fontWeight: 700, color: '#ffffff' }}>
                        Bu Üründe Teknofest Kampanyasını Aktif Et
                      </label>
                    </div>
                    
                    {newProduct.isTeknofestActive && (
                      <div className={styles.formGroup} style={{ marginTop: '16px' }}>
                        <label className={styles.formLabel}>İndirim Oranı (%)</label>
                        <input type="number" className={styles.formInput} placeholder="Örn: 15" 
                               value={newProduct.teknofestDiscount} onChange={e => setNewProduct({...newProduct, teknofestDiscount: e.target.value})} />
                      </div>
                    )}
                  </div>
                </div>

                {/* --- 2. SÜTUN: Satış Kanalları & Teknik Parametreler --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div className={styles.formSection}>
                    <h4 className={styles.formSectionTitle}>Satış Kanalları</h4>
                    {newProduct.channels.map((channel, index) => (
                      <div key={index} className={styles.dynamicListRow}>
                        <input type="text" className={styles.formInput} placeholder="Örn: Hepsiburada" 
                               value={channel.name} onChange={e => handleChannelChange(index, "name", e.target.value)} />
                        <input type="text" className={styles.formInput} placeholder="Satış linki (https://...)" 
                               value={channel.url} onChange={e => handleChannelChange(index, "url", e.target.value)} />
                        <button className={styles.actionBtn} style={{ marginTop: '4px' }} onClick={() => handleRemoveChannel(index)}>
                          <Trash size={16} />
                        </button>
                      </div>
                    ))}
                    <button className={styles.addDynamicBtn} onClick={handleAddChannel}>+ Yeni Satış Kanalı Ekle</button>
                  </div>

                  <div className={styles.formSection}>
                    <h4 className={styles.formSectionTitle}>Teknik Parametreler</h4>
                    {newProduct.specs.map((spec, index) => (
                      <div key={index} className={styles.dynamicListRow}>
                        <input type="text" className={styles.formInput} placeholder="Örn: İşlemci" 
                               value={spec.label} onChange={e => handleSpecChange(index, "label", e.target.value)} />
                        <input type="text" className={styles.formInput} placeholder="Örn: STM32F405" 
                               value={spec.value} onChange={e => handleSpecChange(index, "value", e.target.value)} />
                        <button className={styles.actionBtn} style={{ marginTop: '4px' }} onClick={() => handleRemoveSpec(index)}>
                          <Trash size={16} />
                        </button>
                      </div>
                    ))}
                    <button className={styles.addDynamicBtn} onClick={handleAddSpec}>+ Yeni Parametre Ekle</button>
                  </div>
                </div>

                {/* --- 3. SÜTUN: Belgeler & Şemalar --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div className={styles.formSection}>
                    <h4 className={styles.formSectionTitle}>Bağlantı Şeması (Pinout)</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {pinoutItems.map((item, idx) => (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={(e) => handleDragStartPinout(e, idx)}
                          onDragOver={handleDragOverPinout}
                          onDrop={(e) => handleDropPinout(e, idx)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                            backgroundColor: '#1a1a1a', border: '1px solid #27272a', borderRadius: '8px', cursor: 'grab'
                          }}
                        >
                          <GripVertical size={16} color="#52525b" />
                          <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#27272a', flexShrink: 0 }}>
                            <img
                              src={item.type === 'existing' ? getImageUrl(item.url!) : URL.createObjectURL(item.file!)}
                              alt="pinout"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => handlePinoutTitleChange(idx, e.target.value)}
                            placeholder="Şema Adı (Opsiyonel)"
                            style={{
                              flex: 1, backgroundColor: 'transparent', border: '1px solid #3f3f46',
                              color: '#d4d4d8', fontSize: '13px', padding: '6px 10px', borderRadius: '4px',
                              outline: 'none'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePinoutItem(idx)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <label style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px',
                        border: '1px dashed #3f3f46', borderRadius: '8px', cursor: 'pointer',
                        backgroundColor: '#1a1a1a', color: '#a1a1aa', transition: 'all 0.2s ease'
                      }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--blue-primary)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = '#3f3f46'; e.currentTarget.style.color = '#a1a1aa'; }}
                      >
                        <UploadCloud size={18} />
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>Bağlantı Şeması Ekle (+)</span>
                        <input type="file" accept="image/*" multiple hidden onChange={handlePinoutSelect} />
                      </label>
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <h4 className={styles.formSectionTitle}>Belgeler & İndirmeler</h4>
                    {newProduct.downloads.map((doc, index) => (
                      <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', backgroundColor: '#1a1a1a', border: '1px solid #27272a', borderRadius: '8px', marginBottom: '8px' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#d4d4d8' }}>Belge #{index + 1}</span>
                          <button className={styles.actionBtn} style={{ width: '28px', height: '28px' }} onClick={() => handleRemoveDownload(index)}>
                            <Trash size={14} />
                          </button>
                        </div>

                        <div className={styles.formGrid}>
                          <input type="text" className={styles.formInput} placeholder="Belge Adı" 
                                 value={doc.title} onChange={e => handleDownloadChange(index, "title", e.target.value)} />
                          <input type="text" className={styles.formInput} placeholder="Format (PDF vb.)" 
                                 value={doc.type} onChange={e => handleDownloadChange(index, "type", e.target.value)} />
                        </div>
                        
                        <input type="text" className={styles.formInput} placeholder="Kısa Açıklama (Opsiyonel)" 
                               value={doc.desc} onChange={e => handleDownloadChange(index, "desc", e.target.value)} />

                        <label style={{
                          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                          border: '1px dashed #3f3f46', borderRadius: '6px', cursor: 'pointer',
                          backgroundColor: '#121212', color: '#a1a1aa', minWidth: 0
                        }}>
                          <UploadCloud size={16} style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: '12px', flex: 1, whiteSpace: 'nowrap' }} title={doc.file_name || ""}>
                            {downloadFiles[index] ? truncateFileName(downloadFiles[index]?.name || "") : (doc.file_name ? "Mevcut: " + truncateFileName(doc.file_name) : "Bilgisayardan seç...")}
                          </span>
                          <input type="file" hidden onChange={e => handleDownloadFileChange(index, e.target.files?.[0] || null)} />
                        </label>

                      </div>
                    ))}
                    <button className={styles.addDynamicBtn} onClick={handleAddDownload}>+ Yeni Belge Ekle</button>
                  </div>
                </div>

              </div>

              {/* Ayrıntılar (Jodit Editor) - Tam Genişlik */}
              <div className={styles.formSection} style={{ marginTop: "32px", width: "100%" }}>
                <h4 className={styles.formSectionTitle}>Ayrıntılar (Gelişmiş Açıklama)</h4>
                <div style={{ color: "#000" }}>
                  <JoditEditor
                    value={typeof newProduct.details === "string" ? newProduct.details : ""}
                    config={baseEditorConfig as any}
                    onBlur={(newContent) => setNewProduct({ ...newProduct, details: newContent })}
                  />
                </div>
              </div>

            </div>

            {/* Footer / Kaydet Butonu */}
            <div className={styles.drawerFooter}>
              <button className={`${styles.formButton} ${styles.btnSecondary}`} onClick={() => setIsDrawerOpen(false)}>
                İptal Et
              </button>
              <button className={`${styles.formButton} ${styles.btnPrimary}`} onClick={handleSaveProduct}>
                <Package size={16} />
                Ürünü Kaydet
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Özel Silme Onayı Modal (Custom Confirm) */}
      {deletingProductId && (
        <div className={styles.drawerOverlay} onClick={() => setDeletingProductId(null)} style={{ zIndex: 999 }}>
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
              Ürünü Sil
            </h3>
            <p style={{ fontSize: '14px', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
              Bu ürünü kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm ilişkili dosyalar etkilenebilir.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button 
                onClick={() => setDeletingProductId(null)}
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

      {/* Yeni Kategori Ekleme Modalı */}
      {isCategoryModalOpen && (
        <div className={styles.drawerOverlay} onClick={() => setIsCategoryModalOpen(false)} style={{ zIndex: 999 }}>
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
              <Plus size={20} color="#3b82f6" />
              Yeni Kategori Ekle
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', color: '#a1a1aa' }}>Kategori Adı</label>
              <input 
                type="text" 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Örn: EĞİTİM KİTLERİ"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmAddCategory();
                }}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #27272a', backgroundColor: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                İptal
              </button>
              <button 
                onClick={confirmAddCategory}
                style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                Kategoriyi Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kategori Silme Onayı Modalı */}
      {deletingCategoryName && (
        <div className={styles.drawerOverlay} onClick={() => setDeletingCategoryName(null)} style={{ zIndex: 999 }}>
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
              Kategoriyi Sil
            </h3>
            <p style={{ fontSize: '14px', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
              <strong style={{ color: '#fff' }}>"{deletingCategoryName}"</strong> kategorisini silmek istediğinize emin misiniz? Eğer bu kategoriye ait ürün varsa silme işlemi gerçekleşmeyecektir.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button 
                onClick={() => setDeletingCategoryName(null)}
                style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #27272a', backgroundColor: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                İptal Et
              </button>
              <button 
                onClick={confirmDeleteCategory}
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
