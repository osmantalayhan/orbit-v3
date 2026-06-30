"use client";

import React, { useState, useEffect } from "react";
import styles from "../admin.module.css";
import { apiClient } from "@/lib/api";
import { Search, Trash2, Eye, MailOpen } from "lucide-react";

interface ContactMessage {
  id: number | string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read message drawer
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Delete State
  const [deletingMsgId, setDeletingMsgId] = useState<number | string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tümü");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/messages?t=${new Date().getTime()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error("Mesajlar çekilemedi");
      const data = await res.json();
      setMessages(data || []);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReadMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setIsDrawerOpen(true);

    if (msg.status === 'unread') {
      try {
        await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/messages/${msg.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'read' })
        });
        // Sadece local state'i güncelle (optimistic update)
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'read' } : m));
        // Global badge event tetikle
        window.dispatchEvent(new Event("orbit_messages_read"));
      } catch (error) {
        console.error("Okundu işaretleme hatası:", error);
      }
    }
  };

  const handleDeleteMessage = async () => {
    if (!deletingMsgId) return;
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/messages/${deletingMsgId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setDeletingMsgId(null);
        fetchMessages();
      } else {
        throw new Error("Mesaj silinemedi");
      }
    } catch (err) {
      alert("Silme işlemi başarısız.");
      setDeletingMsgId(null);
    }
  };

  // Filter Logic
  const filteredMessages = messages.filter(msg => {
    const matchStatus = 
      statusFilter === "Tümü" ? true : 
      statusFilter === "Okunmamış" ? msg.status === "unread" : 
      msg.status === "read";

    const searchLower = searchQuery.toLowerCase();
    const matchSearch = msg.name?.toLowerCase().includes(searchLower) || msg.subject?.toLowerCase().includes(searchLower) || msg.email?.toLowerCase().includes(searchLower);
    
    return matchStatus && matchSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, itemsPerPage]);

  // Statistics
  const totalMsgs = messages.length;
  const unreadMsgs = messages.filter(m => m.status === 'unread').length;
  const readMsgs = totalMsgs - unreadMsgs;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <div>
          <h2 className={styles.pageTitle}>İletişim Mesajları</h2>
          <p className={styles.pageDesc}>
            Web sitenizin iletişim formundan gelen müşteri mesajlarını ve taleplerini buradan okuyabilirsiniz.
          </p>
        </div>
      </div>

      {messages.length > 0 && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          {[
            { label: "Toplam Mesaj", value: totalMsgs },
            { label: "Okunmamış", value: unreadMsgs, highlight: unreadMsgs > 0 },
            { label: "Okunmuş", value: readMsgs },
          ].map((stat, i) => (
            <div key={i} style={{ flex: 1, backgroundColor: '#121212', border: stat.highlight ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid #27272a', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 500 }}>{stat.label}</span>
              <span style={{ fontSize: '20px', color: stat.highlight ? '#3b82f6' : '#fff', fontWeight: 600 }}>{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.panelCard} style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div className={styles.searchBox}>
              <Search size={14} color="#a1a1aa" />
              <input 
                type="text" 
                placeholder="Gönderen veya konu ara..." 
                className={styles.searchInput}
                style={{ width: '250px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select 
                className={styles.formSelect}
                style={{ width: '180px', padding: '10px 14px', backgroundColor: '#1a1a1a', border: '1px solid #3f3f46', color: '#d4d4d8', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="Tümü">Tümü (Durum)</option>
                <option value="Okunmamış">Okunmamış</option>
                <option value="Okunmuş">Okunmuş</option>
              </select>
            </div>
          </div>

          <div style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 600 }}>
            Toplam: {filteredMessages.length} Mesaj
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#a1a1aa" }}>Yükleniyor...</div>
        ) : error && messages.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>{error} (Veya Backend Kapalı)</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead className={styles.tableHead}>
                <tr>
                  <th style={{ paddingLeft: '24px' }}>GÖNDEREN</th>
                  <th>TARİH</th>
                  <th>KONU</th>
                  <th>MESAJ</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>İŞLEMLER</th>
                </tr>
              </thead>
              <tbody>
                {currentMessages.length > 0 ? (
                  currentMessages.map(msg => (
                    <tr key={msg.id} className={styles.tableRow} style={{ backgroundColor: msg.status === 'unread' ? 'rgba(59, 130, 246, 0.03)' : 'transparent' }}>
                      <td style={{ paddingLeft: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontWeight: msg.status === 'unread' ? 700 : 500, color: msg.status === 'unread' ? '#fff' : '#d4d4d8', fontSize: '15px' }}>
                            {msg.name}
                          </span>
                          <span style={{ color: '#a1a1aa', fontSize: '12px' }}>{msg.email}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ color: '#a1a1aa', fontSize: '13px' }}>
                          {new Date(msg.created_at).toLocaleDateString("tr-TR", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {msg.status === 'unread' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>}
                          <span style={{ color: msg.status === 'unread' ? '#fff' : '#d4d4d8', fontSize: '14px', fontWeight: msg.status === 'unread' ? 600 : 400 }}>{msg.subject}</span>
                        </div>
                      </td>
                      <td style={{ maxWidth: '250px' }}>
                        <div style={{ color: '#a1a1aa', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {msg.message}
                        </div>
                      </td>
                      <td style={{ paddingRight: '24px' }}>
                        <div className={styles.actionBtns} style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <button 
                            className={styles.actionBtn} 
                            title="Mesajı Oku" 
                            onClick={() => handleReadMessage(msg)}
                            style={{ color: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                          >
                            <Eye size={15} />
                          </button>
                          <button className={`${styles.actionBtn} ${styles.danger}`} title="Sil" onClick={() => setDeletingMsgId(msg.id)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "60px", color: "#a1a1aa" }}>
                      Mesaj bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {totalPages > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #27272a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#a1a1aa' }}>Sayfa başı:</span>
                  <select 
                    value={itemsPerPage} 
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    style={{ padding: '4px 8px', backgroundColor: '#1a1a1a', border: '1px solid #3f3f46', borderRadius: '6px', color: '#fff', fontSize: '13px', outline: 'none' }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button 
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{ 
                        width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                        border: currentPage === pageNum ? '1px solid #fff' : '1px solid #3f3f46', 
                        background: currentPage === pageNum ? '#fff' : '#1a1a1a', 
                        color: currentPage === pageNum ? '#000' : '#a1a1aa'
                      }}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mesaj Okuma Çekmecesi */}
      {isDrawerOpen && selectedMessage && (
        <div className={styles.drawerOverlay} onClick={() => setIsDrawerOpen(false)}>
          <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()} style={{ height: 'auto', maxHeight: '90vh', maxWidth: '600px' }}>
            <div className={styles.drawerHeader}>
              <div>
                <h3 className={styles.drawerTitle}>Mesaj Detayı</h3>
              </div>
            </div>
            <div className={styles.drawerBody} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #27272a', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', color: '#fff', margin: '0 0 4px 0' }}>{selectedMessage.name}</h4>
                    <a href={`mailto:${selectedMessage.email}`} style={{ fontSize: '14px', color: '#3b82f6', textDecoration: 'none' }}>{selectedMessage.email}</a>
                  </div>
                  <span style={{ fontSize: '13px', color: '#a1a1aa' }}>
                    {new Date(selectedMessage.created_at).toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{ borderTop: '1px solid #27272a', paddingTop: '16px' }}>
                  <span style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Konu</span>
                  <p style={{ margin: 0, fontSize: '15px', color: '#f4f4f5', fontWeight: 600 }}>{selectedMessage.subject}</p>
                </div>
                <div style={{ borderTop: '1px solid #27272a', paddingTop: '16px' }}>
                  <span style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mesaj İçeriği</span>
                  <p style={{ margin: 0, fontSize: '15px', color: '#d4d4d8', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{selectedMessage.message}</p>
                </div>
              </div>
            </div>
            <div className={styles.drawerFooter}>
              <button className={`${styles.formButton} ${styles.btnPrimary}`} style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsDrawerOpen(false)}>
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Silme Onayı Modal */}
      {deletingMsgId && (
        <div className={styles.drawerOverlay} onClick={() => setDeletingMsgId(null)} style={{ zIndex: 999 }}>
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
              Mesajı Sil
            </h3>
            <p style={{ fontSize: '14px', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
              Bu mesajı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button 
                onClick={() => setDeletingMsgId(null)}
                style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #27272a', backgroundColor: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
              >
                İptal Et
              </button>
              <button 
                onClick={handleDeleteMessage}
                style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
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
