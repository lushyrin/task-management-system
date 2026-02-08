package service

import (
	"errors"
	"sync"

	"minitask/internal/models"
	"minitask/internal/repository"

	"gorm.io/gorm"
)

type TaskService struct {
	db       *gorm.DB
	taskRepo repository.TaskRepository
}

func NewTaskService(db *gorm.DB, taskRepo repository.TaskRepository) *TaskService { // bikin instance task services baru
	return &TaskService{db: db, taskRepo: taskRepo}
}

func (s *TaskService) Create(task *models.Task) error {
	if task.Title == "" {
		return errors.New("Title cannot be empty")
	}
	if task.UserID == "" {
		return errors.New("please login first") //safety doang barangkali nanti app nya bisa kepake tanpa login
	}
	if task.Status == "" {
		task.Status = models.StatusNotStarted // ini auto jadi kalo misal bikin task baru, pasti masuk ke notstarted
	}
	return s.db.Create(task).Error
}

// getByID ini buat ambil task berdasarkan ID
func (s *TaskService) GetByID(id string, userID string) (*models.Task, error) {
	var task models.Task
	err := s.db.Preload("Comments").First(&task, "id = ? AND user_id = ?", id, userID).Error
	if err != nil {
		return nil, errors.New("task not found!")
	}
	return &task, nil
}

// GetAllByUserID mengambil semua task milik user
func (s *TaskService) GetAllByUserID(userID string) ([]models.Task, error) {
	var tasks []models.Task
	err := s.db.Where("user_id = ?", userID).Order("\"order\" ASC").Preload("Comments").Find(&tasks).Error
	return tasks, err
}

// Update task yang udah ada
func (s *TaskService) Update(id string, userID string, updates map[string]interface{}) (*models.Task, error) {
	var task models.Task
	err := s.db.First(&task, "id = ? AND user_id = ?", id, userID).Error
	if err != nil {
		return nil, errors.New("task not found!")
	}

	if status, ok := updates["status"].(string); ok {
		if status != models.StatusNotStarted && status != models.StatusInProgress && status != models.StatusDone {
			return nil, errors.New("invalid Status")
		}
	}

	err = s.db.Model(&task).Updates(updates).Error //✋✊✋✊✋✊
	if err != nil {
		return nil, err
	}
	return &task, nil
}

func (s *TaskService) Delete(id string, userID string) error {
	result := s.db.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Task{})
	if result.RowsAffected == 0 {
		return errors.New("Task not found")
	}
	return result.Error
}

func (s *TaskService) GetStats(userID string) (models.TaskStats, error) {
	var stats models.TaskStats
	var wg sync.WaitGroup
	var mu sync.Mutex

	// Use goroutines for concurrent counting
	type countResult struct {
		countType string
		value     int64
	}

	resultChan := make(chan countResult, 4)

	// Count total tasks concurrently
	wg.Add(4)

	go func() {
		defer wg.Done()
		var count int64
		s.db.Model(&models.Task{}).Where("user_id = ?", userID).Count(&count)
		resultChan <- countResult{"total", count}
	}()

	go func() {
		defer wg.Done()
		var count int64
		s.db.Model(&models.Task{}).Where("user_id = ? AND status = ?", userID, models.StatusNotStarted).Count(&count)
		resultChan <- countResult{"notStarted", count}
	}()

	go func() {
		defer wg.Done()
		var count int64
		s.db.Model(&models.Task{}).Where("user_id = ? AND status = ?", userID, models.StatusInProgress).Count(&count)
		resultChan <- countResult{"inProgress", count}
	}()

	go func() {
		defer wg.Done()
		var count int64
		s.db.Model(&models.Task{}).Where("user_id = ? AND status = ?", userID, models.StatusDone).Count(&count)
		resultChan <- countResult{"done", count}
	}()

	// Wait for all goroutines to complete
	go func() {
		wg.Wait()
		close(resultChan)
	}()

	// Collect results from channel
	for result := range resultChan {
		mu.Lock()
		switch result.countType {
		case "total":
			stats.Total = int(result.value)
		case "notStarted":
			stats.NotStarted = int(result.value)
		case "inProgress":
			stats.InProgress = int(result.value)
		case "done":
			stats.Done = int(result.value)
		}
		mu.Unlock()
	}

	if stats.Total > 0 {
		stats.Percent = float64(stats.Done) / float64(stats.Total)
	}

	return stats, nil
}

func (s *TaskService) UpdateOrder(taskIDs []string, userID string) error {
	// Use goroutines with error channel for concurrent order updates
	errChan := make(chan error, len(taskIDs))
	var wg sync.WaitGroup

	for i, id := range taskIDs {
		wg.Add(1)
		go func(taskID string, order int) {
			defer wg.Done()
			err := s.db.Model(&models.Task{}).Where("id = ? AND user_id = ?", taskID, userID).Update("order", order).Error
			if err != nil {
				errChan <- err
			}
		}(id, i)
	}

	// Wait for all updates to complete
	go func() {
		wg.Wait()
		close(errChan)
	}()

	// Check for any errors
	for err := range errChan {
		if err != nil {
			return err
		}
	}
	return nil
}
