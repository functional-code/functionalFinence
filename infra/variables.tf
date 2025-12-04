variable "aws_region" {
  description = "AWS Region"
  default     = "ap-south-1"
}

variable "db_username" {
  description = "Database username"
  default     = "postgres"
}

variable "db_password" {
  description = "Database password"
  sensitive   = true
}
