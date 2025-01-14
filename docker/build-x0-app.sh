#!/bin/bash

workdir="$(echo $PWD)"

. ./scripts/get-env.sh

cd ../../
docker build --no-cache --progress=plain -t x0-app ${CMDLINE_ADD_HOST} --file ./x0/docker/x0-app.dockerfile . &> x0-build-app.log
cd ${workdir}
