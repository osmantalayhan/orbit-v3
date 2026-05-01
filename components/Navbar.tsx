import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Ana menü">
      <div className="navbar-left">
        <Link href="/" className="navbar-logo">
          <Image
            src="/img/logo.png"
            alt="Orbit Teknoloji"
            width={90}
            height={27}
            priority
          />
        </Link>

        <ul className="navbar-links">
          <li><Link href="#esc">ESC</Link></li>
          <li><Link href="#ucus-kontrol">Uçuş Kontrol</Link></li>
          <li><Link href="#elrs">ELRS</Link></li>
          <li><Link href="#gps">GPS</Link></li>
          <li><Link href="#cozumler">Çözümler</Link></li>
          <li><Link href="#destek">Destek</Link></li>
        </ul>
      </div>

      <div className="navbar-right">
        <div className="navbar-icon-group">
          {/* Search Icon */}
          <a href="#search" className="navbar-icon" aria-label="Arama">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </a>
          
          {/* User Icon */}
          <a href="#login" className="navbar-icon" aria-label="Giriş Yap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </a>
          
          {/* Region Icon */}
          <a href="#region" className="navbar-icon" aria-label="Bölge Seçimi">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>TR</span>
          </a>
        </div>

        <Link href="#magaza" className="navbar-cta-blue">
          Mağaza
        </Link>
      </div>
    </nav>
  );
}
