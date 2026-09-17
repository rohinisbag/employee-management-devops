resource "aws_db_subnet_group" "main" {
  name = "${var.project_name}-${var.environment}-db"

  subnet_ids = aws_subnet.private_db[*].id

  tags = {
    Name = "${var.project_name}-${var.environment}-db-subnet-group"
  }
}