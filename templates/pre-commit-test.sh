#!/bin/bash
# Updated Pre-Commit Hook Test

set -e

echo "🔍 Starting pre-commit hook behavior test..."

# Save the original branch
original_branch=$(git symbolic-ref --short HEAD)

# Always switch to main branch
echo "🔄 Switching to main branch..."
git switch main

# Prepare test
test_file="dummy-test.txt"
echo "Temporary test file." > "$test_file"
git add "$test_file"

# Attempt commit
commit_message="Temporary test commit to main (should fail)"
if git commit -m "$commit_message"; then
  # Commit succeeded (should not happen)
  echo "❌ TEST FAILED: Commit was allowed on 'main'."
  echo "🔄 Reverting accidental commit..."
  git reset --soft HEAD~1
  git restore --staged "$test_file" || true
  git rm "$test_file" || true
  echo "🔄 Switching back to $original_branch..."
  git switch "$original_branch"
  exit 1
else
  # Commit failed as expected
  echo "✅ TEST PASSED: Commit was correctly blocked on 'main'."
  git restore --staged "$test_file" || true
  rm -f "$test_file"
  echo "🔄 Switching back to $original_branch..."
  git switch "$original_branch"
  exit 0
fi
