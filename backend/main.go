package main

import (
	"context"
	"log"
	"os"

	"orbit-backend/config"
	"orbit-backend/router"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Overload()

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

	// Yüklenen dosyalara erişim için statik dizin
	app.Static("/uploads", "./uploads")

	router.SetupRoutes(app)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Orbit Unified Backend is online and running on port %s...\n", port)
	log.Fatal(app.Listen(":" + port))
}
