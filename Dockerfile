# 1. Base image
FROM node:20-alpine

# 2. Working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies (ignore peer conflicts)
RUN npm install --legacy-peer-deps

# 5. Copy the rest of the code
COPY . .

# 6. Build the project
RUN npm run build

# 7. Specify port
EXPOSE 3000

# 8. Run Next.js
CMD ["npm", "run", "start"]
