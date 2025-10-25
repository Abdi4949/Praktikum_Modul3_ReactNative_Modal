# Gunakan image Node.js dengan versi LTS
FROM node:18-bullseye

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install expo-cli, ngrok, dan dependencies project
RUN npm install -g expo-cli @expo/ngrok && npm install --legacy-peer-deps

# Copy semua file project ke container
COPY . .

# Expo menggunakan port 8081 (Metro), 19000 (expo go), dan 19006 (web)
EXPOSE 8081 19000 19006

# Jalankan expo (gunakan CI=1 agar non-interactive)
ENV CI=false
CMD ["npx", "expo", "start", "--tunnel"]
