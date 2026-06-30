package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"orbit-backend/config"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// Category model
type Category struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// GetAllCategories, tüm kategorileri döndürür
func GetAllCategories(c *fiber.Ctx) error {
	rows, err := config.DB.Query(context.Background(), "SELECT id, name FROM categories ORDER BY name ASC")
	if err != nil {
		// Eğer tablo yoksa (kullanıcı henüz SQL çalıştırmadıysa) boş array dön, patlama olmasın
		if strings.Contains(err.Error(), "does not exist") {
			return c.JSON([]Category{})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Veritabanı hatası", "details": err.Error()})
	}
	defer rows.Close()

	categories := []Category{}
	for rows.Next() {
		var cat Category
		if err := rows.Scan(&cat.ID, &cat.Name); err != nil {
			continue
		}
		categories = append(categories, cat)
	}

	return c.JSON(categories)
}

type CreateCategoryRequest struct {
	Name string `json:"name"`
}

// CreateCategory, yeni bir kategori oluşturur
func CreateCategory(c *fiber.Ctx) error {
	var req CreateCategoryRequest
	bodyBytes := c.Body()
	
	if err := json.Unmarshal(bodyBytes, &req); err != nil {
		fmt.Printf("JSON Parse Hatası: %v\nRaw Body: %s\n", err, string(bodyBytes))
		return c.Status(400).JSON(fiber.Map{
			"error": "Geçersiz istek",
			"details": err.Error(),
			"rawBody": string(bodyBytes),
		})
	}

	req.Name = strings.TrimSpace(req.Name)
	if req.Name == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Kategori adı boş olamaz"})
	}

	var newID int
	err := config.DB.QueryRow(context.Background(), "INSERT INTO categories (name) VALUES ($1) RETURNING id", req.Name).Scan(&newID)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value") {
			return c.Status(400).JSON(fiber.Map{"error": "Bu kategori zaten mevcut"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Veritabanı hatası", "details": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{
		"message": "Kategori oluşturuldu",
		"id":      newID,
		"name":    req.Name,
	})
}
