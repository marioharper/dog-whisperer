resource "aws_iam_role" "iam_for_lambda" {
    name = "dog-whisperer_lambda_function"
    assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "cloudwatch_full_access" {
  name = "dog-whisperer-cloudwatchlogs_full_access"
  role = "${aws_iam_role.iam_for_lambda.id}"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

output "iam_for_lambda_arn" {
  value = "${aws_iam_role.iam_for_lambda.arn}"
}
