#!/bin/sh

# clean up docker
docker container stop x0-app
docker container stop x0-db
docker system prune -f

# set docker network
../docker/x0-network.sh

# start containers
../docker/x0-start-containers.sh

# start pytest
pytest-3
