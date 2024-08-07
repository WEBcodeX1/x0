#!/bin/bash

workdir="$(echo $PWD)"

. ./scripts/get-env.sh

cd ../../
docker build -t x0-test ${CMDLINE_ADD_HOST} --file ./x0/docker/x0-test.dockerfile .
cd ${workdir}
