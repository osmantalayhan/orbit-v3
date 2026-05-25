package handlers

import (
	"github.com/gofiber/fiber/v2"
)

// Login kullanıcı girişi ve JWT token üretimi için boş işleyici (stub)
func Login(c *fiber.Ctx) error {
	// TODO: Auth aşamasında kodlanacak
	return c.JSON(fiber.Map{"message": "Login endpoint placeholder"})
}

// Register yeni admin/kullanıcı kaydı için boş işleyici (stub)
func Register(c *fiber.Ctx) error {
	// TODO: Auth aşamasında kodlanacak
	return c.JSON(fiber.Map{"message": "Register endpoint placeholder"})
}
