# 前端构建阶段
FROM oven/bun:1.3.14 AS builder

# Proxy support for bun install
ARG HTTP_PROXY
ARG HTTPS_PROXY
ENV http_proxy=${HTTP_PROXY}
ENV https_proxy=${HTTPS_PROXY}

WORKDIR /build/web
COPY LICENSE NOTICE THIRD-PARTY-LICENSES.md /build/
COPY web/package.json web/bun.lock ./
RUN bun install --frozen-lockfile
COPY ./web .
COPY ./VERSION .
ARG VITE_SOURCE_CODE_URL
ENV VITE_SOURCE_CODE_URL=${VITE_SOURCE_CODE_URL}
RUN DISABLE_ESLINT_PLUGIN='true' VITE_REACT_APP_VERSION=$(cat VERSION) bun run build

FROM golang:1.26-alpine AS builder2
ENV GO111MODULE=on CGO_ENABLED=0

# Proxy support for go mod download
ARG HTTP_PROXY
ARG HTTPS_PROXY
ENV http_proxy=${HTTP_PROXY}
ENV https_proxy=${HTTPS_PROXY}
ENV GOPROXY=https://goproxy.cn,direct

ARG TARGETOS
ARG TARGETARCH
ENV GOOS=${TARGETOS:-linux} GOARCH=${TARGETARCH:-amd64}
ENV GOEXPERIMENT=greenteagc

WORKDIR /build

ADD go.mod go.sum ./
RUN go mod download

COPY . .
COPY --from=builder /build/web/dist ./web/dist
RUN go build -ldflags "-s -w -X 'github.com/searouter/searouter/common.Version=$(cat VERSION)'" -o searouter

FROM debian:bookworm-slim

ARG VITE_SOURCE_CODE_URL=https://github.com/MetastoneCorp/searouter
ARG VCS_REF
LABEL org.opencontainers.image.source="https://github.com/MetastoneCorp/searouter" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.url="${VITE_SOURCE_CODE_URL}" \
      org.opencontainers.image.licenses="AGPL-3.0-or-later"

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates tzdata libasan8 wget \
    && rm -rf /var/lib/apt/lists/* \
    && update-ca-certificates

COPY --from=builder2 /build/searouter /
COPY --from=builder2 /build/LICENSE /build/NOTICE /build/THIRD-PARTY-LICENSES.md /usr/share/licenses/searouter/
EXPOSE 3000
WORKDIR /data
ENTRYPOINT ["/searouter"]
