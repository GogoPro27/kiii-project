FROM node:18-alpine

ARG VITE_API_BASE=http://localhost:8080
ENV VITE_API_BASE=$VITE_API_BASE

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build the app; Vite copies public/* into dist/, so runtime-config.js.template ends up in /app/dist
RUN npm run build

ENV NODE_ENV=production
# entrypoint should read/write templates in this folder
ENV WEB_ROOT=/app/dist

EXPOSE 3000

CMD ["npm", "run", "preview", "--", "--port", "3000", "--host"]