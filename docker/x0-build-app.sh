#!/bin/sh

workdir="$(echo $PWD)"

cd ../../
docker build -t clauspruefer/x0-app --file ./x0/docker/x0-build-app.dockerfile .
cd ${workdir}
