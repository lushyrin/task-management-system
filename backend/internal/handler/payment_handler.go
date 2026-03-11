package handler

import (
	"minitask/internal/service"
	"net/http"

	"github.com/labstack/echo/v4"
)

type PaymentHandler struct {
	paymentService *service.PaymentService
}

func NewPaymentHandler(paymentService *service.PaymentService) *PaymentHandler {
	return &PaymentHandler{paymentService: paymentService}
}

func (h *PaymentHandler) CreateCheckout(c echo.Context) error {
	userID := c.Get("user_id").(string)

	var req service.CreateCheckoutRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	if req.Plan == "" {
		req.Plan = "pro"
	}

	result, err := h.paymentService.CreateSnapToken(userID, req.Plan)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, result)
}

func (h *PaymentHandler) Webhook(c echo.Context) error {
	var notification service.MidtransNotification
	if err := c.Bind(&notification); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid notification"})
	}

	if err := h.paymentService.HandleWebhook(&notification); err != nil {

		return c.JSON(http.StatusOK, map[string]string{"status": "ignored", "reason": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
}

func (h *PaymentHandler) VerifyPayment(c echo.Context) error {
	userID := c.Get("user_id").(string)
	orderID := c.QueryParam("order_id")
	if orderID == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "order_id is required"})
	}

	plan, err := h.paymentService.VerifyPayment(userID, orderID)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"plan": plan})
}

func (h *PaymentHandler) GetPlanStatus(c echo.Context) error {
	userID := c.Get("user_id").(string)
	h.paymentService.CheckAndDowngradeExpiredPlans(userID)

	// Return actual user plan data
	user, err := h.paymentService.GetUserPlan(userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, user)
}
