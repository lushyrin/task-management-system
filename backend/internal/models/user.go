package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        string         `gorm:"type:char(36);primary_key" json:"id"`
	Username  string         `gorm:"uniqueIndex;not null" json:"username"`
	Email     string         `gorm:"uniqueIndex;not null" json:"email"`
	Password  string         `gorm:"not null" json:"-"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	Tasks     []Task         `json:"tasks,omitempty"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error { // kalo disini fungsi before create itu buat bikin unique uuid
	if u.ID == "" {
		u.ID = uuid.New().String()
	}
	return nil
}
