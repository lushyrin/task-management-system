package repository

import (
	"minitask/internal/models"

	"gorm.io/gorm"
)

type TaskRepository interface {
	Create(task *models.Task) error
	FindByID(id string) (*models.Task, error)
	FindByIDAndUserID(id, userID string) (*models.Task, error)
	FindAllByUserID(userID string) ([]models.Task, error)
	Update(task *models.Task) error
	UpdateFields(id, userID string, updates map[string]interface{}) error
	UpdateOrder(id, userID string, order int) error
	Delete(id, userID string) error
	CountByUserID(userID string) (int64, error)
	CountByStatus(userID, status string) (int64, error)
}

type taskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) TaskRepository {
	return &taskRepository{db: db}
}

func (r *taskRepository) Create(task *models.Task) error {
	return r.db.Create(task).Error
}

func (r *taskRepository) FindByID(id string) (*models.Task, error) {
	var task models.Task
	err := r.db.Preload("Comments").First(&task, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &task, nil
}

func (r *taskRepository) FindByIDAndUserID(id, userID string) (*models.Task, error) {
	var task models.Task
	err := r.db.Preload("Comments").First(&task, "id = ? AND user_id = ?", id, userID).Error
	if err != nil {
		return nil, err
	}
	return &task, nil
}

func (r *taskRepository) FindAllByUserID(userID string) ([]models.Task, error) {
	var tasks []models.Task
	err := r.db.Where("user_id = ?", userID).Order("\"order\" ASC").Preload("Comments").Find(&tasks).Error
	return tasks, err
}

func (r *taskRepository) Update(task *models.Task) error {
	return r.db.Save(task).Error
}

func (r *taskRepository) UpdateFields(id, userID string, updates map[string]interface{}) error {
	return r.db.Model(&models.Task{}).Where("id = ? AND user_id = ?", id, userID).Updates(updates).Error
}

func (r *taskRepository) UpdateOrder(id, userID string, order int) error {
	return r.db.Model(&models.Task{}).Where("id = ? AND user_id = ?", id, userID).Update("order", order).Error
}

func (r *taskRepository) Delete(id, userID string) error {
	result := r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Task{})
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return result.Error
}

func (r *taskRepository) CountByUserID(userID string) (int64, error) {
	var count int64
	err := r.db.Model(&models.Task{}).Where("user_id = ?", userID).Count(&count).Error
	return count, err
}

func (r *taskRepository) CountByStatus(userID, status string) (int64, error) {
	var count int64
	err := r.db.Model(&models.Task{}).Where("user_id = ? AND status = ?", userID, status).Count(&count).Error
	return count, err
}
