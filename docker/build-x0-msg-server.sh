#!/bin/bash

workdir="$(echo $PWD)"

. ./scripts/get-env.sh

cd ../../
docker build --progress=plain -t x0-msg-server ${CMDLINE_ADD_HOST} --file ./x0/docker/x0-msg-server.dockerfile . &> x0-build-msg-server.log
cd ${workdir}
