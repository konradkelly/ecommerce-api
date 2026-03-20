# Cascadia Gear Co-op

**Professional Outdoor Equipment Retailer**
Web Frameworks Capstone Project

## Team

- Jonus Clapshaw — @JonusClapshaw
- Konrad Kelly — @konradkelly
- Sam Kosal — @samkosal

---

## Project Overview

Cascadia Gear Co-op is a full-stack ecommerce web application for outdoor equipment (hiking, camping, weekend travel). It features server-side rendering with EJS, a JSON REST API, session-based authentication (local + Google OAuth), a shopping cart, and product filtering/search.

**Product categories:** Backpacks, Tents, Sleep Systems, Camp Essentials, Accessories & Tools

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js >= 18 (ES Modules) |
| Framework | Express 5 |
| Database | MySQL 8 (AWS RDS in production, Docker locally) |
| Templating | EJS |
| Auth | Passport.js (local + Google OAuth), bcryptjs (cost 12) |
| Sessions | express-session + Redis via connect-redis |
| Containerization | Docker & Docker Compose |
| CI/CD | GitHub Actions → EC2 |
| Infrastructure | AWS EC2, RDS, Terraform |

---

## Architecture

```
src/
├── controllers/       # Route handlers (EJS + API)
├── model/             # Database connection + repository modules
├── services/          # Business logic layer
├── routers/           # Express route definitions
├── middleware/         # Auth guards
├── views/             # EJS templates + partials
├── scripts/           # SQL schema, seed data, utilities
└── utility/           # Header/icon helpers
auth/
├── passport.js        # Local strategy + serialize/deserialize
└── sessions.js        # Redis session store config
docker/
└── docker-compose.dev.yml   # Local development (MySQL + phpMyAdmin + Redis)
aws-integrations/terraform/
├── providers.tf             # AWS provider config (us-east-2)
├── networking.tf            # VPC, subnets, IGW, route tables
├── ec2.tf                   # EC2 instance + security group
├── rds.tf                   # RDS MySQL instance + subnet group
├── variables.tf             # All configurable variables
└── setup.sh                 # EC2 user-data bootstrap script
```

The root `docker-compose.yml` is the **production** configuration (Redis only, connects to RDS).

---

## Getting Started (Local Development)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### 1. Clone the repo

```bash
git clone https://github.com/konradkelly/Cascadia-Gear-Co-op.git
cd Cascadia-Gear-Co-op
```

### 2. Create a `.env` file

```env
NODE_ENV=development
PORT=8001
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce
MYSQL_ROOT_PASSWORD=your_password
MYSQL_DATABASE=ecommerce
SESSION_SECRET=your_session_secret
REDIS_HOST=redis
REDIS_PORT=6379
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Start the dev environment

```bash
docker compose -f docker/docker-compose.dev.yml up --build
```

This starts:
- **Express app** on [http://localhost:8001](http://localhost:8001) (with live reload via file watchers)
- **MySQL 8** on port 3310
- **phpMyAdmin** on [http://localhost:3312](http://localhost:3312)
- **Redis** on port 6379

### 4. Load schema and seed data

```bash
docker exec -i ecommerce-mysql mysql -uroot -pyour_password ecommerce < ./src/scripts/schema.sql
docker exec -i ecommerce-mysql mysql -uroot -pyour_password ecommerce < ./src/scripts/seed.sql
```

---

## Production Deployment (AWS)

The app runs on an **EC2 instance** (Ubuntu 22.04) with an **RDS MySQL** backend. See [DEPLOYMENT.md](DEPLOYMENT.md) for the full manual setup guide.

### CI/CD

Pushes to `main` trigger a GitHub Actions workflow (`.github/workflows/ci.yml`) that:

1. Builds and validates the Docker image
2. SSHs into the EC2 instance
3. Pulls the latest code
4. Writes a `.env` from GitHub Secrets
5. Runs `docker compose up -d --build --force-recreate`

The root `docker-compose.yml` is production-only (Express + Redis). There is no local MySQL container in production — it connects to RDS.

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `EC2_HOST` | EC2 public IP or hostname |
| `EC2_USER` | SSH user (e.g., `ubuntu`) |
| `EC2_SSH_KEY` | Private key for SSH access |
| `RDS_HOST` | RDS endpoint |
| `RDS_USER` | Database username |
| `RDS_PASSWORD` | Database password |
| `RDS_DATABASE` | Database name |
| `SESSION_SECRET` | Session signing secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `categories` | Product categories |
| `products` | Name, description, price, image, featured flag |
| `images` | Random images for the landing page |
| `users` | Local + OAuth accounts (google_id, discord_id fields) |
| `user_preferred_categories` | User ↔ Category junction table |
| `carts` | One cart per user |
| `cart_items` | Line items with price snapshot at add-time |

Schema and seed files are in `src/scripts/`.

---

## Routes

### SSR (Server-Side Rendered)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/` | No | Redirects to `/landing` |
| `GET` | `/landing` | No | Landing page with featured product |
| `GET` | `/login` | No | Login form |
| `POST` | `/login` | No | Authenticate (local strategy) |
| `GET` | `/register` | No | Registration form |
| `POST` | `/register` | No | Create account |
| `POST` | `/logout` | Yes | Log out |
| `GET` | `/products` | Yes | Product listing with category filters |
| `GET` | `/products/:id` | Yes | Product detail page |
| `GET` | `/cart` | Yes | Shopping cart page |

### REST API (JSON)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/data` | Yes | All products + random images |
| `GET` | `/api/products` | Yes | Filtered/sorted product list |
| `GET` | `/api/products/:id` | Yes | Single product |
| `GET` | `/api/cart` | Yes | User's cart |
| `POST` | `/api/cart/add` | Yes | Add item to cart |
| `PUT` | `/api/cart/items/:cartItemId` | Yes | Update item quantity |
| `DELETE` | `/api/cart/items/:cartItemId` | Yes | Remove item |
| `DELETE` | `/api/cart` | Yes | Clear entire cart |

A **Postman collection** is available at [postman/Cascadia Gear Co-op API.postman_collection.json](postman/Cascadia%20Gear%20Co-op%20API.postman_collection.json).

---

## Product Filtering

`GET /api/products` supports server-side filtering via query parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | `string` | Full-text search across name, description, and category |
| `name` | `string` | Partial match on product name |
| `category` | `string` | Exact match on category (case-insensitive) |
| `minPrice` | `number` | Minimum price (inclusive) |
| `maxPrice` | `number` | Maximum price (inclusive) |
| `sort` | `string` | Sort by `id` (default), `name`, or `price` |
| `direction` | `string` | `asc` (default) or `desc` |

**Examples:**
```
GET /api/products?category=Tents&sort=price&direction=asc
GET /api/products?search=sleeping&minPrice=50&maxPrice=300
```

All filter values use parameterized queries (`?` placeholders). Sort columns are resolved through an allowlist to prevent SQL injection.

---

## Authentication

- **Local:** Username/password with bcrypt hashing (cost 12)
- **Google OAuth:** Passport google-oauth20 strategy (callback at `/auth/google/callback`)
- **Sessions:** Redis-backed via connect-redis, 24-hour TTL, HTTP-only cookies
- **Middleware:** `requireAuth` (redirects to login) and `requireAuthApi` (returns 401 JSON)

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with nodemon |
| `npm run lint` | Run ESLint |
| `npm test` | Tests (not yet configured) |

---

## AWS Infrastructure (Terraform)

The full AWS infrastructure is defined in `aws-integrations/terraform/` using Terraform (AWS provider ~> 5.0, us-east-2 region).

### Resources Provisioned

| Resource | Description |
|----------|-------------|
| VPC | `10.0.0.0/16` with internet gateway |
| Subnets | Two public subnets (us-east-2a, us-east-2b) |
| EC2 | Ubuntu 22.04 (t2.micro) with Docker bootstrap via `setup.sh` |
| RDS | MySQL 8.0 (db.t3.micro, 20 GB) |
| Security Groups | SSH (your IP), HTTP (80), Express (8001) |

### Deploy

1. Create `terraform.tfvars` with your values (key pair name, IP, DB password, etc.)
2. Set sensitive vars via environment:
   - PowerShell: `$env:TF_VAR_db_password="your_password"`
   - Bash: `export TF_VAR_db_password="your_password"`
3. Run:
   ```bash
   cd aws-integrations/terraform
   terraform init
   terraform plan
   terraform apply
   ```

> `terraform.tfvars` and `.terraform/` are in `.gitignore` — never commit credentials or state files.

---

## AWS RDS Integration (MySQL)

### Connecting to AWS RDS MySQL

After deploying your RDS instance with Terraform, you can connect using the MySQL client:

```
mysql -h <RDS_ENDPOINT> -P 3306 -u <DB_USERNAME> -p --ssl-mode=VERIFY_IDENTITY --ssl-ca="C:\\certs\\global-bundle.pem" <DB_NAME>
```

Replace `<RDS_ENDPOINT>`, `<DB_USERNAME>`, and `<DB_NAME>` with your values. You will be prompted for your password.

**Example:**
```
mysql -h ***REMOVED-ENDPOINT*** -P 3306 -u cascadia_user -p --ssl-mode=VERIFY_IDENTITY --ssl-ca="C:\\certs\\global-bundle.pem" ecommercedb
```


### Importing schema and seed data

From Command Prompt (replace `<PATH_TO_SCHEMA>` and `<PATH_TO_SEED>` with your actual file paths):
```
mysql -h ***REMOVED-ENDPOINT*** -P 3306 -u cascadia_user -p --ssl-mode=VERIFY_IDENTITY --ssl-ca="C:\\certs\\global-bundle.pem" ecommercedb < <PATH_TO_SCHEMA>
mysql -h ***REMOVED-ENDPOINT*** -P 3306 -u cascadia_user -p --ssl-mode=VERIFY_IDENTITY --ssl-ca="C:\\certs\\global-bundle.pem" ecommercedb < <PATH_TO_SEED>
```

Or, inside the MySQL prompt (use relative paths or upload files to your server):
```
source /path/to/schema.sql;
source /path/to/seed.sql;
```

**Note:** Download the RDS SSL certificate from https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem and place it at C:\certs\global-bundle.pem.

---

## License For Educational Use Only