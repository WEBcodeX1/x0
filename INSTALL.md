# x0 Base System Installation

*x0 base system* runs on the following platforms.

- Google Kubernetes Engine (GKE) - Minikube
- Google Kubernetes Engine (GKE) - Production Cluster
- Local Docker
- Local Standalone Ubuntu 22.04

>[!WARNING]
> The focus of this documentation is on *x0 system developers*.<br>
> If you want to develop an *x0 app*: see chapter 1. Application Development.

>[!NOTE]
> Nevertheless it can`t hurt to study the developer documentation before
> starting *x0 app development*.

## 1. Application Development

*x0 application developers* should continue with cloning the
*x0 app skeleton repository*.

```bash
# clone x0-app skeleton repository
git clone https://github.com/WEBcodeX1/x0-skeleton.git
```

>[!NOTE]
> The *x0 app skeleton repository* contains minimal setup to build (docker)
> and run your application in no time.

## 2. System Developers

The *x0 system* uses a multi-layered packaging concept (debian pakaging in
combination with docker images).

Detailed information see [./PACKAGING.md](./PACKAGING.md).

## 3. System Prerequisites

The following documentation only covers a local docker setup. To build and
run the following 

- Debian Build System
- Debian Package Signing (gpg)
- Docker Engine
- Docker Buildx

Detailed information see [./debian/README.md](./debian/README.md) and
[./docker/README.md](./docker/README.md).

## 4. Build / Run (Docker)

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

3. Run Cotnainers

```bash
# start network and containers
cd ./docker && x0-start-containers.sh
```

# 5. Kubernetes / Minikube

Since a Kubernetes setup can be far more complex as imagined, the *x0 system*
offers a simple automated minikube cluster deployment to test *x0 base* or
*x0 apps* locally without .

Detailed information see [./kubernetes/MINIKUBE.md](./kubernetes/MINIKUBE.md).
