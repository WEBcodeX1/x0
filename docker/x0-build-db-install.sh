#!/bin/sh

workdir="$(echo $PWD)"

cd ../../
docker build -t clauspruefer/x0-db-install --file ./x0/docker/x0-build-db-install.dockerfile .
cd ${workdir}
