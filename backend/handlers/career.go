package handlers

import (
	"orbit-backend/config"
	"orbit-backend/models"

	"github.com/gofiber/fiber/v2"
)

// GetJobPositions tüm iş ilanlarını listelemek için
func GetJobPositions(c *fiber.Ctx) error {
	query := `SELECT id, title, department, location, job_type, description, requirements, linkedin_url, active, created_at FROM job_positions WHERE active = true ORDER BY created_at DESC`
	
	rows, err := config.DB.Query(c.Context(), query)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "İş ilanları getirilirken hata oluştu"})
	}
	defer rows.Close()

	var jobs []models.JobPosition
	for rows.Next() {
		var job models.JobPosition
		if err := rows.Scan(
			&job.ID, &job.Title, &job.Department, &job.Location,
			&job.JobType, &job.Description, &job.Requirements,
			&job.LinkedinURL, &job.Active, &job.CreatedAt,
		); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Veri okunurken hata oluştu"})
		}
		jobs = append(jobs, job)
	}

	if jobs == nil {
		jobs = []models.JobPosition{}
	}

	return c.JSON(jobs)
}
