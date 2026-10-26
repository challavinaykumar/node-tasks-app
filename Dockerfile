# Build the React front end
FROM node:24-alpine AS client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Run the API and serve the built front end
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
COPY --from=client /app/client/dist ./client/dist
ENV PORT=3000
EXPOSE 3000
CMD ["node", "src/server.js"]
