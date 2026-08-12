package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"orbit-backend/config"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// Badge model
type Badge struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// GetAllBadges, tüm etiketleri döndürür
func GetAllBadges(c *fiber.Ctx) error {
	rows, err := config.DB.Query(context.Background(), "SELECT id, name FROM badges ORDER BY name ASC")
	if err != nil {
		// Eğer tablo yoksa boş array dön, patlama olmasın
		if strings.Contains(err.Error(), "does not exist") {
			return c.JSON([]Badge{})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Veritabanı hatası", "details": err.Error()})
	}
	defer rows.Close()

	badges := []Badge{}
	for rows.Next() {
		var b Badge
		if err := rows.Scan(&b.ID, &b.Name); err != nil {
			continue
		}
		badges = append(badges, b)
	}

	return c.JSON(badges)
}

type CreateBadgeRequest struct {
	Name string `json:"name"`
}

// CreateBadge, yeni bir etiket oluşturur
func CreateBadge(c *fiber.Ctx) error {
	var req CreateBadgeRequest
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
		return c.Status(400).JSON(fiber.Map{"error": "Etiket adı boş olamaz"})
	}

	var newID int
	err := config.DB.QueryRow(context.Background(), "INSERT INTO badges (name) VALUES ($1) RETURNING id", req.Name).Scan(&newID)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value") {
			return c.Status(400).JSON(fiber.Map{"error": "Bu etiket zaten mevcut"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Veritabanı hatası", "details": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{
		"message": "Etiket oluşturuldu",
		"id":      newID,
		"name":    req.Name,
	})
}

// DeleteBadge, belirtilen etiketi siler
func DeleteBadge(c *fiber.Ctx) error {
	id := c.Params("id")

	// Önce etiketin adını almamız lazım ki ürünlerde kullanılıyor mu bakalım
	var badgeName string
	err := config.DB.QueryRow(context.Background(), "SELECT name FROM badges WHERE id = $1", id).Scan(&badgeName)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Etiket bulunamadı"})
	}

	// Bu etiket adına sahip ürün var mı kontrol et ve varsa etiketlerini temizle
	var count int
	checkQuery := `SELECT COUNT(*) FROM products WHERE badge ILIKE $1`
	if err := config.DB.QueryRow(context.Background(), checkQuery, badgeName).Scan(&count); err == nil && count > 0 {
		_, err = config.DB.Exec(context.Background(), "UPDATE products SET badge = '' WHERE badge ILIKE $1", badgeName)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Ürünlerin etiketi temizlenirken hata oluştu", "details": err.Error()})
		}
	}

	// Kullanılmıyorsa (veya artık temizlendiyse) sil
	_, err = config.DB.Exec(context.Background(), "DELETE FROM badges WHERE id = $1", id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Etiket silinirken hata oluştu", "details": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Etiket başarıyla silindi"})
}
