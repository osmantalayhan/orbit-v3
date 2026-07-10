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

	// Yükleme dizini kontrolü (Next.js public diziniyle aynı olmalı)
	uploadDir := filepath.Join("..", "public", "uploads")
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	// Dosya ismini dizin atlatma (path traversal) saldırılarına karşı temizle
	cleanFilename := filepath.Base(file.Filename)
	filename := fmt.Sprintf("blog_editor_%d_%s", time.Now().UnixNano(), cleanFilename)
	savePath := filepath.Join(uploadDir, filename)

	if err := services.OptimizeAndSaveImage(file, savePath, false, false); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Dosya kaydedilemedi: " + err.Error(),
		})
	}

	// URL formatında döndür (Frontend'in public dizininden okuyacağı relative URL)
	fileURL := "/uploads/" + filename

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

	// Yükleme dizini kontrolü (Next.js public dizini)
	uploadDir := filepath.Join("..", "public", "uploads")
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, 0755)
	}

	cleanFilename := filepath.Base(file.Filename)
	filename := fmt.Sprintf("doc_%d_%s", time.Now().UnixNano(), cleanFilename)
	savePath := filepath.Join(uploadDir, filename)

	if err := c.SaveFile(file, savePath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Dosya kaydedilemedi: " + err.Error(),
		})
	}

	fileURL := "/uploads/" + filename

	return c.JSON(fiber.Map{
		"message": "Belge başarıyla yüklendi",
		"url":     fileURL,
	})
}
