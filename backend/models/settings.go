package models

import "time"

type SiteSettings struct {
	ID              int       `json:"id"`
	SiteTitle       string    `json:"site_title"`
	SiteDescription string    `json:"site_description"`
	SiteKeywords    string    `json:"site_keywords,omitempty"`
	LogoURL         string    `json:"logo_url"`
	FaviconURL      string    `json:"favicon_url"`
	ContactEmail    string    `json:"contact_email"`
	ContactPhone    string    `json:"contact_phone"`
	ContactAddress  string    `json:"contact_address"`
	MapLatitude     float64   `json:"map_latitude"`
	MapLongitude    float64   `json:"map_longitude"`
	SocialLinkedin  string    `json:"social_linkedin,omitempty"`
	SocialYoutube   string    `json:"social_youtube,omitempty"`
	SocialX         string    `json:"social_x,omitempty"`
	SocialGithub    string    `json:"social_github,omitempty"`
	SocialLinksJSON string    `json:"social_links_json"`
	OfficesJSON     string    `json:"offices_json"`
	CatalogURL      string    `json:"catalog_url,omitempty"`
	UpdatedAt       time.Time `json:"updated_at"`
}
