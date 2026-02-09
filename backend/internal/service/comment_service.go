package service

import (
	"errors"
	"minitask/internal/models"
	"minitask/internal/repository"

	"gorm.io/gorm"
)

type CommentService struct {
	db          *gorm.DB
	commentRepo repository.CommentRepository
	taskRepo    repository.TaskRepository
}

func NewCommentService(db *gorm.DB, commentRepo repository.CommentRepository, taskRepo repository.TaskRepository) *CommentService {
	return &CommentService{
		db:          db,
		commentRepo: commentRepo,
		taskRepo:    taskRepo,
	}
}

type CreateCommentRequest struct {
	Content string `json:"content"`
	TaskID  string `json:"taskId"`
}

type UpdateCommentRequest struct {
	Content string `json:"content"`
}

func (s *CommentService) Create(req *CreateCommentRequest, userID string) (*models.Comment, error) {
	if req.Content == "" {
		return nil, errors.New("content cannot be empty")
	}
	if req.TaskID == "" {
		return nil, errors.New("task ID is required")
	}

	// Verify task exists
	_, err := s.taskRepo.FindByID(req.TaskID)
	if err != nil {
		return nil, errors.New("task not found")
	}

	comment := &models.Comment{
		Content: req.Content,
		TaskID:  req.TaskID,
		UserID:  userID,
	}

	err = s.commentRepo.Create(comment)
	if err != nil {
		return nil, errors.New("failed to create comment")
	}
	return comment, nil
}

func (s *CommentService) GetAllByTaskID(taskID string) ([]models.Comment, error) {
	return s.commentRepo.FindAllByTaskID(taskID)
}

func (s *CommentService) GetByID(id string) (*models.Comment, error) {
	comment, err := s.commentRepo.FindByID(id)
	if err != nil {
		return nil, errors.New("comment not found")
	}
	return comment, nil
}

func (s *CommentService) Update(id string, userID string, req *UpdateCommentRequest) (*models.Comment, error) {
	if req.Content == "" {
		return nil, errors.New("content cannot be empty")
	}

	comment, err := s.commentRepo.FindByIDAndUserID(id, userID)
	if err != nil {
		return nil, errors.New("comment not found or not authorized")
	}

	comment.Content = req.Content
	err = s.commentRepo.Update(comment)
	if err != nil {
		return nil, errors.New("failed to update comment")
	}

	return comment, nil
}

// Delete removes a comment (only owner can delete)
func (s *CommentService) Delete(id string, userID string) error {
	err := s.commentRepo.Delete(id, userID)
	if err != nil {
		return errors.New("comment not found or not authorized")
	}
	return nil
}
