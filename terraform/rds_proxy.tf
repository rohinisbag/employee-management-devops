resource "aws_db_proxy" "main" {
  name = "${var.project_name}-${var.environment}-proxy"

  engine_family = "POSTGRESQL"

  auth {
    auth_scheme = "SECRETS"

    secret_arn = aws_db_instance.postgres.master_user_secret[0].secret_arn

    iam_auth = "DISABLED"
  }

  role_arn               = aws_iam_role.rds_proxy.arn
  vpc_subnet_ids         = aws_subnet.private_app[*].id
  vpc_security_group_ids = [aws_security_group.lambda.id]

  require_tls = true
}

resource "aws_db_proxy_default_target_group" "main" {
  db_proxy_name = aws_db_proxy.main.name

  connection_pool_config {
    connection_borrow_timeout    = 120
    max_connections_percent      = 90
    max_idle_connections_percent = 50
  }
}

resource "aws_db_proxy_target" "main" {
  db_proxy_name          = aws_db_proxy.main.name
  target_group_name      = aws_db_proxy_default_target_group.main.name
  db_instance_identifier = aws_db_instance.postgres.master_user_secret[0].secret_arn
}