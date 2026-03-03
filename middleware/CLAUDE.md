[Root](../CLAUDE.md) > **middleware**

---

# Middleware Module

> Last Updated: 2026-02-24 11:39:50

## Module Responsibility

The middleware module provides HTTP request processing middleware:
- Authentication (Token, User, Admin, Root)
- Rate limiting
- CORS handling
- Request logging
- Request distribution
- Performance monitoring

---

## Entry Points

Middleware is registered in router files. Key middleware chain:
1. CORS
2. Gzip compression
3. Body storage cleanup
4. Stats middleware
5. Auth middleware (varies by route)
6. Rate limiting
7. Distributor

---

## Middleware Components

| Middleware | File | Description |
|------------|------|-------------|
| Auth | `auth.go` | Token, User, Admin, Root authentication |
| Rate Limit | `rate-limit.go` | Global API rate limiting |
| Model Rate Limit | `model-rate-limit.go` | Per-model rate limiting |
| CORS | `cors.go` | Cross-origin resource sharing |
| Logger | `logger.go` | Request logging |
| Recover | `recover.go` | Panic recovery |
| Gzip | `gzip.go` | Response compression |
| Distributor | `distributor.go` | Request distribution to channels |
| Stats | `stats.go` | Request statistics |
| Cache | `cache.go` | Response caching |
| Request ID | `request-id.go` | Request ID generation |
| Performance | `performance.go` | Performance monitoring |
| i18n | `i18n.go` | Language detection |
| Turnstile | `turnstile-check.go` | Cloudflare Turnstile verification |
| Email Verification Rate Limit | `email-verification-rate-limit.go` | Email rate limiting |
| Secure Verification | `secure_verification.go` | Secure operation verification |
| Body Cleanup | `body_cleanup.go` | Request body cleanup |
| Disable Cache | `disable-cache.go` | Cache disabling |
| Kling Adapter | `kling_adapter.go` | Kling API adaptation |
| Jimeng Adapter | `jimeng_adapter.go` | Jimeng API adaptation |

---

## Authentication Levels

```go
// From auth.go

// TokenAuth - Valid API token required
func TokenAuth() gin.HandlerFunc

// UserAuth - Valid user session required
func UserAuth() gin.HandlerFunc

// AdminAuth - Admin role required
func AdminAuth() gin.HandlerFunc

// RootAuth - Root user required
func RootAuth() gin.HandlerFunc

// TryUserAuth - Try user auth, continue if not authenticated
func TryUserAuth() gin.HandlerFunc

// TokenAuthReadOnly - Token auth for read-only operations
func TokenAuthReadOnly() gin.HandlerFunc
```

---

## Rate Limiting

### Global Rate Limit
```go
// In rate-limit.go
func GlobalAPIRateLimit() gin.HandlerFunc
```

### Model Rate Limit
```go
// In model-rate-limit.go
func ModelRequestRateLimit() gin.HandlerFunc
```

### Search Rate Limit
```go
// In rate-limit.go
func SearchRateLimit() gin.HandlerFunc
```

### Critical Rate Limit
For sensitive operations like login/register.

---

## Key Dependencies

- `github.com/gin-gonic/gin` - HTTP framework
- `github.com/QuantumNous/new-api/model` - Database models
- `github.com/QuantumNous/new-api/common` - Shared utilities

---

## Request Flow

```
Request
    |
    v
CORS Middleware
    |
    v
Gzip Decompression
    |
    v
Body Storage
    |
    v
Auth Middleware (if required)
    |
    v
Rate Limit Check
    |
    v
Distributor (for relay routes)
    |
    v
Controller Handler
```

---

## FAQ

**Q: How do I add a new middleware?**
A: 1. Create new file in `middleware/` directory
   2. Implement `gin.HandlerFunc`
   3. Register in appropriate router file

**Q: How is authentication info accessed?**
A: Auth middleware sets values in gin.Context:
- `c.GetInt("id")` - User/Token ID
- `c.GetInt("role")` - User role
- `c.GetString("token_id")` - Token ID

---

## Related Files

- `auth.go` - Authentication middleware
- `rate-limit.go` - Rate limiting
- `distributor.go` - Request distribution
- `cors.go` - CORS handling

---

## Changelog

| Date | Change |
|------|--------|
| 2026-02-24 | Initial module documentation |
