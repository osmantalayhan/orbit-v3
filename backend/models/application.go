package models

import "time"

type JobApplication struct {
	ID             int       `json:"id"`
	Name           string    `json:"name"`
	Profession     string    `json:"profession"`
	EmploymentType string    `json:"employment_type"`
	LinkedinURL    string    `json:"linkedin_url"`
	CVFilePath     string    `json:"cv_file_path"`
	Status         string    `json:"status"`
	CreatedAt      time.Time `json:"created_at"`
}
