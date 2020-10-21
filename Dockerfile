FROM node:12.16.1

# Add package file
COPY package*.json ./

# Install deps
RUN npm i
RUN npm audit fix --force

# Copy source
COPY . .

# Build dist
RUN npm run build-ts

# Expose port 3000
EXPOSE 3000

CMD npm run start