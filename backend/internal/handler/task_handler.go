package handler

import (
	"minitask/internal/models"
	"minitask/internal/service"
	"net/http"

	"github.com/labstack/echo/v4"
)

type TaskHandler struct {
	taskService *service.TaskService
}

func NewTaskHandler(taskService *service.TaskService) *TaskHandler {
	return &TaskHandler{taskService: taskService}
}

// Create handler untuk membuat task baru
func (h *TaskHandler) Create(c echo.Context) error {
	userID := c.Get("user_id").(string)

	var task models.Task
	if err := c.Bind(&task); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	task.UserID = userID

	err := h.taskService.Create(&task)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, task)
}

// GetAll handler untuk mengambil semua task milik user
func (h *TaskHandler) GetAll(c echo.Context) error {
	userID := c.Get("user_id").(string)

	tasks, err := h.taskService.GetAllByUserID(userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, tasks)
}

// GetByID handler untuk mengambil task berdasarkan ID
func (h *TaskHandler) GetByID(c echo.Context) error {
	userID := c.Get("user_id").(string)
	taskID := c.Param("id")

	task, err := h.taskService.GetByID(taskID, userID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, task)
}

// Update handler untuk mengupdate task
func (h *TaskHandler) Update(c echo.Context) error {
	userID := c.Get("user_id").(string)
	taskID := c.Param("id")

	var updates map[string]interface{}
	if err := c.Bind(&updates); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	task, err := h.taskService.Update(taskID, userID, updates)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, task)
}

// Delete handler untuk menghapus task
func (h *TaskHandler) Delete(c echo.Context) error {
	userID := c.Get("user_id").(string)
	taskID := c.Param("id")

	err := h.taskService.Delete(taskID, userID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "task deleted"})
}

// GetStats handler untuk mengambil statistik task
func (h *TaskHandler) GetStats(c echo.Context) error {
	userID := c.Get("user_id").(string)

	stats, err := h.taskService.GetStats(userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, stats)
}

// UpdateOrder handler untuk mengupdate urutan task
type UpdateOrderRequest struct {
	TaskIDs []string `json:"taskIds"`
}

func (h *TaskHandler) UpdateOrder(c echo.Context) error {
	userID := c.Get("user_id").(string)

	var req UpdateOrderRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	err := h.taskService.UpdateOrder(req.TaskIDs, userID)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "order updated"})
}
