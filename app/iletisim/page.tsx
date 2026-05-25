"use client";
 
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MapSection from "@/components/MapSection";
import Toast, { ToastType } from "@/components/Toast";
 
export default function IletisimPage() {
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Select...",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Toast State
  const [toastConfig, setToastConfig] = useState<{ isVisible: boolean; message: string; type: ToastType }>({
    isVisible: false,
    message: "",
    type: null
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/v1/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Settings fetch failed");
        return res.json();
      })
      .then((data) => setSettings(data))
      .catch((err) => console.error("Error loading site settings:", err));
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Hata durumunu anlık temizle
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = "İsim Soyisim alanı boş bırakılamaz.";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      tempErrors.email = "E-posta alanı boş bırakılamaz.";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Lütfen geçerli bir e-posta adresi girin.";
    }

    if (formData.subject === "Select...") {
      tempErrors.subject = "Lütfen bir ileti konusu seçin.";
    }

    if (!formData.message.trim()) {
      tempErrors.message = "Mesaj alanı boş bırakılamaz.";
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = "Mesajınız en az 10 karakter olmalıdır.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    
    try {
      const response = await fetch("http://127.0.0.1:8080/api/v1/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Sunucu bir hata döndürdü");
      }

      setStatus("idle"); // Formu aktif bırak
      setToastConfig({ isVisible: true, message: "Talebiniz alınmıştır, ekibimiz en kısa sürede dönüş yapacaktır.", type: "success" });
      
      // Formu temizle
      setFormData({ name: "", email: "", subject: "Select...", message: "" });
      
    } catch (error) {
      console.error("Submit error:", error);
      setStatus("idle");
      setToastConfig({ isVisible: true, message: "Mesajınız teknik bir sorun nedeniyle iletilemedi. Lütfen bağlantınızı kontrol edin.", type: "error" });
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @media (max-width: 1024px) {
          .iletisim-grid {
            gap: 60px !important;
          }
        }
        @media (max-width: 768px) {
          .iletisim-container {
            padding-top: 120px !important;
            padding-bottom: 40px !important;
          }
          .iletisim-grid {
            gap: 40px !important;
            grid-template-columns: 1fr !important;
          }
          .iletisim-title {
            font-size: 42px !important;
            margin-bottom: 16px !important;
          }
          .iletisim-title br {
            display: none !important;
          }
          .iletisim-form {
            gap: 20px !important;
          }
          .iletisim-btn {
            width: 100% !important;
            align-self: center !important;
          }
        }
      `}</style>
      
      {/* page-container: Navbar ile tam genişlikte (globals.css'den) */}
      <div className="page-container iletisim-container" style={{ 
        paddingTop: '180px', 
        paddingBottom: '60px',
        zIndex: 10
      }}>
        
        <div className="iletisim-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '100px', /* Biraz daraltıldı */
          alignItems: 'start' 
        }}>
          
          {/* Left Side: Orantılı Küçültüldü */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="iletisim-title" style={{ 
              fontSize: '74px', /* 84px -> 74px */
              fontWeight: '700', 
              lineHeight: '0.95', 
              letterSpacing: '-0.04em', 
              margin: '0 0 24px 0',
              textTransform: 'lowercase'
            }}>
              orbit'e <br />
              ulaşın.
            </h1>
            <p style={{ 
              color: 'rgba(255,255,255,0.4)', 
              fontSize: '16px', /* 18px -> 16px */
              fontWeight: '500', 
              lineHeight: '1.6', 
              maxWidth: '360px', 
              margin: '0 0 40px 0' 
            }}>
              Sorularınız, teknik destek talepleriniz veya iş birliği fikirleriniz için buradayız. Ekibimiz en kısa sürede size dönüş yapacaktır.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center' }}>
              {[
                { name: "LinkedIn", url: settings?.social_linkedin || "https://linkedin.com/company/orbitteknoloji" },
                { name: "X", url: settings?.social_x || "https://x.com/orbitteknoloji" },
                { name: "YouTube", url: settings?.social_youtube || "https://youtube.com/c/orbitteknoloji" },
                { name: "GitHub", url: settings?.social_github || "https://github.com/orbitteknoloji" }
              ].map((social) => (
                <a 
                  key={social.name} 
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    fontSize: '16px', /* 18px -> 16px */
                    fontWeight: '700', 
                    color: '#fff', 
                    textDecoration: 'none',
                    transition: 'opacity 0.3s ease'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = '0.6')}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  {social.name}
                  <svg style={{ width: '14px', height: '14px', opacity: '0.4' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              ))}
            </div>

          </motion.div>
 
          {/* Right Side: Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
                <form 
                  key="contact-form"
                  onSubmit={handleSubmit} 
                  className="iletisim-form" 
                  style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,0.4)' }}>İsim Soyisim</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={status === "loading"}
                        placeholder="Jane Smith"
                        style={{ 
                          backgroundColor: 'rgba(255,255,255,0.05)', 
                          border: errors.name ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255,255,255,0.05)', 
                          borderRadius: '14px', 
                          height: '52px', 
                          padding: '0 18px', 
                          color: '#fff', 
                          outline: 'none',
                          fontSize: '15px',
                          transition: 'border-color 0.2s ease'
                        }}
                      />
                      {errors.name && <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: '500', textAlign: 'left' }}>{errors.name}</span>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,0.4)' }}>E-posta</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={status === "loading"}
                        placeholder="jane@orbit.com.tr"
                        style={{ 
                          backgroundColor: 'rgba(255,255,255,0.05)', 
                          border: errors.email ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255,255,255,0.05)', 
                          borderRadius: '14px', 
                          height: '52px', 
                          padding: '0 18px', 
                          color: '#fff', 
                          outline: 'none',
                          fontSize: '15px',
                          transition: 'border-color 0.2s ease'
                        }}
                      />
                      {errors.email && <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: '500', textAlign: 'left' }}>{errors.email}</span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,0.4)' }}>Konu</label>
                    <div style={{ position: 'relative' }}>
                      <select 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={status === "loading"}
                        style={{ 
                          width: '100%',
                          backgroundColor: 'rgba(255,255,255,0.05)', 
                          border: errors.subject ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255,255,255,0.05)', 
                          borderRadius: '14px', 
                          height: '52px', 
                          padding: '0 18px', 
                          color: formData.subject === "Select..." ? 'rgba(255,255,255,0.4)' : '#fff', 
                          outline: 'none',
                          fontSize: '15px',
                          cursor: 'pointer',
                          appearance: 'none',
                          colorScheme: 'dark',
                          transition: 'border-color 0.2s ease'
                        }}
                      >
                        <option style={{ backgroundColor: '#111', color: '#fff' }}>Select...</option>
                        <option style={{ backgroundColor: '#111', color: '#fff' }}>Genel Bilgi</option>
                        <option style={{ backgroundColor: '#111', color: '#fff' }}>Teknik Destek</option>
                      </select>
                      <div style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.3 }}>
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.subject && <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: '500', textAlign: 'left' }}>{errors.subject}</span>}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,0.4)' }}>Mesajınız</label>
                    <textarea 
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      disabled={status === "loading"}
                      placeholder="Mesajınızı buraya yazabilirsiniz..."
                      style={{ 
                        backgroundColor: 'rgba(255,255,255,0.05)', 
                        border: errors.message ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255,255,255,0.05)', 
                        borderRadius: '14px', 
                        padding: '18px', 
                        color: '#fff', 
                        outline: 'none',
                        fontSize: '15px',
                        resize: 'none',
                        lineHeight: '1.6',
                        transition: 'border-color 0.2s ease'
                      }}
                    />
                    {errors.message && <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: '500', textAlign: 'left' }}>{errors.message}</span>}
                  </div>

                  <button 
                    type="submit"
                    disabled={status === "loading"}
                    className="iletisim-btn" 
                    style={{ 
                      height: '48px', 
                      width: '180px', 
                      alignSelf: 'flex-end', 
                      backgroundColor: status === "loading" ? 'rgba(255,255,255,0.1)' : '#4060ff', 
                      color: status === "loading" ? 'rgba(255,255,255,0.4)' : '#fff', 
                      fontWeight: '700', 
                      borderRadius: '12px', 
                      border: 'none', 
                      fontSize: '15px', 
                      cursor: status === "loading" ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      marginTop: '10px',
                      boxShadow: status === "loading" ? 'none' : '0 10px 20px rgba(64, 96, 255, 0.15)'
                    }}
                    onMouseOver={(e) => {
                      if (status !== "loading") e.currentTarget.style.backgroundColor = '#3852de';
                    }}
                    onMouseOut={(e) => {
                      if (status !== "loading") e.currentTarget.style.backgroundColor = '#4060ff';
                    }}
                  >
                    {status === "loading" ? "Gönderiliyor..." : "Mesajı Gönder"}
                  </button>
                </form>
          </motion.div>

        </div>

        {/* Maps Section - Side by Side Squares */}
        <MapSection offices={settings?.offices} />

        {/* Toast Bildirimi */}
        <Toast 
          isVisible={toastConfig.isVisible}
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={() => setToastConfig(prev => ({ ...prev, isVisible: false }))}
        />

      </div>
    </main>
  );
}
