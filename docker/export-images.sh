#/bin/sh

docker save x0-app:latest > /tmp/docker.x0-app.tar
docker save x0-db:latest > /tmp/docker.x0-db.tar
docker save x0-db-install:latest > /tmp/docker.x0-db-install.tar
docker save x0-db-install-tpl:latest > /tmp/docker.x0-db-install-tpl.tar
docker save x0-test:latest > /tmp/docker.x0-test.tar
docker save x0-test-github:latest > /tmp/docker.x0-test-github.tar
docker save x0-msg-server:latest > /tmp/docker.x0-msg-server.tar
