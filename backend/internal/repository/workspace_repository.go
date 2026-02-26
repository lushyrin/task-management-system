package repository

import (
	"minitask/internal/models"

	"gorm.io/gorm"
)

type WorkspaceRepository interface {
	Create(workspace *models.Workspace) error
	FindByID(id string) (*models.Workspace, error)
	FindByOwnerID(ownerID string) ([]models.Workspace, error)
	FindByMemberUserID(userID string) ([]models.Workspace, error)
	Update(workspace *models.Workspace) error
	Delete(id, ownerID string) error

	AddMember(member *models.WorkspaceMember) error
	FindMember(workspaceID, userID string) (*models.WorkspaceMember, error)
	FindAllMembers(workspaceID string) ([]models.WorkspaceMember, error)
	RemoveMember(workspaceID, userID string) error
	IsMember(workspaceID, userID string) (bool, error)

	FindByInviteCode(code string) (*models.Workspace, error)
	UpdateInviteCode(id, newCode string) error
}

type workspaceRepository struct {
	db *gorm.DB
}

func NewWorkspaceRepository(db *gorm.DB) WorkspaceRepository {
	return &workspaceRepository{db: db}
}

func (r *workspaceRepository) Create(workspace *models.Workspace) error {
	err := r.db.Create(workspace).Error
	if err != nil {
		return err
	}
	return r.db.Preload("Owner").Preload("Members.User").First(workspace, "id = ?", workspace.ID).Error
}

func (r *workspaceRepository) FindByID(id string) (*models.Workspace, error) {
	var workspace models.Workspace
	err := r.db.
		Preload("Owner").
		Preload("Members", func(db *gorm.DB) *gorm.DB {
			return db.Where("deleted_at IS NULL")
		}).
		Preload("Members.User").
		First(&workspace, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &workspace, nil
}

func (r *workspaceRepository) FindByOwnerID(ownerID string) ([]models.Workspace, error) {
	var workspaces []models.Workspace
	err := r.db.
		Preload("Owner").
		Where("owner_id = ?", ownerID).
		Find(&workspaces).Error
	return workspaces, err
}

func (r *workspaceRepository) FindByMemberUserID(userID string) ([]models.Workspace, error) {
	var workspaces []models.Workspace
	err := r.db.
		Preload("Owner").
		Preload("Members", func(db *gorm.DB) *gorm.DB {
			return db.Where("deleted_at IS NULL")
		}).
		Preload("Members.User").
		Joins("JOIN workspace_members wm ON wm.workspace_id = workspaces.id AND wm.deleted_at IS NULL").
		Where("wm.user_id = ?", userID).
		Find(&workspaces).Error
	return workspaces, err
}

func (r *workspaceRepository) Update(workspace *models.Workspace) error {
	return r.db.Save(workspace).Error
}

func (r *workspaceRepository) Delete(id, ownerID string) error {
	result := r.db.Where("id = ? AND owner_id = ?", id, ownerID).Delete(&models.Workspace{})
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return result.Error
}

func (r *workspaceRepository) AddMember(member *models.WorkspaceMember) error {
	err := r.db.Create(member).Error
	if err != nil {
		return err
	}
	return r.db.Preload("User").First(member, "id = ?", member.ID).Error
}

func (r *workspaceRepository) FindMember(workspaceID, userID string) (*models.WorkspaceMember, error) {
	var member models.WorkspaceMember
	err := r.db.Preload("User").
		Where("workspace_id = ? AND user_id = ?", workspaceID, userID).
		First(&member).Error
	if err != nil {
		return nil, err
	}
	return &member, nil
}

func (r *workspaceRepository) FindAllMembers(workspaceID string) ([]models.WorkspaceMember, error) {
	var members []models.WorkspaceMember
	err := r.db.Preload("User").
		Where("workspace_id = ?", workspaceID).
		Find(&members).Error
	return members, err
}

func (r *workspaceRepository) RemoveMember(workspaceID, userID string) error {
	result := r.db.
		Where("workspace_id = ? AND user_id = ?", workspaceID, userID).
		Delete(&models.WorkspaceMember{})
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return result.Error
}

func (r *workspaceRepository) IsMember(workspaceID, userID string) (bool, error) {
	var count int64
	err := r.db.Model(&models.WorkspaceMember{}).
		Where("workspace_id = ? AND user_id = ?", workspaceID, userID).
		Count(&count).Error
	return count > 0, err
}

func (r *workspaceRepository) FindByInviteCode(code string) (*models.Workspace, error) {
	var workspace models.Workspace
	err := r.db.Preload("Owner").Where("invite_code = ?", code).First(&workspace).Error
	if err != nil {
		return nil, err
	}
	return &workspace, nil
}

func (r *workspaceRepository) UpdateInviteCode(id, newCode string) error {
	return r.db.Model(&models.Workspace{}).Where("id = ?", id).Update("invite_code", newCode).Error
}
