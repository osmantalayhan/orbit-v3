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

// DeleteCategory, belirtilen kategoriyi siler
func DeleteCategory(c *fiber.Ctx) error {
	id := c.Params("id")

	// Önce kategorinin adını almamız lazım ki ürünlerde kullanılıyor mu bakalım
	var categoryName string
	err := config.DB.QueryRow(context.Background(), "SELECT name FROM categories WHERE id = $1", id).Scan(&categoryName)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Kategori bulunamadı"})
	}

	// Bu kategori adına sahip ürün var mı kontrol et
	var count int
	checkQuery := `SELECT COUNT(*) FROM products WHERE category = $1`
	if err := config.DB.QueryRow(context.Background(), checkQuery, categoryName).Scan(&count); err == nil && count > 0 {
		return c.Status(400).JSON(fiber.Map{"error": fmt.Sprintf("Bu kategoride (%s) %d adet ürün bulunuyor. Lütfen önce o ürünlerin kategorisini değiştirin.", categoryName, count)})
	}

	// Kullanılmıyorsa sil
	_, err = config.DB.Exec(context.Background(), "DELETE FROM categories WHERE id = $1", id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Kategori silinirken hata oluştu", "details": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Kategori başarıyla silindi"})
}
