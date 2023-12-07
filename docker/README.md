# Docker

## 1. Global Building

To build a Docker-Container listed in the next section, run the corresponding shell script, e.g. `build-x0-app.sh` for building the Web-Application Container.

To speed up Container-Building it is possible to use a local Ubuntu Mirror by setting the environment variables described in sub-section "Environment Variables".

Required packages for building under Ubuntu Linux (Jammy Jellyfish) are the docker base and currently the buildx extension.

```bash
# install docker package
apt-get install docker.io
```

```bash
# download docker buildx plugin ubuntu debian install package
wget https://download.docker.com/linux/ubuntu/dists/jammy/pool/stable/amd64/docker-buildx-plugin_0.11.2-1~ubuntu.22.04~jammy_amd64.deb

# install package
apt-get install ./docker-buildx-plugin_0.11.2-1~ubuntu.22.04~jammy_amd64.deb
```

## 2. Requirements / Build Application

* Build / update Debian Package for all Docker Images
* Build Docker Images ("x0-app" and "x0-db")

The following shell commands do the job:

```bash
# build debian package(s)
cd $repo/debian && debuild

# build docker images
cd $repo/docker
./build-x0-app.sh
./build-x0-db.sh

# start local app
x0-start-containers.sh
```

:memo: If building for kubernetes, also build "x0-db-install" container and use Kubernetes-Installer in `/kubernetes/setup/Setup.py` subdir.

## 3. Container List

The following Docker Containers exist:

* x0-app (Web-Application)
* x0-db (Separated postgresql-14 Database)
* x0-db-install (Kubernetes Database Installer Image)
* x0-test (Kubernetes Integration-Test Container)

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

Documentation for _Building Your Own Application_ (Docker / Kubernetes) is documented under `/doc` subdir (Sphinx).
