[Root](../CLAUDE.md) > **relay**

---

# Relay Module

> Last Updated: 2026-02-24 11:39:50

## Module Responsibility

The relay module is the core of the AI gateway functionality. It handles:
- Routing requests to appropriate AI provider adapters
- Request/response transformation between OpenAI-compatible format and provider-specific formats
- Stream processing and SSE handling
- Billing and usage tracking for API calls

---

## Entry Points

- `relay/channel/adapter.go` - Defines the `Adaptor` and `TaskAdaptor` interfaces
- `relay/common/relay_info.go` - Relay context and configuration

---

## External Interfaces

### Supported Relay Formats (defined in `types/relay_format.go`)

| Format | Description |
|--------|-------------|
| `RelayFormatOpenAI` | OpenAI Chat Completions API |
| `RelayFormatOpenAIResponses` | OpenAI Responses API |
| `RelayFormatClaude` | Anthropic Claude Messages API |
| `RelayFormatGemini` | Google Gemini API |
| `RelayFormatEmbedding` | Embedding API |
| `RelayFormatOpenAIAudio` | Audio transcription/translation/speech |
| `RelayFormatOpenAIImage` | Image generation API |
| `RelayFormatRerank` | Rerank API (Cohere, Jina) |

### Provider Adapters (in `relay/channel/`)

| Provider | Path | Description |
|----------|------|-------------|
| OpenAI | `openai/` | OpenAI and compatible APIs |
| Claude | `claude/` | Anthropic Claude |
| Gemini | `gemini/` | Google Gemini |
| AWS | `aws/` | AWS Bedrock |
| Azure | `azure/` | Azure OpenAI |
| Ali | `ali/` | Alibaba Qwen |
| Baidu | `baidu/`, `baidu_v2/` | Baidu ERNIE |
| Cohere | `cohere/` | Cohere API |
| DeepSeek | `deepseek/` | DeepSeek |
| Ollama | `ollama/` | Ollama local models |
| Mistral | `mistral/` | Mistral AI |
| ... | ... | 40+ providers total |

---

## Key Dependencies

- `github.com/QuantumNous/new-api/dto` - Request/response DTOs
- `github.com/QuantumNous/new-api/model` - Database models
- `github.com/QuantumNous/new-api/types` - Type definitions
- `github.com/gin-gonic/gin` - HTTP framework

---

## Data Models

### RelayInfo (`relay/common/relay_info.go`)
Contains request context including:
- Channel information
- User and token info
- Request metadata
- Billing parameters

---

## Interfaces

### Adaptor Interface (`relay/channel/adapter.go`)

```go
type Adaptor interface {
    Init(info *relaycommon.RelayInfo)
    GetRequestURL(info *relaycommon.RelayInfo) (string, error)
    SetupRequestHeader(c *gin.Context, req *http.Header, info *relaycommon.RelayInfo) error
    ConvertOpenAIRequest(c *gin.Context, info *relaycommon.RelayInfo, request *dto.GeneralOpenAIRequest) (any, error)
    ConvertRerankRequest(c *gin.Context, relayMode int, request dto.RerankRequest) (any, error)
    ConvertEmbeddingRequest(c *gin.Context, info *relaycommon.RelayInfo, request dto.EmbeddingRequest) (any, error)
    ConvertAudioRequest(c *gin.Context, info *relaycommon.RelayInfo, request dto.AudioRequest) (io.Reader, error)
    ConvertImageRequest(c *gin.Context, info *relaycommon.RelayInfo, request dto.ImageRequest) (any, error)
    DoRequest(c *gin.Context, info *relaycommon.RelayInfo, requestBody io.Reader) (any, error)
    DoResponse(c *gin.Context, resp *http.Response, info *relaycommon.RelayInfo) (usage any, err *types.NewAPIError)
    GetModelList() []string
    GetChannelName() string
    // ... more methods
}
```

### TaskAdaptor Interface

For async tasks like Midjourney and Suno:
- `ValidateRequestAndSetAction()`
- `EstimateBilling()` / `AdjustBillingOnSubmit()` / `AdjustBillingOnComplete()`
- `BuildRequestURL()` / `BuildRequestBody()` / `DoRequest()` / `DoResponse()`
- `FetchTask()` / `ParseTaskResult()`

---

## Tests

- `relay/channel/api_request_test.go`
- `relay/channel/claude/relay_claude_test.go`
- `relay/channel/claude/message_delta_usage_patch_test.go`
- `relay/channel/gemini/relay_gemini_usage_test.go`
- `relay/common/override_test.go`
- `relay/common/relay_info_test.go`

---

## FAQ

**Q: How do I add a new AI provider?**
A: 1. Create a new directory under `relay/channel/<provider>/`
   2. Create `adaptor.go` implementing the `Adaptor` interface
   3. Add constants in `constants.go`
   4. Register the channel type in `constant/channel.go`

**Q: How is billing handled?**
A: The `relay/common/billing.go` handles quota consumption based on token usage or task-specific billing.

---

## Related Files

- `adapter.go` - Core interface definitions
- `audio_handler.go` - Audio request handling
- `common/relay_info.go` - Request context
- `common/billing.go` - Billing logic

---

## Changelog

| Date | Change |
|------|--------|
| 2026-02-24 | Initial module documentation |
