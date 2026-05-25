package main

import (
	"log"
	"os"

	"orbit-backend/config"
	"orbit-backend/handlers"
	"orbit-backend/router"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Overload()

	config.ConnectDatabase()

	handlers.SeedCatalogData()

	app := fiber.New(fiber.Config{
		AppName: "Orbit - Unified Modular Monolith Backend",
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
		ExposeHeaders:    "Content-Length",
		AllowCredentials: true,
	}))

	// Yüklenen dosyalara (Örn: CV) erişim için statik dizin
	app.Static("/uploads", "./uploads")

	router.SetupRoutes(app)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Orbit Unified Backend is online and running on port %s...\n", port)
	log.Fatal(app.Listen(":" + port))
}
