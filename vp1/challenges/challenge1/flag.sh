#!/bin/bash
#flag.sh

REAL_FLAG=$1
USER=$2

if [ -z "$REAL_FLAG" ] || [ -z "$USER" ]; then
  echo "خطا: پرچم یا نام کاربر وارد نشده است."
  exit 1
fi

# دریافت دقیق مسیر Home کاربر (حتی برای root)
USER_HOME=$(getent passwd "$USER" | cut -d: -f6)

if [ -z "$USER_HOME" ]; then
  echo "خطا: کاربر '$USER' در سیستم یافت نشد."
  exit 1
fi

echo "[*] Challenge Solved! Deploying flag..."
echo "$REAL_FLAG" > "$USER_HOME/flag.txt"
echo "[+] Flag deployed successfully to $USER_HOME/flag.txt"
exit 0