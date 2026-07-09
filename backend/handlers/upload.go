package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"orbit-backend/services"

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

	// Güvenlik: Magic Bytes (İçerik) Kontrolü
	f, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Dosya okunamadı",
		})
	}
	buffer := make([]byte, 512)
	f.Read(buffer)
	f.Close()

	contentType := http.DetectContentType(buffer)
	if !strings.HasPrefix(contentType, "image/") && ext != ".svg" && contentType != "text/xml; charset=utf-8" && contentType != "text/plain; charset=utf-8" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Zararlı dosya girişimi tespit edildi: Dosya içeriği resim değil",
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

	if err := services.OptimizeAndSaveImage(file, savePath); err != nil {
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

// UploadDocument genel amaçlı belge yükleme servisi (Örn: PDF Katalog)
func UploadDocument(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Belge dosyası bulunamadı",
		})
	}

	// Sadece PDF vb. dosyalara izin ver
	ext := strings.ToLower(filepath.Ext(file.Filename))
	if ext != ".pdf" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Sadece PDF formatında belge yüklenebilir",
		})
	}

	// Güvenlik: Magic Bytes (İçerik) Kontrolü
	f, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Dosya okunamadı",
		})
	}
	buffer := make([]byte, 512)
	f.Read(buffer)
	f.Close()

	contentType := http.DetectContentType(buffer)
	if contentType != "application/pdf" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Zararlı dosya girişimi tespit edildi: Dosya içeriği geçerli bir PDF değil",
		})
	}

	uploadDir := "./uploads/docs"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, 0755)
	}

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

	fileURL := fmt.Sprintf("%s/uploads/docs/%s", baseURL, filename)

	return c.JSON(fiber.Map{
		"message": "Belge başarıyla yüklendi",
		"url":     fileURL,
	})
}
