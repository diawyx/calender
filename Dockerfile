# Tahap 1: Build aplikasi React
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json dan package-lock.json (atau yarn.lock)
COPY package*.json ./
# COPY yarn.lock ./ # Jika menggunakan Yarn

# Install dependencies
RUN npm install
# RUN yarn install # Jika menggunakan Yarn

# Copy semua sisa file proyek
COPY . .

# Build aplikasi React
RUN npm run build

# Tahap 2: Serve file statis dengan Nginx, dikonfigurasi untuk Cloud Run
FROM nginx:alpine

# Install 'gettext' yang menyediakan utilitas 'envsubst'
# Ini dibutuhkan untuk mengganti placeholder di file konfigurasi Nginx
RUN apk add --no-cache gettext

# Hapus konfigurasi Nginx default agar tidak konflik
RUN rm /etc/nginx/conf.d/default.conf

# Copy template konfigurasi Nginx kustom kita.
# File ini akan diproses oleh envsubst untuk menyuntikkan nilai PORT.
# Pastikan file 'nginx.conf.template' ada di direktori yang sama dengan Dockerfile
# atau sesuaikan path-nya.
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Copy hasil build aplikasi React dari tahap 'build' sebelumnya
# ke direktori root Nginx default.
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 8080 (ini adalah port default yang akan digunakan Cloud Run via env var PORT)
# Nginx akan dikonfigurasi untuk mendengarkan pada $PORT.
EXPOSE 8080

# Perintah untuk memulai Nginx.
# 1. Gunakan 'envsubst' untuk mengganti '${PORT}' di template konfigurasi Nginx
#    dengan nilai dari environment variable PORT yang disediakan oleh Cloud Run.
#    Hasilnya disimpan sebagai /etc/nginx/conf.d/default.conf.
# 2. Jalankan Nginx di foreground.
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
