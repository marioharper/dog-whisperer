#!/bin/bash
set -e 
readonly OS=$(uname -s | tr "[:upper:]" "[:lower:]")
readonly PROGPATH=$PWD
readonly BIN=$PROGPATH"/bin/"$OS
export PATH=$BIN:$PATH #add bin to path

export AWS_REGION="us-east-1"

cd $PROGPATH/infrastructure/dev-pre
terraform plan
terraform apply

sleep 2

cd $PROGPATH
apex deploy --set FITBARK_API_TOKEN=$FITBARK_API_TOKEN
apex infra plan
apex infra apply