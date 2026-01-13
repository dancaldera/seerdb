#!/bin/bash
set -e

echo "🔍 Running Type Check..."
bun run type-check

echo "✨ Running Code Quality Checks..."
bun run check

echo "🧪 Running Tests..."
bun test

echo "🏗️ Building Project..."
bun run build

echo "✅ All checks passed! Ready to push."
