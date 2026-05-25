package handlers

import (
	"orbit-backend/config"
	"orbit-backend/models"

	"github.com/gofiber/fiber/v2"
)

// GetBlogPosts tüm aktif blog yazılarını listelemek için
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
