package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"orbit-backend/config"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// Redirect model
type Redirect struct {
	ID        int    `json:"id"`
	OldURL    string `json:"old_url"`
	NewURL    string `json:"new_url"`
	IsActive  bool   `json:"is_active"`
	CreatedAt string `json:"created_at"`
}

// GetAllRedirects - tüm yönlendirmeleri listeler (Admin için)
func GetAllRedirects(c *fiber.Ctx) error {
	rows, err := config.DB.Query(context.Background(), "SELECT id, old_url, new_url, is_active, created_at FROM redirects ORDER BY created_at DESC")
	if err != nil {
		if strings.Contains(err.Error(), "does not exist") {
			return c.JSON([]Redirect{})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Veritabanı hatası", "details": err.Error()})
	}
	defer rows.Close()

	redirects := []Redirect{}
	for rows.Next() {
		var r Redirect
		var t interface{}
		if err := rows.Scan(&r.ID, &r.OldURL, &r.NewURL, &r.IsActive, &t); err != nil {
			continue
		}
		r.CreatedAt = fmt.Sprintf("%v", t)
		redirects = append(redirects, r)
	}

	return c.JSON(redirects)
}

// GetActiveRedirects - sadece aktif yönlendirmeleri listeler (Next.js Middleware için çok hızlı çalışmalı)
func GetActiveRedirects(c *fiber.Ctx) error {
	rows, err := config.DB.Query(context.Background(), "SELECT old_url, new_url FROM redirects WHERE is_active = true")
	if err != nil {
		if strings.Contains(err.Error(), "does not exist") {
			return c.JSON([]Redirect{})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Veritabanı hatası", "details": err.Error()})
	}
	defer rows.Close()

	type SimpleRedirect struct {
		OldURL string `json:"old_url"`
		NewURL string `json:"new_url"`
	}

	redirects := []SimpleRedirect{}
	for rows.Next() {
		var r SimpleRedirect
		if err := rows.Scan(&r.OldURL, &r.NewURL); err != nil {
			continue
		}
		redirects = append(redirects, r)
	}

	// Middleware bunu hızlı okuması için Headerlara Cache eklenebilir, fakat middleware sürekli sorgulamamalı.
	// Bunun yerine Next.js tarafında fetch cache kullanılabilir.
	c.Set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120")
	return c.JSON(redirects)
}

type RedirectRequest struct {
	OldURL   string `json:"old_url"`
	NewURL   string `json:"new_url"`
	IsActive bool   `json:"is_active"`
}

// CreateRedirect - yeni yönlendirme oluşturur
func CreateRedirect(c *fiber.Ctx) error {
	var req RedirectRequest
	if err := json.Unmarshal(c.Body(), &req); err != nil {
		fmt.Println("Unmarshal Error:", err)
		fmt.Println("Raw Body:", string(c.Body()))
		return c.Status(400).JSON(fiber.Map{"error": "Geçersiz istek formatı", "details": err.Error()})
	}

	req.OldURL = strings.TrimSpace(req.OldURL)
	req.NewURL = strings.TrimSpace(req.NewURL)

	if req.OldURL == "" || req.NewURL == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Eski URL ve Yeni URL boş olamaz"})
	}
	if req.OldURL == req.NewURL {
		return c.Status(400).JSON(fiber.Map{"error": "Eski URL ve Yeni URL aynı olamaz (Sonsuz döngü yaratır)"})
	}

	// URL'lerin başında / olduğundan emin olalım (kolay eşleştirme için)
	if !strings.HasPrefix(req.OldURL, "/") && !strings.HasPrefix(req.OldURL, "http") {
		req.OldURL = "/" + req.OldURL
	}
	if !strings.HasPrefix(req.NewURL, "/") && !strings.HasPrefix(req.NewURL, "http") {
		req.NewURL = "/" + req.NewURL
	}

	isActive := req.IsActive

	var newID int
	err := config.DB.QueryRow(context.Background(), 
		"INSERT INTO redirects (old_url, new_url, is_active) VALUES ($1, $2, $3) RETURNING id", 
		req.OldURL, req.NewURL, isActive).Scan(&newID)
	
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value") {
			return c.Status(400).JSON(fiber.Map{"error": "Bu 'Eski URL' zaten kullanımda."})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Veritabanına kaydedilemedi", "details": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{
		"message": "Yönlendirme oluşturuldu",
		"id":      newID,
	})
}

// UpdateRedirect - yönlendirmeyi günceller
func UpdateRedirect(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Geçersiz ID"})
	}

	var req RedirectRequest
	if err := json.Unmarshal(c.Body(), &req); err != nil {
		fmt.Println("Unmarshal Error:", err)
		fmt.Println("Raw Body:", string(c.Body()))
		return c.Status(400).JSON(fiber.Map{"error": "Geçersiz istek formatı", "details": err.Error()})
	}

	req.OldURL = strings.TrimSpace(req.OldURL)
	req.NewURL = strings.TrimSpace(req.NewURL)

	if req.OldURL == "" || req.NewURL == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Eski URL ve Yeni URL boş olamaz"})
	}
	if req.OldURL == req.NewURL {
		return c.Status(400).JSON(fiber.Map{"error": "Eski URL ve Yeni URL aynı olamaz (Sonsuz döngü yaratır)"})
	}

	if !strings.HasPrefix(req.OldURL, "/") && !strings.HasPrefix(req.OldURL, "http") {
		req.OldURL = "/" + req.OldURL
	}
	if !strings.HasPrefix(req.NewURL, "/") && !strings.HasPrefix(req.NewURL, "http") {
		req.NewURL = "/" + req.NewURL
	}

	isActive := req.IsActive

	_, err = config.DB.Exec(context.Background(), 
		"UPDATE redirects SET old_url = $1, new_url = $2, is_active = $3 WHERE id = $4", 
		req.OldURL, req.NewURL, isActive, id)
	
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value") {
			return c.Status(400).JSON(fiber.Map{"error": "Bu 'Eski URL' başka bir kayıtta zaten var."})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Veritabanı güncellenemedi", "details": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Yönlendirme güncellendi"})
}

// DeleteRedirect - yönlendirmeyi siler
func DeleteRedirect(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Geçersiz ID"})
	}

	_, err = config.DB.Exec(context.Background(), "DELETE FROM redirects WHERE id = $1", id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Silinemedi", "details": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Yönlendirme silindi"})
}
