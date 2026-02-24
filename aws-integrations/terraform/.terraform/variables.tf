variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-2"
}

variable "project_name" {
  description = "Project name used for resource naming and tagging"
  type        = string
  default     = "cascadia-gear-co-op"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

// # ── Networking ────────────────────────────────────────────────────────────────

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_cidr" {
  description = "CIDR block for the public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "availability_zone" {
  description = "Availability zone for the subnet"
  type        = string
  default     = "us-east-2a"
}

// # ── EC2 ───────────────────────────────────────────────────────────────────────

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "key_pair_name" {
  description = "Name of the AWS key pair for SSH access"
  type        = string
}

variable "your_ip" {
  description = "Your IP address for SSH access (e.g. 203.0.113.5/32)"
  type        = string
}

# ── MySQL ─────────────────────────────────────────────────────────────────────

variable "db_name" {
  description = "MySQL database name"
  type        = string
  default     = "ecommercedb"
}

variable "db_username" {
  description = "MySQL username for the app"
  type        = string
  default     = "cascadia"
}

variable "db_password" {
  description = "MySQL password for the app user"
  type        = string
  sensitive   = true
  # Set via: $env:TF_VAR_db_password="green_river888$$$"
}

variable "db_root_password" {
  description = "MySQL root password"
  type        = string
  sensitive   = true
  # Set via: $env:TF_VAR_db_root_password="Andromeda_Worlds999$$$"
}
