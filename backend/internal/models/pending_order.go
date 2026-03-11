package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PendingOrder struct {
	ID        string         `gorm:"type:char(36);primary_key" json:"id"`
	OrderID   string         `gorm:"uniqueIndex;not null" json:"orderId"`
	UserID    string         `gorm:"type:char(36);not null;index" json:"userId"`
	Plan      string         `gorm:"not null" json:"plan"`
	Amount    int            `gorm:"not null" json:"amount"`
	Status    string         `gorm:"default:'pending'" json:"status"`
	ExpiresAt time.Time      `json:"expiresAt"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (p *PendingOrder) BeforeCreate(tx *gorm.DB) error {
	if p.ID == "" {
		p.ID = uuid.New().String()
	}
	return nil
}
