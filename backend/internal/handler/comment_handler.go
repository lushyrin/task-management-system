package handler

import (
	"minitask/internal/service"
	"net/http"

	"github.com/labstack/echo/v4"
)

type CommentHandler struct {
	commentService *service.CommentService
}

func NewCommentHandler(commentService *service.CommentService) *CommentHandler {
	return &CommentHandler{commentService: commentService}
}

// Create handler untuk membuat comment baru pada task
func (h *CommentHandler) Create(c echo.Context) error {
	userID := c.Get("user_id").(string)

	var req service.CreateCommentRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	comment, err := h.commentService.Create(&req, userID)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, comment)
}

// GetByTaskID handler untuk mengambil semua comment dari suatu task
func (h *CommentHandler) GetByTaskID(c echo.Context) error {
	taskID := c.Param("taskId")

	comments, err := h.commentService.GetAllByTaskID(taskID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, comments)
}

// GetByID handler untuk mengambil comment berdasarkan ID
func (h *CommentHandler) GetByID(c echo.Context) error {
	commentID := c.Param("id")

	comment, err := h.commentService.GetByID(commentID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, comment)
}

// Update handler untuk mengupdate comment (hanya pemilik yang bisa update)
func (h *CommentHandler) Update(c echo.Context) error {
	userID := c.Get("user_id").(string)
	commentID := c.Param("id")

	var req service.UpdateCommentRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	comment, err := h.commentService.Update(commentID, userID, &req)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, comment)
}

// Delete handler untuk menghapus comment (cmn pemilik yang bisa hapus)
func (h *CommentHandler) Delete(c echo.Context) error {
	userID := c.Get("user_id").(string)
	commentID := c.Param("id")

	err := h.commentService.Delete(commentID, userID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "comment deleted"})
}
