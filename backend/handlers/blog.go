package handlers

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"orbit-backend/config"
	"orbit-backend/models"

	"github.com/gofiber/fiber/v2"
)

// GetBlogPosts tüm aktif blog yazılarını listelemek için (Web tarafı için)
func GetBlogPosts(c *fiber.Ctx) error {
	query := `SELECT id, title, category, date_published, read_time, cover_image, lead_paragraph, body_content, author_name, author_role, author_avatar, active, created_at FROM blog_posts WHERE active = true ORDER BY created_at DESC`
	
	rows, err := config.DB.Query(c.Context(), query)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Blog yazıları getirilirken hata oluştu"})
	}
	defer rows.Close()

	var blogs []models.BlogPost
	for rows.Next() {
		var blog models.BlogPost
		if err := rows.Scan(
			&blog.ID, &blog.Title, &blog.Category, &blog.DatePublished,
			&blog.ReadTime, &blog.CoverImage, &blog.LeadParagraph,
			&blog.BodyContent, &blog.AuthorName, &blog.AuthorRole,
			&blog.AuthorAvatar, &blog.Active, &blog.CreatedAt,
		); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Veri okunurken hata oluştu"})
		}
		blogs = append(blogs, blog)
	}

	if blogs == nil {
		blogs = []models.BlogPost{}
	}

	return c.JSON(blogs)
}

// GetBlogPostByID tek bir blog yazısı detayı için
func GetBlogPostByID(c *fiber.Ctx) error {
	id := c.Params("id")
	query := `SELECT id, title, category, date_published, read_time, cover_image, lead_paragraph, body_content, author_name, author_role, author_avatar, active, created_at FROM blog_posts WHERE id = $1 AND active = true LIMIT 1`
	
	var blog models.BlogPost
	err := config.DB.QueryRow(c.Context(), query, id).Scan(
		&blog.ID, &blog.Title, &blog.Category, &blog.DatePublished,
		&blog.ReadTime, &blog.CoverImage, &blog.LeadParagraph,
		&blog.BodyContent, &blog.AuthorName, &blog.AuthorRole,
		&blog.AuthorAvatar, &blog.Active, &blog.CreatedAt,
	)
	
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Blog yazısı bulunamadı"})
	}
	
	return c.JSON(blog)
}

// GetAdminBlogPosts tüm blog yazılarını (aktif/pasif) listelemek için (Admin paneli için)
func GetAdminBlogPosts(c *fiber.Ctx) error {
	query := `SELECT id, title, category, date_published, read_time, cover_image, lead_paragraph, body_content, author_name, author_role, author_avatar, active, created_at FROM blog_posts ORDER BY created_at DESC`
	
	rows, err := config.DB.Query(c.Context(), query)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Blog yazıları getirilirken hata oluştu"})
	}
	defer rows.Close()

	var blogs []models.BlogPost
	for rows.Next() {
		var blog models.BlogPost
		if err := rows.Scan(
			&blog.ID, &blog.Title, &blog.Category, &blog.DatePublished,
			&blog.ReadTime, &blog.CoverImage, &blog.LeadParagraph,
			&blog.BodyContent, &blog.AuthorName, &blog.AuthorRole,
			&blog.AuthorAvatar, &blog.Active, &blog.CreatedAt,
		); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Veri okunurken hata oluştu"})
		}
		blogs = append(blogs, blog)
	}

	if blogs == nil {
		blogs = []models.BlogPost{}
	}

	return c.JSON(blogs)
}

// CreateBlogPost yeni bir makale ekler
func CreateBlogPost(c *fiber.Ctx) error {
	title := c.FormValue("title")
	category := c.FormValue("category")
	datePublished := c.FormValue("date_published")
	readTime := c.FormValue("read_time")
	leadParagraph := c.FormValue("lead_paragraph")
	authorName := c.FormValue("author_name")
	authorRole := c.FormValue("author_role")
	bodyContentRaw := c.FormValue("body_content")

	if bodyContentRaw == "" {
		bodyContentRaw = "[]"
	}

	uploadDir := filepath.Join("..", "public", "uploads")
	os.MkdirAll(uploadDir, os.ModePerm)

	coverImageUrl := ""
	if file, err := c.FormFile("cover_image"); err == nil {
		filename := fmt.Sprintf("blog_cover_%d_%s", time.Now().UnixNano(), file.Filename)
		if err := c.SaveFile(file, filepath.Join(uploadDir, filename)); err == nil {
			coverImageUrl = "/uploads/" + filename
		}
	} else {
		coverImageUrl = c.FormValue("existing_cover_image")
	}

	authorAvatarUrl := ""
	if file, err := c.FormFile("author_avatar"); err == nil {
		filename := fmt.Sprintf("blog_avatar_%d_%s", time.Now().UnixNano(), file.Filename)
		if err := c.SaveFile(file, filepath.Join(uploadDir, filename)); err == nil {
			authorAvatarUrl = "/uploads/" + filename
		}
	} else {
		authorAvatarUrl = c.FormValue("existing_author_avatar")
	}

	activeStr := c.FormValue("active")
	isActive := true
	if activeStr == "false" {
		isActive = false
	}

	query := `INSERT INTO blog_posts 
		(title, category, date_published, read_time, cover_image, lead_paragraph, body_content, author_name, author_role, author_avatar, active)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`

	_, err := config.DB.Exec(c.Context(), query,
		title, category, datePublished, readTime, coverImageUrl,
		leadParagraph, bodyContentRaw, authorName, authorRole, authorAvatarUrl, isActive)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Blog yazısı oluşturulurken hata oluştu", "details": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{"message": "Blog yazısı başarıyla oluşturuldu"})
}

// UpdateBlogPost mevcut bir makaleyi günceller
func UpdateBlogPost(c *fiber.Ctx) error {
	id := c.Params("id")
	title := c.FormValue("title")
	category := c.FormValue("category")
	datePublished := c.FormValue("date_published")
	readTime := c.FormValue("read_time")
	leadParagraph := c.FormValue("lead_paragraph")
	authorName := c.FormValue("author_name")
	authorRole := c.FormValue("author_role")
	bodyContentRaw := c.FormValue("body_content")

	if bodyContentRaw == "" {
		bodyContentRaw = "[]"
	}

	uploadDir := filepath.Join("..", "public", "uploads")
	os.MkdirAll(uploadDir, os.ModePerm)

	coverImageUrl := ""
	if file, err := c.FormFile("cover_image"); err == nil {
		filename := fmt.Sprintf("blog_cover_%d_%s", time.Now().UnixNano(), file.Filename)
		if err := c.SaveFile(file, filepath.Join(uploadDir, filename)); err == nil {
			coverImageUrl = "/uploads/" + filename
		}
	} else {
		coverImageUrl = c.FormValue("existing_cover_image")
	}

	authorAvatarUrl := ""
	if file, err := c.FormFile("author_avatar"); err == nil {
		filename := fmt.Sprintf("blog_avatar_%d_%s", time.Now().UnixNano(), file.Filename)
		if err := c.SaveFile(file, filepath.Join(uploadDir, filename)); err == nil {
			authorAvatarUrl = "/uploads/" + filename
		}
	} else {
		authorAvatarUrl = c.FormValue("existing_author_avatar")
	}

	activeStr := c.FormValue("active")
	isActive := true
	if activeStr == "false" {
		isActive = false
	}

	query := `UPDATE blog_posts SET 
		title = $1, category = $2, date_published = $3, read_time = $4, cover_image = $5, 
		lead_paragraph = $6, body_content = $7, author_name = $8, author_role = $9, author_avatar = $10, active = $11 
		WHERE id = $12`

	_, err := config.DB.Exec(c.Context(), query,
		title, category, datePublished, readTime, coverImageUrl,
		leadParagraph, bodyContentRaw, authorName, authorRole, authorAvatarUrl, isActive, id)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Blog yazısı güncellenirken hata oluştu", "details": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Blog yazısı başarıyla güncellendi"})
}

// DeleteBlogPost mevcut bir makaleyi siler
func DeleteBlogPost(c *fiber.Ctx) error {
	id := c.Params("id")
	query := `DELETE FROM blog_posts WHERE id = $1`
	_, err := config.DB.Exec(c.Context(), query, id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Blog silinirken hata oluştu"})
	}
	return c.JSON(fiber.Map{"message": "Blog başarıyla silindi"})
}
