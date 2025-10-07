FROM node:20-alpine3.18

WORKDIR /app

# Зависимости для Prisma на Alpine
RUN apk add --no-cache openssl1.1-compat libc6-compat

COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 4000
CMD ["npm", "run", "start"]
