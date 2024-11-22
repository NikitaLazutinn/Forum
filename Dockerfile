# 1. Використовуємо базовий образ Node.js
FROM node:20

# 2. Встановлюємо робочу директорію
WORKDIR /usr/src/app

# 3. Копіюємо package.json та package-lock.json для встановлення залежностей
COPY package*.json ./

# 4. Встановлюємо залежності
RUN npm install

# 5. Копіюємо всі файли проєкту в контейнер
COPY . .

# 6. Виставляємо порт для додатка
EXPOSE 3000

# 7. Команда для запуску проєкту
CMD ["npm", "run", "start"]

RUN npm install -g @nestjs/cli
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npx prisma generate
COPY . .
