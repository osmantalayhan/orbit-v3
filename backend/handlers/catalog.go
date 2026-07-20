package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"orbit-backend/config"
	"orbit-backend/models"
	"orbit-backend/services"

	"github.com/gofiber/fiber/v2"
)



// GetProducts tüm ürünleri listeler
func GetProducts(c *fiber.Ctx) error {
	// İsteğe bağlı sayfalama parametreleri (Varsayılan 1000 limit, OOM koruması)
	limit := c.QueryInt("limit", 1000)
	page := c.QueryInt("page", 1)
	offset := (page - 1) * limit

	query := `
		SELECT id, name, role, category, tagline, description, images, specs, channels, pinout_images, downloads, is_teknofest_active, teknofest_discount, badge, sort_order, active, details, created_at
		FROM products
		WHERE active = true
		ORDER BY sort_order ASC
		LIMIT $1 OFFSET $2
	`

	rows, err := config.DB.Query(context.Background(), query, limit, offset)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to query products",
		})
	}
	defer rows.Close()

	products := []models.Product{}
	for rows.Next() {
		var p models.Product
		var teknofestDiscount *string // Nullable olduğu için
		err := rows.Scan(
			&p.ID, &p.Name, &p.Role, &p.Category, &p.Tagline, &p.Description, &p.Images, &p.Specs, &p.Channels, &p.PinoutImages, &p.Downloads, &p.IsTeknofestActive, &teknofestDiscount, &p.Badge, &p.SortOrder, &p.Active, &p.Details, &p.CreatedAt,
		)
		if err != nil {
			log.Println("Scan error:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to parse product",
			})
		}
		if teknofestDiscount != nil {
			p.TeknofestDiscount = *teknofestDiscount
		}
		products = append(products, p)
	}

	return c.JSON(products)
}

// GetProductByID tek bir ürün detayı getirir
func GetProductByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var p models.Product
	var teknofestDiscount *string

	err := config.DB.QueryRow(context.Background(), `
		SELECT id, name, role, category, tagline, description, images, specs, channels, pinout_images, downloads, is_teknofest_active, teknofest_discount, badge, sort_order, active, details, created_at
		FROM products
		WHERE id = $1 AND active = true
	`, id).Scan(
		&p.ID, &p.Name, &p.Role, &p.Category, &p.Tagline, &p.Description, &p.Images, &p.Specs, &p.Channels, &p.PinoutImages, &p.Downloads, &p.IsTeknofestActive, &teknofestDiscount, &p.Badge, &p.SortOrder, &p.Active, &p.Details, &p.CreatedAt,
	)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}

	if teknofestDiscount != nil {
		p.TeknofestDiscount = *teknofestDiscount
	}

	return c.JSON(p)
}

// GetSliderItems anasayfa slider elemanlarını listeler
func GetSliderItems(c *fiber.Ctx) error {
	rows, err := config.DB.Query(context.Background(), `
		SELECT id, COALESCE(product_id, ''), model_code, slide_title, slide_desc, image_url, sort_order, active
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

// GetAllSliderItems tüm slider elemanlarını (aktif/pasif fark etmeksizin) admin paneli için listeler
func GetAllSliderItems(c *fiber.Ctx) error {
	rows, err := config.DB.Query(context.Background(), `
		SELECT id, COALESCE(product_id, ''), model_code, slide_title, slide_desc, image_url, sort_order, active
		FROM home_slider
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

// CreateProduct yeni ürün ekler ve dosyaları kaydeder
func CreateProduct(c *fiber.Ctx) error {
	id := c.FormValue("id")
	if id == "" {
		id = fmt.Sprintf("prod_%d", time.Now().Unix())
	}

	name := c.FormValue("name")
	role := c.FormValue("role")
	category := c.FormValue("category")
	tagline := c.FormValue("tagline")
	description := c.FormValue("description")
	badge := c.FormValue("badge")
	isTeknofestActive := c.FormValue("is_teknofest_active") == "true"
	teknofestDiscount := c.FormValue("teknofest_discount")

	detailsRaw := c.FormValue("details")
	if detailsRaw == "" {
		detailsRaw = `""`
	}

	specsRaw := c.FormValue("specs")
	if specsRaw == "" {
		specsRaw = "[]" // Default empty array
	} else if strings.HasPrefix(specsRaw, "[") {
		var specsArr []map[string]string
		if err := json.Unmarshal([]byte(specsRaw), &specsArr); err == nil {
			var filtered []map[string]string
			for _, s := range specsArr {
				if s["label"] != "" || s["value"] != "" {
					filtered = append(filtered, s)
				}
			}
			mapped, _ := json.Marshal(filtered)
			specsRaw = string(mapped)
		}
	}

	channelsRaw := c.FormValue("channels")
	if channelsRaw == "" {
		channelsRaw = "[]" // Default empty array
	} else if strings.HasPrefix(channelsRaw, "[") {
		var chArr []map[string]string
		if err := json.Unmarshal([]byte(channelsRaw), &chArr); err == nil {
			var filtered []map[string]string
			for _, ch := range chArr {
				if ch["name"] != "" || ch["url"] != "" {
					filtered = append(filtered, ch)
				}
			}
			mapped, _ := json.Marshal(filtered)
			channelsRaw = string(mapped)
		}
	}

	downloadsRaw := c.FormValue("downloads")
	var dlArr []map[string]interface{}
	if downloadsRaw != "" {
		json.Unmarshal([]byte(downloadsRaw), &dlArr)
	}

	// Klasör Yolu
	uploadDir := filepath.Join("..", "public", "uploads")
	os.MkdirAll(uploadDir, os.ModePerm)

	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse form"})
	}

	for i := range dlArr {
		key := fmt.Sprintf("download_file_%d", i)
		if files, ok := form.File[key]; ok && len(files) > 0 {
			file := files[0]
			filename := fmt.Sprintf("%s_dl_%d_%s", id, time.Now().UnixNano(), file.Filename)
			if err := c.SaveFile(file, filepath.Join(uploadDir, filename)); err == nil {
				dlArr[i]["url"] = "/uploads/" + filename
				dlArr[i]["file_name"] = file.Filename
			}
		}
	}
	if len(dlArr) > 0 {
		mapped, _ := json.Marshal(dlArr)
		downloadsRaw = string(mapped)
	} else {
		downloadsRaw = "[]"
	}

	var galleryImages = []string{}
	if files, ok := form.File["gallery"]; ok {
		for i, file := range files {
			filename := fmt.Sprintf("%s_gal_%d_%s", id, time.Now().UnixNano(), file.Filename)
			generateThumb := (i == 0) // Sadece ilk resim "Ana Kapak"tır
			if err := services.OptimizeAndSaveImage(file, filepath.Join(uploadDir, filename), generateThumb, false); err == nil {
				galleryImages = append(galleryImages, "/uploads/"+filename)
			}
		}
	}

	var finalPinouts = []string{}
	pinoutLayoutRaw := c.FormValue("pinout_layout")
	if pinoutLayoutRaw != "" {
		var layout []string
		if err := json.Unmarshal([]byte(pinoutLayoutRaw), &layout); err == nil {
			uploadedCount := 0
			for _, item := range layout {
				parts := strings.Split(item, "|")
				baseItem := parts[0]
				titleSuffix := ""
				if len(parts) > 1 {
					titleSuffix = "|" + parts[1]
				}

				if strings.HasPrefix(baseItem, "FILE:") {
					if files, ok := form.File["pinouts"]; ok && uploadedCount < len(files) {
						file := files[uploadedCount]
						filename := fmt.Sprintf("%s_pinout_%d_%s", id, time.Now().UnixNano(), file.Filename)
						// İç bağlantı şemaları sekmesi, thumbnail'e gerek yok
						if err := services.OptimizeAndSaveImage(file, filepath.Join(uploadDir, filename), false, false); err == nil {
							finalPinouts = append(finalPinouts, "/uploads/"+filename+titleSuffix)
						}
						uploadedCount++
					}
				} else {
					finalPinouts = append(finalPinouts, item)
				}
			}
		}
	}

	// Insert into DB
	insertQuery := `
		INSERT INTO products (
			id, name, role, category, tagline, description, images, specs, channels, 
			pinout_images, downloads, is_teknofest_active, teknofest_discount, badge, details, active
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, true)
	`
	
	_, dbErr := config.DB.Exec(context.Background(), insertQuery,
		id, name, role, category, tagline, description, galleryImages, specsRaw, channelsRaw,
		finalPinouts, downloadsRaw, isTeknofestActive, teknofestDiscount, badge, detailsRaw,
	)

	if dbErr != nil {
		log.Println("Error inserting product:", dbErr)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save product to database"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Product created successfully", "id": id})
}

// UpdateProduct mevcut ürünü günceller
func UpdateProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Product ID required"})
	}

	// Eski dosyaları çöpe atmak üzere mevcut durumu veritabanından okuyalım
	var oldImages, oldPinouts []string
	var oldDownloads interface{}
	err := config.DB.QueryRow(context.Background(), `
		SELECT images, pinout_images, downloads
		FROM products WHERE id = $1
	`, id).Scan(&oldImages, &oldPinouts, &oldDownloads)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Güncellenecek ürün bulunamadı veya veritabanı hatası"})
	}

	name := c.FormValue("name")
	role := c.FormValue("role")
	category := c.FormValue("category")
	tagline := c.FormValue("tagline")
	description := c.FormValue("description")
	badge := c.FormValue("badge")
	isTeknofestActive := c.FormValue("is_teknofest_active") == "true"
	teknofestDiscount := c.FormValue("teknofest_discount")

	detailsRaw := c.FormValue("details")
	if detailsRaw == "" {
		detailsRaw = `""`
	}

	specsRaw := c.FormValue("specs")
	if specsRaw == "" {
		specsRaw = "[]"
	} else if strings.HasPrefix(specsRaw, "[") {
		var specsArr []map[string]string
		if err := json.Unmarshal([]byte(specsRaw), &specsArr); err == nil {
			var filtered []map[string]string
			for _, s := range specsArr {
				if s["label"] != "" || s["value"] != "" {
					filtered = append(filtered, s)
				}
			}
			mapped, _ := json.Marshal(filtered)
			specsRaw = string(mapped)
		}
	}

	channelsRaw := c.FormValue("channels")
	if channelsRaw == "" {
		channelsRaw = "[]"
	} else if strings.HasPrefix(channelsRaw, "[") {
		var chArr []map[string]string
		if err := json.Unmarshal([]byte(channelsRaw), &chArr); err == nil {
			var filtered []map[string]string
			for _, ch := range chArr {
				if ch["name"] != "" || ch["url"] != "" {
					filtered = append(filtered, ch)
				}
			}
			mapped, _ := json.Marshal(filtered)
			channelsRaw = string(mapped)
		}
	}

	downloadsRaw := c.FormValue("downloads")
	var dlArr []map[string]interface{}
	if downloadsRaw != "" {
		json.Unmarshal([]byte(downloadsRaw), &dlArr)
	}

	uploadDir := filepath.Join("..", "public", "uploads")
	os.MkdirAll(uploadDir, os.ModePerm)

	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse form"})
	}

	for i := range dlArr {
		key := fmt.Sprintf("download_file_%d", i)
		if files, ok := form.File[key]; ok && len(files) > 0 {
			file := files[0]
			filename := fmt.Sprintf("%s_dl_%d_%s", id, time.Now().UnixNano(), file.Filename)
			if err := c.SaveFile(file, filepath.Join(uploadDir, filename)); err == nil {
				dlArr[i]["url"] = "/uploads/" + filename
				dlArr[i]["file_name"] = file.Filename
			}
		}
	}
	if len(dlArr) > 0 {
		mapped, _ := json.Marshal(dlArr)
		downloadsRaw = string(mapped)
	} else {
		downloadsRaw = "[]"
	}

	var finalGallery = []string{}
	layoutRaw := c.FormValue("gallery_layout")
	if layoutRaw != "" {
		var layout []string
		if err := json.Unmarshal([]byte(layoutRaw), &layout); err == nil {
			uploadedCount := 0
			for _, item := range layout {
				if strings.HasPrefix(item, "FILE:") {
					if files, ok := form.File["gallery"]; ok && uploadedCount < len(files) {
						file := files[uploadedCount]
						filename := fmt.Sprintf("%s_gal_%d_%s", id, time.Now().UnixNano(), file.Filename)
						generateThumb := (len(finalGallery) == 0) // Eğer liste boşsa, bu ilk eklenen resimdir (Ana Kapaktır)
						if err := services.OptimizeAndSaveImage(file, filepath.Join(uploadDir, filename), generateThumb, false); err == nil {
							finalGallery = append(finalGallery, "/uploads/"+filename)
						}
						uploadedCount++
					}
				} else {
					finalGallery = append(finalGallery, item)
				}
			}
		}
	} else {
		// Fallback for no layout
		if existingRaw := c.FormValue("existing_gallery"); existingRaw != "" {
			json.Unmarshal([]byte(existingRaw), &finalGallery)
		}
		if files, ok := form.File["gallery"]; ok {
			for i, file := range files {
				filename := fmt.Sprintf("%s_gal_%d_%s", id, time.Now().UnixNano(), file.Filename)
				generateThumb := (len(finalGallery) == 0 && i == 0) // Eğer liste boşsa ve bu ilk dosyaysa ana kapaktır
				if err := services.OptimizeAndSaveImage(file, filepath.Join(uploadDir, filename), generateThumb, false); err == nil {
					finalGallery = append(finalGallery, "/uploads/"+filename)
				}
			}
		}
	}

	var finalPinouts = []string{}
	pinoutLayoutRaw := c.FormValue("pinout_layout")
	if pinoutLayoutRaw != "" {
		var layout []string
		if err := json.Unmarshal([]byte(pinoutLayoutRaw), &layout); err == nil {
			uploadedCount := 0
			for _, item := range layout {
				parts := strings.Split(item, "|")
				baseItem := parts[0]
				titleSuffix := ""
				if len(parts) > 1 {
					titleSuffix = "|" + parts[1]
				}

				if strings.HasPrefix(baseItem, "FILE:") {
					if files, ok := form.File["pinouts"]; ok && uploadedCount < len(files) {
						file := files[uploadedCount]
						filename := fmt.Sprintf("%s_pinout_%d_%s", id, time.Now().UnixNano(), file.Filename)
						// Sekme detay resmi thumbnail üretilmez
						if err := services.OptimizeAndSaveImage(file, filepath.Join(uploadDir, filename), false, false); err == nil {
							finalPinouts = append(finalPinouts, "/uploads/"+filename+titleSuffix)
						}
						uploadedCount++
					}
				} else {
					finalPinouts = append(finalPinouts, item)
				}
			}
		}
	}

	updateQuery := `
		UPDATE products 
		SET name = $1, role = $2, category = $3, tagline = $4, description = $5, images = $6, specs = $7, channels = $8, 
			pinout_images = $9, downloads = $10, is_teknofest_active = $11, teknofest_discount = $12, badge = $13, details = $14
		WHERE id = $15
	`
	
	_, dbErr := config.DB.Exec(context.Background(), updateQuery,
		name, role, category, tagline, description, finalGallery, specsRaw, channelsRaw,
		finalPinouts, downloadsRaw, isTeknofestActive, teknofestDiscount, badge, detailsRaw, id,
	)

	if dbErr != nil {
		log.Println("Error updating product:", dbErr)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update product"})
	}

	// === DOSYA ÇÖP TOPLAMA (GARBAGE COLLECTION) ===
	var finalDownloads []string
	for _, dl := range dlArr {
		if url, ok := dl["url"].(string); ok && url != "" {
			finalDownloads = append(finalDownloads, url)
		}
	}
	var oldDlUrls []string
	if oldDlArray, ok := oldDownloads.([]interface{}); ok {
		for _, dlObj := range oldDlArray {
			if dlMap, ok := dlObj.(map[string]interface{}); ok {
				if url, ok := dlMap["url"].(string); ok && url != "" {
					oldDlUrls = append(oldDlUrls, url)
				}
			}
		}
	}

	deleteOrphans := func(oldUrls, newUrls []string) {
		newUrlMap := make(map[string]bool)
		for _, u := range newUrls {
			newUrlMap[u] = true
		}
		for _, oldU := range oldUrls {
			if !newUrlMap[oldU] && strings.HasPrefix(oldU, "/uploads/") {
				os.Remove("." + oldU)
			}
		}
	}

	deleteOrphans(oldImages, finalGallery)
	deleteOrphans(oldPinouts, finalPinouts)
	deleteOrphans(oldDlUrls, finalDownloads)
	// ===============================================

	return c.JSON(fiber.Map{"message": "Product updated successfully"})
}

// DeleteProduct veritabanından ID'ye göre ürün siler ve bağlı dosyaları diskten temizler
func DeleteProduct(c *fiber.Ctx) error {
	id := c.Params("id")

	// Önce silinecek ürünün dosya yollarını veritabanından çekelim
	var images, pinoutImages []string
	var downloads interface{}
	
	err := config.DB.QueryRow(context.Background(), `
		SELECT images, pinout_images, downloads
		FROM products WHERE id = $1
	`, id).Scan(&images, &pinoutImages, &downloads)
	
	if err != nil {
		log.Println("Error finding product before delete:", err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	query := `DELETE FROM products WHERE id = $1`
	res, err := config.DB.Exec(context.Background(), query, id)
	if err != nil {
		log.Println("Error deleting product:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete product"})
	}
	if res.RowsAffected() == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	// Dosyaları fiziksel olarak sunucudan temizleme
	for _, img := range images {
		if strings.HasPrefix(img, "/uploads/") {
			os.Remove("." + img)
		}
	}
	for _, img := range pinoutImages {
		if strings.HasPrefix(img, "/uploads/") {
			os.Remove("." + img)
		}
	}
	if dlArray, ok := downloads.([]interface{}); ok {
		for _, dlObj := range dlArray {
			if dlMap, ok := dlObj.(map[string]interface{}); ok {
				if url, ok := dlMap["url"].(string); ok {
					if strings.HasPrefix(url, "/uploads/") {
						os.Remove("." + url)
					}
				}
			}
		}
	}

	return c.JSON(fiber.Map{"message": "Product and associated files deleted successfully"})
}

// ==========================================
// 🎢 SLIDER YÖNETİMİ
// ==========================================

// CreateSliderItem yeni bir slider elemanı ekler
func CreateSliderItem(c *fiber.Ctx) error {
	slideTitle := c.FormValue("slide_title")
	slideDesc := c.FormValue("slide_desc")
	modelCode := c.FormValue("model_code")
	productID := c.FormValue("product_id")
	sortOrderStr := c.FormValue("sort_order", "0")
	activeStr := c.FormValue("active", "true")

	if slideTitle == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Başlık zorunludur"})
	}

	var pID interface{}
	if productID != "" {
		pID = productID
	} else {
		pID = nil
	}

	sortOrder := 0
	fmt.Sscanf(sortOrderStr, "%d", &sortOrder)
	active := activeStr == "true"

	// Dosya yükleme (Opsiyonel ama genelde gerekir)
	uploadDir := filepath.Join("..", "public", "uploads")
	os.MkdirAll(uploadDir, os.ModePerm)

	var imageURL string
	if file, err := c.FormFile("image_file"); err == nil {
		filename := fmt.Sprintf("slider_%d_%s", time.Now().UnixNano(), file.Filename)
		if err := services.OptimizeAndSaveImage(file, filepath.Join(uploadDir, filename), true, true); err == nil {
			imageURL = "/uploads/" + filename
		}
	} else {
		// Varsa formdan gelen manuel url
		imageURL = c.FormValue("image_url")
	}

	if imageURL == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Görsel zorunludur"})
	}

	var newID int
	query := `
		INSERT INTO home_slider (product_id, model_code, slide_title, slide_desc, image_url, sort_order, active)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id
	`
	err := config.DB.QueryRow(context.Background(), query,
		pID, modelCode, slideTitle, slideDesc, imageURL, sortOrder, active,
	).Scan(&newID)

	if err != nil {
		log.Println("Error creating slider item:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Slider eklenemedi"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": newID, "message": "Slider oluşturuldu"})
}

// UpdateSliderItem mevcut slider elemanını günceller
func UpdateSliderItem(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID gerekli"})
	}

	slideTitle := c.FormValue("slide_title")
	slideDesc := c.FormValue("slide_desc")
	modelCode := c.FormValue("model_code")
	productID := c.FormValue("product_id")
	sortOrderStr := c.FormValue("sort_order", "0")
	activeStr := c.FormValue("active", "true")

	if slideTitle == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Başlık zorunludur"})
	}

	var pID interface{}
	if productID != "" {
		pID = productID
	} else {
		pID = nil
	}

	sortOrder := 0
	fmt.Sscanf(sortOrderStr, "%d", &sortOrder)
	active := activeStr == "true"

	uploadDir := filepath.Join("..", "public", "uploads")
	os.MkdirAll(uploadDir, os.ModePerm)

	var imageURL = c.FormValue("image_url") // Eski URL
	if file, err := c.FormFile("image_file"); err == nil {
		filename := fmt.Sprintf("slider_%d_%s", time.Now().UnixNano(), file.Filename)
		if err := services.OptimizeAndSaveImage(file, filepath.Join(uploadDir, filename), true, true); err == nil {
			imageURL = "/uploads/" + filename
		}
	}

	if imageURL == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Görsel zorunludur"})
	}

	query := `
		UPDATE home_slider 
		SET product_id = $1, model_code = $2, slide_title = $3, slide_desc = $4, image_url = $5, sort_order = $6, active = $7
		WHERE id = $8
	`
	res, err := config.DB.Exec(context.Background(), query,
		pID, modelCode, slideTitle, slideDesc, imageURL, sortOrder, active, id,
	)

	if err != nil {
		log.Println("Error updating slider item:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Slider güncellenemedi"})
	}
	if res.RowsAffected() == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Slider bulunamadı"})
	}

	return c.JSON(fiber.Map{"message": "Slider güncellendi"})
}

// DeleteSliderItem slider elemanını siler (opsiyonel: bağlantılı resmi sunucudan temizler)
func DeleteSliderItem(c *fiber.Ctx) error {
	id := c.Params("id")

	// İmaj yolunu bul
	var imageUrl string
	err := config.DB.QueryRow(context.Background(), "SELECT image_url FROM home_slider WHERE id = $1", id).Scan(&imageUrl)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Slider bulunamadı"})
	}

	query := `DELETE FROM home_slider WHERE id = $1`
	res, err := config.DB.Exec(context.Background(), query, id)
	
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Silme başarısız"})
	}
	if res.RowsAffected() == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Slider bulunamadı"})
	}

	// Slayt silindiyse dosyayı da diskten kaldır
	if strings.HasPrefix(imageUrl, "/uploads/") {
		os.Remove("." + imageUrl)
	}

	return c.JSON(fiber.Map{"message": "Slider başarıyla silindi"})
}
