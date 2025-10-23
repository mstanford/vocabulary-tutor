# ---------- Build Stage ----------
FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Runtime Stage ----------
FROM nginx:alpine
# 1️⃣ Copy the React build
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
# 2️⃣ Copy the data directory into the Nginx root so the files are publicly available
COPY --from=build /usr/src/app/data /usr/share/nginx/html/data
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
