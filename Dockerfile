# ========= STAGE 1: BUILD - Môi trường tạm thời để build code =========
FROM node:22-alpine AS builder
WORKDIR /app

# Cài các gói hệ thống cần thiết cho Prisma/Node.js trên Alpine Linux
RUN apk add --no-cache openssl libc6-compat

# Tối ưu cache layer bằng cách copy các file manifest và schema trước
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# Dùng npm ci để cài đặt dependencies một cách nhất quán
# Script 'postinstall' (prisma generate) sẽ chạy thành công ở bước này
RUN npm ci

# Copy toàn bộ mã nguồn và build ứng dụng
COPY . .
RUN npm run build

# Xóa các gói dev dependencies để giảm kích thước node_modules
RUN npm prune --omit=dev


# ========= STAGE 2: RUNTIME - Image cuối cùng để triển khai =========
FROM node:22-alpine
WORKDIR /app

# Cài các gói hệ thống tối thiểu cần thiết để chạy
RUN apk add --no-cache openssl libc6-compat bash

# Tạo một user và group riêng cho ứng dụng để tăng cường bảo mật (không chạy bằng root)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy các file cần thiết từ stage builder và gán quyền sở hữu cho user mới
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/prisma ./prisma
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json

# Tạo thư mục uploads (nếu cần) và gán quyền sở hữu
RUN mkdir /app/uploads && chown -R appuser:appgroup /app/uploads

# Chuyển sang user không phải root
USER appuser

# Copy và cấp quyền thực thi cho entrypoint script
COPY --chown=appuser:appgroup docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Thông báo cổng mà ứng dụng sẽ lắng nghe
EXPOSE 8080

# Entrypoint sẽ chạy migrate trước, sau đó chạy CMD
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "dist/main.js"]