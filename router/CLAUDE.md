[Root](../CLAUDE.md) > **router**

---

# Router Module

> Last Updated: 2026-02-24 11:39:50

## Module Responsibility

The router module defines all HTTP routes and binds them to controllers:
- API route registration
- Middleware chain configuration
- Route grouping by functionality

---

## Entry Points

- `main.go` - `SetRouter()` - Main router setup
- `api-router.go` - Admin API routes
- `relay-router.go` - AI relay routes (OpenAI-compatible)
- `dashboard.go` - Dashboard routes
- `video-router.go` - Video-related routes
- `web-router.go` - Static file serving

---

## Router Structure

### Main Router Setup (`main.go`)

```go
func SetRouter(router *gin.Engine, buildFS embed.FS, indexPage []byte) {
    SetApiRouter(router)      // /api/*
    SetDashboardRouter(router) // /api/dashboard/*
    SetRelayRouter(router)    // /v1/*, /mj/*, /suno/*
    SetVideoRouter(router)    // Video routes

    // Frontend serving
    frontendBaseUrl := os.Getenv("FRONTEND_BASE_URL")
    if frontendBaseUrl == "" {
        SetWebRouter(router, buildFS, indexPage)
    }
}
```

---

## Route Groups

### API Router (`api-router.go`)

| Group | Prefix | Auth | Description |
|-------|--------|------|-------------|
| Setup | `/api/setup` | None | Initial setup |
| Status | `/api/status` | None | System status |
| User | `/api/user` | Varies | User operations |
| Channel | `/api/channel` | Admin | Channel management |
| Token | `/api/token` | User | Token management |
| Log | `/api/log` | User/Admin | Usage logs |
| Option | `/api/option` | Root | System settings |
| Subscription | `/api/subscription` | User | Subscriptions |
| Models | `/api/models` | Admin | Model management |
| Deployments | `/api/deployments` | Admin | Model deployments |
| Vendors | `/api/vendors` | Admin | Vendor metadata |
| Redemption | `/api/redemption` | Admin | Redemption codes |
| Custom OAuth | `/api/custom-oauth-provider` | Root | OAuth providers |

### Relay Router (`relay-router.go`)

| Endpoint | Auth | Format | Description |
|----------|------|--------|-------------|
| `/v1/models` | Token | - | List models |
| `/v1/chat/completions` | Token | OpenAI | Chat completions |
| `/v1/completions` | Token | OpenAI | Legacy completions |
| `/v1/messages` | Token | Claude | Claude messages |
| `/v1/embeddings` | Token | Embedding | Embeddings |
| `/v1/images/generations` | Token | Image | Image generation |
| `/v1/audio/*` | Token | Audio | Audio operations |
| `/v1/rerank` | Token | Rerank | Rerank API |
| `/v1/responses` | Token | Responses | OpenAI Responses |
| `/v1beta/models/*` | Token | Gemini | Gemini API |
| `/mj/*` | Token | Midjourney | Midjourney tasks |
| `/suno/*` | Token | Suno | Suno tasks |

---

## Middleware Chains

### API Routes
```
gzip -> BodyStorageCleanup -> GlobalAPIRateLimit -> [Auth] -> Handler
```

### Relay Routes
```
CORS -> DecompressRequest -> BodyStorageCleanup -> StatsMiddleware
  -> TokenAuth -> ModelRequestRateLimit -> Distribute -> Handler
```

---

## Key Dependencies

- `github.com/gin-gonic/gin` - HTTP framework
- `github.com/QuantumNous/new-api/controller` - Handlers
- `github.com/QuantumNous/new-api/middleware` - Middleware

---

## Route Registration Pattern

```go
func SetApiRouter(router *gin.Engine) {
    apiRouter := router.Group("/api")
    apiRouter.Use(gzip.Gzip(gzip.DefaultCompression))
    apiRouter.Use(middleware.BodyStorageCleanup())
    apiRouter.Use(middleware.GlobalAPIRateLimit())
    {
        // Public routes
        apiRouter.GET("/status", controller.GetStatus)

        // User-authenticated routes
        userRoute := apiRouter.Group("/user")
        {
            userRoute.POST("/login", controller.Login)
            // ...
        }

        // Admin routes
        channelRoute := apiRouter.Group("/channel")
        channelRoute.Use(middleware.AdminAuth())
        {
            channelRoute.GET("/", controller.GetAllChannels)
            // ...
        }
    }
}
```

---

## FAQ

**Q: How do I add a new API endpoint?**
A: 1. Add route definition in appropriate router file
   2. Apply necessary middleware
   3. Create handler in controller

**Q: How do I add a new relay format?**
A: 1. Add format constant in `types/relay_format.go`
   2. Add route in `relay-router.go`
   3. Implement adapter in `relay/channel/`

---

## Related Files

- `main.go` - Main router setup
- `api-router.go` - Admin API routes
- `relay-router.go` - AI relay routes
- `web-router.go` - Static file serving

---

## Changelog

| Date | Change |
|------|--------|
| 2026-02-24 | Initial module documentation |
