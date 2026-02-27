# Cascadia Gear Co-op — EC2 Deployment Guide

This guide walks through manually deploying the app on a fresh EC2 instance (Ubuntu 22.04).

## Prerequisites

- EC2 instance running Ubuntu 22.04 (t2.micro or larger)
- Security group with ports 22, 80, and 8001 open
- RDS MySQL instance running and accessible
- Your `.pem` key pair

---

## 1. Connect to EC2

```bash
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
```

---

## 2. Update System & Install Dependencies

```bash
sudo apt-get update -y
sudo apt-get install -y curl git
```

---

## 3. Install Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu
newgrp docker
```

Verify:
```bash
docker -v
docker compose version
```

---

## 4. Clone the Repo

```bash
cd /home/ubuntu
git clone https://github.com/konradkelly/Cascadia-Gear-Co-op.git
cd Cascadia-Gear-Co-op
```

---

## 5. Create the `.env` File

```bash
nano .env
```

Paste the following and fill in your actual values:

```env
NODE_ENV=production
PORT=8001
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

> ⚠️ Never commit `.env` to GitHub. It is already listed in `.gitignore`.

---

## 6. Start the App

```bash
docker compose up -d --build
```

Verify containers are running:
```bash
docker ps
docker compose logs app
```

---

## 7. Seed the Database (first time only)

```bash
mysql -h your-rds-endpoint.rds.amazonaws.com -u your_db_user -p'your_db_password' your_db_name < ./src/scripts/schema.sql
mysql -h your-rds-endpoint.rds.amazonaws.com -u your_db_user -p'your_db_password' your_db_name < ./src/scripts/seed.sql
```

---

## 8. Access the App

Open your browser and navigate to:

```
http://your-ec2-public-ip:8001
```

---

## Useful Commands

```bash
docker compose logs app -f      # live logs
docker compose ps               # check container status
docker compose down             # stop everything
docker compose up -d --build    # rebuild after code changes
```

---

## Notes

- If Docker install fails due to Ubuntu EOL warnings, follow the manual install steps in the Docker docs.
- The `$` characters in passwords must be escaped as `$$` inside `docker-compose.yml` environment variables.
- RDS must have port 3306 open to `0.0.0.0/0` in its security group inbound rules for EC2 to connect.