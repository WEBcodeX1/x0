# x0 Development Installation

*x0 base system* runs on the following platforms.

- Google Kubernetes Engine (GKE) - Minikube
- Google Kubernetes Engine (GKE) - Production Cluster
- Local Standalone Linux (Ubuntu, Devuan)
- Local Docker Container

This installation documentation is intended for x0 system developers, if you
intend to develop an x0 application, visit: https://github.com/WEBcodeX1/x0-skeleton/.

## 1. System Prerequisites

- Debian build system (debuild)
- Debian package signing (gpg)
- Docker engine including buildx

Detailed information see [./debian/README.md](./debian/README.md) and
[./docker/README.md](./docker/README.md).

## 2. Build / Run (Docker)

The fastest way to build and run the *x0 base system* is using docker.
The following docker images must be built before the containers can be started.

- x0-app
- x0-db
- x0-test

1. Build Debian Packages

```bash
# build debian packages
cd ./debian && debuild
```

2. Build Docker Images

```bash
# build docker images
cd ./docker
./build-x0-app.sh
./build-x0-db.sh
./build-x0-test.sh
```

3. Run Containers

```bash
# start network and containers
cd ./docker && x0-start-containers.sh
```

# 3. Kubernetes / Minikube

Since a Kubernetes setup can be far more complex as imagined, the *x0 system*
offers a simple automated minikube cluster deployment to test *x0 base* or
*x0 apps* locally without .

Detailed information see [./kubernetes/MINIKUBE.md](./kubernetes/MINIKUBE.md).

