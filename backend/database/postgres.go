package database

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDB() *gorm.DB { // buat load env
	envPaths := []string{".env", "../.env", "../../.env", "./backend/.env"} // sempat ganti file location
	loaded := false
	for _, path := range envPaths {
		if err := godotenv.Load(path); err == nil {
			log.Printf("Loaded .env from: %s", path)
			loaded = true
			break
		}
	}
	if !loaded {
		log.Println("Warning: Could not load .env file from any path")
	}

	// DSN stands for Data Source Name
	password := os.Getenv("DB_PASSWORD")
	var dsn string
	if password != "" {
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
			os.Getenv("DB_HOST"),
			os.Getenv("DB_USER"),
			password,
			os.Getenv("DB_NAME"),
			os.Getenv("DB_PORT"),
			os.Getenv("DB_SSLMODE"),
		)
	} else {
		dsn = fmt.Sprintf("host=%s user=%s dbname=%s port=%s sslmode=%s",
			os.Getenv("DB_HOST"),
			os.Getenv("DB_USER"),
			os.Getenv("DB_NAME"),
			os.Getenv("DB_PORT"),
			os.Getenv("DB_SSLMODE"),
		)
	}

	fmt.Printf("Connecting with DSN: host=%s user=%s dbname=%s port=%s\n",
		os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_NAME"), os.Getenv("DB_PORT"))

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("FAILED TO CONNECT DATABASE HELP HELP HELP")
	}

	fmt.Println("Database connected successfully")
	return db
}
