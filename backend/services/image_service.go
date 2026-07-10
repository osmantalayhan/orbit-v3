package services

import (
	"errors"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"

	"golang.org/x/image/draw"
)

const MaxImageSize = 5 * 1024 * 1024 // 5MB

// OptimizeAndSaveImage checks file size, decodes, resizes if too large, and saves it. Optionally generates a thumbnail.
func OptimizeAndSaveImage(fileHeader *multipart.FileHeader, savePath string, generateThumb bool, isSlider bool) error {
	// 1. 5MB Sınırı Kontrolü
	if fileHeader.Size > MaxImageSize {
		return errors.New("Dosya boyutu 5MB sınırını aşıyor")
	}

	// 2. Dosyayı Aç
	file, err := fileHeader.Open()
	if err != nil {
		return err
	}
	defer file.Close()

	// 3. Görseli Decode Et (Desteklenen formatlar: jpeg, png)
	img, format, err := image.Decode(file)
	if err != nil {
		// Geçersiz format veya bozuk dosya olabilir (örn: SVG).
		// Eğer decode edilemiyorsa, boyutlandırma yapmadan direkt kaydedelim.
		// Dosya göstericisini başa sar:
		file.Seek(0, 0)
		out, err := os.Create(savePath)
		if err != nil {
			return err
		}
		defer out.Close()
		_, err = io.Copy(out, file)
		return err
	}

	// 4. Boyutlandırma (Genişlik 1920px'den büyükse küçült)
	bounds := img.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	const maxWidth = 1920
	var finalImg image.Image = img

	if !isSlider && width > maxWidth {
		// En-boy oranını koruyarak yeni yüksekliği hesapla
		ratio := float64(maxWidth) / float64(width)
		newHeight := int(float64(height) * ratio)

		// Yeni hedeflenen boyutta bir çerçeve oluştur
		dst := image.NewRGBA(image.Rect(0, 0, maxWidth, newHeight))

		// Yüksek kaliteli küçültme algoritması ile çiz (BiLinear)
		draw.BiLinear.Scale(dst, dst.Bounds(), img, bounds, draw.Over, nil)
		finalImg = dst
	}

	// 5. Kaydedilecek dosyayı oluştur
	out, err := os.Create(savePath)
	if err != nil {
		return err
	}
	defer out.Close()

	// 6. Formatına göre yüksek kalitede kaydet
	if format == "png" {
		if isSlider {
			// Slider için standart kaydet
			err = png.Encode(out, finalImg)
		} else {
			// Ürün ve Blog PNG'leri için Maksimum Sıkıştırma (Kayıpsız)
			encoder := png.Encoder{CompressionLevel: png.BestCompression}
			err = encoder.Encode(out, finalImg)
		}
	} else {
		if isSlider {
			// Slider JPEG'leri için maksimum kalite
			err = jpeg.Encode(out, finalImg, &jpeg.Options{Quality: 100})
		} else {
			// Diğer JPEG'ler (ürün, blog) kalite kaybı göze batmadan %85 ile iyice sıkıştırılır
			err = jpeg.Encode(out, finalImg, &jpeg.Options{Quality: 85})
		}
	}

	// 7. Thumbnail oluştur (Eğer istenmişse ve sadece ana kapak vs ise)
	if err == nil && generateThumb {
		GenerateThumbnail(finalImg, savePath, format)
	}

	return err
}

// GenerateThumbnail creates a small thumbnail for admin panels
func GenerateThumbnail(img image.Image, savePath string, format string) {
	bounds := img.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	// 128px max size
	const maxSize = 128
	var newWidth, newHeight int

	if width == 0 || height == 0 {
		return
	}

	if width > height {
		newWidth = maxSize
		newHeight = int(float64(height) * (float64(maxSize) / float64(width)))
	} else {
		newHeight = maxSize
		newWidth = int(float64(width) * (float64(maxSize) / float64(height)))
	}

	dst := image.NewRGBA(image.Rect(0, 0, newWidth, newHeight))
	draw.BiLinear.Scale(dst, dst.Bounds(), img, bounds, draw.Over, nil)

	dir := filepath.Dir(savePath)
	base := filepath.Base(savePath)
	thumbPath := filepath.Join(dir, "thumb_"+base)

	out, err := os.Create(thumbPath)
	if err != nil {
		return
	}
	defer out.Close()

	if format == "png" {
		png.Encode(out, dst)
	} else {
		jpeg.Encode(out, dst, &jpeg.Options{Quality: 80})
	}
}
