package handlers

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"orbit-backend/config"

	"github.com/gofiber/fiber/v2"
)

// CreateApplication Kariyer sayfasından gelen genel başvuruyu kaydeder (Dosya yükleme destekli)
func CreateApplication(c *fiber.Ctx) error {
	// Gelen form verilerini (metin alanları) alalım
	name := c.FormValue("name")
	profession := c.FormValue("profession")
	employmentType := c.FormValue("employmentType")
	linkedinURL := c.FormValue("linkedinUrl")

	if name == "" || profession == "" || employmentType == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "İsim, Meslek ve Çalışma Şekli alanları zorunludur.",
		})
	}

	// CV dosyasını alalım
	file, err := c.FormFile("cv_file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Lütfen geçerli bir CV dosyası yükleyin.",
		})
	}

	// Dosya boyutu kontrolü (Örn: Max 10MB)
	if file.Size > 10*1024*1024 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Dosya boyutu 10MB'ı aşamaz.",
		})
	}

	// Klasör yoksa oluştur (uploads/cv)
	uploadDir := "./uploads/cv"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Sunucu hatası: Yükleme klasörü oluşturulamadı.",
		})
	}

	// Dosyaya benzersiz bir isim verelim (Zaman damgası + Orijinal isim)
	fileName := fmt.Sprintf("%d_%s", time.Now().Unix(), file.Filename)
	savePath := filepath.Join(uploadDir, fileName)

	// Dosyayı sunucuya kaydedelim
	if err := c.SaveFile(file, savePath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "CV dosyası sunucuya kaydedilemedi.",
		})
	}

	// Dosya yolunu oluştur (Veritabanına kaydedilecek olan kısım)
	dbFilePath := fmt.Sprintf("/uploads/cv/%s", fileName)

	// Veritabanına kaydet (pgxpool)
	query := `
		INSERT INTO job_applications (name, profession, employment_type, linkedin_url, cv_file_path, status, created_at)
		VALUES ($1, $2, $3, $4, $5, 'new', NOW())
		RETURNING id, created_at
	`

	var applicationID int
	var createdAt time.Time

	err = config.DB.QueryRow(context.Background(), query,
		name, profession, employmentType, linkedinURL, dbFilePath,
	).Scan(&applicationID, &createdAt)

	if err != nil {
		// Eğer VT hatası alırsak, kaydedilmiş dosyayı silmek iyi bir pratiktir.
		_ = os.Remove(savePath)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Başvuru veritabanına kaydedilemedi.",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message":    "Başvurunuz başarıyla alındı.",
		"id":         applicationID,
		"created_at": createdAt,
	})
}
