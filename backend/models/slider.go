package models

type HomeSlider struct {
	ID         int    `json:"id"`
	ProductID  string `json:"product_id,omitempty"` // Foreign key, null olabilir
	ModelCode  string `json:"model_code"`           // 3D Spline model kodu
	SlideTitle string `json:"slide_title"`
	SlideDesc  string `json:"slide_desc"`
	ImageURL   string `json:"image_url"`
	SortOrder  int    `json:"sort_order"`
	Active     bool   `json:"active"`
}
