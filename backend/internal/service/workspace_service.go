package service

import (
	"errors"
	"minitask/internal/models"
	"minitask/internal/repository"
	"time"

	"gorm.io/gorm"
)

type WorkspaceService struct {
	db            *gorm.DB
	workspaceRepo repository.WorkspaceRepository
	taskRepo      repository.TaskRepository
	userRepo      repository.UserRepository
}

func NewWorkspaceService(
	db *gorm.DB,
	workspaceRepo repository.WorkspaceRepository,
	taskRepo repository.TaskRepository,
	userRepo repository.UserRepository,
) *WorkspaceService {
	return &WorkspaceService{
		db:            db,
		workspaceRepo: workspaceRepo,
		taskRepo:      taskRepo,
		userRepo:      userRepo,
	}
}

type CreateWorkspaceRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type UpdateWorkspaceRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type JoinWorkspaceRequest struct {
	InviteCode string `json:"inviteCode"`
}

type CreateWorkspaceTaskRequest struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	AssigneeID  *string `json:"assigneeId"` // optional
}

type AssignTaskRequest struct {
	AssigneeID *string `json:"assigneeId"` // null to unassign
}

func (s *WorkspaceService) Create(req *CreateWorkspaceRequest, ownerID string) (*models.Workspace, error) {
	if req.Name == "" {
		return nil, errors.New("workspace name is required")
	}

	workspace := &models.Workspace{
		Name:        req.Name,
		Description: req.Description,
		OwnerID:     ownerID,
	}

	err := s.workspaceRepo.Create(workspace)
	if err != nil {
		return nil, errors.New("failed to create workspace")
	}

	// Auto-add owner as a member with owner role
	member := &models.WorkspaceMember{
		WorkspaceID: workspace.ID,
		UserID:      ownerID,
		Role:        models.RoleOwner,
	}
	err = s.workspaceRepo.AddMember(member)
	if err != nil {
		return nil, errors.New("failed to assign owner role")
	}

	return s.workspaceRepo.FindByID(workspace.ID)
}

func (s *WorkspaceService) GetByID(id, userID string) (*models.Workspace, error) {
	isMember, err := s.workspaceRepo.IsMember(id, userID)
	if err != nil || !isMember {
		return nil, errors.New("workspace not found or access denied")
	}

	workspace, err := s.workspaceRepo.FindByID(id)
	if err != nil {
		return nil, errors.New("workspace not found")
	}
	return workspace, nil
}

func (s *WorkspaceService) GetAllForUser(userID string) ([]models.Workspace, error) {
	return s.workspaceRepo.FindByMemberUserID(userID)
}

func (s *WorkspaceService) Update(id, ownerID string, req *UpdateWorkspaceRequest) (*models.Workspace, error) {
	workspace, err := s.workspaceRepo.FindByID(id)
	if err != nil || workspace.OwnerID != ownerID {
		return nil, errors.New("workspace not found or not authorized")
	}

	if req.Name != "" {
		workspace.Name = req.Name
	}
	workspace.Description = req.Description

	err = s.workspaceRepo.Update(workspace)
	if err != nil {
		return nil, errors.New("failed to update workspace")
	}
	return workspace, nil
}

func (s *WorkspaceService) Delete(id, ownerID string) error {
	err := s.workspaceRepo.Delete(id, ownerID)
	if err != nil {
		return errors.New("workspace not found or not authorized")
	}
	return nil
}

func (s *WorkspaceService) JoinByInviteCode(req *JoinWorkspaceRequest, userID string) (*models.Workspace, error) {
	if req.InviteCode == "" {
		return nil, errors.New("invite code is required")
	}

	workspace, err := s.workspaceRepo.FindByInviteCode(req.InviteCode)
	if err != nil {
		return nil, errors.New("invalid invite code")
	}

	if workspace.InviteExpires != nil && time.Now().After(*workspace.InviteExpires) {
		return nil, errors.New("invite code has expired")
	}

	isMember, _ := s.workspaceRepo.IsMember(workspace.ID, userID)
	if isMember {
		return nil, errors.New("you are already a member of this workspace")
	}

	member := &models.WorkspaceMember{
		WorkspaceID: workspace.ID,
		UserID:      userID,
		Role:        models.RoleMember,
	}
	err = s.workspaceRepo.AddMember(member)
	if err != nil {
		return nil, errors.New("failed to join workspace")
	}

	return s.workspaceRepo.FindByID(workspace.ID)
}

func (s *WorkspaceService) RemoveMember(workspaceID, ownerID, targetUserID string) error {
	workspace, err := s.workspaceRepo.FindByID(workspaceID)
	if err != nil {
		return errors.New("workspace not found")
	}

	if workspace.OwnerID != ownerID {
		return errors.New("only the owner can remove members")
	}

	if targetUserID == ownerID {
		return errors.New("owner cannot be removed from the workspace")
	}

	return s.workspaceRepo.RemoveMember(workspaceID, targetUserID)
}

func (s *WorkspaceService) RefreshInviteCode(workspaceID, ownerID string) (string, error) {
	workspace, err := s.workspaceRepo.FindByID(workspaceID)
	if err != nil || workspace.OwnerID != ownerID {
		return "", errors.New("workspace not found or not authorized")
	}

	newCode := models.GenerateInviteCode()
	err = s.workspaceRepo.UpdateInviteCode(workspaceID, newCode)
	if err != nil {
		return "", errors.New("failed to refresh invite code")
	}
	return newCode, nil
}
func (s *WorkspaceService) CreateTask(workspaceID, requesterID string, req *CreateWorkspaceTaskRequest) (*models.Task, error) {
	if req.Title == "" {
		return nil, errors.New("title cannot be empty")
	}

	member, err := s.workspaceRepo.FindMember(workspaceID, requesterID)
	if err != nil {
		return nil, errors.New("workspace not found or access denied")
	}

	if req.AssigneeID != nil && *req.AssigneeID != requesterID {
		if member.Role != models.RoleOwner {
			return nil, errors.New("only the owner can assign tasks to others")
		}
		isMember, _ := s.workspaceRepo.IsMember(workspaceID, *req.AssigneeID)
		if !isMember {
			return nil, errors.New("assignee is not a member of this workspace")
		}
	}

	task := &models.Task{
		Title:       req.Title,
		Description: req.Description,
		UserID:      requesterID,
		WorkspaceID: &workspaceID,
		AssigneeID:  req.AssigneeID,
		Status:      models.StatusNotStarted,
	}

	err = s.taskRepo.Create(task)
	if err != nil {
		return nil, errors.New("failed to create task")
	}
	return task, nil
}

func (s *WorkspaceService) GetTasks(workspaceID, userID string) ([]models.Task, error) {
	isMember, err := s.workspaceRepo.IsMember(workspaceID, userID)
	if err != nil || !isMember {
		return nil, errors.New("workspace not found or access denied")
	}

	return s.taskRepo.FindAllByWorkspaceID(workspaceID)
}

func (s *WorkspaceService) AssignTask(workspaceID, taskID, ownerID string, req *AssignTaskRequest) (*models.Task, error) {
	workspace, err := s.workspaceRepo.FindByID(workspaceID)
	if err != nil || workspace.OwnerID != ownerID {
		return nil, errors.New("workspace not found or not authorized")
	}

	task, err := s.taskRepo.FindByWorkspaceAndTaskID(workspaceID, taskID)
	if err != nil {
		return nil, errors.New("task not found in this workspace")
	}

	if req.AssigneeID != nil {
		isMember, _ := s.workspaceRepo.IsMember(workspaceID, *req.AssigneeID)
		if !isMember {
			return nil, errors.New("assignee is not a member of this workspace")
		}
	}

	task.AssigneeID = req.AssigneeID
	err = s.taskRepo.Update(task)
	if err != nil {
		return nil, errors.New("failed to assign task")
	}
	return task, nil
}
