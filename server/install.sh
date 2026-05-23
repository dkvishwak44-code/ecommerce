#!/bin/bash

echo "🚀 Initializing Node Project..."

npm init -y

echo "📦 Installing Production Dependencies..."

npm install \
express \
mongoose \
dotenv \
cors \
helmet \
morgan \
jsonwebtoken \
bcryptjs \
nodemailer \
multer \
cloudinary \
multer-storage-cloudinary \
express-rate-limit \
express-validator \
cookie-parser \
compression \
slugify \
uuid \
dayjs \
socket.io \
redis \
ioredis \
bullmq \
node-cron \
swagger-ui-express \
swagger-jsdoc \
winston \
joi \
morgan \
axios \
pdfkit \
xlsx \
csv-parser \
sharp \
mime-types

echo "🛠 Installing Development Dependencies..."

npm install -D \
nodemon \
eslint \
prettier \
eslint-config-prettier \
eslint-plugin-prettier \
jest \
supertest \
cross-env

echo "✅ Creating .env file..."

touch .env

echo "✅ Updating package.json scripts..."

node -e "
const fs = require('fs');

const pkg = JSON.parse(fs.readFileSync('package.json'));

pkg.scripts = {
  dev: 'nodemon src/server.js',
  start: 'node src/server.js',
  test: 'jest',
  lint: 'eslint .',
  format: 'prettier --write .'
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

console.log('✅ package.json updated');
"

echo "✅ Installation Completed Successfully"