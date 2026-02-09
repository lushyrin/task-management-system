package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type Comment struct {
	ID        string         `gorm:"type:char(36);primary_key" json:"id"`
	Content   string         `gorm:"not null" json:"content"`
	TaskID    string         `gorm:"type:char(36);not null;index" json:"taskId"`
	Task      Task           `json:"-"`
	UserID    string         `gorm:"type:char(36);not null" json:"userId"`
	User      User           `json:"user,omitempty"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (u *Comment) BeforeCreate(tx *gorm.DB) error { // kalo disini fungsi beforecreate itu buat bikin unique uuid
	if u.ID == "" {
		u.ID = uuid.New().String()
	}
	return nil
}
