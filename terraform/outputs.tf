output "api_url" {
  value = aws_apigatewayv2_stage.default.invoke_url
}

output "frontend_bucket" {
  value = aws_s3_bucket.frontend.bucket
}

output "lambda_name" {
  value = aws_lambda_function.api.function_name
}

output "rds_endpoint" {
  value = aws_db_instance.main.address
}

output "rds_proxy_endpoint" {
  value = aws_db_proxy.main.endpoint
}
