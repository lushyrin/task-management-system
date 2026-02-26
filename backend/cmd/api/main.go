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
	db := database.InitDB()

	fmt.Println("Running migrations...")
	err := db.AutoMigrate(
		&models.User{},
		&models.Task{},
		&models.Comment{},
		&models.Workspace{},
		&models.WorkspaceMember{},
	)
	if err != nil {
		panic("Failed to migrate tables: " + err.Error())
	}
	fmt.Println("Tables created/migrated successfully!")

	// Repositories
	userRepo := repository.NewUserRepository(db)
	taskRepo := repository.NewTaskRepository(db)
	commentRepo := repository.NewCommentRepository(db)
	workspaceRepo := repository.NewWorkspaceRepository(db)

	// Services
	authService := service.NewAuthService(db, userRepo)
	taskService := service.NewTaskService(db, taskRepo)
	commentService := service.NewCommentService(db, commentRepo, taskRepo)
	workspaceService := service.NewWorkspaceService(db, workspaceRepo, taskRepo, userRepo)

	// Handlers
	authHandler := handler.NewAuthHandler(authService)
	taskHandler := handler.NewTaskHandler(taskService)
	commentHandler := handler.NewCommentHandler(commentService)
	workspaceHandler := handler.NewWorkspaceHandler(workspaceService)

	e := echo.New()

	r := router.NewRouter(authHandler, taskHandler, commentHandler, workspaceHandler)
	r.Setup(e)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := e.Start(":" + port); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}
