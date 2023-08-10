#!/bin/sh

# remember work-dir
workdir="$(echo $PWD)"

# cd to docker dir
cd ../docker/

# set docker network
./x0-network.sh

# start containers
./x0-start-containers.sh

# change back
cd ${workdir}

# start pytest
pytest-3
