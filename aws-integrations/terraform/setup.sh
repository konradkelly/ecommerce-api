#!/bin/bash
export DEBIAN_FRONTEND=noninteractive
export UCF_FORCE_CONFOLD=1
sudo apt-get update -y
sudo apt-get -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" install -y curl git
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt-get install -y nodejs

# Clone your app repo
cd /home/ubuntu
rm -rf Cascadia-Gear-Co-op
git clone https://github.com/konradkelly/Cascadia-Gear-Co-op.git
cd Cascadia-Gear-Co-op

# Install dependencies
npm ci --only=production

# Set environment variables (update as needed for RDS connection)
export NODE_ENV=production
export PORT=8001
export DB_HOST="***REMOVED-ENDPOINT***"
export DB_PORT=3306
export DB_USER="cascadia_user"
export DB_PASSWORD="***REMOVED-CREDENTIAL***"
export DB_NAME="ecommercedb"

# Start the app
npm run dev
