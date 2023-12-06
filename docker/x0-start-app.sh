#!/bin/sh

docker stop x0-app
docker container rm x0-app

docker run -i \
--log-driver=none \
-a stdin -a stdout -a stderr \
--name x0-app \
--add-host=mypostgres:172.20.0.20 \
--net x0-connect \
--ip 172.20.0.10 -p 80:80 -p 443:443 x0-app
