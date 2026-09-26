#!/usr/bin/env bash
set -e

echo "Starting Clinical Ground Truth Runner..."
echo "For two-device testing, use the Network URL printed below."
echo

npm run dev -- --host 0.0.0.0
