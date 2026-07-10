package handlers

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"orbit-backend/config"
	"orbit-backend/models"
	"orbit-backend/services"

	"github.com/gofiber/fiber/v2"
)

// GetAuthors tüm yazarları listeler
func GetAuthors(c *fiber.Ctx) error {
	query := `SELECT id, name, role, avatar_url, created_at FROM authors ORDER BY name ASC`
	rows, err := config.DB.Query(c.Context(), query)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Yazarlar getirilirken hata oluştu"})
	}
	defer rows.Close()

	var authors []models.Author
	for rows.Next() {
		var author models.Author
		if err := rows.Scan(&author.ID, &author.Name, &author.Role, &author.AvatarURL, &author.CreatedAt); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Veri okunurken hata oluştu"})
		}
		authors = append(authors, author)
	}

	if authors == nil {
		authors = []models.Author{}
	}

	return c.JSON(authors)
}

// CreateAuthor yeni yazar ekler
func CreateAuthor(c *fiber.Ctx) error {
	name := c.FormValue("name")
	role := c.FormValue("role")

	if name == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Yazar adı zorunludur"})
	}

	uploadDir := filepath.Join("..", "public", "uploads")
	os.MkdirAll(uploadDir, os.ModePerm)

	avatarUrl := ""
	if file, err := c.FormFile("avatar"); err == nil {
		filename := fmt.Sprintf("author_avatar_%d_%s", time.Now().UnixNano(), file.Filename)
		if err := services.OptimizeAndSaveImage(file, filepath.Join(uploadDir, filename), true, false); err == nil {
			avatarUrl = "/uploads/" + filename
		}
	} else {
		avatarUrl = c.FormValue("existing_avatar")
	}

	query := `INSERT INTO authors (name, role, avatar_url) VALUES ($1, $2, $3)`
	_, err := config.DB.Exec(c.Context(), query, name, role, avatarUrl)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Yazar oluşturulurken hata oluştu", "details": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{"message": "Yazar başarıyla eklendi"})
}

// UpdateAuthor yazarı günceller
func UpdateAuthor(c *fiber.Ctx) error {
	id := c.Params("id")
	name := c.FormValue("name")
	role := c.FormValue("role")

	if name == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Yazar adı zorunludur"})
	}

	uploadDir := filepath.Join("..", "public", "uploads")
	os.MkdirAll(uploadDir, os.ModePerm)

	avatarUrl := ""
	if file, err := c.FormFile("avatar"); err == nil {
		filename := fmt.Sprintf("author_avatar_%d_%s", time.Now().UnixNano(), file.Filename)
		if err := services.OptimizeAndSaveImage(file, filepath.Join(uploadDir, filename), true, false); err == nil {
			avatarUrl = "/uploads/" + filename
		}
	} else {
		avatarUrl = c.FormValue("existing_avatar")
	}

	query := `UPDATE authors SET name = $1, role = $2, avatar_url = $3 WHERE id = $4`
	_, err := config.DB.Exec(c.Context(), query, name, role, avatarUrl, id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Yazar güncellenirken hata oluştu", "details": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Yazar başarıyla güncellendi"})
}

// DeleteAuthor yazarı siler
func DeleteAuthor(c *fiber.Ctx) error {
	id := c.Params("id")
	
	// Check if author is used in any blog posts
	var count int
	checkQuery := `SELECT COUNT(*) FROM blog_posts WHERE author_id = $1`
	if err := config.DB.QueryRow(c.Context(), checkQuery, id).Scan(&count); err == nil && count > 0 {
		return c.Status(400).JSON(fiber.Map{"error": "Bu yazar blog yazılarında kullanıldığı için silinemez"})
	}

	query := `DELETE FROM authors WHERE id = $1`
	_, err := config.DB.Exec(c.Context(), query, id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Yazar silinirken hata oluştu"})
	}
	
	return c.JSON(fiber.Map{"message": "Yazar başarıyla silindi"})
}
