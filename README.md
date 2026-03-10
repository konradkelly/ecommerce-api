# Cascadia-Gear-Co-op

**Professional Outdoor Equipment Retailer**  
Web Frameworks Capstone Project

## Team

- Jonus Clapshaw - @JonusClapshaw
- Konrad Kelly - @konradkelly
- Sam Kosal - @samkosal

## Project Overview

Cascadia Gear Co-op is a professional ecommerce web application focused on high-quality outdoor equipment for hiking, camping, and weekend travel. The goal is to demonstrate full-stack web application architecture with server-side rendering, MVC structure, and REST-style API endpoints.

## Product Category

Outdoor equipment and camping gear.

**Categories include:**
- Backpacks
- Tents
- Sleep Systems
- Camp Essentials
- Accessories & Tools

## Application Architecture

The application follows an **MVC (Model-View-Controller)** pattern built on **Express.js** with **EJS** templating for server-side rendering and a separate JSON REST API layer.

```
src/
├── controllers/       # Route handler logic (EJS and API controllers)
├── model/             # Database queries (repository pattern)
├── services/          # Business logic between controller and model
├── routers/           # Express route definitions
└── views/             # EJS templates for SSR pages
```

---

## SSR Routes (Server-Side Rendered)

These routes return fully rendered HTML pages using EJS templates.

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/` | Landing page — displays a featured product and hero images |
| `GET` | `/products` | Product listing page — displays all products with category filter UI |
| `GET` | `/products/:id` | Product detail page — displays full details for a single product |
| `GET` | `/login` | Login page (UI placeholder) |
| `GET` | `/register` | Register page (UI placeholder) |

---

## API Endpoints

All API routes return **JSON** responses.

A full **Postman collection** for all endpoints is available:

- **Published collection:** [View on Postman](https://konradkelly.postman.co/collection/43671523-d43ec514-62dd-4ab1-b735-b76628ce4c24?source=collection_link)
- **Local file:** [postman/Cascadia Gear Co-op API.postman_collection.json](postman/Cascadia%20Gear%20Co-op%20API.postman_collection.json)

Open the published link directly in Postman, or import the local file via **File → Import**.

### `GET /api/products`

Returns a list of products. Supports optional query parameter filtering.

**Response shape:**
```json
{
  "count": 12,
  "filters": { ... },
  "products": [ ... ]
}
```

**Supported query parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | `string` | Full-text search across product name, description, and category |
| `name` | `string` | Partial match filter on product name |
| `category` | `string` | Exact (case-insensitive) match on category name |
| `minPrice` | `number` | Minimum price (inclusive) |
| `maxPrice` | `number` | Maximum price (inclusive) |
| `sort` | `string` | Sort field: `id` (default), `name`, or `price` |
| `direction` | `string` | Sort direction: `asc` (default) or `desc` |

**Example requests:**
```
GET /api/products
GET /api/products?category=Tents&sort=price&direction=asc
GET /api/products?search=sleeping&minPrice=50&maxPrice=300
GET /api/products?name=daypack&sort=name
```

---

### `GET /api/products/:id`

Returns a single product by its ID, including its category name.

**Responses:**
- `200 OK` — product object
- `404 Not Found` — `{ "error": "Product not found" }`

---

### `GET /data`

Returns all products and a set of random images. Used for internal frontend data loading.

**Response shape:**
```json
{
  "products": [ ... ],
  "images": [ ... ]
}
```

---

## How Filtering Works

Filtering on `GET /api/products` is handled server-side through parameterized SQL queries.

1. **Detection** — If any query parameter has a non-default value, the app routes the request through `getFilteredProducts()`. If no filters are provided, `getAllProducts()` is called instead (no extra processing overhead).

2. **Search** (`search`) — Performs a `LIKE` match against the product `name`, `description`, and the associated `category` name simultaneously. Returns any product matching any of those fields.

3. **Name** (`name`) — Performs a partial `LIKE` match scoped to the product `name` field only.

4. **Category** (`category`) — Performs a case-insensitive exact match against the category name using `LOWER(c.name) = LOWER(?)`.

5. **Price range** (`minPrice` / `maxPrice`) — Applies `p.price >= minPrice` and/or `p.price <= maxPrice` conditions. Either bound can be used independently.

6. **Sorting** (`sort` + `direction`) — Results can be sorted by `id`, `name`, or `price` in either `asc` or `desc` direction. When sorting by a non-`id` column, `p.id ASC` is appended as a tiebreaker for stable ordering.

7. **SQL injection safety** — All filter values are passed as parameterized query bindings (`?` placeholders). The sort column is resolved through an allowlist mapping (`price`, `name`, `id`) before being inserted into the query.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- (Optional) [Node.js](https://nodejs.org/) if you want to run the app locally without Docker

## Environment Variables

Create a `.env` file in the project root with the following content (edit values as needed):

```env
NODE_ENV=production
PORT=8001
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_chosen_password
DB_NAME=ecommerce
MYSQL_ROOT_PASSWORD=your_chosen_password
MYSQL_DATABASE=ecommerce
PMA_HOST=mysql
PMA_PORT=3306
```

## Docker Setup (Express Application + MySQL)

**Start the containers (first time or after dependency changes):**
```bash
docker compose up -d --build
```

**Start the containers (subsequent runs):**
```bash
docker compose up -d
```

**Load the schema into the database:**
```bash
docker exec -i ecommerce-mysql mysql -uroot -p${MYSQL_ROOT_PASSWORD} ecommerce < ./src/scripts/schema.sql
```

**Seed the database with sample data:**
```bash
docker exec -i ecommerce-mysql mysql -uroot -p${MYSQL_ROOT_PASSWORD} ecommerce < ./src/scripts/seed.sql
```

**Verify the database has products and images:**
```bash
docker exec -it ecommerce-mysql mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "SELECT * FROM products; SELECT * FROM images;" ecommerce
```

## Accessing the Application

- **Express Application:**  
  [http://localhost:8001](http://localhost:8001)  
  (If you change the `PORT` in your `.env` file, use that port instead.)

- **phpMyAdmin:**  
  [http://localhost:3312](http://localhost:3312)  
  - **Username:** your `DB_USER` from `.env`
  - **Password:** your `DB_PASSWORD` from `.env`
  - Select the `ecommerce` database to view and manage tables.

---

All configuration values (ports, database credentials, etc.) are managed via the `.env` file.  
Update `.env` as needed and restart Docker containers for changes to take effect.

# Deploying AWS RDS with Terraform

This project demonstrates cloud engineering skills by provisioning an AWS RDS MySQL instance using Terraform.

### Steps to Deploy RDS

1. **Configure Terraform variables:**
  - Edit `variables.tf` and `terraform.tfvars` to set your database name, username, and password.
  - Sensitive values (like passwords) should be set as environment variables:
    - PowerShell: `$env:TF_VAR_db_password="your_password"`
    - Bash: `export TF_VAR_db_password="your_password"`

2. **Initialize Terraform:**
  ```
  terraform init
  ```

3. **Plan the deployment:**
  ```
  terraform plan
  ```

4. **Apply the deployment:**
  ```
  terraform apply
  ```
  - Confirm with `yes` when prompted.

5. **Find your RDS endpoint:**
  - After deployment, log in to AWS Console > RDS > Databases to find your instance endpoint.

### Best Practices
- Use environment variables for secrets.
- Restrict RDS access with security groups.
- Make RDS publicly accessible only for development/testing.
- Download the SSL certificate for secure connections: [global-bundle.pem](https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem)

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