#!/bin/bash
# Thoát ngay lập tức nếu có lỗi
set -e

echo "Running Prisma migrations..."
# Áp dụng các migration vào database
npx prisma migrate deploy

echo "Starting the application..."
# Chạy lệnh CMD mặc định của Dockerfile (node dist/main.js)
exec "$@"