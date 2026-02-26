package router

import (
	"minitask/internal/handler"
	"minitask/internal/middleware"

	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
)

type Router struct {
	authHandler      *handler.AuthHandler
	taskHandler      *handler.TaskHandler
	commentHandler   *handler.CommentHandler
	workspaceHandler *handler.WorkspaceHandler
}

func NewRouter(
	authHandler *handler.AuthHandler,
	taskHandler *handler.TaskHandler,
	commentHandler *handler.CommentHandler,
	workspaceHandler *handler.WorkspaceHandler,
) *Router {
	return &Router{
		authHandler:      authHandler,
		taskHandler:      taskHandler,
		commentHandler:   commentHandler,
		workspaceHandler: workspaceHandler,
	}
}

func (r *Router) Setup(e *echo.Echo) {
	e.Use(echoMiddleware.Logger())
	e.Use(echoMiddleware.Recover())
	e.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.PATCH, echo.DELETE, echo.OPTIONS},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	api := e.Group("/api/v1")

	auth := api.Group("/auth")
	auth.POST("/register", r.authHandler.Register)
	auth.POST("/login", r.authHandler.Login)

	protected := api.Group("")
	protected.Use(middleware.JWTMiddleware)

	protected.GET("/profile", r.authHandler.GetProfile)

	tasks := protected.Group("/tasks")
	tasks.POST("", r.taskHandler.Create)
	tasks.GET("", r.taskHandler.GetAll)
	tasks.GET("/stats", r.taskHandler.GetStats)
	tasks.GET("/:id", r.taskHandler.GetByID)
	tasks.PUT("/:id", r.taskHandler.Update)
	tasks.DELETE("/:id", r.taskHandler.Delete)
	tasks.PUT("/order", r.taskHandler.UpdateOrder)

	comments := protected.Group("/comments")
	comments.POST("", r.commentHandler.Create)
	comments.GET("/task/:taskId", r.commentHandler.GetByTaskID)
	comments.GET("/:id", r.commentHandler.GetByID)
	comments.PUT("/:id", r.commentHandler.Update)
	comments.DELETE("/:id", r.commentHandler.Delete)

	// Workspaces
	workspaces := protected.Group("/workspaces")
	workspaces.POST("", r.workspaceHandler.Create)
	workspaces.GET("", r.workspaceHandler.GetAll)
	workspaces.POST("/join", r.workspaceHandler.Join)

	workspaces.GET("/:id", r.workspaceHandler.GetByID)
	workspaces.PUT("/:id", r.workspaceHandler.Update)
	workspaces.DELETE("/:id", r.workspaceHandler.Delete)

	workspaces.POST("/:id/invite/refresh", r.workspaceHandler.RefreshInviteCode)
	workspaces.DELETE("/:id/members/:userId", r.workspaceHandler.RemoveMember)

	workspaces.GET("/:id/tasks", r.workspaceHandler.GetTasks)
	workspaces.POST("/:id/tasks", r.workspaceHandler.CreateTask)
	workspaces.PUT("/:id/tasks/:taskId/assign", r.workspaceHandler.AssignTask)

	// Health check
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"status": "ok"})
	})
}
