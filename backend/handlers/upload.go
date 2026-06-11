package handlers

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
)

// UploadImage genel amaçlı resim yükleme servisi (Örn: Logo, Favicon)
func UploadImage(c *fiber.Ctx) error {
	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Resim dosyası bulunamadı",
		})
	}

	// Sadece resim dosyalarına izin ver
	ext := strings.ToLower(filepath.Ext(file.Filename))
	if ext != ".png" && ext != ".jpg" && ext != ".jpeg" && ext != ".svg" && ext != ".gif" && ext != ".ico" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Sadece PNG, JPG, SVG, GIF veya ICO formatında resim yüklenebilir",
		})
	}

	// Yükleme dizini kontrolü
	uploadDir := "./uploads/images"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, 0755)
	}

	// Dosya ismini dizin atlatma (path traversal) saldırılarına karşı temizle
	cleanFilename := filepath.Base(file.Filename)
	filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), cleanFilename)
	savePath := filepath.Join(uploadDir, filename)

	if err := c.SaveFile(file, savePath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Dosya kaydedilemedi: " + err.Error(),
		})
	}

	baseURL := os.Getenv("API_URL")
	if baseURL == "" {
		baseURL = "http://127.0.0.1:8080"
	}

	// URL formatında döndür (Frontend'in kullanacağı tam veya relative URL)
	fileURL := fmt.Sprintf("%s/uploads/images/%s", baseURL, filename)

	return c.JSON(fiber.Map{
		"message": "Dosya başarıyla yüklendi",
		"url":     fileURL,
	})
}
