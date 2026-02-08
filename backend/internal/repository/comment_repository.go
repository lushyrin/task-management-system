package repository

import (
	"minitask/internal/models"

	"gorm.io/gorm"
)

type CommentRepository interface {
	Create(comment *models.Comment) error
	FindByID(id string) (*models.Comment, error)
	FindByIDAndUserID(id, userID string) (*models.Comment, error)
	FindAllByTaskID(taskID string) ([]models.Comment, error)
	Update(comment *models.Comment) error
	Delete(id, userID string) error
}

type commentRepository struct {
	db *gorm.DB
}

func NewCommentRepository(db *gorm.DB) CommentRepository {
	return &commentRepository{db: db}
}

func (r *commentRepository) Create(comment *models.Comment) error {
	return r.db.Create(comment).Error
}

func (r *commentRepository) FindByID(id string) (*models.Comment, error) {
	var comment models.Comment
	err := r.db.Preload("User").First(&comment, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &comment, nil
}

func (r *commentRepository) FindByIDAndUserID(id, userID string) (*models.Comment, error) {
	var comment models.Comment
	err := r.db.First(&comment, "id = ? AND user_id = ?", id, userID).Error
	if err != nil {
		return nil, err
	}
	return &comment, nil
}

func (r *commentRepository) FindAllByTaskID(taskID string) ([]models.Comment, error) {
	var comments []models.Comment
	err := r.db.Where("task_id = ?", taskID).Preload("User").Order("created_at ASC").Find(&comments).Error
	return comments, err
}

func (r *commentRepository) Update(comment *models.Comment) error {
	return r.db.Save(comment).Error
}

func (r *commentRepository) Delete(id, userID string) error {
	result := r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Comment{})
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return result.Error
}
