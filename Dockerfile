# Gunakan image node untuk build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file ke workdir
COPY . .

# Build react app
RUN npm run build

# Gunakan nginx untuk serving build file
FROM nginx:alpine

# Copy build hasil dari stage sebelumnya
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
