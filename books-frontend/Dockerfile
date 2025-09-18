FROM node:18-alpine

ARG VITE_API_BASE=http://localhost:8080
ENV VITE_API_BASE=$VITE_API_BASE

# Needed for envsubst in entrypoint
RUN apk add --no-cache gettext

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build the app; Vite copies public/* into dist/, so runtime-config.js.template ends up in /app/dist
RUN npm run build

# Make the entrypoint in public executable and use it directly
RUN chmod +x /app/public/entrypoint.sh

ENV NODE_ENV=production
# entrypoint should read/write templates in this folder
ENV WEB_ROOT=/app/dist

EXPOSE 3000

ENTRYPOINT ["/app/public/entrypoint.sh"]
CMD ["npm", "run", "preview", "--", "--port", "3000", "--host"]