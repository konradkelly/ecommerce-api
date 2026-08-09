output "rds_endpoint" {
  description = "RDS MySQL endpoint. Not publicly reachable — connect from the app instance, or via an SSH tunnel through it."
  value       = aws_db_instance.mysql.address
}

output "rds_port" {
  value = aws_db_instance.mysql.port
}

output "db_security_group_id" {
  value = aws_security_group.rds_sg.id
}
