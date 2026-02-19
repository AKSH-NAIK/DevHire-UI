#!/bin/bash
pkill -f "vite" || true
rm -rf node_modules/.vite
pnpm install
pnpm dev
