package models

import "time"

type User struct {
	ID           int       `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // Şifre dışarı sızdırılmaz
	Role         string    `json:"role"`
	LastLogin    time.Time `json:"last_login"`
	CreatedAt    time.Time `json:"created_at"`
}

// LoginRequest temsilcisi
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
