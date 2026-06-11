package middleware

import (
	"context"
	"fmt"
	"orbit-backend/config"
	"orbit-backend/handlers"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// Protected, istekteki JWT'yi doğrular ve kullanıcının DB'de var olup olmadığını kontrol eder.
func Protected() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// 1. Authorization header'ını al
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Yetkilendirme başlığı eksik",
			})
		}

		// 2. "Bearer <token>" formatını kontrol et
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Geçersiz yetkilendirme formatı",
			})
		}
		tokenString := parts[1]

		// 3. Token'ı parse et ve doğrula
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("beklenmeyen imzalama yöntemi: %v", token.Header["alg"])
			}
			return handlers.GetJWTSecret(), nil
		})

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Geçersiz veya süresi dolmuş token",
			})
		}

		// 4. Claims (Veriler) içerisinden user_id'yi al
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Geçersiz token verisi",
			})
		}

		userIDFloat, ok := claims["user_id"].(float64)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Kullanıcı ID'si okunamadı",
			})
		}
		userID := int(userIDFloat)

		// 5. DB'de kullanıcının HALA var olup olmadığını (silinip silinmediğini) kontrol et
		var exists bool
		err = config.DB.QueryRow(context.Background(), "SELECT EXISTS(SELECT 1 FROM users WHERE id=$1)", userID).Scan(&exists)
		if err != nil || !exists {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Bu kullanıcı silinmiş veya bulunamıyor",
			})
		}

		// 6. Doğrulama başarılı! User ID'yi context'e (locals) kaydet ki handler'lar kullanabilsin.
		c.Locals("user_id", userID)

		return c.Next()
	}
}
