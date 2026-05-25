package models

import "time"

type BlogPost struct {
	ID            int                    `json:"id"`
	Title         string                 `json:"title"`
	Category      string                 `json:"category"`
	DatePublished string                 `json:"date_published"`
	ReadTime      string                 `json:"read_time"`
	CoverImage    string                 `json:"cover_image"`
	LeadParagraph string                 `json:"lead_paragraph"`
	BodyContent   interface{}            `json:"body_content"` // Postgres JSONB alanı ile tam uyumlu (Dizi veya obje olabilir)
	AuthorName    string                 `json:"author_name"`
	AuthorRole    string                 `json:"author_role"`
	AuthorAvatar  string                 `json:"author_avatar"`
	Active        bool                   `json:"active"`
	CreatedAt     time.Time              `json:"created_at"`
}
