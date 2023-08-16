# Docker

## Building

To build a Docker-Container listed in the next section, run the corresponding shell script,
e.g. build-x0-app.sh for building the Web-Application Container.

To speed up Container-Building it is possible to use a local Ubuntu Mirror by setting the
environment variables described under "Environment Variables".

This automatically adds host(s) (hostname, IP-address) to Docker-Container(s) when building
via command-line parameter.

## Container List

The following Docker Containers exist:

* x0-app (Web-Application)
* x0-db (Separated postgresql-14 Database)
* x0-db-install (Kubernetes Database Installer Image)
* x0-test (Kubernetes Integration-Test Container)

## Environment Variables

Export the following environment-variables to control use of "local" Ubuntu-Mirror:

* UBUNTU_MIRROR_DNS=archive.ubuntu.local
* UBUNTU_MIRROR_IP=10.10.100.250

## Network

When building the Docker-Network "x0-connect" in x0-network.sh script with subnet 172.20.0.0/24
will be created.

x0-app get IP-address "172.20.0.10" assigned, x0-db "172.20.0.20".

The x0-db is accessible (resolvable) with hostname "mypostgres". The ports 80, 443 and 5432 are
accesible from localhost (testing, database administration, browser access).

## Subdirs

"apt-config" folder contains the /etc/apt/source.list config which will be used for local mirror
or remote mirror depending on environment variables under "Environment Variables" set or unset.

"script" folder contains internal (startup) scripts for Container-Building, you should leave it
unmodified.
