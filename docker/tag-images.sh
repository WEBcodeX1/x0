#/bin/sh

docker tag x0-app:latest ghcr.io/clauspruefer/x0-app:latest
docker tag x0-db:latest ghcr.io/clauspruefer/x0-db:latest
docker tag x0-db-install:latest ghcr.io/clauspruefer/x0-db-install:latest
docker tag x0-db-install-tpl:latest ghcr.io/clauspruefer/x0-db-install-tpl:latest
docker tag x0-test:latest ghcr.io/clauspruefer/x0-test:latest
docker tag x0-test-github:latest ghcr.io/clauspruefer/x0-test-github:latest
docker tag x0-msg-server:latest ghcr.io/clauspruefer/x0-msg-server:latest

docker tag x0-app:latest ghcr.io/webcodex1/x0-app:latest
docker tag x0-db:latest ghcr.io/webcodex1/x0-db:latest
docker tag x0-db-install:latest ghcr.io/webcodex1/x0-db-install:latest
docker tag x0-db-install-tpl:latest ghcr.io/webcodex1/x0-db-install-tpl:latest
docker tag x0-test:latest ghcr.io/webcodex1/x0-test:latest
docker tag x0-test-github:latest ghcr.io/webcodex1/x0-test-github:latest
docker tag x0-msg-server:latest ghcr.io/webcodex1/x0-msg-server:latest

docker push ghcr.io/clauspruefer/x0-app:latest
docker push ghcr.io/clauspruefer/x0-db:latest
docker push ghcr.io/clauspruefer/x0-db-install:latest
docker push ghcr.io/clauspruefer/x0-db-install-tpl:latest
docker push ghcr.io/clauspruefer/x0-test:latest
docker push ghcr.io/clauspruefer/x0-test-github:latest
docker push ghcr.io/clauspruefer/x0-msg-server:latest

docker push ghcr.io/webcodex1/x0-app:latest
docker push ghcr.io/webcodex1/x0-db:latest
docker push ghcr.io/webcodex1/x0-db-install:latest
docker push ghcr.io/webcodex1/x0-db-install-tpl:latest
docker push ghcr.io/webcodex1/x0-test:latest
docker push ghcr.io/webcodex1/x0-test-github:latest
docker push ghcr.io/webcodex1/x0-msg-server:latest
