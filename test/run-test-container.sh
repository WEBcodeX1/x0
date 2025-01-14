#!/bin/sh

docker stop x0-test
docker container prune -f

docker run -i \
--log-driver=none \
-a stdin -a stdout -a stderr \
--name x0-test \
--add-host=selenium-server-0:172.20.0.40 \
--add-host=selenium-server-1:172.20.0.50 \
--add-host=selenium-server-2:172.20.0.60 \
--add-host=mypostgres:172.20.0.20 \
--add-host=x0-app.click-it.online:172.20.0.10 \
--net x0-connect \
--ip 172.20.0.30 x0-test
