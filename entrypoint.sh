# 1) Застосувати всі міграції
npx prisma migrate deploy

# 2) Запустити seed-скрипт (в залежності від налаштування в package.json)
npx prisma db seed

# 3) Нарешті — запустити сервер
node dist/main.js