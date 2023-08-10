#!/bin/sh

./x0-network.sh
./x0-stop-containers.sh

docker run -d --name x0-db --net x0-connect --ip 172.20.0.20 -p 5432:5432 x0-db
docker run -d --name x0-app --add-host=mypostgres:172.20.0.20 --net x0-connect --ip 172.20.0.10 -p 80:80 -p 443:443 x0-app
