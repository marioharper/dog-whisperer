#!/bin/bash

export AWS_REGION="us-east-1"

cd ./infrastructure/dev-pre
terraform destroy --force

cd ../../
apex delete --force
apex infra destroy --force
