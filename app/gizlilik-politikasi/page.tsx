import React from 'react';

export const metadata = {
  title: 'Gizlilik Politikası | Orbit',
  description: 'Orbit gizlilik politikası ve çerez kullanımı hakkında bilgilendirme metni.',
};

export default function PrivacyPolicyPage() {
  return (
    <main style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', backgroundColor: '#000', color: '#fff' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 600, marginBottom: '40px', letterSpacing: '-0.02em' }}>
          Gizlilik ve Çerez Politikası
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: '#a1a1aa', lineHeight: 1.7, fontSize: '16px' }}>
          
          <section>
            <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 500, marginBottom: '16px' }}>1. Veri Toplama ve Kullanım</h2>
            <p>
              Orbit olarak, kullanıcılarımızın gizliliğine büyük önem veriyoruz. Web sitemizi ziyaret ettiğinizde, 
              size daha iyi bir hizmet sunabilmek ve site performansını analiz edebilmek amacıyla 
              standart web sunucusu günlük dosyaları (log files) ve analitik çerezleri (cookies) 
              kullanarak anonim ziyaretçi verilerini toplayabiliriz.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 500, marginBottom: '16px' }}>2. Çerezler (Cookies) Hakkında</h2>
            <p>
              Çerezler, web tarayıcınız tarafından bilgisayarınıza veya mobil cihazınıza kaydedilen küçük metin dosyalarıdır. 
              Sitemizin düzgün çalışmasını sağlamak, tercihlerinizi hatırlamak ve ziyaretçi trafiğini anlamak için çerezlerden yararlanıyoruz. 
              Tarayıcı ayarlarınızı değiştirerek çerezleri dilediğiniz zaman devre dışı bırakabilirsiniz, ancak bu durum sitenin 
              bazı fonksiyonlarının tam olarak çalışmasını engelleyebilir.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 500, marginBottom: '16px' }}>3. Üçüncü Taraf Bağlantılar ve Servisler</h2>
            <p>
              Web sitemiz, tamamen bilgi sağlama amaçlı veya iş ortaklarımıza ait harici sitelere bağlantılar içerebilir. 
              Bu dış sitelerin içerikleri veya gizlilik politikaları üzerinde herhangi bir kontrolümüz bulunmamaktadır. 
              Bu sebeple, bağlantı verilen üçüncü taraf sitelerin gizlilik ve veri güvenliği uygulamalarından sorumlu tutulamayız.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 500, marginBottom: '16px' }}>4. Veri Güvenliği</h2>
            <p>
              Sistemlerimiz üzerinde toplanan verilerin izinsiz erişime, değiştirilmeye veya ifşa edilmesine karşı korunması için 
              ticari olarak kabul gören yüksek güvenlik standartlarını uygulamaktayız. Sistemlerimiz düzenli olarak güncellenmekte 
              ve modern güvenlik protokolleri (SSL şifreleme vb.) kullanılmaktadır.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 500, marginBottom: '16px' }}>5. İletişim Formları ve Kişisel Bilgiler</h2>
            <p>
              İletişim, destek veya kariyer formları aracılığıyla bizimle paylaştığınız ad, soyad, e-posta ve benzeri 
              kişisel bilgiler, sadece talebinize yanıt vermek ve size destek sağlamak amacıyla kullanılır. 
              Bu bilgiler yasal bir zorunluluk olmadığı sürece hiçbir şekilde üçüncü şahıs veya kurumlarla paylaşılmaz, 
              satılmaz veya kiralanmaz.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 500, marginBottom: '16px' }}>6. Politika Güncellemeleri</h2>
            <p>
              Gerektiğinde bu gizlilik politikasını önceden haber vermeksizin güncelleyebiliriz. Yapılan tüm değişiklikler 
              bu sayfada yayımlanacak olup, sitemizi kullanmaya devam etmeniz bu güncellemeleri kabul ettiğiniz anlamına gelir. 
              Son güncelleme tarihi her zaman bu dokümanın en altında belirtilecektir.
            </p>
            <p style={{ marginTop: '24px', fontSize: '14px', color: '#71717a' }}>
              Son Güncelleme: Temmuz 2026
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
