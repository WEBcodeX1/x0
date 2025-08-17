# Docker

## 1. Building

To build docker images listed in the next section, run the corresponding shell script,
e.g. `build-x0-app.sh` for building the web-app image.

To speed up image building it is possible to use a local ubuntu mirror by setting the env
vars described in section "3. Environment Variables".

## 2. Image List

The x0 system relies on the following docker images:

* x0-app (web-application)
* x0-db (postgresql-14 database)
* x0-db-install (kubernetes database installer image)
* x0-test (kubernetes integration-test image)

## 3. Environment Variables

Export the following environment-variables to control / use a "local" ubuntu mirror:

* UBUNTU_MIRROR_DNS=archive.ubuntu.local
* UBUNTU_MIRROR_IP=10.10.100.250

## 4. Network

When setting up the docker-network "x0-connect" in `x0-network.sh` script, the subnet
`172.20.0.0/24` will be created.

`x0-app` container uses ip-address 172.20.0.10, `x0-db` 172.20.0.20.

The `x0-db` is accessible (resolvable) by hostname "mypostgres". The ports 80, 443 and 5432 are
reachable from localhost (testing, database administration, browser access).

