# Tahap build React app
FROM node:20-alpine AS build

# Set workdir
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code
COPY . .

# Build React app
RUN npm run build

# Tahap production pakai Nginx
FROM nginx:alpine

# Copy custom nginx config ke container
COPY nginx.conf /etc/nginx/nginx.conf

# Copy hasil build React ke folder default Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 8080 ke Cloud Run
EXPOSE 8080

# Command buat start nginx
CMD ["nginx", "-g", "daemon off;"]