export const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api-proxy";
const SERVER_API_BASE = process.env.BACKEND_URL || "http://orbit_backend:8080";

/**
 * Merkezi API İstek Yöneticisi
 */
export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("orb_sys_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (!(options.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  const isAbsoluteURL = endpoint.startsWith("http://") || endpoint.startsWith("https://");
  let url = endpoint;

  if (!isAbsoluteURL) {
    if (typeof window === "undefined") {
      if (url.startsWith("/api-proxy")) {
        url = url.substring("/api-proxy".length);
      }
      url = `${SERVER_API_BASE}${url}`;
    } else {
      if (!url.startsWith(API_URL)) {
        url = `${API_URL}${url}`;
      }
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 3. Hata ve Token (401) Kontrolü
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      // Sadece admin panelindeyse login'e at (Kullanıcı tarafındaki sorgular 401 döndüyse login'e atma)
      const isAdminRoute = window.location.pathname.startsWith("/orb-sys");
      const isAlreadyLoginPage = window.location.pathname === "/orb-sys/login";
      if (isAdminRoute && !isAlreadyLoginPage) {
        console.warn("Token süresi dolmuş veya geçersiz! Çıkış yapılıyor...");
        localStorage.removeItem("orb_sys_token");
        localStorage.removeItem("orb_sys_user");
        window.location.href = "/orb-sys/login";
      }
    }
  }

  return response;
}
