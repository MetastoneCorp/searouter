[Root](../CLAUDE.md) > **controller**

---

# Controller Module

> Last Updated: 2026-02-24 11:39:50

## Module Responsibility

The controller module handles all HTTP requests:
- API endpoint handlers
- Request validation
- Response formatting
- Route binding with middleware

---

## Entry Points

Handlers are registered via the router module. Key controller files are imported by `router/api-router.go` and `router/relay-router.go`.

---

## External Interfaces

### Admin API Controllers

| Controller | File | Endpoints |
|------------|------|-----------|
| User | `*.go` (user operations) | `/api/user/*` |
| Channel | `channel.go` | `/api/channel/*` |
| Token | `token.go` | `/api/token/*` |
| Log | `log.go` | `/api/log/*` |
| Option | `option.go` | `/api/option/*` |
| Subscription | `subscription.go` | `/api/subscription/*` |
| Pricing | `pricing.go` | `/api/pricing` |
| Model | `model.go` | `/api/models/*` |
| Deployment | `deployment.go` | `/api/deployments/*` |
| Vendor | (in model) | `/api/vendors/*` |
| Redemption | `redemption.go` | `/api/redemption/*` |

### Relay Controllers

| Controller | File | Description |
|------------|------|-------------|
| Relay | `relay.go` | Main relay handler for AI requests |
| Midjourney | `midjourney.go` | Midjourney task handling |
| Task | `task.go` | General task handling |
| Playground | `playground.go` | Playground API for testing |

### Auth Controllers

| Controller | File | Description |
|------------|------|-------------|
| OAuth | `oauth.go` | OAuth authentication |
| CustomOAuth | `custom_oauth.go` | Custom OAuth provider handling |
| Passkey | `passkey.go` | WebAuthn/Passkey authentication |
| Telegram | `telegram.go` | Telegram login |
| CodexOAuth | `codex_oauth.go` | Codex OAuth handling |

### Payment Controllers

| Controller | File | Description |
|------------|------|-------------|
| TopUp | `topup.go`, `topup_creem.go` | Top-up handling |
| Billing | `billing.go` | Billing operations |
| SubscriptionPayment | `subscription_payment_*.go` | Stripe, EPay, Creem payment |

---

## Key Dependencies

- `github.com/gin-gonic/gin` - HTTP framework
- `github.com/QuantumNous/new-api/model` - Database models
- `github.com/QuantumNous/new-api/service` - Business logic
- `github.com/QuantumNous/new-api/middleware` - Auth middleware

---

## Request Flow

```
HTTP Request
    |
    v
Middleware (Auth, RateLimit, etc.)
    |
    v
Controller Handler
    |
    v
Service Layer (business logic)
    |
    v
Model Layer (database)
    |
    v
Response
```

---

## Common Patterns

### Handler with Auth

```go
func GetChannel(c *gin.Context) {
    // Get channel ID from URL
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
        return
    }

    // Get user ID from context (set by middleware)
    userId := c.GetInt("id")

    // Call model/service
    channel, err := model.GetChannelById(id, userId)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "channel not found"})
        return
    }

    c.JSON(http.StatusOK, channel)
}
```

### Admin-Only Handler

```go
// In router - protected by middleware.AdminAuth()
channelRoute.GET("/:id", controller.GetChannel)
```

---

## Tests

Most controller tests are integration tests via the API router. Unit tests may be in corresponding service files.

---

## FAQ

**Q: How do I add a new API endpoint?**
A: 1. Create handler function in appropriate controller file
   2. Add route in `router/api-router.go` or `router/relay-router.go`
   3. Apply appropriate middleware (auth, rate limit)

**Q: How is authentication handled?**
A: Middleware sets user info in gin.Context:
- `c.GetInt("id")` - User ID
- `c.GetInt("role")` - User role
- `c.GetString("username")` - Username

---

## Related Files

- `relay.go` - Main relay controller
- `channel.go` - Channel management
- `user.go` (via service) - User operations
- `token.go` - Token management

---

## Changelog

| Date | Change |
|------|--------|
| 2026-02-24 | Initial module documentation |
