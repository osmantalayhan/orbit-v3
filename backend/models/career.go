package models

import "time"

type JobPosition struct {
	ID           int       `json:"id"`
	Title        string    `json:"title"`
	Department   string    `json:"department"`
	Location     string    `json:"location"`
	JobType      string    `json:"job_type"`
	Description  string    `json:"description"`
	Requirements []string  `json:"requirements"` // Postgres TEXT[] dizisi ile tam uyumlu
	LinkedinURL  string    `json:"linkedin_url"`
	Active       bool      `json:"active"`
	CreatedAt    time.Time `json:"created_at"`
}
