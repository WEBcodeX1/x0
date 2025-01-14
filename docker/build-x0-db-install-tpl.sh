#!/bin/bash

workdir="$(echo $PWD)"

. ./scripts/get-env.sh

cd ../../
docker build --no-cache --progress=plain -t x0-db-install-tpl ${CMDLINE_ADD_HOST} --file ./x0/docker/x0-db-install-tpl.dockerfile . &> x0-build-db-install-tpl.log
cd ${workdir}
