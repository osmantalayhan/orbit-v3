package handlers

import (
	"context"
	"encoding/json"
	"orbit-backend/config"
	"orbit-backend/models"
	"time"

	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// GetJWTSecret JWT için gizli anahtarı .env dosyasından alır
func GetJWTSecret() []byte {
	return []byte(os.Getenv("JWT_SECRET"))
}

// AdminLogin admin paneli giriş işlemi
func AdminLogin(c *fiber.Ctx) error {
	var req models.LoginRequest
	if err := json.Unmarshal(c.Body(), &req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz istek"})
	}

	// Veritabanından kullanıcıyı bul
	var user models.User
	query := `SELECT id, email, password_hash, role FROM users WHERE email = $1`
	err := config.DB.QueryRow(context.Background(), query, req.Email).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.Role)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "E-posta veya şifre hatalı"})
	}

	// Şifreyi doğrula
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "E-posta veya şifre hatalı"})
	}

	// Admin yetkisi kontrolü
	if user.Role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Bu alana giriş yetkiniz yok"})
	}

	// JWT Token oluştur
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // 24 saat geçerli
	})

	tokenString, err := token.SignedString(GetJWTSecret())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Token oluşturulamadı"})
	}

	// Son giriş tarihini güncelle
	updateQuery := `UPDATE users SET last_login = NOW() WHERE id = $1`
	config.DB.Exec(context.Background(), updateQuery, user.ID)

	return c.JSON(fiber.Map{
		"message": "Giriş başarılı",
		"token":   tokenString,
		"user": fiber.Map{
			"id":    user.ID,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}
