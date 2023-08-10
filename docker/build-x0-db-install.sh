#!/bin/bash

workdir="$(echo $PWD)"

. ./get-env.sh

cd ../../
docker build -t x0-db-install ${CMDLINE_ADD_HOST} --file ./x0/docker/x0-db-install.dockerfile .
cd ${workdir}
