#!/bin/bash

CHECK_FILE="/tmp/regex_solved.txt"

if [ -f "$CHECK_FILE" ]; then
  # خروجی ok برای اطلاع به سیستم امتیازدهی
  echo "ok"
  
  # پاک کردن فایل برای جلوگیری از تداخل
  rm -f "$CHECK_FILE"
  exit 0
fi

exit 1