#!/bin/sh

DOC_DIR="/var/lib/x0/doc"

cd ${DOC_DIR}

make html

touch /tmp/deploy-finished
