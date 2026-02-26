package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

const (
	RoleOwner  = "owner"
	RoleMember = "member"
)

type Workspace struct {
	ID            string            `gorm:"type:char(36);primary_key" json:"id"`
	Name          string            `gorm:"not null" json:"name"`
	Description   string            `json:"description"`
	OwnerID       string            `gorm:"type:char(36);not null;index" json:"ownerId"`
	Owner         User              `json:"owner" gorm:"foreignKey:OwnerID"`
	InviteCode    string            `gorm:"uniqueIndex;not null" json:"inviteCode"`
	InviteExpires *time.Time        `json:"inviteExpiresAt"`
	Members       []WorkspaceMember `json:"members,omitempty" gorm:"foreignKey:WorkspaceID"`
	Tasks         []Task            `json:"tasks,omitempty" gorm:"foreignKey:WorkspaceID"`
	CreatedAt     time.Time         `json:"ceatedAt"`
	UpdatedAt     time.Time         `json:"updatedAt"`
	DeletedAt     gorm.DeletedAt    `gorm:"index" json:"-"`
}

type WorkspaceMember struct {
	ID          string         `gorm:"type:char(36);primary_key" json:"id"`
	WorkspaceID string         `gorm:"type:char(36);not null;index" json:"workspaceId"`
	UserID      string         `gorm:"type:char(36);not null;index" json:"userId"`
	User        User           `json:"user" gorm:"foreignKey:UserID"`
	Role        string         `gorm:"default:'member'" json:"role"`
	JoinedAt    time.Time      `json:"joinedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

func (w *Workspace) BeforeCreate(tx *gorm.DB) error {
	if w.ID == "" {
		w.ID = uuid.New().String()
	}
	if w.InviteCode == "" {
		w.InviteCode = GenerateInviteCode()
	}
	return nil
}

func GenerateInviteCode() string {
	// Uses uuid but takes only first 8 chars
	id := uuid.New().String()
	code := ""
	for _, c := range id {
		if c != '-' {
			code += string(c)
		}
		if len(code) == 8 {
			break
		}
	}
	// uppercase
	result := ""
	for _, c := range code {
		if c >= 'a' && c <= 'z' {
			result += string(c - 32)
		} else {
			result += string(c)
		}
	}
	return result
}
