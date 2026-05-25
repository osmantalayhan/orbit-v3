package handlers

import (
	"context"
	"orbit-backend/config"
	"orbit-backend/models"

	"github.com/gofiber/fiber/v2"
)

type OfficeLocation struct {
	Name      string  `json:"name"`
	City      string  `json:"city"`
	Address   string  `json:"address"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type ExtendedSettings struct {
	models.SiteSettings
	Offices []OfficeLocation `json:"offices"`
}

// GetSettings site_settings tablosundaki tek satırlık (ID = 1) site genel ayarlarını getirir (2 Ofis mock datası eklenmiştir)
func GetSettings(c *fiber.Ctx) error {
	var s models.SiteSettings

	query := `
		SELECT id, site_title, site_description, site_keywords, logo_url, favicon_url, 
		       contact_email, contact_phone, contact_address, map_latitude, map_longitude, 
		       social_linkedin, social_youtube, social_x, social_github, updated_at
		FROM site_settings 
		WHERE id = 1
	`

	err := config.DB.QueryRow(context.Background(), query).Scan(
		&s.ID, &s.SiteTitle, &s.SiteDescription, &s.SiteKeywords, &s.LogoURL, &s.FaviconURL,
		&s.ContactEmail, &s.ContactPhone, &s.ContactAddress, &s.MapLatitude, &s.MapLongitude,
		&s.SocialLinkedin, &s.SocialYoutube, &s.SocialX, &s.SocialGithub, &s.UpdatedAt,
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch site settings",
		})
	}

	// İletişim sayfasındaki "2 Adet Harita" için ofis bilgilerini dinamik ekliyoruz
	offices := []OfficeLocation{
		{
			Name:      "Orbit İstanbul, Ofis",
			City:      "İstanbul",
			Address:   "Akşemsettin Mah. Akdeniz Cad. No:30 Kat:3 Fatih",
			Latitude:  41.019087,
			Longitude: 28.946238,
		},
		{
			Name:      "Orbit Ankara, Merkez",
			City:      "Ankara",
			Address:   "Anadolu Blv Corner 2 Plaza No:151/6 Yenimahalle",
			Latitude:  40.00089,
			Longitude: 32.77203,
		},
	}

	response := ExtendedSettings{
		SiteSettings: s,
		Offices:      offices,
	}

	return c.JSON(response)
}

// UpdateSettings site_settings tablosundaki tek satırlık (ID = 1) site genel ayarlarını günceller
func UpdateSettings(c *fiber.Ctx) error {
	s := new(models.SiteSettings)
	if err := c.BodyParser(s); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse request body",
		})
	}

	// Basit doğrulama kuralları
	if s.SiteTitle == "" || s.SiteDescription == "" || s.ContactEmail == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Site title, description, and contact email are required fields",
		})
	}

	query := `
		UPDATE site_settings
		SET site_title = $1, site_description = $2, site_keywords = $3, logo_url = $4, favicon_url = $5,
		    contact_email = $6, contact_phone = $7, contact_address = $8, map_latitude = $9, map_longitude = $10,
		    social_linkedin = $11, social_youtube = $12, social_x = $13, social_github = $14, updated_at = NOW()
		WHERE id = 1
	`

	_, err := config.DB.Exec(context.Background(), query,
		s.SiteTitle, s.SiteDescription, s.SiteKeywords, s.LogoURL, s.FaviconURL,
		s.ContactEmail, s.ContactPhone, s.ContactAddress, s.MapLatitude, s.MapLongitude,
		s.SocialLinkedin, s.SocialYoutube, s.SocialX, s.SocialGithub,
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update site settings",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Site settings updated successfully",
	})
}
