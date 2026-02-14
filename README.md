# ecommerce-api

**Professional Outdoor Equipment Retailer**\
Web Frameworks Capstone Project

## Team

- Jonus Clapshaw - @JonusClapshaw
- Konrad Kelly - @konradkelly
- Sam Kosal - @samkosal

## Project Overview

Cascadia Gear Co-op is a professional ecommerce web application focused on high-quality outdoor equipment for hiking, camping, and weekend travel. The goal is to demonstrate full-stack web application architecture with server-side rendering, MVC structure, and REST-style API endpoints.

## Product Category

Outdoor equipment and camping gear (no clothing).

## Basic Setup

```bash
npm install
npm i express
npm run dev
```

## Docker Setup (App + MySQL)

Start the containers:

```bash
docker compose up -d
```

Load the schema into the database:

```bash
docker exec -i ecommerce-mysql mysql -uroot -proot_password ecommerce < ./src/scripts/schema.sql
```

Seed the database with sample data:

```bash
docker exec -i ecommerce-mysql mysql -uroot -proot_password ecommerce < ./src/scripts/seed.sql
```

Verify the database has products:

```bash
docker exec -it ecommerce-mysql mysql -uroot -proot_password -e "SELECT COUNT(*) AS product_count FROM products;" ecommerce
```
