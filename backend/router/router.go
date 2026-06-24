package router

import (
	"orbit-backend/handlers"
	"orbit-backend/middleware"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
)

// SetupRoutes tüm API rotalarını tek bir yerde kaydeder
func SetupRoutes(app *fiber.App) {
	// Spam Koruması (Rate Limiter): 1 dakikada max 3 istek (IP bazlı)
	spamLimiter := limiter.New(limiter.Config{
		Max:        3,
		Expiration: 1 * time.Minute,
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Çok fazla istek gönderdiniz. Lütfen 1 dakika bekleyip tekrar deneyin.",
			})
		},
	})

	// Brute-Force (Kaba Kuvvet) Koruması: Login için 15 dakikalık pencerede max 5 deneme
	loginLimiter := limiter.New(limiter.Config{
		Max:        5,
		Expiration: 15 * time.Minute,
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Çok fazla deneme yaptınız, 15 dakika bekleyin",
			})
		},
	})

	// Genel İstek Limitleyici (Spam / Bot / DDOS Koruması)
	generalLimiter := limiter.New(limiter.Config{
		Max:        60, // Saniyede 1 istek ortalaması için dakikada 60 iyi
		Expiration: 1 * time.Minute,
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Sistem koruması devreye girdi. Çok fazla istek attınız, lütfen bekleyin.",
			})
		},
	})

	api := app.Group("/api/v1")
	
	// API altındaki tüm endpointler için genel korumayı aktifleştir
	api.Use(generalLimiter)

	// ==========================================
	// 📂 Dosya Yükleme (Upload) Rotaları
	// ==========================================
	api.Post("/upload", middleware.Protected(), handlers.UploadImage)

	// Yetkilendirme şimdilik sadece Admin panel için /admin/login üzerinden yapılıyor.

	// ==========================================
	// ⚙️ Site Ayarları (Settings) Rotaları
	// ==========================================
	api.Get("/settings", handlers.GetSettings)
	api.Put("/settings", middleware.Protected(), handlers.UpdateSettings)

	// ==========================================
	// ==========================================
	// 📩 İletişim (Contact & Message) Rotaları
	// ==========================================
	api.Post("/contact", spamLimiter, handlers.CreateMessage)
	api.Get("/messages", middleware.Protected(), handlers.GetMessages)
	api.Get("/messages/unread-count", middleware.Protected(), handlers.GetUnreadMessagesCount)
	api.Put("/messages/:id/status", middleware.Protected(), handlers.UpdateMessageStatus)
	api.Delete("/messages/:id", middleware.Protected(), handlers.DeleteMessage)

	// ==========================================
	// 🛡️ ADMIN API & Yetkilendirme
	// ==========================================
	adminGroup := api.Group("/admin")
	adminGroup.Post("/login", loginLimiter, handlers.AdminLogin)

	// Bundan sonraki tüm adminGroup rotalarını Middleware ile koru
	adminGroup.Use(middleware.Protected())

	// Admin: Yöneticiler (Kullanıcılar) Yönetimi
	adminGroup.Get("/users", handlers.GetUsers)
	adminGroup.Post("/users", handlers.CreateUser)
	adminGroup.Put("/users/:id/password", handlers.UpdateUserPassword)
	adminGroup.Delete("/users/:id", handlers.DeleteUser)

	// Admin: Blog Yönetimi
	adminGroup.Get("/blog", handlers.GetAdminBlogPosts)
	adminGroup.Post("/blog", handlers.CreateBlogPost)
	adminGroup.Put("/blog/:id", handlers.UpdateBlogPost)
	adminGroup.Delete("/blog/:id", handlers.DeleteBlogPost)

	// Admin: Kariyer / İş İlanları Yönetimi
	adminGroup.Get("/careers", handlers.GetAdminJobPositions)
	adminGroup.Post("/careers", handlers.CreateJobPosition)
	adminGroup.Put("/careers/:id", handlers.UpdateJobPosition)
	adminGroup.Delete("/careers/:id", handlers.DeleteJobPosition)
	
	// Dashboard
	adminGroup.Get("/dashboard", handlers.GetDashboardStats)

	// Admin: İş Başvuruları Yönetimi
	adminGroup.Get("/applications", handlers.GetAdminApplications)
	adminGroup.Get("/applications/unread-count", handlers.GetUnreadApplicationsCount)
	adminGroup.Put("/applications/mark-read", handlers.MarkApplicationsAsRead)
	adminGroup.Delete("/applications/:id", handlers.DeleteApplication)

	// ==========================================
	// 📦 Ürün Kataloğu (Catalog) Rotaları
	// ==========================================
	api.Post("/products", middleware.Protected(), handlers.CreateProduct)
	api.Get("/products", handlers.GetProducts)
	api.Get("/products/:id", handlers.GetProductByID)
	api.Put("/products/:id", middleware.Protected(), handlers.UpdateProduct)
	api.Delete("/products/:id", middleware.Protected(), handlers.DeleteProduct)
	
	// Anasayfa Slider
	api.Get("/slider", handlers.GetSliderItems)
	adminGroup.Get("/slider", handlers.GetAllSliderItems)
	adminGroup.Post("/slider", handlers.CreateSliderItem)
	adminGroup.Put("/slider/:id", handlers.UpdateSliderItem)
	adminGroup.Delete("/slider/:id", handlers.DeleteSliderItem)

	// ==========================================
	// ✍️ Blog Rotaları
	// ==========================================
	api.Get("/blog", handlers.GetBlogPosts)
	api.Get("/blog/:id", handlers.GetBlogPostByID)

	// ==========================================
	// 💼 Kariyer/İş İlanı (Career) Rotaları
	// ==========================================
	api.Get("/careers", handlers.GetJobPositions)
	api.Post("/applications", spamLimiter, handlers.CreateApplication)
}
