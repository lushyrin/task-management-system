package handler

import (
	"log"
	"minitask/internal/service"
	"net/http"

	"github.com/labstack/echo/v4"
)

type WorkspaceHandler struct {
	workspaceService *service.WorkspaceService
}

func NewWorkspaceHandler(workspaceService *service.WorkspaceService) *WorkspaceHandler {
	return &WorkspaceHandler{workspaceService: workspaceService}
}

// Create handler untuk membuat workspace baru
func (h *WorkspaceHandler) Create(c echo.Context) error {
	userID := c.Get("user_id").(string)

	var req service.CreateWorkspaceRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	workspace, err := h.workspaceService.Create(&req, userID)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, workspace)
}

// GetAll handler untuk mengambil semua workspace user (sidebar data)
func (h *WorkspaceHandler) GetAll(c echo.Context) error {
	userID := c.Get("user_id").(string)

	workspaces, err := h.workspaceService.GetAllForUser(userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, workspaces)
}

// GetByID handler untuk mengambil detail workspace
func (h *WorkspaceHandler) GetByID(c echo.Context) error {
	userID := c.Get("user_id").(string)
	workspaceID := c.Param("id")

	workspace, err := h.workspaceService.GetByID(workspaceID, userID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, workspace)
}

// Update handler untuk update workspace (owner only)
func (h *WorkspaceHandler) Update(c echo.Context) error {
	userID := c.Get("user_id").(string)
	workspaceID := c.Param("id")

	var req service.UpdateWorkspaceRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	workspace, err := h.workspaceService.Update(workspaceID, userID, &req)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, workspace)
}

// Delete handler untuk hapus workspace (owner only)
func (h *WorkspaceHandler) Delete(c echo.Context) error {
	userID := c.Get("user_id").(string)
	workspaceID := c.Param("id")

	err := h.workspaceService.Delete(workspaceID, userID)
	if err != nil {
		return c.JSON(http.StatusForbidden, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "workspace deleted"})
}

// Join handler untuk join workspace via invite code
func (h *WorkspaceHandler) Join(c echo.Context) error {
	userID := c.Get("user_id").(string)

	var req service.JoinWorkspaceRequest
	if err := c.Bind(&req); err != nil {
		log.Printf("Bind error: %v, Content-Type: %s", err, c.Request().Header.Get("Content-Type"))
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request: " + err.Error()})
	}

	if req.InviteCode == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invite code is required"})
	}

	workspace, err := h.workspaceService.JoinByInviteCode(&req, userID)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, workspace)
}

// RemoveMember handler untuk kick member dari workspace (owner only)
func (h *WorkspaceHandler) RemoveMember(c echo.Context) error {
	ownerID := c.Get("user_id").(string)
	workspaceID := c.Param("id")
	targetUserID := c.Param("userId")

	err := h.workspaceService.RemoveMember(workspaceID, ownerID, targetUserID)
	if err != nil {
		return c.JSON(http.StatusForbidden, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "member removed"})
}

// RefreshInviteCode handler untuk generate invite code baru (owner only)
func (h *WorkspaceHandler) RefreshInviteCode(c echo.Context) error {
	ownerID := c.Get("user_id").(string)
	workspaceID := c.Param("id")

	newCode, err := h.workspaceService.RefreshInviteCode(workspaceID, ownerID)
	if err != nil {
		return c.JSON(http.StatusForbidden, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"inviteCode": newCode})
}

// GetTasks handler untuk ambil semua task di workspace
func (h *WorkspaceHandler) GetTasks(c echo.Context) error {
	userID := c.Get("user_id").(string)
	workspaceID := c.Param("id")

	tasks, err := h.workspaceService.GetTasks(workspaceID, userID)
	if err != nil {
		return c.JSON(http.StatusForbidden, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, tasks)
}

// CreateTask handler untuk bikin task di dalam workspace
func (h *WorkspaceHandler) CreateTask(c echo.Context) error {
	userID := c.Get("user_id").(string)
	workspaceID := c.Param("id")

	var req service.CreateWorkspaceTaskRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	task, err := h.workspaceService.CreateTask(workspaceID, userID, &req)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, task)
}

// AssignTask handler untuk assign task ke member (owner only)
func (h *WorkspaceHandler) AssignTask(c echo.Context) error {
	ownerID := c.Get("user_id").(string)
	workspaceID := c.Param("id")
	taskID := c.Param("taskId")

	var req service.AssignTaskRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	task, err := h.workspaceService.AssignTask(workspaceID, taskID, ownerID, &req)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, task)
}
