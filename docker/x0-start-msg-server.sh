#!/bin/sh

docker container stop x0-msg-server
docker container rm x0-msg-server

docker run -d --name x0-msg-server --net x0-connect --ip 172.20.0.100 -p 8080:8080 x0-msg-server
