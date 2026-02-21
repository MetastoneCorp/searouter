#!/bin/bash

# SeaRouter Development Environment Initialization Script
# Based on Anthropic Effective Harnesses for Long-Running Agents

echo "=========================================="
echo "  SeaRouter Development Environment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${YELLOW}Working directory: $SCRIPT_DIR${NC}"

# Check Go installation (prefer /usr/local/go/bin/go for newer version)
echo ""
echo "Checking prerequisites..."
if [ -x "/usr/local/go/bin/go" ]; then
    export PATH="/usr/local/go/bin:$PATH"
    GO_VERSION=$(/usr/local/go/bin/go version)
    echo -e "${GREEN}✓ Go installed: $GO_VERSION${NC}"
elif command -v go &> /dev/null; then
    GO_VERSION=$(go version)
    echo -e "${GREEN}✓ Go installed: $GO_VERSION${NC}"
    # Check if version is at least 1.21
    GO_MAJOR=$(go version | sed -n 's/.*go\([0-9]*\.[0-9]*\).*/\1/p' | cut -d. -f1)
    GO_MINOR=$(go version | sed -n 's/.*go\([0-9]*\.[0-9]*\).*/\1/p' | cut -d. -f2)
    if [ "$GO_MAJOR" -lt 1 ] || ([ "$GO_MAJOR" -eq 1 ] && [ "$GO_MINOR" -lt 21 ]); then
        echo -e "${RED}✗ Go version too old. Need Go 1.21+, found Go ${GO_MAJOR}.${GO_MINOR}${NC}"
        echo "  Install newer Go or use Docker: docker-compose up -d"
        exit 1
    fi
else
    echo -e "${RED}✗ Go not installed. Please install Go 1.21+${NC}"
    echo "  Alternatively, use Docker: docker-compose up -d"
    exit 1
fi

# Check Docker installation
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓ Docker installed: $DOCKER_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ Docker not installed. Some features may not work.${NC}"
fi

# Check Docker Compose
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version)
    echo -e "${GREEN}✓ Docker Compose installed: $COMPOSE_VERSION${NC}"
elif docker compose version &> /dev/null; then
    COMPOSE_VERSION=$(docker compose version)
    echo -e "${GREEN}✓ Docker Compose (plugin) installed: $COMPOSE_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ Docker Compose not installed. Some features may not work.${NC}"
fi

echo ""
echo "=========================================="
echo "  Dependency Installation"
echo "=========================================="

# Download Go dependencies
echo "Downloading Go dependencies..."
go mod download
echo -e "${GREEN}✓ Go dependencies downloaded${NC}"

# Verify go mod
echo "Verifying Go modules..."
go mod verify
echo -e "${GREEN}✓ Go modules verified${NC}"

# Check if web/dist exists, if not, check for bun/npm
if [ ! -d "web/dist" ]; then
    echo ""
    echo "Frontend build required..."
    FRONTEND_BUILT=false
    if command -v bun &> /dev/null; then
        echo "Building frontend with bun..."
        (cd web && bun install && bun run build) && FRONTEND_BUILT=true
    elif command -v npm &> /dev/null; then
        echo "Building frontend with npm..."
        (cd web && npm install --legacy-peer-deps && npm run build) && FRONTEND_BUILT=true
    else
        echo -e "${YELLOW}⚠ Neither bun nor npm found. Frontend not built.${NC}"
    fi

    if [ "$FRONTEND_BUILT" = true ]; then
        echo -e "${GREEN}✓ Frontend built${NC}"
    else
        echo -e "${YELLOW}⚠ Frontend build failed or skipped.${NC}"
        echo "  Backend build will fail without web/dist/"
        echo "  Use Docker for full build: docker-compose up -d --build"
    fi
else
    echo -e "${GREEN}✓ Frontend already built (web/dist exists)${NC}"
fi

echo ""
echo "=========================================="
echo "  Build Verification"
echo "=========================================="

# Build the project
echo "Building SeaRouter..."
if go build -o bin/searouter .; then
    echo -e "${GREEN}✓ Build successful: bin/searouter${NC}"
else
    echo -e "${RED}✗ Build failed. Check error messages above.${NC}"
    exit 1
fi

echo ""
echo "=========================================="
echo "  Development Commands"
echo "=========================================="
echo ""
echo "Available commands:"
echo ""
echo "  # Run development server (requires DB/Redis)"
echo "  ./bin/searouter"
echo ""
echo "  # Start with Docker Compose (full stack)"
echo "  docker-compose up -d"
echo ""
echo "  # View Docker logs"
echo "  docker-compose logs -f searouter"
echo ""
echo "  # Stop Docker services"
echo "  docker-compose down"
echo ""
echo "  # Run tests"
echo "  go test ./..."
echo ""
echo "  # Build for production"
echo "  go build -o bin/searouter ."
echo ""
echo "  # Build Docker image"
echo "  docker build -t searouter:latest ."
echo ""
echo "=========================================="
echo "  Next Steps"
echo "=========================================="
echo ""
echo "1. Configure environment:"
echo "   cp .env.example .env"
echo "   # Edit .env with your settings"
echo ""
echo "2. Start services:"
echo "   docker-compose up -d"
echo ""
echo "3. Access the application:"
echo "   http://localhost:3000"
echo "   Default: root / 123456"
echo ""
echo "4. Configure GLM5 channel:"
echo "   Login → 渠道管理 → 添加渠道"
echo ""
echo "=========================================="
echo "  Status Check"
echo "=========================================="

# Check if services are running
if docker ps 2>/dev/null | grep -q searouter; then
    echo -e "${GREEN}✓ SeaRouter container is running${NC}"
    if curl -s http://localhost:3000/api/status | grep -q "success"; then
        echo -e "${GREEN}✓ API is responding${NC}"
    else
        echo -e "${YELLOW}⚠ API not responding (may still be starting)${NC}"
    fi
else
    echo -e "${YELLOW}○ SeaRouter container not running${NC}"
    echo "  Run: docker-compose up -d"
fi

echo ""
echo "=========================================="
echo "  Environment Ready"
echo "=========================================="
