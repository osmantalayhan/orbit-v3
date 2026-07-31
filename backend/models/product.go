package models

import (
	"encoding/json"
	"time"
)

type Product struct {
	ID          string                 `json:"id"`
	Name        string                 `json:"name"`
	Role        string                 `json:"role"` // Ürün alt sistemi (otopilot, esc vb.)
	Category    string                 `json:"category"`
	Tagline     string                 `json:"tagline"`
	Description string                 `json:"description"`
	Images       []string                 `json:"images"`   // Postgres TEXT[] dizisi
	Specs        interface{}              `json:"specs"`    // Postgres JSONB alanı (Eski Object veya Yeni Array)
	Channels     interface{}              `json:"channels"` // Postgres JSONB alanı (Eski Object veya Yeni Array)
	Details      json.RawMessage          `json:"details"`  // Postgres JSONB alanı (Rich Text)
	PinoutImages []string                 `json:"pinout_images"` // Postgres TEXT[] dizisi
	Downloads         []map[string]interface{} `json:"downloads"`     // Postgres JSONB (Array of objects)
	IsCampaignActive     bool                     `json:"is_campaign_active"`
	CampaignDiscountRate string                   `json:"campaign_discount_rate"`
	CampaignTitle        string                   `json:"campaign_title"`
	CampaignDescription  string                   `json:"campaign_description"`
	CampaignButtonText   string                   `json:"campaign_button_text"`
	CampaignButtonURL    string                   `json:"campaign_button_url"`
	Badge             string                   `json:"badge,omitempty"`
	SortOrder         int                      `json:"sort_order"`
	Active            bool                     `json:"active"`
	CreatedAt         time.Time                `json:"created_at"`
}
