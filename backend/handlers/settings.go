package handlers

import (
	"context"
	"encoding/json"
	"fmt"
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

// GetSettings site_settings tablosundaki tek satırlık (ID = 1) site genel ayarlarını getirir
func GetSettings(c *fiber.Ctx) error {
	var s models.SiteSettings

	query := `
		SELECT id, site_title, site_description, site_keywords, logo_url, favicon_url, COALESCE(favicon_dark_url, ''),
		       contact_email, contact_phone, contact_address, map_latitude, map_longitude, 
		       social_linkedin, social_youtube, social_x, social_github, COALESCE(catalog_url, ''), COALESCE(social_links_json::text, '[]'), COALESCE(offices_json::text, ''), updated_at
		FROM site_settings 
		WHERE id = 1
	`

	err := config.DB.QueryRow(context.Background(), query).Scan(
		&s.ID, &s.SiteTitle, &s.SiteDescription, &s.SiteKeywords, &s.LogoURL, &s.FaviconURL, &s.FaviconDarkURL,
		&s.ContactEmail, &s.ContactPhone, &s.ContactAddress, &s.MapLatitude, &s.MapLongitude,
		&s.SocialLinkedin, &s.SocialYoutube, &s.SocialX, &s.SocialGithub, &s.CatalogURL, &s.SocialLinksJSON, &s.OfficesJSON, &s.UpdatedAt,
	)

	if err != nil {
		fmt.Printf("GetSettings SQL Error: %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch site settings",
		})
	}

	var offices []OfficeLocation
	if s.OfficesJSON != "" && s.OfficesJSON != "null" {
		json.Unmarshal([]byte(s.OfficesJSON), &offices)
	}

	if s.OfficesJSON == "" || s.OfficesJSON == "null" {
		offices = []OfficeLocation{}
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
	if err := json.Unmarshal(c.Body(), s); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "JSON parse error: " + err.Error(),
		})
	}

	// Basit doğrulama kuralları
	if s.SiteTitle == "" || s.SiteDescription == "" || s.ContactEmail == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Site title, description, and contact email are required fields",
		})
	}

	if s.SocialLinksJSON == "" {
		s.SocialLinksJSON = "[]"
	}
	if s.OfficesJSON == "" {
		s.OfficesJSON = "[]"
	}

	query := `
		UPDATE site_settings
		SET site_title = $1, site_description = $2, site_keywords = $3, logo_url = $4, favicon_url = $5, favicon_dark_url = $6,
		    contact_email = $7, contact_phone = $8, contact_address = $9, map_latitude = $10, map_longitude = $11,
		    social_linkedin = $12, social_youtube = $13, social_x = $14, social_github = $15, social_links_json = $16::jsonb, offices_json = $17::jsonb, catalog_url = $18, updated_at = NOW()
		WHERE id = 1
	`

	_, err := config.DB.Exec(context.Background(), query,
		s.SiteTitle, s.SiteDescription, s.SiteKeywords, s.LogoURL, s.FaviconURL, s.FaviconDarkURL,
		s.ContactEmail, s.ContactPhone, s.ContactAddress, s.MapLatitude, s.MapLongitude,
		s.SocialLinkedin, s.SocialYoutube, s.SocialX, s.SocialGithub, s.SocialLinksJSON, s.OfficesJSON, s.CatalogURL,
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
