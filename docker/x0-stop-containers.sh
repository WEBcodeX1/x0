#!/bin/sh

docker stop x0-app
docker stop x0-db

docker container prune -f
