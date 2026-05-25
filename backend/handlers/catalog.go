package handlers

import (
	"context"
	"log"
	"orbit-backend/config"
	"orbit-backend/models"

	"github.com/gofiber/fiber/v2"
)

// SeedCatalogData veri tabanında ürün veya slider verisi boşsa varsayılan başlangıç verilerini otomatik yükler
func SeedCatalogData() {
	var count int
	err := config.DB.QueryRow(context.Background(), "SELECT COUNT(*) FROM products").Scan(&count)
	if err != nil {
		log.Println("Error checking products count:", err)
		return
	}

	if count == 0 {
		log.Println("Seeding default products into database...")
		productsQuery := `
			INSERT INTO products (id, name, role, category, tagline, description, images, specs, channels, badge, sort_order, active)
			VALUES 
			('f435', 'Orbit F435', 'Uçuş Kontrol Sistemi', 'Otopilot', 'STM32F405 İşlemci & Dual IMU Teknolojisi', 'Havacılık standartlarında yedekli otopilot sistemi.', ARRAY['/img/ucuskontrol.png'], '{}'::jsonb, '{}'::jsonb, 'Yeni', 0, true),
			('e50', 'Orbit E50', '50A 4-in-1 ESC', 'Güç', 'BLHeli_32 & 128K PWM Desteği', 'Yüksek akımlı ve kararlı motor hız kontrolcüsü.', ARRAY['/img/esc.png'], '{}'::jsonb, '{}'::jsonb, '', 1, true),
			('lrs', 'Orbit LRS', '2.4GHz ELRS Alıcı', 'Haberleşme', '30km+ Menzil & 0.6g Ultra Hafif', 'Uzun menzilli ve düşük gecikmeli haberleşme modülü.', ARRAY['/img/elrs.png'], '{}'::jsonb, '{}'::jsonb, 'Popüler', 2, true),
			('gps', 'Orbit M10', 'GPS Modülü', 'Navigasyon', 'Ublox M10 & Dual Kompas', 'Hassas konumlandırma ve yön bulma sistemi.', ARRAY['/img/gps.png'], '{}'::jsonb, '{}'::jsonb, '', 3, true),
			('vtx', 'Orbit Nebula', 'Video Verici', 'Haberleşme', '1.2W Güç & SmartAudio Desteği', 'Net ve parazitsiz analog video yayını.', ARRAY['/img/vtx.png'], '{}'::jsonb, '{}'::jsonb, '', 4, true),
			('frame', 'Orbit X5', 'Carbon Fiber Frame', 'Gövde', 'T700 Karbon & 5mm Kol Kalınlığı', 'Hafif ve son derece dayanıklı yarış gövdesi.', ARRAY['/img/frame.png'], '{}'::jsonb, '{}'::jsonb, '', 5, true)
		`
		_, err = config.DB.Exec(context.Background(), productsQuery)
		if err != nil {
			log.Println("Error seeding products:", err)
		} else {
			log.Println("Successfully seeded default products!")
		}
	}

	var sliderCount int
	err = config.DB.QueryRow(context.Background(), "SELECT COUNT(*) FROM home_slider").Scan(&sliderCount)
	if err != nil {
		log.Println("Error checking slider count:", err)
		return
	}

	if sliderCount == 0 {
		log.Println("Seeding default slider items into database...")
		sliderQuery := `
			INSERT INTO home_slider (product_id, model_code, slide_title, slide_desc, image_url, sort_order, active)
			VALUES 
			('f435', 'F435', 'ORBIT F435', 'Uçuş Kontrol Kartı', '/img/ucuskontrol.png', 0, true),
			('e50', 'E50', 'ORBIT E50', 'ESC Güç Yönetimi', '/img/esc.png', 1, true),
			('lrs', 'LRS', 'ORBIT LRS', 'Haberleşme Sistemi', '/img/elrs.png', 2, true)
		`
		_, err = config.DB.Exec(context.Background(), sliderQuery)
		if err != nil {
			log.Println("Error seeding slider items:", err)
		} else {
			log.Println("Successfully seeded default slider items!")
		}
	}
}

// GetProducts tüm ürünleri listeler
func GetProducts(c *fiber.Ctx) error {
	rows, err := config.DB.Query(context.Background(), `
		SELECT id, name, role, category, tagline, description, images, specs, channels, pinout_images, downloads, badge, sort_order, active, created_at
		FROM products
		WHERE active = true
		ORDER BY sort_order ASC
	`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to query products",
		})
	}
	defer rows.Close()

	products := []models.Product{}
	for rows.Next() {
		var p models.Product
		err := rows.Scan(
			&p.ID, &p.Name, &p.Role, &p.Category, &p.Tagline, &p.Description, &p.Images, &p.Specs, &p.Channels, &p.PinoutImages, &p.Downloads, &p.Badge, &p.SortOrder, &p.Active, &p.CreatedAt,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to parse product",
			})
		}
		products = append(products, p)
	}

	return c.JSON(products)
}

// GetProductByID tek bir ürün detayı getirir
func GetProductByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var p models.Product

	err := config.DB.QueryRow(context.Background(), `
		SELECT id, name, role, category, tagline, description, images, specs, channels, pinout_images, downloads, badge, sort_order, active, created_at
		FROM products
		WHERE id = $1 AND active = true
	`, id).Scan(
		&p.ID, &p.Name, &p.Role, &p.Category, &p.Tagline, &p.Description, &p.Images, &p.Specs, &p.Channels, &p.PinoutImages, &p.Downloads, &p.Badge, &p.SortOrder, &p.Active, &p.CreatedAt,
	)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}

	return c.JSON(p)
}

// GetSliderItems anasayfa slider elemanlarını listeler
func GetSliderItems(c *fiber.Ctx) error {
	rows, err := config.DB.Query(context.Background(), `
		SELECT id, product_id, model_code, slide_title, slide_desc, image_url, sort_order, active
		FROM home_slider
		WHERE active = true
		ORDER BY sort_order ASC
	`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to query slider items",
		})
	}
	defer rows.Close()

	items := []models.HomeSlider{}
	for rows.Next() {
		var s models.HomeSlider
		err := rows.Scan(
			&s.ID, &s.ProductID, &s.ModelCode, &s.SlideTitle, &s.SlideDesc, &s.ImageURL, &s.SortOrder, &s.Active,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to parse slider item",
			})
		}
		items = append(items, s)
	}

	return c.JSON(items)
}
