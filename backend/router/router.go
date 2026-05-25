package router

import (
	"orbit-backend/handlers"

	"github.com/gofiber/fiber/v2"
)

// SetupRoutes tüm API rotalarını tek bir yerde kaydeder
func SetupRoutes(app *fiber.App) {
	api := app.Group("/api/v1")

	// ==========================================
	// 🔐 Yetkilendirme (Auth) Rotaları
	// ==========================================
	auth := api.Group("/auth")
	auth.Post("/login", handlers.Login)
	auth.Post("/register", handlers.Register)

	// ==========================================
	// ⚙️ Site Ayarları (Settings) Rotaları
	// ==========================================
	api.Get("/settings", handlers.GetSettings)
	api.Put("/settings", handlers.UpdateSettings)

	// ==========================================
	// 📩 İletişim (Contact & Message) Rotaları
	// ==========================================
	api.Post("/contact", handlers.CreateMessage)
	api.Get("/messages", handlers.GetMessages)
	api.Put("/messages/:id/status", handlers.UpdateMessageStatus)

	// ==========================================
	// 📦 Ürün Kataloğu (Catalog) Rotaları
	// ==========================================
	api.Get("/products", handlers.GetProducts)
	api.Get("/products/:id", handlers.GetProductByID)
	api.Get("/slider", handlers.GetSliderItems)

	// ==========================================
	// ✍️ Blog Rotaları
	// ==========================================
	api.Get("/blog", handlers.GetBlogPosts)
	api.Get("/blog/:id", handlers.GetBlogPostByID)

	// ==========================================
	// 💼 Kariyer/İş İlanı (Career) Rotaları
	// ==========================================
	api.Get("/careers", handlers.GetJobPositions)
	api.Post("/applications", handlers.CreateApplication)
}
