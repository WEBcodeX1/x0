#!/bin/sh

workdir="$(echo $PWD)"

cd ../../
docker build -t clauspruefer/x0-db --file ./x0/docker/x0-build-db.dockerfile .
cd ${workdir}
