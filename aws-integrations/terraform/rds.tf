# Security group for the database. Ingress is restricted to the EC2 instances'
# security group — not a CIDR — so the database is reachable only from the app,
# and only on 3306.
resource "aws_security_group" "rds_sg" {
  name        = "${var.project_name}-rds-sg"
  description = "MySQL access from the application instances only"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "MySQL from app instances"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}

resource "aws_db_instance" "mysql" {
  identifier        = "ecommercedb"
  engine            = "mysql"
  engine_version    = "8.0"
  instance_class    = "db.t3.micro"
  allocated_storage = 20

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  # Pinned explicitly — without both of these the instance lands in the default
  # VPC's default subnet group with the default SG, outside the VPC that
  # networking.tf builds.
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  # Private: reachable only from the application security group above.
  publicly_accessible = false

  storage_encrypted         = true
  backup_retention_period   = 7
  skip_final_snapshot       = false
  final_snapshot_identifier = "${var.project_name}-final-${formatdate("YYYYMMDDhhmmss", timestamp())}"
  deletion_protection       = true

  tags = {
    Name        = "${var.project_name}-mysql"
    Environment = var.environment
  }

  lifecycle {
    # final_snapshot_identifier embeds a timestamp, which would otherwise show
    # up as a diff on every plan.
    ignore_changes = [final_snapshot_identifier]
  }
}

# NOTE: the subnet group still points at the public subnets, because
# networking.tf defines no private subnets. With publicly_accessible = false
# and the security group above, the instance has no public endpoint — but
# moving it to dedicated private subnets is the correct end state. Left as-is
# here to keep this change reviewable; see ROADMAP.md Phase 4.
resource "aws_db_subnet_group" "main" {
  name       = "main-db-subnet-group"
  subnet_ids = [aws_subnet.public.id, aws_subnet.public_2.id]

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}
