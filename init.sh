#!/bin/bash

# SeaRouter Project Initialization Script
# This script sets up the development environment and verifies basic functionality

set -e

echo "=========================================="
echo "SeaRouter Development Environment Setup"
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

# Step 1: Check git status
echo ""
echo "Step 1: Checking git status..."
if [ -d ".git" ]; then
    echo -e "${GREEN}✓ Git repository initialized${NC}"
    git status --short
else
    echo -e "${YELLOW}! No git repository found${NC}"
fi

# Step 2: Check project files
echo ""
echo "Step 2: Checking project files..."
FILES_OK=true

for file in "CLAUDE.md" "feature_list.json" "claude-progress.txt"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file exists${NC}"
    else
        echo -e "${RED}✗ $file missing${NC}"
        FILES_OK=false
    fi
done

# Step 3: Project-specific setup (to be customized)
echo ""
echo "Step 3: Project-specific setup..."
echo -e "${YELLOW}⚠ Project requirements not yet defined${NC}"
echo "  Run requirements analysis to configure this section"

# Placeholder for project-specific commands:
# - Install dependencies
# - Start development server
# - Run tests

# Step 4: Summary
echo ""
echo "=========================================="
echo "Setup Summary"
echo "=========================================="

if [ "$FILES_OK" = true ]; then
    echo -e "${GREEN}✓ All harness files present${NC}"
else
    echo -e "${RED}✗ Some harness files missing${NC}"
fi

echo ""
echo "Next steps:"
echo "1. Define project requirements"
echo "2. Create Software Design Document"
echo "3. Begin incremental development"
echo ""
echo "Ready for development!"
