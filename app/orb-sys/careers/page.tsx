"use client";

import React, { useState, useEffect } from "react";
import styles from "../orb-sys.module.css";
import { Search, Plus, X, Trash2, Edit, Save, Download, Briefcase, Users, CheckCircle, Clock } from "lucide-react";
import { apiClient } from "@/lib/api";

interface JobPosition {
  id: number | string;
  title: string;
  department: string;
  location: string;
  job_type: string;
  linkedin_url: string;
  active: boolean;
  created_at?: string;
}

interface JobApplication {
  id: number | string;
  name: string;
  profession: string;
  employment_type: string;
  linkedin_url: string;
  cv_file_path: string;
  status: string;
  created_at?: string;
}

export default function AdminCareersPage() {
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tabs State
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  
  // Applications State
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [deletingAppId, setDeletingAppId] = useState<number | string | null>(null);

  // Modal (Drawer) State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<number | string | null>(null);

  // Delete State
  const [deletingJobId, setDeletingJobId] = useState<number | string | null>(null);

  // Form State
  const [newJob, setNewJob] = useState<Partial<JobPosition>>({
    title: "",
    department: "",
    location: "",
    job_type: "Tam Zamanlı",
    linkedin_url: "",
    active: true,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("Tümü");

  const [appSearchQuery, setAppSearchQuery] = useState("");
  const [appEmploymentType, setAppEmploymentType] = useState("Tümü");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/careers?t=${new Date().getTime()}`);
      if (!res.ok) throw new Error("İlanlar getirilemedi");
      const data = await res.json();
      setJobs(data || []);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/applications?t=${new Date().getTime()}`);
      if (!res.ok) throw new Error("Başvurular getirilemedi");
      const data = await res.json();
      setApplications(data || []);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'jobs') {
      fetchJobs();
    } else {
      fetchApplications();
      // "Gelen Başvurular" sekmesine girildiğinde, okundu olarak işaretle ve menüdeki badge'i sıfırla
      apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/applications/mark-read`, { method: "PUT" })
        .then(res => {
          if (res.ok) {
            window.dispatchEvent(new Event("orbit_apps_read"));
          }
        })
        .catch(err => console.error("Mark read error:", err));
    }
  }, [activeTab]);

  const handleOpenNewDrawer = () => {
    setEditingJobId(null);
    setNewJob({
      title: "",
      department: "",
      location: "",
      job_type: "Tam Zamanlı",
      linkedin_url: "",
      active: true,
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (job: JobPosition) => {
    setEditingJobId(job.id);
    setNewJob({
      title: job.title,
      department: job.department,
      location: job.location,
      job_type: job.job_type,
      linkedin_url: job.linkedin_url,
      active: job.active,
    });
    setIsDrawerOpen(true);
  };

  const handleSaveJob = async () => {
    try {
      const payload = {
        title: newJob.title || "",
        department: newJob.department || "",
        location: newJob.location || "",
        job_type: newJob.job_type || "Tam Zamanlı",
        linkedin_url: newJob.linkedin_url || "",
        description: "", // Simplification request
        requirements: [], // Simplification request
        active: newJob.active !== undefined ? newJob.active : true,
      };

      console.log("Gönderilen payload:", payload);

      const url = editingJobId ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/careers/${editingJobId}` : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/careers`;
      const method = editingJobId ? "PUT" : "POST";

      const res = await apiClient(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error response:", res.status, errorText);
        throw new Error("İlan kaydedilemedi: " + errorText);
      }

      setIsDrawerOpen(false);
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Kayıt sırasında bir hata oluştu.");
    }
  };

  const handleDeleteJob = async () => {
    if (!deletingJobId) return;
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/careers/${deletingJobId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setDeletingJobId(null);
        fetchJobs();
      } else {
        throw new Error("İlan silinemedi");
      }
    } catch (err) {
      alert("Silme işlemi başarısız.");
      setDeletingJobId(null);
    }
  };

  const handleDeleteApplication = async () => {
    if (!deletingAppId) return;
    try {
      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/applications/${deletingAppId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setDeletingAppId(null);
        fetchApplications();
      } else {
        throw new Error("Başvuru silinemedi");
      }
    } catch (err) {
      alert("Silme işlemi başarısız.");
      setDeletingAppId(null);
    }
  };

  const toggleActiveStatus = async (job: JobPosition) => {
    // Optimistic Update
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, active: !j.active } : j));

    try {
      const payload = {
        title: job.title,
        department: job.department,
        location: job.location,
        job_type: job.job_type,
        linkedin_url: job.linkedin_url,
        active: !job.active,
        description: "",
        requirements: []
      };

      console.log("Toggle payload:", payload);

      const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orb-sys/careers/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        fetchJobs(); // revert
      }
    } catch (e) {
      console.error(e);
      fetchJobs(); // revert
    }
  };

  const departments = ["Tümü", ...Array.from(new Set(jobs.map(j => j.department)))].filter(Boolean);

  const filteredJobs = jobs.filter(job => {
    const matchDep = selectedDepartment === "Tümü" || job.department === selectedDepartment;
    const matchSearch = job.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDep && matchSearch;
  });

  const appEmploymentTypes = ["Tümü", ...Array.from(new Set(applications.map(a => a.employment_type)))].filter(Boolean);

  const filteredApplications = applications.filter(app => {
    const matchType = appEmploymentType === "Tümü" || app.employment_type === appEmploymentType;
    const searchLower = appSearchQuery.toLowerCase();
    const matchSearch = app.name?.toLowerCase().includes(searchLower) || app.profession?.toLowerCase().includes(searchLower);
    return matchType && matchSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [appSearchQuery, appEmploymentType, activeTab, itemsPerPage]);

  // İstatistikleri hesaplama (Sadece Gelen Başvurular sekmesinde gösterilecek)
  const totalApps = applications.length;
  const fullTimeApps = applications.filter(a => a.employment_type === 'Tam Zamanlı').length;
  const internApps = applications.filter(a => a.employment_type === 'Stajyer' || a.employment_type === 'Staj').length;
  
  const professionCounts: Record<string, number> = {};
  applications.forEach(a => {
    const prof = a.profession || 'Belirtilmemiş';
    professionCounts[prof] = (professionCounts[prof] || 0) + 1;
  });
  let topProfession = "-";
  let maxProfCount = 0;
  Object.entries(professionCounts).forEach(([prof, count]) => {
    if (count > maxProfCount) {
      maxProfCount = count;
      topProfession = prof;
    }
  });

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <div>
          <h2 className={styles.pageTitle}>Kariyer Yönetimi</h2>
          <p className={styles.pageDesc}>
            Açık iş ilanlarınızı yönetin ve başvuruları doğrudan LinkedIn'e yönlendirin.
          </p>
        </div>
        {activeTab === 'jobs' && (
          <button className={styles.downloadBtn} onClick={handleOpenNewDrawer}>
            <Plus size={16} />
            Yeni İlan Ekle
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* TABS */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '16px', borderBottom: '1px solid #27272a' }}>
        <button 
          onClick={() => setActiveTab('jobs')}
          style={{ padding: '12px 0', border: 'none', background: 'transparent', color: activeTab === 'jobs' ? '#fff' : '#a1a1aa', fontWeight: activeTab === 'jobs' ? 600 : 500, borderBottom: activeTab === 'jobs' ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer', fontSize: '15px' }}
        >
          Açık İlanlar
        </button>
        <button 
          onClick={() => setActiveTab('applications')}
          style={{ padding: '12px 0', border: 'none', background: 'transparent', color: activeTab === 'applications' ? '#fff' : '#a1a1aa', fontWeight: activeTab === 'applications' ? 600 : 500, borderBottom: activeTab === 'applications' ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer', fontSize: '15px' }}
        >
          Gelen Başvurular
        </button>
      </div>

      {/* İstatistikler */}
      {activeTab === 'applications' && applications.length > 0 && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          {[
            { label: "Toplam Başvuru", value: totalApps },
            { label: "Tam Zamanlı", value: fullTimeApps },
            { label: "Stajyer", value: internApps },
            { label: "En Çok Başvurulan", value: topProfession },
          ].map((stat, i) => (
            <div key={i} style={{ flex: 1, backgroundColor: '#121212', border: '1px solid #27272a', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 500 }}>{stat.label}</span>
              <span style={{ fontSize: '20px', color: '#fff', fontWeight: 600 }}>{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.panelCard} style={{ padding: 0, overflow: 'hidden' }}>
        
        {activeTab === 'jobs' ? (
          <div style={{ padding: '24px', borderBottom: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className={styles.searchBox}>
                <Search size={14} color="#a1a1aa" />
                <input 
                  type="text" 
                  placeholder="İlan ara..." 
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
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {departments.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 600 }}>
              Toplam: {filteredJobs.length} İlan
            </div>
          </div>
        ) : (
          <div style={{ padding: '24px', borderBottom: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className={styles.searchBox}>
                <Search size={14} color="#a1a1aa" />
                <input 
                  type="text" 
                  placeholder="Aday veya meslek ara..." 
                  className={styles.searchInput}
                  style={{ width: '250px' }}
                  value={appSearchQuery}
                  onChange={(e) => setAppSearchQuery(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select 
                  className={styles.formSelect}
                  style={{ width: '180px', padding: '10px 14px', backgroundColor: '#1a1a1a', border: '1px solid #3f3f46', color: '#d4d4d8', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                  value={appEmploymentType}
                  onChange={(e) => setAppEmploymentType(e.target.value)}
                >
                  {appEmploymentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 600 }}>
              Toplam: {filteredApplications.length} Başvuru
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#a1a1aa" }}>Yükleniyor...</div>
        ) : error && ((activeTab === 'jobs' && jobs.length === 0) || (activeTab === 'applications' && applications.length === 0)) ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>{error} (Veya Backend Hazır Değil)</div>
        ) : (
          <div className={styles.tableContainer}>
            {activeTab === 'jobs' ? (
              <table className={styles.dataTable}>
              <thead className={styles.tableHead}>
                <tr>
                  <th style={{ paddingLeft: '24px' }}>İŞ İLANI</th>
                  <th>DEPARTMAN</th>
                  <th>LOKASYON</th>
                  <th>ÇALIŞMA ŞEKLİ</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>İŞLEMLER</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map(job => (
                    <tr key={job.id} className={styles.tableRow}>
                      <td style={{ paddingLeft: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontWeight: 600, color: '#f4f4f5', fontSize: '15px' }}>{job.title}</span>
                          {!job.active && <span style={{ width: 'fit-content', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(245, 158, 11, 0.4)' }}>PASİF / YAYINDA DEĞİL</span>}
                        </div>
                      </td>
                      <td>
                        <span className={styles.badgePill} style={{ backgroundColor: '#1a1a1a', border: '1px solid #3f3f46', color: '#d4d4d8' }}>
                          {job.department}
                        </span>
                      </td>
                      <td><span style={{ color: '#a1a1aa', fontSize: '13px' }}>{job.location}</span></td>
                      <td><span style={{ color: '#a1a1aa', fontSize: '13px' }}>{job.job_type}</span></td>
                      <td style={{ paddingRight: '24px' }}>
                        <div className={styles.actionBtns} style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <div 
                            onClick={() => toggleActiveStatus(job)}
                            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '6px' }}
                          >
                            <div style={{
                              width: '36px', height: '20px', borderRadius: '20px', 
                              backgroundColor: job.active ? '#10b981' : '#3f3f46',
                              position: 'relative', transition: 'background-color 0.3s'
                            }}>
                              <div style={{
                                width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#fff',
                                position: 'absolute', top: '3px', left: job.active ? '19px' : '3px',
                                transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                              }} />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: job.active ? '#10b981' : '#a1a1aa', userSelect: 'none' }}>
                              {job.active ? "Aktif" : "Pasif"}
                            </span>
                          </div>
                          <div style={{ width: '1px', height: '16px', backgroundColor: '#3f3f46' }}></div>
                          <button className={styles.actionBtn} title="Düzenle" onClick={() => handleOpenEditDrawer(job)}>
                            <Edit size={15} />
                          </button>
                          <button className={`${styles.actionBtn} ${styles.danger}`} title="Sil" onClick={() => setDeletingJobId(job.id)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "60px", color: "#a1a1aa" }}>
                      Kayıtlı iş ilanı bulunamadı veya henüz sunucu bağlantısı yok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <table className={styles.dataTable}>
                <thead className={styles.tableHead}>
                  <tr>
                    <th style={{ paddingLeft: '24px' }}>ADAY BİLGİSİ</th>
                    <th>MESLEK & ŞEKİL</th>
                    <th>LINKEDIN</th>
                    <th>ÖZGEÇMİŞ (CV)</th>
                    <th style={{ textAlign: 'right', paddingRight: '24px' }}>İŞLEMLER</th>
                  </tr>
                </thead>
                <tbody>
                  {currentApplications.length > 0 ? (
                    currentApplications.map(app => (
                      <tr key={app.id} className={styles.tableRow}>
                        <td style={{ paddingLeft: '24px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontWeight: 600, color: '#f4f4f5', fontSize: '15px' }}>{app.name}</span>
                            <span style={{ color: '#a1a1aa', fontSize: '12px' }}>{new Date(app.created_at || "").toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ color: '#d4d4d8', fontSize: '14px' }}>{app.profession}</span>
                            <span style={{ color: '#a1a1aa', fontSize: '12px' }}>{app.employment_type}</span>
                          </div>
                        </td>
                        <td>
                          {app.linkedin_url ? (
                            <a href={app.linkedin_url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', fontSize: '13px', textDecoration: 'none' }}>Profili Gör</a>
                          ) : (
                            <span style={{ color: '#a1a1aa', fontSize: '13px' }}>Belirtilmedi</span>
                          )}
                        </td>
                        <td>
                          {app.cv_file_path ? (
                            <a 
                              href={`${process.env.NEXT_PUBLIC_API_URL}${app.cv_file_path}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '6px', textDecoration: 'none', fontSize: '12px', fontWeight: 600 }}
                            >
                              <Download size={14} />
                              CV İndir
                            </a>
                          ) : (
                            <span style={{ color: '#a1a1aa', fontSize: '13px' }}>CV Yok</span>
                          )}
                        </td>
                        <td style={{ paddingRight: '24px' }}>
                          <div className={styles.actionBtns} style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <button className={`${styles.actionBtn} ${styles.danger}`} title="Sil" onClick={() => setDeletingAppId(app.id)}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "60px", color: "#a1a1aa" }}>
                        Henüz hiç başvuru bulunmamaktadır.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Pagination Controls */}
              {totalPages > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #27272a' }}>
                  
                  {/* Items Per Page Selector */}
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

                  {/* Page Numbers (Right Aligned) */}
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
        )}
      </div>
      </div>

      {/* --- YENİ/DÜZENLE MODAL (GENİŞ POPUP / ÇEKMECE) --- */}
      {isDrawerOpen && (
        <div className={styles.drawerOverlay} onClick={() => setIsDrawerOpen(false)}>
          <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()} style={{ height: 'auto', maxHeight: '90vh', maxWidth: '600px' }}>
            
            {/* Header */}
            <div className={styles.drawerHeader}>
              <div>
                <h3 className={styles.drawerTitle}>{editingJobId ? "İş İlanını Düzenle" : "Yeni İş İlanı Ekle"}</h3>
                <p className={styles.drawerDesc} style={{ marginTop: '4px' }}>
                  {editingJobId ? "Mevcut ilanı güncelleyin." : "Sisteme yeni bir iş ilanı ekleyin."}
                </p>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className={styles.drawerBody} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>İlan Başlığı <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" 
                  className={styles.formInput} 
                  value={newJob.title} 
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})} 
                  placeholder="Örn: Senior Software Engineer"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Departman <span style={{ color: '#ef4444' }}>*</span></label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    value={newJob.department} 
                    onChange={(e) => setNewJob({...newJob, department: e.target.value})} 
                    placeholder="Örn: Ar-Ge / Yazılım"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Çalışma Şekli <span style={{ color: '#ef4444' }}>*</span></label>
                  <select 
                    className={styles.formInput} 
                    value={newJob.job_type} 
                    onChange={(e) => setNewJob({...newJob, job_type: e.target.value})}
                  >
                    <option value="Tam Zamanlı">Tam Zamanlı</option>
                    <option value="Yarı Zamanlı">Yarı Zamanlı</option>
                    <option value="Proje Bazlı">Proje Bazlı</option>
                    <option value="Staj">Staj</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Lokasyon <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" 
                  className={styles.formInput} 
                  value={newJob.location} 
                  onChange={(e) => setNewJob({...newJob, location: e.target.value})} 
                  placeholder="Örn: Ankara (Teknopark) veya Uzaktan"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>LinkedIn Başvuru URL'si <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" 
                  className={styles.formInput} 
                  value={newJob.linkedin_url} 
                  onChange={(e) => setNewJob({...newJob, linkedin_url: e.target.value})} 
                  placeholder="Örn: https://www.linkedin.com/jobs/view/..."
                />
                <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '6px' }}>
                  Adaylar web sitesinde ilana tıkladığında doğrudan bu adrese yönlendirilecektir.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className={styles.drawerFooter}>
              <button className={`${styles.formButton} ${styles.btnSecondary}`} onClick={() => setIsDrawerOpen(false)}>
                İptal Et
              </button>
              <button className={`${styles.formButton} ${styles.btnPrimary}`} onClick={handleSaveJob}>
                <Save size={16} />
                {editingJobId ? "Değişiklikleri Kaydet" : "İlanı Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Özel Silme Onayı Modal (Custom Confirm) */}
      {deletingJobId && (
        <div className={styles.drawerOverlay} onClick={() => setDeletingJobId(null)} style={{ zIndex: 999 }}>
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
              İlanı Sil
            </h3>
            <p style={{ fontSize: '14px', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
              Bu iş ilanını kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button 
                onClick={() => setDeletingJobId(null)}
                style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #27272a', backgroundColor: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                İptal Et
              </button>
              <button 
                onClick={handleDeleteJob}
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

      {/* Özel Başvuru Silme Onayı Modal */}
      {deletingAppId && (
        <div className={styles.drawerOverlay} onClick={() => setDeletingAppId(null)} style={{ zIndex: 999 }}>
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
              Başvuruyu Sil
            </h3>
            <p style={{ fontSize: '14px', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
              Bu adayın başvurusunu ve sisteme yüklediği CV dosyasını kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button 
                onClick={() => setDeletingAppId(null)}
                style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #27272a', backgroundColor: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                İptal Et
              </button>
              <button 
                onClick={handleDeleteApplication}
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
