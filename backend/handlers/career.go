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

// GetAdminJobPositions tüm ilanları (aktif veya pasif gözetmeksizin) admin paneli için getirir
func GetAdminJobPositions(c *fiber.Ctx) error {
	query := `SELECT id, title, department, location, job_type, description, requirements, linkedin_url, active, created_at FROM job_positions ORDER BY created_at DESC`
	
	rows, err := config.DB.Query(c.Context(), query)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Admin ilanları getirilirken hata oluştu"})
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

// CreateJobPosition yeni bir iş ilanı ekler
func CreateJobPosition(c *fiber.Ctx) error {
	var job models.JobPosition
	if err := c.BodyParser(&job); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Geçersiz JSON formatı"})
	}

	if job.Requirements == nil {
		job.Requirements = []string{}
	}

	query := `INSERT INTO job_positions (title, department, location, job_type, description, requirements, linkedin_url, active)
			  VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`
			  
	err := config.DB.QueryRow(c.Context(), query, 
		job.Title, job.Department, job.Location, job.JobType, 
		job.Description, job.Requirements, job.LinkedinURL, job.Active).Scan(&job.ID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "İlan oluşturulamadı", "details": err.Error()})
	}

	return c.Status(201).JSON(job)
}

// UpdateJobPosition var olan iş ilanını günceller
func UpdateJobPosition(c *fiber.Ctx) error {
	id := c.Params("id")
	var job models.JobPosition
	if err := c.BodyParser(&job); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Geçersiz JSON formatı"})
	}

	if job.Requirements == nil {
		job.Requirements = []string{}
	}

	query := `UPDATE job_positions SET 
			  title = $1, department = $2, location = $3, job_type = $4, 
			  description = $5, requirements = $6, linkedin_url = $7, active = $8
			  WHERE id = $9`

	_, err := config.DB.Exec(c.Context(), query, 
		job.Title, job.Department, job.Location, job.JobType, 
		job.Description, job.Requirements, job.LinkedinURL, job.Active, id)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "İlan güncellenemedi", "details": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "İlan başarıyla güncellendi"})
}

// DeleteJobPosition bir ilanı siler
func DeleteJobPosition(c *fiber.Ctx) error {
	id := c.Params("id")
	query := `DELETE FROM job_positions WHERE id = $1`
	
	_, err := config.DB.Exec(c.Context(), query, id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "İlan silinemedi"})
	}

	return c.JSON(fiber.Map{"message": "İlan başarıyla silindi"})
}
