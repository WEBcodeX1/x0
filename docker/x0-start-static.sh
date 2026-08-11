#!/bin/sh

docker stop x0-static
docker container rm x0-static

docker run -i \
--log-driver=none \
-a stdin -a stdout -a stderr \
--name x0-static \
-p 8080:80 x0-static
