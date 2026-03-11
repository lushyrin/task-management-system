package service

import (
	"crypto/sha512"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"minitask/internal/models"
	"minitask/internal/repository"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PaymentService struct {
	db       *gorm.DB
	userRepo repository.UserRepository
}

func NewPaymentService(db *gorm.DB, userRepo repository.UserRepository) *PaymentService {
	return &PaymentService{db: db, userRepo: userRepo}
}

const (
	ProPlanPrice    = 49000
	ProPlanDuration = 30
)

type CreateCheckoutRequest struct {
	Plan string `json:"plan"`
}

type CheckoutResponse struct {
	Token       string `json:"token"`
	RedirectURL string `json:"redirectUrl"`
}

type MidtransSnapRequest struct {
	TransactionDetails TransactionDetails `json:"transaction_details"`
	CustomerDetails    CustomerDetails    `json:"customer_details"`
	ItemDetails        []ItemDetail       `json:"item_details"`
	Callbacks          Callbacks          `json:"callbacks"`
}

type TransactionDetails struct {
	OrderID     string `json:"order_id"`
	GrossAmount int    `json:"gross_amount"`
}

type CustomerDetails struct {
	FirstName string `json:"first_name"`
	Email     string `json:"email"`
}

type ItemDetail struct {
	ID       string `json:"id"`
	Price    int    `json:"price"`
	Quantity int    `json:"quantity"`
	Name     string `json:"name"`
}

type Callbacks struct {
	Finish string `json:"finish"`
}

type MidtransSnapResponse struct {
	Token       string `json:"token"`
	RedirectURL string `json:"redirect_url"`
}

type MidtransNotification struct {
	OrderID           string `json:"order_id"`
	TransactionStatus string `json:"transaction_status"`
	FraudStatus       string `json:"fraud_status"`
	SignatureKey      string `json:"signature_key"`
	StatusCode        string `json:"status_code"`
	GrossAmount       string `json:"gross_amount"`
}

func (s *PaymentService) CreateSnapToken(userID string, plan string) (*CheckoutResponse, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	if plan != "pro" {
		return nil, errors.New("invalid plan")
	}

	orderID := fmt.Sprintf("MINITASK-%s-%s", strings.ToUpper(plan), uuid.New().String())

	frontendURL := os.Getenv("FRONTEND_URL")

	payload := MidtransSnapRequest{
		TransactionDetails: TransactionDetails{
			OrderID:     orderID,
			GrossAmount: ProPlanPrice,
		},
		CustomerDetails: CustomerDetails{
			FirstName: user.Username,
			Email:     user.Email,
		},
		ItemDetails: []ItemDetail{
			{
				ID:       "pro-plan",
				Price:    ProPlanPrice,
				Quantity: 1,
				Name:     "MiniTask Pro - 30 Days",
			},
		},
		Callbacks: Callbacks{
			Finish: frontendURL + "/payment/success",
		},
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return nil, errors.New("failed to prepare payment")
	}

	snapURL := "https://app.sandbox.midtrans.com/snap/v1/transactions"
	if os.Getenv("MIDTRANS_ENV") == "production" {
		snapURL = "https://app.midtrans.com/snap/v1/transactions"
	}

	req, err := http.NewRequest("POST", snapURL, strings.NewReader(string(payloadBytes)))
	if err != nil {
		return nil, errors.New("failed to create payment request")
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	// Midtrans uses Basic Auth with server key as username, password empty
	req.SetBasicAuth(os.Getenv("MIDTRANS_SERVER_KEY"), "")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, errors.New("failed to connect to payment gateway")
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.New("failed to read payment response")
	}

	if resp.StatusCode != http.StatusCreated {
		return nil, fmt.Errorf("payment gateway error: %s", string(body))
	}

	var snapResp MidtransSnapResponse
	if err := json.Unmarshal(body, &snapResp); err != nil {
		return nil, errors.New("failed to parse payment response")
	}

	pendingOrder := &models.PendingOrder{
		OrderID:   orderID,
		UserID:    userID,
		Plan:      plan,
		Amount:    ProPlanPrice,
		Status:    "pending",
		ExpiresAt: time.Now().Add(24 * time.Hour),
	}
	if err := s.db.Create(pendingOrder).Error; err != nil {
		return nil, errors.New("failed to save payment order")
	}

	return &CheckoutResponse{
		Token:       snapResp.Token,
		RedirectURL: snapResp.RedirectURL,
	}, nil
}

func (s *PaymentService) HandleWebhook(notification *MidtransNotification) error {
	serverKey := os.Getenv("MIDTRANS_SERVER_KEY")
	raw := notification.OrderID + notification.StatusCode + notification.GrossAmount + serverKey
	hash := sha512.Sum512([]byte(raw))
	expectedSig := fmt.Sprintf("%x", hash)

	if expectedSig != notification.SignatureKey {
		return errors.New("invalid signature")
	}

	var order models.PendingOrder
	err := s.db.Where("order_id = ?", notification.OrderID).First(&order).Error
	if err != nil {
		return errors.New("order not found")
	}

	isPaid := notification.TransactionStatus == "settlement" ||
		(notification.TransactionStatus == "capture" && notification.FraudStatus == "accept")

	if isPaid {
		var user models.User
		if err := s.db.First(&user, "id = ?", order.UserID).Error; err != nil {
			return errors.New("user not found for order")
		}

		var newExpiry time.Time
		if user.Plan == "pro" && user.PlanExpiresAt != nil && user.PlanExpiresAt.After(time.Now()) {
			newExpiry = user.PlanExpiresAt.Add(time.Duration(ProPlanDuration) * 24 * time.Hour)
		} else {
			newExpiry = time.Now().Add(time.Duration(ProPlanDuration) * 24 * time.Hour)
		}

		if err := s.db.Model(&models.User{}).Where("id = ?", order.UserID).Updates(map[string]interface{}{
			"plan":            "pro",
			"plan_expires_at": newExpiry,
		}).Error; err != nil {
			return errors.New("failed to update user plan")
		}

		if err := s.db.Model(&order).Update("status", "paid").Error; err != nil {
			return errors.New("failed to update order status")
		}

	} else if notification.TransactionStatus == "expire" || notification.TransactionStatus == "cancel" {
		s.db.Model(&order).Update("status", notification.TransactionStatus)
	}

	return nil
}

func (s *PaymentService) VerifyPayment(userID string, orderID string) (string, error) {
	log.Printf("[VerifyPayment] userID=%s orderID=%s", userID, orderID)

	var order models.PendingOrder
	if err := s.db.Where("order_id = ? AND user_id = ?", orderID, userID).First(&order).Error; err != nil {
		log.Printf("[VerifyPayment] order not found: %v", err)
		return "", errors.New("order not found")
	}
	log.Printf("[VerifyPayment] order found, status=%s", order.Status)

	if order.Status == "paid" {
		return "pro", nil
	}

	apiURL := fmt.Sprintf("https://api.sandbox.midtrans.com/v2/%s/status", orderID)
	if os.Getenv("MIDTRANS_ENV") == "production" {
		apiURL = fmt.Sprintf("https://api.midtrans.com/v2/%s/status", orderID)
	}

	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return "", errors.New("failed to create verify request")
	}
	req.SetBasicAuth(os.Getenv("MIDTRANS_SERVER_KEY"), "")
	req.Header.Set("Accept", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("[VerifyPayment] midtrans API error: %v", err)
		return "", errors.New("failed to connect to payment gateway")
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", errors.New("failed to read verify response")
	}
	log.Printf("[VerifyPayment] midtrans response (HTTP %d): %s", resp.StatusCode, string(body))

	var notification MidtransNotification
	if err := json.Unmarshal(body, &notification); err != nil {
		return "", errors.New("failed to parse verify response")
	}
	log.Printf("[VerifyPayment] transaction_status=%s fraud_status=%s", notification.TransactionStatus, notification.FraudStatus)

	isPaid := notification.TransactionStatus == "settlement" ||
		(notification.TransactionStatus == "capture" && notification.FraudStatus == "accept")

	if isPaid {
		var user models.User
		if err := s.db.First(&user, "id = ?", userID).Error; err != nil {
			return "", errors.New("user not found")
		}

		var newExpiry time.Time
		if user.Plan == "pro" && user.PlanExpiresAt != nil && user.PlanExpiresAt.After(time.Now()) {
			newExpiry = user.PlanExpiresAt.Add(time.Duration(ProPlanDuration) * 24 * time.Hour)
		} else {
			newExpiry = time.Now().Add(time.Duration(ProPlanDuration) * 24 * time.Hour)
		}

		if err := s.db.Model(&models.User{}).Where("id = ?", userID).Updates(map[string]interface{}{
			"plan":            "pro",
			"plan_expires_at": newExpiry,
		}).Error; err != nil {
			log.Printf("[VerifyPayment] DB update failed: %v", err)
			return "", errors.New("failed to update user plan")
		}

		s.db.Model(&order).Update("status", "paid")
		log.Printf("[VerifyPayment] user upgraded to pro successfully")
		return "pro", nil
	}

	log.Printf("[VerifyPayment] not paid, status=%s — no upgrade", notification.TransactionStatus)
	return "free", nil
}

func (s *PaymentService) CheckAndDowngradeExpiredPlans(userID string) error {
	return s.db.Model(&models.User{}).
		Where("id = ? AND plan != 'free' AND plan_expires_at < ?", userID, time.Now()).
		Updates(map[string]interface{}{
			"plan": "free",
		}).Error
}

func (s *PaymentService) GetUserPlan(userID string) (*models.User, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, errors.New("user not found")
	}
	return user, nil
}
