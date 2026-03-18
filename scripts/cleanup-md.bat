#!/bin/bash

# VOZAZI Repository Cleanup Script
# Removes duplicate .md files from node_modules and venv

echo "🧹 Cleaning up duplicate .md files..."

# Remove .md files from node_modules (not needed for development)
echo "📦 Cleaning node_modules..."
find ./vozazi/node_modules -name "*.md" -type f -delete 2>/dev/null

# Remove .md files from venv (not needed for development)
echo "🐍 Cleaning venv..."
find ./apps/audio-engine/venv -name "*.md" -type f -delete 2>/dev/null

# Remove .history folders
echo "🗑️  Removing .history folders..."
find ./vozazi/node_modules -type d -name ".history" -exec rm -rf {} + 2>/dev/null

echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary:"
echo "   - Removed .md files from node_modules"
echo "   - Removed .md files from venv"
echo "   - Removed .history folders"
echo ""
echo "📁 Your documentation is now clean and organized!"
echo "   - Root README.md: Quick start guide"
echo "   - documentacion/: Technical documentation"
echo "   - *.md in root: Specific guides (i18n, testing, MCP)"
