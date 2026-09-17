data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-${var.environment}-vpc"
  }
}

resource "aws_subnet" "private_app" {
  count = 2

  vpc_id = aws_vpc.main.id

  cidr_block = "10.0.${count.index + 1}.0/24"

  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "${var.project_name}-${var.environment}-private-app-${count.index + 1}"
  }
}

resource "aws_subnet" "private_db" {
  count = 2

  vpc_id = aws_vpc.main.id

  cidr_block = "10.0.${count.index + 11}.0/24"

  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "${var.project_name}-${var.environment}-private-db-${count.index + 1}"
  }
}