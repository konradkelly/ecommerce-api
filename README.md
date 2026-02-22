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
mysql -h ecommercedb.cju0u6waad4i.us-east-2.rds.amazonaws.com -P 3306 -u cascadia_user -p --ssl-mode=VERIFY_IDENTITY --ssl-ca="C:\\certs\\global-bundle.pem" ecommercedb
```


### Importing schema and seed data

From Command Prompt (replace `<PATH_TO_SCHEMA>` and `<PATH_TO_SEED>` with your actual file paths):
```
mysql -h ecommercedb.cju0u6waad4i.us-east-2.rds.amazonaws.com -P 3306 -u cascadia_user -p --ssl-mode=VERIFY_IDENTITY --ssl-ca="C:\\certs\\global-bundle.pem" ecommercedb < <PATH_TO_SCHEMA>
mysql -h ecommercedb.cju0u6waad4i.us-east-2.rds.amazonaws.com -P 3306 -u cascadia_user -p --ssl-mode=VERIFY_IDENTITY --ssl-ca="C:\\certs\\global-bundle.pem" ecommercedb < <PATH_TO_SEED>
```

Or, inside the MySQL prompt (use relative paths or upload files to your server):
```
source /path/to/schema.sql;
source /path/to/seed.sql;
```

**Note:** Download the RDS SSL certificate from https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem and place it at C:\certs\global-bundle.pem.

---

## License For Educational Use Only