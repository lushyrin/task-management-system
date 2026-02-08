package router

import (
	"minitask/internal/handler"
	"minitask/internal/middleware"

	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
)

type Router struct {
	authHandler    *handler.AuthHandler
	taskHandler    *handler.TaskHandler
	commentHandler *handler.CommentHandler
}

func NewRouter(authHandler *handler.AuthHandler, taskHandler *handler.TaskHandler, commentHandler *handler.CommentHandler) *Router {
	return &Router{
		authHandler:    authHandler,
		taskHandler:    taskHandler,
		commentHandler: commentHandler,
	}
}

func (r *Router) Setup(e *echo.Echo) {
	// Middleware
	e.Use(echoMiddleware.Logger())
	e.Use(echoMiddleware.Recover())
	e.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.PATCH, echo.DELETE, echo.OPTIONS},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	// API version group
	api := e.Group("/api/v1")

	// Public routes (no auth required)
	auth := api.Group("/auth")
	auth.POST("/register", r.authHandler.Register)
	auth.POST("/login", r.authHandler.Login)

	// Protected routes (auth required)
	protected := api.Group("")
	protected.Use(middleware.JWTMiddleware)

	// User routes
	protected.GET("/profile", r.authHandler.GetProfile)

	// Task routes
	tasks := protected.Group("/tasks")
	tasks.POST("", r.taskHandler.Create)
	tasks.GET("", r.taskHandler.GetAll)
	tasks.GET("/stats", r.taskHandler.GetStats)
	tasks.GET("/:id", r.taskHandler.GetByID)
	tasks.PUT("/:id", r.taskHandler.Update)
	tasks.DELETE("/:id", r.taskHandler.Delete)
	tasks.PUT("/order", r.taskHandler.UpdateOrder)

	// Comment routes
	comments := protected.Group("/comments")
	comments.POST("", r.commentHandler.Create)
	comments.GET("/task/:taskId", r.commentHandler.GetByTaskID)
	comments.GET("/:id", r.commentHandler.GetByID)
	comments.PUT("/:id", r.commentHandler.Update)
	comments.DELETE("/:id", r.commentHandler.Delete)

	// Health check (public)
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"status": "ok"})
	})
}
