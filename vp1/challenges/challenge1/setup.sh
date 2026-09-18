#!/bin/bash

NEW_PORT=$1

if [ -z "$NEW_PORT" ]; then
  echo "خطا: شماره پورت وارد نشده است."
  exit 1
fi

if ! [[ "$NEW_PORT" =~ ^[0-9]+$ ]] || [ "$NEW_PORT" -le 1024 ] || [ "$NEW_PORT" -gt 65535 ]; then
  echo "خطا: شماره پورت باید عددی بین 1025 تا 65535 باشد. PORT: $NEW_PORT"
  exit 1
fi

echo "[1/2] تغییر پورت SSH در sshd_config..."
if grep -q "^#\?Port " /etc/ssh/sshd_config; then
  sed -i "s/^#\?Port .*/Port $NEW_PORT/" /etc/ssh/sshd_config
else
  echo "Port $NEW_PORT" >> /etc/ssh/sshd_config
fi

echo "[2/2] راه‌اندازی مجدد سرویس SSH..."
# استفاده از service به جای systemctl برای محیط Docker
service ssh restart || /usr/sbin/sshd -D &

echo "تغییر پورت با موفقیت انجام شد!"