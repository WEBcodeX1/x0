#!/bin/bash

workdir="$(echo $PWD)"

cd ../../
docker build --progress=plain -t x0-static --file ./x0/docker/x0-static.dockerfile . &> x0-build-static.log
cd ${workdir}
