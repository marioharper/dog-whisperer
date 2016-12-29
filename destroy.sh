#!/bin/bash
set -e
readonly OS=$(uname -s | tr "[:upper:]" "[:lower:]")
readonly PROGPATH=$PWD
readonly BIN=$PROGPATH"/bin/"$OS
export PATH=$BIN:$PATH #add bin to path

export AWS_REGION="us-east-1"

cd $PROGPATH/infrastructure/dev-pre
terraform destroy --force

cd $PROGPATH
apex infra destroy --force
apex delete --force
