FROM node:24.8.0-bullseye as builder
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Just output the built files to a volume that Caddy will serve
FROM alpine:latest
WORKDIR /app
COPY --from=builder /src/build /app
CMD ["sh", "-c", "cp -r /app/* /srv/frontend/ && tail -f /dev/null"]