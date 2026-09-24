terraform {
  backend "s3" {
    bucket       = "maintain-state-file-terraform"
    key          = "dev/terraform.tfstate"
    region       = "ap-south-1"
    encrypt      = true
    use_lockfile = true
  }
}