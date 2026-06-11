package handlers

import (
	"context"
	"fmt"
	"orbit-backend/config"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
)

func calculateTrendStr(thisMonth, lastMonth int) (string, bool) {
	if lastMonth == 0 {
		if thisMonth > 0 {
			return fmt.Sprintf("+%d", thisMonth), true
		}
		return "Değişim yok", true
	}
	diff := float64(thisMonth - lastMonth)
	pct := (diff / float64(lastMonth)) * 100
	if pct > 0 {
		return fmt.Sprintf("+%.0f%%", pct), true
	} else if pct < 0 {
		return fmt.Sprintf("%.0f%%", pct), false
	}
	return "Değişim yok", true
}

// GetDashboardStats returns all dynamic metrics for the admin dashboard
func GetDashboardStats(c *fiber.Ctx) error {
	ctx := context.Background()
	now := time.Now()
	
	// Get first day of this month and last month
	thisMonthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	lastMonthStart := thisMonthStart.AddDate(0, -1, 0)

	var wg sync.WaitGroup

	// 1. Products
	var prodTotal, prodThisMonth, prodLastMonth int
	var prodTrend string
	var prodTrendUp bool
	wg.Add(1)
	go func() {
		defer wg.Done()
		config.DB.QueryRow(ctx, "SELECT COUNT(*) FROM products WHERE active = true").Scan(&prodTotal)
		config.DB.QueryRow(ctx, "SELECT COUNT(*) FROM products WHERE active = true AND created_at >= $1", thisMonthStart).Scan(&prodThisMonth)
		config.DB.QueryRow(ctx, "SELECT COUNT(*) FROM products WHERE active = true AND created_at >= $1 AND created_at < $2", lastMonthStart, thisMonthStart).Scan(&prodLastMonth)
		prodTrend, prodTrendUp = calculateTrendStr(prodThisMonth, prodLastMonth)
	}()

	// 2. Messages
	var msgTotal, msgThisMonth, msgLastMonth int
	var msgTrend string
	var msgTrendUp bool
	wg.Add(1)
	go func() {
		defer wg.Done()
		config.DB.QueryRow(ctx, "SELECT COUNT(*) FROM contact_messages WHERE status = 'unread'").Scan(&msgTotal)
		config.DB.QueryRow(ctx, "SELECT COUNT(*) FROM contact_messages WHERE created_at >= $1", thisMonthStart).Scan(&msgThisMonth)
		config.DB.QueryRow(ctx, "SELECT COUNT(*) FROM contact_messages WHERE created_at >= $1 AND created_at < $2", lastMonthStart, thisMonthStart).Scan(&msgLastMonth)
		msgTrend, msgTrendUp = calculateTrendStr(msgThisMonth, msgLastMonth)
	}()

	// 3. Blogs
	var blogTotal, blogThisMonth, blogLastMonth int
	var blogTrend string
	var blogTrendUp bool
	wg.Add(1)
	go func() {
		defer wg.Done()
		config.DB.QueryRow(ctx, "SELECT COUNT(*) FROM blog_posts WHERE active = true").Scan(&blogTotal)
		config.DB.QueryRow(ctx, "SELECT COUNT(*) FROM blog_posts WHERE active = true AND created_at >= $1", thisMonthStart).Scan(&blogThisMonth)
		config.DB.QueryRow(ctx, "SELECT COUNT(*) FROM blog_posts WHERE active = true AND created_at >= $1 AND created_at < $2", lastMonthStart, thisMonthStart).Scan(&blogLastMonth)
		blogTrend, blogTrendUp = calculateTrendStr(blogThisMonth, blogLastMonth)
	}()

	// 4. Careers
	var careerTotal, careerThisMonth, careerLastMonth int
	var careerTrend string
	var careerTrendUp bool
	wg.Add(1)
	go func() {
		defer wg.Done()
		config.DB.QueryRow(ctx, "SELECT COUNT(*) FROM job_applications").Scan(&careerTotal)
		config.DB.QueryRow(ctx, "SELECT COUNT(*) FROM job_applications WHERE created_at >= $1", thisMonthStart).Scan(&careerThisMonth)
		config.DB.QueryRow(ctx, "SELECT COUNT(*) FROM job_applications WHERE created_at >= $1 AND created_at < $2", lastMonthStart, thisMonthStart).Scan(&careerLastMonth)
		careerTrend, careerTrendUp = calculateTrendStr(careerThisMonth, careerLastMonth)
	}()

	// 5. Traffic Data (Monthly chart)
	type ChartData struct {
		Name  string `json:"name"`
		Value int    `json:"value"`
	}
	trafficData := []ChartData{
		{"Oca", 0}, {"Şub", 0}, {"Mar", 0}, {"Nis", 0}, {"May", 0}, {"Haz", 0},
		{"Tem", 0}, {"Ağu", 0}, {"Eyl", 0}, {"Eki", 0}, {"Kas", 0}, {"Ara", 0},
	}
	
	wg.Add(1)
	go func() {
		defer wg.Done()
		yearStart := time.Date(now.Year(), 1, 1, 0, 0, 0, 0, now.Location())
		rows, err := config.DB.Query(ctx, "SELECT EXTRACT(MONTH FROM created_at), COUNT(*) FROM contact_messages WHERE created_at >= $1 GROUP BY 1", yearStart)
		if err == nil {
			defer rows.Close()
			for rows.Next() {
				var month float64
				var count int
				rows.Scan(&month, &count)
				if int(month) >= 1 && int(month) <= 12 {
					trafficData[int(month)-1].Value = count
				}
			}
		}
	}()

	// 6. Recent Activities
	type Activity struct {
		ID     string `json:"id"`
		Type   string `json:"type"`
		User   string `json:"user"`
		Action string `json:"action"`
		Time   string `json:"time"`
	}
	var recentActivities []Activity

	wg.Add(1)
	go func() {
		defer wg.Done()
		activityQuery := `
			SELECT 'message' as type, name as user, 'yeni bir iletişim formu gönderdi.' as action, created_at
			FROM contact_messages
			UNION ALL
			SELECT 'career' as type, name as user, profession || ' ilanına başvurdu.' as action, created_at
			FROM job_applications
			UNION ALL
			SELECT 'blog' as type, 'Admin' as user, title || ' başlıklı yazıyı oluşturdu.' as action, created_at
			FROM blog_posts
			ORDER BY created_at DESC
			LIMIT 7
		`
		aRows, err := config.DB.Query(ctx, activityQuery)
		if err == nil {
			defer aRows.Close()
			for aRows.Next() {
				var act Activity
				var createdAt time.Time
				aRows.Scan(&act.Type, &act.User, &act.Action, &createdAt)
				act.ID = fmt.Sprintf("%d", createdAt.UnixNano())
				
				diff := now.Sub(createdAt)
				if diff.Hours() < 1 {
					act.Time = fmt.Sprintf("%d dk önce", int(diff.Minutes()))
				} else if diff.Hours() < 24 {
					act.Time = fmt.Sprintf("%d saat önce", int(diff.Hours()))
				} else if diff.Hours() < 48 {
					act.Time = "Dün"
				} else {
					act.Time = fmt.Sprintf("%d gün önce", int(diff.Hours()/24))
				}
				if diff.Minutes() < 1 {
					act.Time = "Şimdi"
				}
				
				recentActivities = append(recentActivities, act)
			}
		}
	}()

	wg.Wait()

	response := fiber.Map{
		"metrics": fiber.Map{
			"products":     fiber.Map{"value": prodTotal, "trend": prodTrend, "trendUp": prodTrendUp},
			"messages":     fiber.Map{"value": msgTotal, "trend": msgTrend, "trendUp": msgTrendUp},
			"blogs":        fiber.Map{"value": blogTotal, "trend": blogTrend, "trendUp": blogTrendUp},
			"applications": fiber.Map{"value": careerTotal, "trend": careerTrend, "trendUp": careerTrendUp},
		},
		"trafficData":      trafficData,
		"recentActivities": recentActivities,
	}

	return c.JSON(response)
}
