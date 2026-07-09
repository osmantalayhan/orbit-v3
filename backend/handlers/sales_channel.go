package handlers

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"orbit-backend/config"
	"orbit-backend/models"
	"orbit-backend/services"

	"github.com/gofiber/fiber/v2"
)

// GetSalesChannels anasayfa için aktif satış kanallarını getirir
func GetSalesChannels(c *fiber.Ctx) error {
	rows, err := config.DB.Query(context.Background(), `
		SELECT id, name, url, image_url, sort_order, active
		FROM sales_channels
		WHERE active = true
		ORDER BY sort_order ASC
	`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to query sales channels",
		})
	}
	defer rows.Close()

	items := []models.SalesChannel{}
	for rows.Next() {
		var s models.SalesChannel
		err := rows.Scan(&s.ID, &s.Name, &s.URL, &s.ImageURL, &s.SortOrder, &s.Active)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to parse sales channel",
			})
		}
		items = append(items, s)
	}

	return c.JSON(items)
}

// GetAllSalesChannels admin paneli için tüm satış kanallarını getirir
func GetAllSalesChannels(c *fiber.Ctx) error {
	rows, err := config.DB.Query(context.Background(), `
		SELECT id, name, url, image_url, sort_order, active
		FROM sales_channels
		ORDER BY sort_order ASC
	`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to query sales channels",
		})
	}
	defer rows.Close()

	items := []models.SalesChannel{}
	for rows.Next() {
		var s models.SalesChannel
		err := rows.Scan(&s.ID, &s.Name, &s.URL, &s.ImageURL, &s.SortOrder, &s.Active)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to parse sales channel",
			})
		}
		items = append(items, s)
	}

	return c.JSON(items)
}

// CreateSalesChannel yeni bir satış kanalı ekler
func CreateSalesChannel(c *fiber.Ctx) error {
	name := c.FormValue("name")
	url := c.FormValue("url")
	sortOrderStr := c.FormValue("sort_order", "0")
	activeStr := c.FormValue("active", "true")

	if name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "İsim zorunludur"})
	}

	sortOrder := 0
	fmt.Sscanf(sortOrderStr, "%d", &sortOrder)
	active := activeStr == "true"

	uploadDir := filepath.Join("..", "public", "uploads")
	os.MkdirAll(uploadDir, os.ModePerm)

	var imageURL string
	if file, err := c.FormFile("image_file"); err == nil {
		filename := fmt.Sprintf("sc_%d_%s", time.Now().UnixNano(), file.Filename)
		if err := services.OptimizeAndSaveImage(file, filepath.Join(uploadDir, filename)); err == nil {
			imageURL = "/uploads/" + filename
		}
	} else {
		imageURL = c.FormValue("image_url")
	}

	if imageURL == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Görsel zorunludur"})
	}

	var newID int
	query := `
		INSERT INTO sales_channels (name, url, image_url, sort_order, active)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id
	`
	err := config.DB.QueryRow(context.Background(), query, name, url, imageURL, sortOrder, active).Scan(&newID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create sales channel"})
	}

	return c.JSON(fiber.Map{"message": "Başarıyla eklendi", "id": newID})
}

// UpdateSalesChannel mevcut bir satış kanalını günceller
func UpdateSalesChannel(c *fiber.Ctx) error {
	id := c.Params("id")
	name := c.FormValue("name")
	url := c.FormValue("url")
	sortOrderStr := c.FormValue("sort_order", "0")
	activeStr := c.FormValue("active", "true")

	if name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "İsim zorunludur"})
	}

	sortOrder := 0
	fmt.Sscanf(sortOrderStr, "%d", &sortOrder)
	active := activeStr == "true"

	uploadDir := filepath.Join("..", "public", "uploads")
	os.MkdirAll(uploadDir, os.ModePerm)

	imageURL := c.FormValue("image_url")
	if file, err := c.FormFile("image_file"); err == nil {
		filename := fmt.Sprintf("sc_%d_%s", time.Now().UnixNano(), file.Filename)
		if err := services.OptimizeAndSaveImage(file, filepath.Join(uploadDir, filename)); err == nil {
			imageURL = "/uploads/" + filename
		}
	}

	if imageURL == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Görsel zorunludur"})
	}

	query := `
		UPDATE sales_channels
		SET name = $1, url = $2, image_url = $3, sort_order = $4, active = $5
		WHERE id = $6
	`
	_, err := config.DB.Exec(context.Background(), query, name, url, imageURL, sortOrder, active, id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update sales channel"})
	}

	return c.JSON(fiber.Map{"message": "Başarıyla güncellendi"})
}

// DeleteSalesChannel bir satış kanalını siler
func DeleteSalesChannel(c *fiber.Ctx) error {
	id := c.Params("id")

	query := "DELETE FROM sales_channels WHERE id = $1"
	_, err := config.DB.Exec(context.Background(), query, id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete sales channel"})
	}

	return c.JSON(fiber.Map{"message": "Başarıyla silindi"})
}
