package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"orbit-backend/config"
	"orbit-backend/router"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Overload()

	// Güvenlik Kontrolü: JWT_SECRET eksikse sunucuyu hiç başlatma
	if os.Getenv("JWT_SECRET") == "" {
		log.Fatal("CRITICAL ERROR: Bana gizli anahtar (JWT_SECRET) verilmedi, güvenlik riski alamam! Sunucu başlatılmıyor.")
	}

	config.ConnectDatabase()

	// Otomatik Veritabanı Güncellemesi: offices_json sütunu yoksa ekler
	if config.DB != nil {
		_, err := config.DB.Exec(context.Background(), "ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS offices_json JSONB DEFAULT '[]'::jsonb;")
		if err != nil {
			log.Printf("Uyarı: offices_json auto-migration hatası: %v", err)
		}
		_, err2 := config.DB.Exec(context.Background(), "ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_links_json JSONB DEFAULT '[]'::jsonb;")
		if err2 != nil {
			log.Printf("Uyarı: social_links_json auto-migration hatası: %v", err2)
		}
	}
	app := fiber.New(fiber.Config{
		AppName:                 "Orbit - Unified Modular Monolith Backend",
		BodyLimit:               50 * 1024 * 1024, // Dosya yüklemeleri için sınırı 50MB'a çıkardık
		EnableTrustedProxyCheck: true,
		TrustedProxies:          []string{"127.0.0.1", "::1"},
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			log.Printf("HATA [%d]: %v", code, err)
			return c.Status(code).JSON(fiber.Map{
				"error": "Sistemde bir hata oluştu, lütfen daha sonra tekrar deneyin.",
			})
		},
	})

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:3000"
	}

	app.Use(cors.New(cors.Config{
		AllowOrigins:     frontendURL,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
		ExposeHeaders:    "Content-Length",
		AllowCredentials: true,
	}))

	// CV ve yüklemelerde tarayıcıda zararlı script çalışmasını önlemek (Stored XSS Koruması)
	app.Use("/uploads/cv", func(c *fiber.Ctx) error {
		c.Set("Content-Disposition", "attachment")
		c.Set("X-Content-Type-Options", "nosniff")
		return c.Next()
	})

	// Dosyaların nerede olduğunu kesin olarak bul (çalıştırma dizinine göre)
	cwd, _ := os.Getwd()
	rootDir := cwd
	if filepath.Base(cwd) == "backend" {
		rootDir = filepath.Dir(cwd) // Eğer backend içindeyse bir üst dizine çık
	}
	
	// Yüklenen dosyalara erişim için statik dizin
	app.Static("/uploads", filepath.Join(rootDir, "public", "uploads"))
	app.Static("/uploads", filepath.Join(rootDir, "backend", "uploads"))

	router.SetupRoutes(app)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// ----------------------------------------------------
	// Graceful Shutdown (Zarif Kapanma) Entegrasyonu
	// ----------------------------------------------------
	
	// İşletim sisteminden gelecek sinyalleri dinlemek için bir kanal oluştur
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	// Sunucuyu ana blokta (blocking) değil, ayrı bir goroutine'de başlat
	go func() {
		log.Printf("Orbit Unified Backend is online and running on port %s...\n", port)
		if err := app.Listen(":" + port); err != nil {
			log.Fatalf("Sunucu başlatılamadı: %v", err)
		}
	}()

	// OS'ten (CTRL+C veya Docker stop vs) sinyal gelene kadar bekle
	<-quit
	log.Println("Kapanma sinyali (SIGINT/SIGTERM) alındı...")
	log.Println("Sunucu kapıya kilit vurdu, yeni istek almıyor. Devam eden işlemlerin bitmesi bekleniyor...")

	// 10 Saniyelik bekleme süresi tanıyıp açık kalan isteklerin tamamlanmasını sağla
	if err := app.ShutdownWithTimeout(10 * time.Second); err != nil {
		log.Fatalf("Sunucu kapatılırken hata oluştu: %v", err)
	}

	// Son olarak veritabanı bağlantı havuzunu (Connection Pool) düzgünce kapat
	if config.DB != nil {
		log.Println("Veritabanı bağlantıları güvenle sonlandırılıyor...")
		config.DB.Close()
	}

	log.Println("Orbit Sunucusu başarıyla, hiçbir veri kaybetmeden kapatıldı. 👋")
}
