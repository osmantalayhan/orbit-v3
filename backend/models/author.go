package models

import (
	"time"
)

type Author struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Role      string    `json:"role"`
	AvatarURL string    `json:"avatar_url"`
	CreatedAt time.Time `json:"created_at"`
}
