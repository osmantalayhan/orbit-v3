-- =========================================================
-- ORBIT V3 DATABASE SCHEMA SETUP SCRIPT
-- =========================================================

-- 1. USERS TABLE (Admin accounts)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'editor',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. SITE SETTINGS TABLE (Single-row general configurations)
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    site_title VARCHAR(150) NOT NULL,
    site_description TEXT NOT NULL,
    site_keywords TEXT,
    logo_url VARCHAR(255) DEFAULT '/img/logo.png',
    favicon_url VARCHAR(255) DEFAULT '/favicon.ico',
    contact_email VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    contact_address TEXT NOT NULL,
    map_latitude DOUBLE PRECISION NOT NULL,
    map_longitude DOUBLE PRECISION NOT NULL,
    social_linkedin VARCHAR(255),
    social_youtube VARCHAR(255),
    social_x VARCHAR(255),
    social_github VARCHAR(255),
    social_links_json JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT check_single_row CHECK (id = 1)
);

-- 3. PRODUCTS TABLE (Aerospace and drone hardware catalog)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    tagline VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    images TEXT[] NOT NULL,
    specs JSONB NOT NULL,
    channels JSONB NOT NULL,
    pinout_images TEXT[],
    downloads JSONB,
    is_teknofest_active BOOLEAN DEFAULT false,
    teknofest_discount VARCHAR(50),
    badge VARCHAR(50),
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. BLOG POSTS TABLE (Engineering documentation & articles)
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date_published VARCHAR(50) NOT NULL,
    read_time VARCHAR(50) NOT NULL,
    cover_image VARCHAR(255) NOT NULL,
    lead_paragraph TEXT NOT NULL,
    body_content JSONB NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_role VARCHAR(100) NOT NULL,
    author_avatar VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. CAREER POSITIONS TABLE (Available job openings & listings)
CREATE TABLE IF NOT EXISTS job_positions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] NOT NULL,
    linkedin_url VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6. HOMEPAGE SLIDER TABLE (3D Cinematic Hero Slider slides)
CREATE TABLE IF NOT EXISTS home_slider (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) REFERENCES products(id) ON DELETE SET NULL,
    model_code VARCHAR(50) NOT NULL,
    slide_title VARCHAR(100) NOT NULL,
    slide_desc VARCHAR(150) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT true
);

-- 7. CONTACT MESSAGES TABLE (Form submissions catalog)
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- INITIAL DEFAULT DATA SEEDING (Seed baseline settings)
-- =========================================================
INSERT INTO site_settings (
    id, site_title, site_description, site_keywords, 
    contact_email, contact_phone, contact_address, 
    map_latitude, map_longitude, 
    social_linkedin, social_youtube, social_x, social_github, social_instagram, social_nsosyal
) VALUES (
    1,
    'Orbit Teknoloji — Yerli İHA Elektroniği',
    'Yerli Ar-Ge''den doğan İHA elektroniği. ESC''den GPS''e, tamamen Türk mühendisliğinin ürünü.',
    'iha, esc, gps, flight control, uçuş kontrol, elrs, lrs, orbit, drone',
    'info@orbitteknoloji.com',
    '+90 212 000 00 00',
    'Yıldız Teknik Üniversitesi Davutpaşa Kampüsü, Teknopark Alanı, Esenler / İstanbul',
    41.0263, 28.8916, -- Davutpaşa Teknopark default coordinates
    'https://linkedin.com/company/orbitteknoloji',
    'https://youtube.com/c/orbitteknoloji',
    'https://x.com/orbitteknoloji',
    'https://github.com/orbitteknoloji',
    'https://instagram.com/orbitteknoloji',
    'https://nsosyal.com/orbitteknoloji'
) ON CONFLICT (id) DO NOTHING;
