import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    // Sunucu tarafında çalıştığı için (Edge runtime) göreceli yol (/api-proxy) kullanamaz, backend'e tam URL atmalı.
    const apiUrl = process.env.BACKEND_URL || 'http://orbit_backend:8080';
    
    // Aktif yönlendirmeleri backend'den çekiyoruz
    // next: { revalidate: 60 } sayesinde her saniye istek atılmaz, 60 saniyede bir önbellek (cache) tazelenir. Performansı yüksek tutar.
    const res = await fetch(`${apiUrl}/api/v1/active-redirects`, {
      next: { revalidate: 60 } 
    });

    if (res.ok) {
      const redirects = await res.json();
      
      // Kullanıcının girdiği URL ile eşleşen 'eski url' var mı kontrol et
      const match = redirects.find((r: any) => 
        r.old_url === pathname || 
        r.old_url === pathname + '/' || 
        r.old_url + '/' === pathname
      );
      
      if (match) {
        // Yönlendirme hedefi dış bağlantıysa (https://...) direkt git
        if (match.new_url.startsWith('http')) {
          return NextResponse.redirect(match.new_url, 301);
        } else {
          // Kendi sitemiz içindeyse yeni URL'yi oluştur ve 301 yönlendirmesi yap
          const newUrl = new URL(match.new_url, request.url);
          return NextResponse.redirect(newUrl, 301);
        }
      }
    }
  } catch (error) {
    // Eğer API'ye ulaşılamazsa (sunucu çökmesi vb.), sitenin geri kalanı durmasın diye sessizce devam eder
    console.error("Middleware Redirect Check Failed:", error);
  }

  return NextResponse.next();
}

export const config = {
  // Middleware'in sadece sayfa ziyaretlerinde çalışmasını sağlıyoruz. Statik dosyalar, admin paneli ve API'lerde boşuna yorulmaz.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|img|orb-sys).*)',
  ],
};
