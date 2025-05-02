#!/bin/bash
set -e

echo "🔧 Installing Git hooks..."

if [ ! -d ".git" ]; then
  echo "❌ Error: Not inside a Git repository."
  exit 1
fi

# Install pre-commit hook
if [ -f "templates/pre-commit" ]; then
  cp templates/pre-commit .git/hooks/pre-commit
  chmod +x .git/hooks/pre-commit
  echo "✅ Installed pre-commit hook."
else
  echo "⚠️ Warning: templates/pre-commit not found. Skipping pre-commit hook."
fi

echo "✅ Hook installation complete."
