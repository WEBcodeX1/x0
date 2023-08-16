#!/bin/sh

DOCKER_DIR="/var/lib/x0/docker"

cd ${DOCKER_DIR}

./build-x0-app.sh &
./build-x0-db.sh &
./build-x0-db-install.sh &
./build-x0-test.sh &
