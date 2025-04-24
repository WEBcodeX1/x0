#!/bin/bash

workdir="$(echo $PWD)"

. ./scripts/get-env.sh

cd ../../
docker build --progress=plain -t x0-test-github ${CMDLINE_ADD_HOST} --file ./x0/docker/x0-test-github.dockerfile . &> x0-build-test-dockerfile.log
cd ${workdir}
