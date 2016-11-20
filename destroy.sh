#!/bin/bash
set -e

export AWS_REGION="us-east-1"

cd ./infrastructure/dev-pre
terraform destroy --force

cd ../../
apex infra destroy --force
apex delete --force
