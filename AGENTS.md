# AGENTS.md — Project Conventions for searouter

## Overview

AI API gateway/proxy built with Go. Aggregates 40+ upstream AI providers (OpenAI, Claude, Gemini, Azure, AWS Bedrock, etc.) behind a unified API.

## Tech Stack

- **Backend**: Go 1.24+, Gin web framework, GORM v2 ORM
- **Frontend**: React 18, Vite, Semi Design UI
- **Databases**: SQLite, MySQL, PostgreSQL (all three must be supported)
- **Cache**: Redis + in-memory cache
- **Auth**: JWT, WebAuthn/Passkeys, OAuth
- **Frontend package manager**: Bun (preferred)

## Build/Test Commands

### Backend (Go)

```bash
go build -o searouter . && ./searouter    # Build and run
go run main.go                             # Development
go test ./...                              # All tests
go test ./service/...                      # Tests in package
go test ./service/error_test.go            # Single test file
go test ./service -run TestResetStatusCode # Single test function
go test -v ./...                           # Verbose
go test -race ./...                        # Race detection
```

### Frontend (web/)

```bash
cd web && bun install                      # Install
bun run dev                                # Dev server
bun run build                              # Build
bun run lint / lint:fix                    # Prettier
bun run eslint / eslint:fix                # ESLint
bun run i18n:extract / sync / lint         # i18n
```

### Docker

```bash
# Generate local credentials, then build and start searouter.
test -e .env || (umask 077; for key in POSTGRES_PASSWORD SESSION_SECRET CRYPTO_SECRET; do
  printf '%s=%s\n' "$key" "$(openssl rand -hex 32)"
done > .env)
docker compose up -d --build
```

Reuse the existing `.env` when restarting an installation. Changing database or
encryption credentials requires a separate migration.

## Architecture

Layered: Router -> Controller -> Service -> Model

```
router/        — HTTP routing
controller/    — Request handlers
service/       — Business logic
model/         — Data models and DB access (GORM)
relay/         — AI API relay/proxy (channel/ has provider adapters)
middleware/    — Auth, rate limiting, CORS, logging
setting/       — Configuration management
common/        — Shared utilities (JSON, crypto, Redis, env)
dto/           — Data transfer objects
constant/      — Constants (API types, channel types)
types/         — Type definitions (relay formats, errors)
i18n/          — Backend i18n (go-i18n, en/zh)
web/           — React frontend
```

## Code Style Guidelines

### Imports

Group imports in order: 1) Standard library 2) Local packages 3) Third-party

```go
import (
    "context"
    "fmt"
    "net/http"

    "github.com/searouter/searouter/common"
    "github.com/searouter/searouter/model"

    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)
```

### Naming Conventions

- **Packages**: lowercase, single word (`common`, `model`, `dto`)
- **Types**: PascalCase for exported, camelCase for internal
- **Constants**: PascalCase or UPPER_SNAKE_CASE
- **Interfaces**: end with `-er` (`Adaptor`, `TaskAdaptor`)
- **Test files**: `*_test.go`, functions start with `Test`

### Error Handling

- Use `common.SysError()` for logging errors (not `log.Printf`)
- Use `common.FatalLog()` for fatal errors
- Use `types.NewAPIError` for API errors with status codes

### Testing

- Use `testing` package and `github.com/stretchr/testify/require`
- Use `t.Parallel()` for parallel tests
- Use table-driven tests for multiple cases
- Use `t.Helper()` for helper functions

```go
func TestSomething(t *testing.T) {
    t.Parallel()
    testCases := []struct {
        name     string
        input    string
        expected string
    }{
        {"case1", "input1", "expected1"},
    }
    for _, tc := range testCases {
        tc := tc
        t.Run(tc.name, func(t *testing.T) {
            t.Parallel()
        })
    }
}
```

## Rules

### Rule 1: JSON Package — Use `common/json.go`

All JSON operations MUST use wrapper functions: `common.Marshal`, `common.Unmarshal`, `common.UnmarshalJsonStr`, `common.DecodeJson`, `common.GetJsonType`. Do NOT directly import `encoding/json` in business code.

### Rule 2: Database Compatibility — SQLite, MySQL >= 5.7.8, PostgreSQL >= 9.6

- Prefer GORM methods over raw SQL
- Use `commonGroupCol`, `commonKeyCol` from `model/main.go` for reserved-word columns
- Use `commonTrueVal`/`commonFalseVal` for boolean values
- Use `common.UsingPostgreSQL`, `common.UsingSQLite`, `common.UsingMySQL` flags for DB-specific logic

### Rule 3: Frontend — Prefer Bun

Use `bun` as the preferred package manager for frontend (`web/` directory).

### Rule 4: New Channel StreamOptions Support

When implementing a new channel, confirm StreamOptions support and add to `streamSupportedChannels` if supported.

### Rule 5: Protected Project Information

Any references to **searouter** or related branding must NOT be modified, deleted, or removed.

## Internationalization (i18n)

- **Backend** (`i18n/`): `nicksnyder/go-i18n/v2`, languages: en, zh
- **Frontend** (`web/src/i18n/`): `i18next` + `react-i18next`, languages: zh (fallback), en, fr, ru, ja, vi
