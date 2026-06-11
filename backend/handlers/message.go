package handlers

import (
	"context"
	"html"
	"orbit-backend/config"
	"orbit-backend/models"

	"github.com/gofiber/fiber/v2"
)

// CreateMessage iletişim formundan gelen yeni bir mesajı veri tabanına kaydeder
func CreateMessage(c *fiber.Ctx) error {
	msg := new(models.ContactMessage)
	if err := c.BodyParser(msg); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse request body",
		})
	}

	// API düzeyinde zorunlu alan doğrulaması
	if msg.Name == "" || msg.Email == "" || msg.Subject == "" || msg.Message == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "All fields (name, email, subject, message) are required",
		})
	}

	// Veritabanı sınırları için karakter uzunluğu kontrolü
	if len(msg.Name) > 100 || len(msg.Email) > 150 || len(msg.Subject) > 100 || len(msg.Message) > 2000 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Field length exceeds maximum allowed characters",
		})
	}

	// HTML etiketlerini temizle (XSS Koruması)
	msg.Name = html.EscapeString(msg.Name)
	msg.Email = html.EscapeString(msg.Email)
	msg.Subject = html.EscapeString(msg.Subject)
	msg.Message = html.EscapeString(msg.Message)

	query := `
		INSERT INTO contact_messages (name, email, subject, message, status, created_at)
		VALUES ($1, $2, $3, $4, 'unread', NOW())
		RETURNING id, created_at
	`

	err := config.DB.QueryRow(context.Background(), query,
		msg.Name, msg.Email, msg.Subject, msg.Message,
	).Scan(&msg.ID, &msg.CreatedAt)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to save message to database",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message":    "Message submitted successfully",
		"id":         msg.ID,
		"created_at": msg.CreatedAt,
	})
}

// GetMessages admin paneli için tüm iletişim mesajlarını yeniden eskiye doğru listeler
func GetMessages(c *fiber.Ctx) error {
	// İsteğe bağlı sayfalama parametreleri (Varsayılan 1000 limit, OOM koruması)
	limit := c.QueryInt("limit", 1000)
	page := c.QueryInt("page", 1)
	offset := (page - 1) * limit

	query := `
		SELECT id, name, email, subject, message, status, created_at
		FROM contact_messages
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := config.DB.Query(context.Background(), query, limit, offset)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch messages",
		})
	}
	defer rows.Close()

	var messages []models.ContactMessage
	for rows.Next() {
		var m models.ContactMessage
		err := rows.Scan(&m.ID, &m.Name, &m.Email, &m.Subject, &m.Message, &m.Status, &m.CreatedAt)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Error scanning message row",
			})
		}
		messages = append(messages, m)
	}

	return c.JSON(messages)
}

// UpdateMessageStatus mesajların okundu/arşivlendi durumunu günceller (Admin için)
func UpdateMessageStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Message ID is required",
		})
	}

	var body struct {
		Status string `json:"status"`
	}
	if err := c.BodyParser(&body); err != nil || body.Status == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Valid status field is required",
		})
	}

	query := `
		UPDATE contact_messages
		SET status = $1
		WHERE id = $2
	`

	_, err := config.DB.Exec(context.Background(), query, body.Status, id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update message status",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Message status updated successfully",
	})
}

// DeleteMessage silme işlemi
func DeleteMessage(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Message ID is required",
		})
	}

	query := `DELETE FROM contact_messages WHERE id = $1`
	res, err := config.DB.Exec(context.Background(), query, id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete message",
		})
	}

	if res.RowsAffected() == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Message not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Message deleted successfully",
	})
}

// GetUnreadMessagesCount okunanmamış mesaj sayısını döndürür
func GetUnreadMessagesCount(c *fiber.Ctx) error {
	query := `SELECT COUNT(*) FROM contact_messages WHERE status = 'unread'`
	
	var count int
	err := config.DB.QueryRow(context.Background(), query).Scan(&count)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get unread messages count",
		})
	}

	return c.JSON(fiber.Map{
		"unread_count": count,
	})
}
