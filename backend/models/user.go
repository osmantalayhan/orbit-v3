package models

import "time"

type User struct {
	ID           int        `json:"id"`
	Email        string     `json:"email"`
	PasswordHash string     `json:"-"` // Güvenlik amacıyla JSON çıktısında asla gösterilmez
	Role         string     `json:"role"`
	LastLogin    *time.Time `json:"last_login,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
}
