#!/usr/bin/env bash
set -u

echo "=== Clinical Ground Truth Runner: requirements check ==="
echo

if command -v node >/dev/null 2>&1; then
  echo "Node:"
  node --version
else
  echo "Node: NOT INSTALLED"
fi

echo

if command -v npm >/dev/null 2>&1; then
  echo "npm:"
  npm --version
else
  echo "npm: NOT INSTALLED"
fi

echo

if command -v git >/dev/null 2>&1; then
  echo "Git:"
  git --version
else
  echo "Git: not installed (recommended but not required for local use)"
fi

echo

if command -v code >/dev/null 2>&1; then
  echo "VS Code command:"
  code --version | head -n 1
else
  echo "VS Code command: not available in PATH"
fi

echo
echo "Recommended: Node.js 20 or newer."
