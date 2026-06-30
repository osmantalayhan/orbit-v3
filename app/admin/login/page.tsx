"use client";

import React, { useState, useEffect } from "react";
import styles from "./login.module.css";
import { apiClient } from "@/lib/api";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // GÜVENLİK: Eğer kullanıcı zaten giriş yapmışsa (token varsa), tekrar login formunu göremez.
    // Direkt olarak panele geri postalanır.
    const token = localStorage.getItem("admin_token");
    if (token) {
      window.location.href = "/admin";
    } else {
      // Sadece token YOKSA formu göstermeye izin ver
      setIsChecking(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiClient("/api/v1/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Giriş başarısız, bilgileri kontrol edin.");
      }

      // Başarılı giriş
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));
      
      // Dashboard'a yönlendir
      window.location.href = "/admin";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) {
    // Formu asla render etme, siyah arkaplan bas ve yönlendirmeyi bekle
    return <div className={styles.loginContainer} style={{ backgroundColor: '#0a0a0a' }}></div>;
  }

  return (
    <div className={styles.loginContainer}>
      {/* Performans dostu saf CSS parlama efekti */}
      <div className={styles.glowBackground} />

      <div className={styles.loginBox}>
        <div className={styles.headerArea}>
          <h1 className={styles.title}>Orbit Yönetim</h1>
          <p className={styles.subtitle}>Devam etmek için giriş yapın</p>
        </div>

        {error && (
          <div className={styles.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.inputField}
              placeholder="admin@orbitteknoloji.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.inputField}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
