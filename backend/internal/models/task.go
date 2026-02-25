package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

const (
	StatusNotStarted = "not_started"
	StatusInProgress = "in_progress"
	StatusDone       = "done"
)

type Task struct {
	ID          string `gorm:"type:char(36);primary_key" json:"id"`
	Title       string `gorm:"not null" json:"title"`
	Description string `json:"description"`
	Status      string `gorm:"default:'not_started'" json:"status"`
	Order       int    `gorm:"default:0" json:"order"`
	UserID      string `gorm:"type:char(36);not null;index" json:"userId"`
	User        User   `json:"user" gorm:"foreignKey:UserID"`

	WorkspaceID *string    `gorm:"type:char(36);index" json:"workspaceId"`
	Workspace   *Workspace `json:"workspace,omitempty" gorm:"foreignKey:WorkspaceID"`
	AssigneeID  *string    `gorm:"type:char(36);index" json:"assigneeId"`
	Assignee    *User      `json:"assignee,omitempty" gorm:"foreignKey:AssigneeID"`

	Comments  []Comment      `json:"comments,omitempty"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (u *Task) BeforeCreate(tx *gorm.DB) error { // kalo disini fungsi before create itu buat bikin unique uuid
	if u.ID == "" {
		u.ID = uuid.New().String()
	}
	return nil
}

type TaskStats struct {
	Total      int     `json:"total"`
	NotStarted int     `json:"notStarted"`
	InProgress int     `json:"inProgress"`
	Done       int     `json:"done"`
	Percent    float64 `json:"percent"`
}
