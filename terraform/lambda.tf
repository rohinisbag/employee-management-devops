resource "aws_lambda_function" "api" {
  function_name = "${var.project_name}-${var.environment}-api"

  role = aws_iam_role.lambda.arn

  runtime = "python3.12"

  handler = "app.lambda_handler"

  filename = "${path.module}/../backend/lambda.zip"

  source_code_hash = filebase64sha256(
    "${path.module}/../backend/lambda.zip"
  )

  timeout     = 30
  memory_size = 512

  vpc_config {
    subnet_ids = aws_subnet.private_app[*].id

    security_group_ids = [
      aws_security_group.lambda.id
    ]
  }

  environment {
    variables = {
      DB_HOST     = aws_db_proxy.main.endpoint
      DB_NAME     = var.db_name
      DB_USER     = var.db_username
      DB_PASSWORD = "PLACEHOLDER"
    }
  }
}