#!/bin/bash
set -e

# تنظیم دسترسی اجرایی به فایل‌های اصلی
chmod +x ./server ./agent 2>/dev/null || true

# ۱. اجرا کردن سرور در پس‌زمینه
if [ -f "./server" ]; then
    echo "[*] Starting CTF Server in background..."
    ./server &
    sleep 2
fi

# ۲. اجرای ایجنت در پیش‌زمینه (ارسال شده از طریق CMD)
exec "$@"