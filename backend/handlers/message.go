package handlers

import (
	"context"
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
	query := `
		SELECT id, name, email, subject, message, status, created_at
		FROM contact_messages
		ORDER BY created_at DESC
	`

	rows, err := config.DB.Query(context.Background(), query)
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
