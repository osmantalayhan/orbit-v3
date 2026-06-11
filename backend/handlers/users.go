package handlers

import (
	"context"
	"fmt"
	"regexp"
	"orbit-backend/config"
	"orbit-backend/models"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

// isValidPassword şifrenin en az 8 karakter, 1 büyük harf ve 1 rakam içerdiğini doğrular
func isValidPassword(password string) bool {
	if len(password) < 8 {
		return false
	}
	hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
	hasDigit := regexp.MustCompile(`[0-9]`).MatchString(password)
	return hasUpper && hasDigit
}

// GetUsers tüm admin yöneticilerini getirir (Şifre hariç)
func GetUsers(c *fiber.Ctx) error {
	// İsteğe bağlı sayfalama parametreleri (Varsayılan 1000 limit, OOM koruması)
	limit := c.QueryInt("limit", 1000)
	page := c.QueryInt("page", 1)
	offset := (page - 1) * limit

	query := `
		SELECT id, email, role, COALESCE(last_login, '1999-01-01'::timestamp), created_at 
		FROM users 
		WHERE role = 'admin' 
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`
	rows, err := config.DB.Query(context.Background(), query, limit, offset)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Yöneticiler getirilemedi"})
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var u models.User
		if err := rows.Scan(&u.ID, &u.Email, &u.Role, &u.LastLogin, &u.CreatedAt); err != nil {
			continue
		}
		users = append(users, u)
	}

	return c.JSON(users)
}

// CreateUser yeni bir admin yöneticisi ekler
func CreateUser(c *fiber.Ctx) error {
	var req models.LoginRequest // Email ve Password alıyoruz
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Geçersiz veri"})
	}

	if req.Email == "" || req.Password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "E-posta ve şifre zorunludur"})
	}

	if !isValidPassword(req.Password) {
		return c.Status(400).JSON(fiber.Map{"error": "Şifre en az 8 karakter uzunluğunda olmalı, en az 1 büyük harf ve 1 rakam içermelidir"})
	}

	// Şifreyi hashle
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), 10)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Şifre şifrelenemedi"})
	}

	// Aynı email var mı kontrol et
	var exists bool
	config.DB.QueryRow(context.Background(), "SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)", req.Email).Scan(&exists)
	if exists {
		return c.Status(400).JSON(fiber.Map{"error": "Bu e-posta adresi zaten kullanılıyor"})
	}

	insertQuery := `INSERT INTO users (email, password_hash, role, created_at) VALUES ($1, $2, 'admin', NOW()) RETURNING id`
	var newID int
	err = config.DB.QueryRow(context.Background(), insertQuery, req.Email, string(hashedPassword)).Scan(&newID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Kullanıcı oluşturulamadı"})
	}

	return c.JSON(fiber.Map{"message": "Kullanıcı başarıyla oluşturuldu", "id": newID})
}

// UpdateUserPassword bir adminin şifresini değiştirir
func UpdateUserPassword(c *fiber.Ctx) error {
	id := c.Params("id")
	var req struct {
		Password string `json:"password"`
	}
	if err := c.BodyParser(&req); err != nil || req.Password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Yeni şifre gereklidir"})
	}

	if !isValidPassword(req.Password) {
		return c.Status(400).JSON(fiber.Map{"error": "Şifre en az 8 karakter uzunluğunda olmalı, en az 1 büyük harf ve 1 rakam içermelidir"})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), 10)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Şifre şifrelenemedi"})
	}

	updateQuery := `UPDATE users SET password_hash = $1 WHERE id = $2`
	_, err = config.DB.Exec(context.Background(), updateQuery, string(hashedPassword), id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Şifre güncellenemedi"})
	}

	return c.JSON(fiber.Map{"message": "Şifre başarıyla güncellendi"})
}

// DeleteUser bir admin hesabını siler
func DeleteUser(c *fiber.Ctx) error {
	id := c.Params("id")
	
	// Middleware'den gelen giriş yapmış kullanıcının ID'si
	currentUserID := c.Locals("user_id").(int)
	
	// Kendini silmeye çalışıyorsa direkt engelle
	if fmt.Sprintf("%d", currentUserID) == id {
		return c.Status(400).JSON(fiber.Map{"error": "Giriş yaptığınız kendi hesabınızı silemezsiniz!"})
	}

	// Son kalan adminin silinmesini engelle
	var count int
	config.DB.QueryRow(context.Background(), "SELECT COUNT(*) FROM users WHERE role = 'admin'").Scan(&count)
	if count <= 1 {
		return c.Status(400).JSON(fiber.Map{"error": "Sistemde en az 1 yönetici kalmalıdır. Bu hesap silinemez."})
	}

	deleteQuery := `DELETE FROM users WHERE id = $1`
	_, err := config.DB.Exec(context.Background(), deleteQuery, id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Kullanıcı silinemedi"})
	}

	return c.JSON(fiber.Map{"message": "Kullanıcı başarıyla silindi"})
}
