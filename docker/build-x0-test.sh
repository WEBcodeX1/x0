#!/bin/bash

workdir="$(echo $PWD)"

. ./scripts/get-env.sh

cd ../../
docker build --no-cache --progress=plain -t x0-test ${CMDLINE_ADD_HOST} --file ./x0/docker/x0-test.dockerfile . &> x0-build-test.log
cd ${workdir}
