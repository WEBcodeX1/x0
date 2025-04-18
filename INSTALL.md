# x0 Development Installation

*x0-base-system* runs on the following platforms.

- Google Kubernetes Engine (GKE) - Minikube
- Google Kubernetes Engine (GKE) - Production Cluster
- Standalone Linux (Ubuntu, Devuan)
- Docker Environment

This installation documentation is intended for *x0-system-developer*,
if you intend to develop an *x0-application*, visit: https://github.com/WEBcodeX1/x0-skeleton/.

## 1. System Prerequisites

- Debian Build System (debuild)
- Debian Package Signing (gpg)
- Docker Engine (including buildx)

Ubuntu 22.04, 24.04

```bash
# install debian package builder / gnu gpg
apt-get -y install debuild gnupg docker.io
```

Devuan

```bash
# install debian package builder / gnu gpg
apt-get install devscripts pbuilder gnupg docker.io
```

## 2. Docker Build / Run

The fastest way to build and run the *x0-base-system* is using docker.
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

Detailed information see [./debian/README.md](./debian/README.md) and
[./docker/README.md](./docker/README.md).

3. Run Containers

```bash
# start network and containers
cd ./docker && x0-start-containers.sh
```

# 3. Kubernetes / Minikube

Since a Kubernetes setup can be far more complex as imagined, the *x0-system*
offers a simple automated Minikube cluster deployment to test *x0-base* or
*x0-applications* locally before deploying into production.

Detailed information see [./kubernetes/README.md](./kubernetes/README.md).

