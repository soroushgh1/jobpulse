FROM node:22-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force

RUN npm config rm proxy 

RUN npm config rm https-proxy --tried removing npm proxy 

RUN npm install -v

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]