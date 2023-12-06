#!/bin/bash

workdir="$(echo $PWD)"

. ./scripts/get-env.sh

cd ../../
docker build -t x0-db-install-tpl ${CMDLINE_ADD_HOST} --file ./x0/docker/x0-db-install-tpl.dockerfile .
cd ${workdir}
