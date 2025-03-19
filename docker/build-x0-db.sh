#!/bin/bash

workdir="$(echo $PWD)"

. ./scripts/get-env.sh

cd ../../
docker build --progress=plain -t x0-db ${CMDLINE_ADD_HOST} --file ./x0/docker/x0-db.dockerfile . &> x0-build-db.log
cd ${workdir}
