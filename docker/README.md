# Docker

## 1. Global Building

To build a Docker-Container listed in the next section, run the corresponding shell script, e.g. `build-x0-app.sh` for building the Web-Application Container.

To speed up Container-Building it is possible to use a local Ubuntu Mirror by setting the environment variables described in sub-section "Environment Variables".

Required packages for building under Ubuntu Linux (Jammy Jellyfish) are the docker base and the buildx extension.

```bash
# install docker packages including buildx system
apt-get install docker.io docker-buildx
```

## 2. Requirements / Build Application

>[!WARNING]
> All dockerfiles have been updated to use ubuntu:22.04 images (before ubuntu:latest).
> 24.04 is unsupported and does not work currently.

* Build / update debian package(s) for all Docker images
* Build Docker images (`x0-app`, `x0-db` and `x0-test`)

The following shell commands do the job:

```bash
# build debian package(s)
cd $repo/debian && debuild

# build docker images
cd $repo/docker
./build-x0-app.sh
./build-x0-db.sh
./build-x0-test.sh

# start local app
x0-start-containers.sh
```

:memo: If building for kubernetes, also build "x0-db-install" container and use Kubernetes-Installer in `/kubernetes/setup/Setup.py` subdir.

## 3. Container List

The following Docker Containers exist:

* `x0-app` (Web-Application)
* `x0-db` (Postgresql-14 Database used for running local docker)
* `x0-db-install` (Kubernetes Database Installer Image)
* `x0-db-install-tpl` (Kubernetes Database Installer Image / Template)
* `x0-test` (x0-app Test Image)

>[!NOTE]
> Note the `x0-db` image for running local docker contains full postgres database
> system. On kubernetes (kubegres) only a database installer container (`x0-db-install`)
> is needed.

## 4. Environment Variables

Export the following environment-variables to control / use a "local" Ubuntu-Mirror:

* UBUNTU_MIRROR_DNS=archive.ubuntu.local
* UBUNTU_MIRROR_IP=10.10.100.250

## 5. Network

When building the Docker-Network "x0-connect" in `x0-network.sh` script with subnet `172.20.0.0/24` will be created.

* `172.20.0.10` to `x0-app`
* `172.20.0.20` to `x0-db`

The x0-db is accessible by DNS hostname "mypostgres" docker internally.

The ports 80, 443 and 5432 are accesible from localhost (testing, database administration, browser access).

## 6. Subdirs

* `/apt-config` folder contains the /etc/apt/source.list config which will be used for local mirror or remote mirror depending on environment variables in sub-section "Environment Variables" set or unset.
* `/script` folder contains internal (startup) scripts for Container-Building, you should leave it unmodified.
* `/tmp` folder is used for building.

## 7. Integration / Build your own Application

Documentation (Sphinx) for building your own *x0 app* can be found here: [/doc](/doc).
