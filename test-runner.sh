#!/bin/bash
# Test Runner for setup-scripts project

set -e

echo "🚀 Running all available tests..."

test_dir="templates"
failures=0

# Save original directory
original_dir=$(pwd)

for test_script in "$test_dir"/*-test.sh; do
  if [ -f "$test_script" ]; then
    echo "▶️  Running $(basename "$test_script")..."
    # Run test in subshell to isolate environment changes
    (bash "$test_script")
    if [ $? -ne 0 ]; then
      # Return to original directory after each test
      cd "$original_dir"
      echo "❌ Test $(basename "$test_script") FAILED."
      failures=$((failures+1))
    else
      echo "✅ Test $(basename "$test_script") PASSED."
    fi
    echo "---------------------------"
  fi
done

if [ "$failures" -eq 0 ]; then
  echo "🎉 All tests passed!"
  exit 0
else
  echo "🔥 $failures test(s) failed."
  exit 1
fi
