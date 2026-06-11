package handlers

import (
	"context"
	"fmt"
	"html"
	"os"
	"path/filepath"
	"strings"
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

	// XSS koruması için HTML etiketlerini temizle
	name = html.EscapeString(name)
	profession = html.EscapeString(profession)
	employmentType = html.EscapeString(employmentType)
	linkedinURL = html.EscapeString(linkedinURL)

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

	// Dosya türü kontrolü (Sadece PDF, DOC, DOCX)
	ext := strings.ToLower(filepath.Ext(file.Filename))
	if ext != ".pdf" && ext != ".doc" && ext != ".docx" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Sadece PDF, DOC veya DOCX formatında CV yükleyebilirsiniz.",
		})
	}

	// Klasör yoksa oluştur (uploads/cv)
	uploadDir := "./uploads/cv"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Sunucu hatası: Yükleme klasörü oluşturulamadı.",
		})
	}

	// Dosyaya benzersiz bir isim verelim (Zaman damgası + Temizlenmiş Orijinal isim)
	cleanFilename := filepath.Base(file.Filename)
	fileName := fmt.Sprintf("%d_%s", time.Now().Unix(), cleanFilename)
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

// GetAdminApplications admin paneli için tüm başvuruları getirir
func GetAdminApplications(c *fiber.Ctx) error {
	query := `SELECT id, name, profession, employment_type, linkedin_url, cv_file_path, status, created_at FROM job_applications ORDER BY created_at DESC`
	
	rows, err := config.DB.Query(c.Context(), query)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Başvurular getirilirken hata oluştu"})
	}
	defer rows.Close()

	var applications []map[string]interface{}
	for rows.Next() {
		var app map[string]interface{} = make(map[string]interface{})
		var id int
		var name, profession, employmentType, linkedinURL, cvFilePath, status string
		var createdAt time.Time

		if err := rows.Scan(
			&id, &name, &profession, &employmentType, &linkedinURL, &cvFilePath, &status, &createdAt,
		); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Veri okunurken hata oluştu"})
		}

		app["id"] = id
		app["name"] = name
		app["profession"] = profession
		app["employment_type"] = employmentType
		app["linkedin_url"] = linkedinURL
		app["cv_file_path"] = cvFilePath
		app["status"] = status
		app["created_at"] = createdAt

		applications = append(applications, app)
	}

	if applications == nil {
		applications = []map[string]interface{}{}
	}

	return c.JSON(applications)
}

// DeleteApplication silme işlemi yapar ve yüklü CV dosyasını fiziksel olarak siler
func DeleteApplication(c *fiber.Ctx) error {
	id := c.Params("id")

	// Önce dosya yolunu alalım ki silebilelim
	var cvFilePath string
	err := config.DB.QueryRow(c.Context(), "SELECT cv_file_path FROM job_applications WHERE id = $1", id).Scan(&cvFilePath)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Başvuru bulunamadı"})
	}

	// Veritabanından sil
	commandTag, err := config.DB.Exec(c.Context(), "DELETE FROM job_applications WHERE id = $1", id)
	if err != nil || commandTag.RowsAffected() == 0 {
		return c.Status(500).JSON(fiber.Map{"error": "Başvuru silinemedi"})
	}

	// Fiziksel dosyayı sil
	if cvFilePath != "" {
		// "/uploads/cv/dosya.pdf" -> "./uploads/cv/dosya.pdf"
		physicalPath := "." + cvFilePath
		_ = os.Remove(physicalPath) // Hata fırlatsa bile takılma (dosya zaten silinmiş olabilir)
	}

	return c.JSON(fiber.Map{"message": "Başvuru başarıyla silindi"})
}

// GetUnreadApplicationsCount menüdeki badge için yeni başvuruların sayısını döndürür
func GetUnreadApplicationsCount(c *fiber.Ctx) error {
	var count int
	query := `SELECT COUNT(*) FROM job_applications WHERE status = 'new'`
	err := config.DB.QueryRow(c.Context(), query).Scan(&count)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Okunmamış başvuru sayısı alınamadı"})
	}

	return c.JSON(fiber.Map{"count": count})
}

// MarkApplicationsAsRead tüm 'new' durumundaki başvuruları 'read' yapar
func MarkApplicationsAsRead(c *fiber.Ctx) error {
	query := `UPDATE job_applications SET status = 'read' WHERE status = 'new'`
	_, err := config.DB.Exec(c.Context(), query)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Başvurular okundu olarak işaretlenemedi"})
	}

	return c.JSON(fiber.Map{"message": "Tüm yeni başvurular okundu olarak işaretlendi"})
}
