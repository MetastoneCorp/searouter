[Root](../CLAUDE.md) > **service**

---

# Service Module

> Last Updated: 2026-02-24 11:39:50

## Module Responsibility

The service module contains business logic that sits between controllers and models:
- Billing calculations
- Quota management
- Task scheduling and polling
- Channel selection algorithms
- Token estimation
- Webhook handling

---

## Entry Points

Services are called by controllers. Key services:
- `billing.go` - Billing calculations
- `quota.go` - Quota management
- `task.go` - Task handling
- `channel_select.go` - Channel selection logic

---

## Key Services

| Service | File | Description |
|---------|------|-------------|
| Billing | `billing.go` | Usage billing and quota consumption |
| Billing Session | `billing_session.go` | Session-based billing |
| Quota | `quota.go` | Quota checking and management |
| Task | `task.go` | Async task coordination |
| Task Billing | `task_billing.go` | Task-specific billing |
| Task Polling | `task_polling.go` | Task status polling |
| Channel Select | `channel_select.go` | Intelligent channel routing |
| Channel Affinity | `channel_affinity.go` | Channel affinity caching |
| Token Counter | `token_counter.go` | Token counting utilities |
| Token Estimator | `token_estimator.go` | Token usage estimation |
| HTTP | `http.go` | HTTP client utilities |
| Image | `image.go` | Image processing |
| Audio | `audio.go` | Audio processing |
| Midjourney | `midjourney.go` | Midjourney-specific logic |
| Notify | `notify-limit.go` | Notification rate limiting |
| Webhook | `webhook.go` | Webhook handling |
| Sensitive | `sensitive.go` | Sensitive word filtering |

---

## Sub-packages

### `service/passkey/`
- `service.go` - Passkey service
- `user.go` - User passkey operations
- `session.go` - Session management

### `service/openaicompat/`
- `chat_to_responses.go` - Chat to Responses conversion
- `responses_to_chat.go` - Responses to Chat conversion
- `policy.go` - Request policies
- `regex.go` - Regex utilities

---

## Key Dependencies

- `github.com/QuantumNous/new-api/model` - Database models
- `github.com/QuantumNous/new-api/common` - Shared utilities
- `github.com/QuantumNous/new-api/dto` - Data transfer objects

---

## Channel Selection Algorithm

The `channel_select.go` implements intelligent routing:

1. Filter channels by model availability
2. Apply group restrictions
3. Check channel health/status
4. Apply weighted random selection
5. Handle retry logic

---

## Billing Flow

```
Request
    |
    v
Pre-charge (estimate quota)
    |
    v
Make API call
    |
    v
Post-billing (actual usage)
    |
    v
Refund/charge difference
```

---

## Tests

- `error_test.go` - Error handling tests
- `task_billing_test.go` - Task billing tests
- `channel_affinity_usage_cache_test.go` - Cache tests

---

## FAQ

**Q: What is channel affinity?**
A: Channel affinity caches successful channel-model pairs to optimize routing and reduce latency.

**Q: How is quota consumed?**
A: Quota is consumed based on token usage, multiplied by model-specific ratios defined in settings.

---

## Related Files

- `billing.go` - Core billing logic
- `quota.go` - Quota management
- `channel_select.go` - Channel selection
- `task.go` - Task coordination

---

## Changelog

| Date | Change |
|------|--------|
| 2026-02-24 | Initial module documentation |
