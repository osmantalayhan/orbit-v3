package models

type SalesChannel struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	URL       string `json:"url"`
	ImageURL  string `json:"image_url"`
	SortOrder int    `json:"sort_order"`
	Active    bool   `json:"active"`
}
