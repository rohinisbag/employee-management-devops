variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "project_name" {
  type    = string
  default = "employee-app"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "db_name" {
  type    = string
  default = "employees"
}

variable "db_username" {
  type    = string
  default = "employeeapp"
}