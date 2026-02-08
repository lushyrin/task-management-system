package main

import (
	"fmt"
	"log"
	"minitask/database"
	"minitask/internal/handler"
	"minitask/internal/models"
	"minitask/internal/repository"
	"minitask/internal/router"
	"minitask/internal/service"
	"os"

	"github.com/labstack/echo/v4"
)

func main() {
	// Initialize database connection
	db := database.InitDB()

	// Auto-migrate the tables
	fmt.Println("Running migrations...")
	err := db.AutoMigrate(&models.User{}, &models.Task{}, &models.Comment{})
	if err != nil {
		panic("Failed to migrate tables: " + err.Error())
	}
	fmt.Println("Tables created/migrated successfully!")

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	taskRepo := repository.NewTaskRepository(db)
	commentRepo := repository.NewCommentRepository(db)

	// Initialize services
	authService := service.NewAuthService(db, userRepo)
	taskService := service.NewTaskService(db, taskRepo)
	commentService := service.NewCommentService(db, commentRepo, taskRepo)

	// For future: services can use repositories
	_ = userRepo // userRepo akan digunakan ketika auth_service direfactor

	// Initialize handlers
	authHandler := handler.NewAuthHandler(authService)
	taskHandler := handler.NewTaskHandler(taskService)
	commentHandler := handler.NewCommentHandler(commentService)

	// Initialize Echo
	e := echo.New()

	// Setup router
	r := router.NewRouter(authHandler, taskHandler, commentHandler)
	r.Setup(e)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start server
	log.Printf("Server starting on port %s", port)
	if err := e.Start(":" + port); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}
