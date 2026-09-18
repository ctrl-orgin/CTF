#!/bin/bash

TARGET_FILE="/tmp/regex_tester.py"

# ایجاد فایل پایتون با چالش ریجکس
cat << 'EOF' > $TARGET_FILE
import sys
import re

print("--- Email Regex Validator ---")

if len(sys.argv) != 2:
    print("Usage: python3 /tmp/regex_tester.py '<your_regex_pattern>'")
    print("Example: python3 /tmp/regex_tester.py '^.+@.+$'")
    sys.exit(1)

user_regex = sys.argv[1]

# دیکشنری تست‌ها: کلید = رشته ایمیل، مقدار = آیا باید تایید شود یا خیر
test_cases = {
    "admin@google.com": True,
    "user_123@test.ir": True,
    "info@my-site.org": True,
    "invalid-email": False,
    "test@.com": False,
    "@domain.com": False,
    "user@domain": False
}

try:
    # کامپایل کردن ریجکس کاربر
    compiled_re = re.compile(user_regex)
except re.error:
    print("[-] خطا: ریجکس وارد شده از نظر سینتکس پایتون معتبر نیست!")
    sys.exit(1)

passed_all = True
for text, expected_match in test_cases.items():
    # استفاده از fullmatch برای تطبیق کل رشته
    is_match = bool(compiled_re.fullmatch(text))
    
    if is_match != expected_match:
        print(f"[-] Test failed on: '{text}' (Expected valid: {expected_match})")
        passed_all = False

if passed_all:
    print("[+] All tests passed! You are a Regex Master.")
    with open("/tmp/regex_solved.txt", "w") as f:
        f.write("solved")
else:
    print("[-] Some tests failed. Keep refining your regex!")
EOF

# دادن قابلیت اجرا به فایل پایتون
chmod 755 $TARGET_FILE

echo "[+] Regex tester script created at $TARGET_FILE"
exit 0