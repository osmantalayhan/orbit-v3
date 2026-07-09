package services

import (
	"errors"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"mime/multipart"
	"os"

	"golang.org/x/image/draw"
)

const MaxImageSize = 5 * 1024 * 1024 // 5MB

// OptimizeAndSaveImage checks file size, decodes, resizes if too large, and saves it.
func OptimizeAndSaveImage(fileHeader *multipart.FileHeader, savePath string) error {
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

	if width > maxWidth {
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
		// PNG'ler şeffaflığı korumak için yine PNG olarak kaydedilir
		err = png.Encode(out, finalImg)
	} else {
		// Diğerleri (JPEG vs.) kalite kaybı olmadan %90 kalitede sıkıştırılıp kaydedilir
		err = jpeg.Encode(out, finalImg, &jpeg.Options{Quality: 90})
	}

	return err
}
