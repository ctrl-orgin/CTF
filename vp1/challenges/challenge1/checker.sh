#!/bin/bash

TARGET_USER=$1

if [ -z "$TARGET_USER" ]; then
  exit 1
fi

if ! id "$TARGET_USER" >/dev/null 2>&1; then
  exit 1
fi

SSH_SESSIONS=$(who | grep -E "^${TARGET_USER}[[:space:]]+")
SSHD_PIDS=$(pgrep -u "$TARGET_USER" -f "sshd:" 2>/dev/null)

if [ -n "$SSH_SESSIONS" ] || [ -n "$SSHD_PIDS" ]; then
  # خروجی با حروف کوچک مطابق با بررسی Go
  echo "ok"
  exit 0
else
  exit 1
fi