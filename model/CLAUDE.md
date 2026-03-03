[Root](../CLAUDE.md) > **model**

---

# Model Module

> Last Updated: 2026-02-24 11:39:50

## Module Responsibility

The model module handles all database operations using GORM:
- Database connection management (SQLite, MySQL, PostgreSQL)
- Data model definitions
- Database migrations
- CRUD operations for all entities

---

## Entry Points

- `main.go` - Database initialization, connection, and migration
- Individual model files for each entity

---

## Database Models

| Model | File | Description |
|-------|------|-------------|
| `User` | `user.go` | User accounts and authentication |
| `Token` | `token.go` | API tokens for authentication |
| `Channel` | `channel.go` | AI provider channel configuration |
| `Log` | `log.go` | API usage logs |
| `Option` | `option.go` | System settings |
| `Ability` | `ability.go` | Channel abilities/models |
| `Task` | `task.go` | Async tasks (Midjourney, Suno) |
| `TopUp` | `topup.go` | User top-up records |
| `SubscriptionOrder` | `subscription.go` | Subscription management |
| `TwoFA` | `twofa.go` | Two-factor authentication |
| `Checkin` | `checkin.go` | Daily check-in records |
| `Pricing` | `pricing.go` | Model pricing configuration |
| `Vendor` | `vendor_meta.go` | Vendor metadata |
| `Model` | `model_extra.go` | Model metadata |
| `PrefillGroup` | `prefill_group.go` | Prefill configuration groups |
| `CustomOAuthProvider` | `custom_oauth_provider.go` | Custom OAuth providers |
| `UserOAuthBinding` | `user_oauth_binding.go` | User OAuth bindings |
| `PasskeyCredential` | `passkey.go` | WebAuthn credentials |
| `Redemption` | `redemption.go` | Redemption codes |

---

## Key Dependencies

- `gorm.io/gorm` - ORM framework
- `gorm.io/driver/mysql` - MySQL driver
- `gorm.io/driver/postgres` - PostgreSQL driver
- `github.com/glebarez/sqlite` - SQLite driver (pure Go)
- `github.com/QuantumNous/new-api/common` - Shared utilities

---

## Database Compatibility

The module supports three databases with automatic detection:

```go
// From main.go
func chooseDB(envName string, isLog bool) (*gorm.DB, error) {
    dsn := os.Getenv(envName)
    if strings.HasPrefix(dsn, "postgres://") || strings.HasPrefix(dsn, "postgresql://") {
        // PostgreSQL
        common.UsingPostgreSQL = true
        return gorm.Open(postgres.Open(dsn), ...)
    }
    if strings.HasPrefix(dsn, "local") {
        // SQLite (explicit)
        common.UsingSQLite = true
        return gorm.Open(sqlite.Open(common.SQLitePath), ...)
    }
    // MySQL or default SQLite
    ...
}
```

### Column Quoting Variables

```go
var commonGroupCol string  // "group" or `"group"` for PostgreSQL
var commonKeyCol string    // "key" or `"key"` for PostgreSQL
var commonTrueVal string   // "1" or "true" for PostgreSQL
var commonFalseVal string  // "0" or "false" for PostgreSQL
```

---

## Migration Strategy

Migrations are handled automatically via GORM's `AutoMigrate`:

```go
func migrateDB() error {
    err := DB.AutoMigrate(
        &Channel{},
        &Token{},
        &User{},
        // ... all models
    )
    ...
}
```

For SQLite-specific migrations (due to limited ALTER TABLE support):
- See `ensureSubscriptionPlanTableSQLite()` for patterns

---

## Tests

- `task_cas_test.go` - Compare-and-swap tests for task operations

---

## Key Functions

### Database Initialization

```go
func InitDB() error       // Initialize main database
func InitLogDB() error    // Initialize log database (separate DSN)
func CloseDB() error      // Close database connections
func PingDB() error       // Health check
```

### Setup Management

```go
func CheckSetup()         // Check if system is initialized
func createRootAccountIfNeed() // Create default root user
```

---

## FAQ

**Q: How do I add a new model?**
A: 1. Create a new file `xxx.go` with the struct definition
   2. Add GORM tags for column definitions
   3. Add the model to `migrateDB()` in `main.go`
   4. Implement any needed CRUD methods

**Q: How do I handle reserved keywords in column names?**
A: Use `commonGroupCol` and `commonKeyCol` variables instead of hardcoded column names.

---

## Related Files

- `main.go` - Database initialization and migrations
- `channel.go` - Channel model and operations
- `user.go` - User model and operations
- `token.go` - Token model and operations
- `log.go` - Log model and queries

---

## Changelog

| Date | Change |
|------|--------|
| 2026-02-24 | Initial module documentation |
