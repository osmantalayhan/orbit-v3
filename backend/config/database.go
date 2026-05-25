package config

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

// DB, tüm modüller tarafından ortaklaşa kullanılacak global veri tabanı bağlantı havuzudur
var DB *pgxpool.Pool

// ConnectDatabase veri tabanı bağlantısını başlatır ve havuza kaydeder
func ConnectDatabase() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL environment variable is not set inside .env file")
	}

	config, err := pgxpool.ParseConfig(dbURL)
	if err != nil {
		log.Fatalf("Unable to parse database URL: %v", err)
	}

	// Bağlantı havuzunu oluştur
	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatalf("Unable to create database pool: %v", err)
	}

	// Bağlantıyı doğrula (Ping at)
	err = pool.Ping(context.Background())
	if err != nil {
		log.Fatalf("Database connection ping failed: %v", err)
	}

	DB = pool
	log.Println("Successfully connected to PostgreSQL database connection pool!")
}
