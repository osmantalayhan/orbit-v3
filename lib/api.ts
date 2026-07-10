export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Merkezi API İstek Yöneticisi
 * 
 * Bu fonksiyon, projede kullanılan tüm fetch() çağrılarının yerini alır.
 * Güvenlik için token ekleme ve hata durumunda yönlendirme işlemlerini tek bir merkezden yapar.
 */
export async function apiClient(endpoint: string, options: RequestInit = {}) {
  // 1. Headers (Başlıklar) ayarlanması
  const headers = new Headers(options.headers || {});

  // Tarayıcı ortamındaysak ve token varsa ekle
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("orb_sys_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // Eğer body FormData ise Content-Type'ı BİZ BELİRLEMİYORUZ (Tarayıcı boundary ile kendi ayarlar)
  if (!(options.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  // 2. Fetch isteğinin yapılması
  // Endpoint URL yapısını oluştur (Eğer endpoint doğrudan http ile başlıyorsa API_URL ekleme)
  const isAbsoluteURL = endpoint.startsWith("http://") || endpoint.startsWith("https://");
  const url = isAbsoluteURL ? endpoint : `${API_URL}${endpoint}`;

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
