#!/bin/bash
# EC2 user-data bootstrap. Installs Docker + compose and clones the app.
#
# Runtime configuration is written to .env by the GitHub Actions deploy workflow
# (.github/workflows/ci.yml) from repository secrets, and the app is started by
# `docker compose up` from there. Credentials are kept out of user-data on
# purpose — it is readable from the instance metadata service by anything
# running on the box.
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive
export UCF_FORCE_CONFOLD=1

apt-get update -y
apt-get -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" \
  install -y curl git ca-certificates

# Docker Engine + compose plugin (official convenience script)
curl -fsSL https://get.docker.com | sh
usermod -aG docker ubuntu

# Clone the app. The deploy workflow takes over from here: it writes .env from
# GitHub Secrets and runs `docker compose up -d --build`.
cd /home/ubuntu
if [ ! -d Cascadia-Gear-Co-op ]; then
  git clone https://github.com/konradkelly/Cascadia-Gear-Co-op.git
fi
chown -R ubuntu:ubuntu /home/ubuntu/Cascadia-Gear-Co-op
