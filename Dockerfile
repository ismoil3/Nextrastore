# 1. Базовый образ
FROM node:20-alpine

# 2. Рабочая директория
WORKDIR /app

# 3. Копируем package.json и package-lock.json
COPY package*.json ./

# 4. Устанавливаем зависимости (игнорируем peer conflicts)
RUN npm install --legacy-peer-deps

# 5. Копируем остальной код
COPY . .

# 6. Собираем проект
RUN npm run build

# 7. Указываем порт
EXPOSE 3000

# 8. Запуск Next.js
CMD ["npm", "run", "start"]