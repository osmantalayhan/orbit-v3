import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Next.js'in "export yok" hatası vermemesi için geçerli bir middleware fonksiyonu
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [], // Hiçbir rotada çalışmaması için boş bırakıldı
};
