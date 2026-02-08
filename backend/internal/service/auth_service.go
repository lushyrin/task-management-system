package service

import (
	"errors"
	"minitask/internal/middleware"
	"minitask/internal/models"
	"minitask/internal/repository"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService struct {
	db       *gorm.DB
	userRepo repository.UserRepository
}

func NewAuthService(db *gorm.DB, userRepo repository.UserRepository) *AuthService {
	return &AuthService{db: db, userRepo: userRepo}
}

type RegisterRequest struct { //req body buat regist
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct { //req body buat login
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct { //req respons abis login/regist
	Token string      `json:"token"`
	User  models.User `json:"user"`
}

// urus handlers dulu
func (s *AuthService) Register(req *RegisterRequest) (*AuthResponse, error) {
	if req.Username == "" {
		return nil, errors.New("Username Required!")
	}
	if req.Email == "" {
		return nil, errors.New("Email Required!")
	}
	if req.Password == "" {
		return nil, errors.New("Password Required!")
	}
	if len(req.Password) < 6 {
		return nil, errors.New("Password must be astleast 6 characters")
	}

	var existingUser models.User
	err := s.db.Where("email = ?", req.Email).First(&existingUser).Error
	if err == nil {
		return nil, errors.New("Email already registered")
	}
	err = s.db.Where("username = ?", req.Username).First(&existingUser).Error
	if err == nil {
		return nil, errors.New("Username is taken!")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("Failed, please try again later") // sefti lg
	}

	user := models.User{
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	err = s.db.Create(&user).Error
	if err != nil {
		return nil, errors.New("Failed to create account")
	}

	token, err := middleware.GenerateToken(user.ID, user.Username)
	if err != nil {
		return nil, errors.New("Failed to generate token")
	}

	return &AuthResponse{
		Token: token,
		User:  user,
	}, nil
}

// Login handles user authentication
func (s *AuthService) Login(req *LoginRequest) (*AuthResponse, error) {
	if req.Email == "" {
		return nil, errors.New("Email Required!")
	}
	if req.Password == "" {
		return nil, errors.New("Password Required!")
	}

	var user models.User
	err := s.db.Where("email = ?", req.Email).First(&user).Error
	if err != nil {
		return nil, errors.New("Invalid email or password")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return nil, errors.New("Invalid email or password")
	}

	token, err := middleware.GenerateToken(user.ID, user.Username)
	if err != nil {
		return nil, errors.New("Failed to generate token")
	}

	return &AuthResponse{
		Token: token,
		User:  user,
	}, nil
}

// GetUserByID retrieves a user by their ID
func (s *AuthService) GetUserByID(userID string) (*models.User, error) {
	var user models.User
	err := s.db.First(&user, "id = ?", userID).Error
	if err != nil {
		return nil, errors.New("User not found")
	}
	user.Password = ""
	return &user, nil
}
