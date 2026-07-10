package handlers

import (
	"fmt"
	"os"
	"path/filepath"
	"time"
	"regexp"
	"strings"
	"unicode"

	"golang.org/x/text/transform"
	"golang.org/x/text/unicode/norm"

	"orbit-backend/config"
	"orbit-backend/models"
	"orbit-backend/services"

	"github.com/gofiber/fiber/v2"
)

func generateSlug(title string) string {
	s := strings.ToLower(title)
	s = strings.ReplaceAll(s, "ı", "i")
	s = strings.ReplaceAll(s, "ğ", "g")
	s = strings.ReplaceAll(s, "ü", "u")
	s = strings.ReplaceAll(s, "ş", "s")
	s = strings.ReplaceAll(s, "ö", "o")
	s = strings.ReplaceAll(s, "ç", "c")
	
	t := transform.Chain(norm.NFD, transform.RemoveFunc(func(r rune) bool {
		return unicode.Is(unicode.Mn, r)
	}), norm.NFC)
	s, _, _ = transform.String(t, s)
	
	reg := regexp.MustCompile("[^a-z0-9]+")
	s = reg.ReplaceAllString(s, "-")
	s = strings.Trim(s, "-")
	
	if s == "" {
		s = "blog-post"
	}
	return s
}

// GetBlogPosts tüm aktif blog yazılarını listelemek için (Web tarafı için)
func GetBlogPosts(c *fiber.Ctx) error {
	query := `SELECT b.id, b.slug, b.title, b.category, b.date_published, b.read_time, b.cover_image, b.lead_paragraph, b.body_content, b.author_id, COALESCE(a.name, ''), COALESCE(a.role, ''), COALESCE(a.avatar_url, ''), b.active, b.created_at FROM blog_posts b LEFT JOIN authors a ON b.author_id = a.id WHERE b.active = true ORDER BY b.created_at DESC`
	
	rows, err := config.DB.Query(c.Context(), query)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Blog yazıları getirilirken hata oluştu"})
	}
	defer rows.Close()

	var blogs []models.BlogPost
	for rows.Next() {
		var blog models.BlogPost
		if err := rows.Scan(
			&blog.ID, &blog.Slug, &blog.Title, &blog.Category, &blog.DatePublished,
			&blog.ReadTime, &blog.CoverImage, &blog.LeadParagraph,
			&blog.BodyContent, &blog.AuthorID, &blog.AuthorName, &blog.AuthorRole,
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

// GetBlogPostBySlug tek bir blog yazısı detayı için
func GetBlogPostBySlug(c *fiber.Ctx) error {
	slug := c.Params("id") // Parametre adı router'da "id" olarak kalsa bile biz slug olarak okuyoruz
	query := `SELECT b.id, b.slug, b.title, b.category, b.date_published, b.read_time, b.cover_image, b.lead_paragraph, b.body_content, b.author_id, COALESCE(a.name, ''), COALESCE(a.role, ''), COALESCE(a.avatar_url, ''), b.active, b.created_at FROM blog_posts b LEFT JOIN authors a ON b.author_id = a.id WHERE b.slug = $1 AND b.active = true LIMIT 1`
	
	var blog models.BlogPost
	err := config.DB.QueryRow(c.Context(), query, slug).Scan(
		&blog.ID, &blog.Slug, &blog.Title, &blog.Category, &blog.DatePublished,
		&blog.ReadTime, &blog.CoverImage, &blog.LeadParagraph,
		&blog.BodyContent, &blog.AuthorID, &blog.AuthorName, &blog.AuthorRole,
		&blog.AuthorAvatar, &blog.Active, &blog.CreatedAt,
	)
	
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Blog yazısı bulunamadı"})
	}
	
	return c.JSON(blog)
}

// GetAdminBlogPosts tüm blog yazılarını (aktif/pasif) listelemek için (Admin paneli için)
func GetAdminBlogPosts(c *fiber.Ctx) error {
	query := `SELECT b.id, b.slug, b.title, b.category, b.date_published, b.read_time, b.cover_image, b.lead_paragraph, b.body_content, b.author_id, COALESCE(a.name, ''), COALESCE(a.role, ''), COALESCE(a.avatar_url, ''), b.active, b.created_at FROM blog_posts b LEFT JOIN authors a ON b.author_id = a.id ORDER BY b.created_at DESC`
	
	rows, err := config.DB.Query(c.Context(), query)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Blog yazıları getirilirken hata oluştu"})
	}
	defer rows.Close()

	var blogs []models.BlogPost
	for rows.Next() {
		var blog models.BlogPost
		if err := rows.Scan(
			&blog.ID, &blog.Slug, &blog.Title, &blog.Category, &blog.DatePublished,
			&blog.ReadTime, &blog.CoverImage, &blog.LeadParagraph,
			&blog.BodyContent, &blog.AuthorID, &blog.AuthorName, &blog.AuthorRole,
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
	authorIdStr := c.FormValue("author_id")
	var authorId interface{}
	if authorIdStr != "" && authorIdStr != "null" {
		authorId = authorIdStr
	} else {
		authorId = nil
	}

	bodyContentRaw := c.FormValue("body_content")

	if bodyContentRaw == "" {
		bodyContentRaw = "[]"
	}

	uploadDir := filepath.Join("..", "public", "uploads")
	os.MkdirAll(uploadDir, os.ModePerm)

	coverImageUrl := ""
	if file, err := c.FormFile("cover_image"); err == nil {
		filename := fmt.Sprintf("blog_cover_%d_%s", time.Now().UnixNano(), file.Filename)
		if err := services.OptimizeAndSaveImage(file, filepath.Join(uploadDir, filename), true, false); err == nil {
			coverImageUrl = "/uploads/" + filename
		}
	} else {
		coverImageUrl = c.FormValue("existing_cover_image")
	}

	activeStr := c.FormValue("active")
	isActive := true
	if activeStr == "false" {
		isActive = false
	}

	baseSlug := generateSlug(title)
	slug := baseSlug
	var count int
	// Benzersiz slug oluştur
	for i := 1; ; i++ {
		err := config.DB.QueryRow(c.Context(), "SELECT count(*) FROM blog_posts WHERE slug = $1", slug).Scan(&count)
		if err == nil && count == 0 {
			break
		}
		slug = fmt.Sprintf("%s-%d", baseSlug, i)
	}

	query := `INSERT INTO blog_posts 
		(slug, title, category, date_published, read_time, cover_image, lead_paragraph, body_content, author_id, active)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`

	_, err := config.DB.Exec(c.Context(), query,
		slug, title, category, datePublished, readTime, coverImageUrl,
		leadParagraph, bodyContentRaw, authorId, isActive)

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
	authorIdStr := c.FormValue("author_id")
	var authorId interface{}
	if authorIdStr != "" && authorIdStr != "null" {
		authorId = authorIdStr
	} else {
		authorId = nil
	}
	bodyContentRaw := c.FormValue("body_content")

	if bodyContentRaw == "" {
		bodyContentRaw = "[]"
	}

	uploadDir := filepath.Join("..", "public", "uploads")
	os.MkdirAll(uploadDir, os.ModePerm)

	coverImageUrl := ""
	if file, err := c.FormFile("cover_image"); err == nil {
		filename := fmt.Sprintf("blog_cover_%d_%s", time.Now().UnixNano(), file.Filename)
		if err := services.OptimizeAndSaveImage(file, filepath.Join(uploadDir, filename), true, false); err == nil {
			coverImageUrl = "/uploads/" + filename
		}
	} else {
		coverImageUrl = c.FormValue("existing_cover_image")
	}

	activeStr := c.FormValue("active")
	isActive := true
	if activeStr == "false" {
		isActive = false
	}

	baseSlug := generateSlug(title)
	slug := baseSlug
	var count int
	// Benzersiz slug oluştur (kendi ID'si hariç)
	for i := 1; ; i++ {
		err := config.DB.QueryRow(c.Context(), "SELECT count(*) FROM blog_posts WHERE slug = $1 AND id != $2", slug, id).Scan(&count)
		if err == nil && count == 0 {
			break
		}
		slug = fmt.Sprintf("%s-%d", baseSlug, i)
	}

	query := `UPDATE blog_posts SET 
		slug = $1, title = $2, category = $3, date_published = $4, read_time = $5, cover_image = $6, 
		lead_paragraph = $7, body_content = $8, author_id = $9, active = $10 
		WHERE id = $11`

	_, err := config.DB.Exec(c.Context(), query,
		slug, title, category, datePublished, readTime, coverImageUrl,
		leadParagraph, bodyContentRaw, authorId, isActive, id)

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
