package models

import "time"

type Product struct {
	ID          string                 `json:"id"`
	Name        string                 `json:"name"`
	Role        string                 `json:"role"` // Ürün alt sistemi (otopilot, esc vb.)
	Category    string                 `json:"category"`
	Tagline     string                 `json:"tagline"`
	Description string                 `json:"description"`
	Images       []string                 `json:"images"`   // Postgres TEXT[] dizisi
	Specs        map[string]interface{}   `json:"specs"`    // Postgres JSONB alanı
	Channels     map[string]interface{}   `json:"channels"` // Postgres JSONB alanı
	PinoutImages []string                 `json:"pinout_images"` // Postgres TEXT[] dizisi
	Downloads    []map[string]interface{} `json:"downloads"`     // Postgres JSONB (Array of objects)
	Badge       string                 `json:"badge,omitempty"`
	SortOrder   int                    `json:"sort_order"`
	Active      bool                   `json:"active"`
	CreatedAt   time.Time              `json:"created_at"`
}
