.. appdev-deployment

11. Deployment
==============

Deployment / Layered

* Standalone Ubuntu 22.04
* Docker
* GKE (Google Kubernetes Engine)

11.1. Standalone
----------------

Standalone provides packages for

.. _appdeployment-docker:

11.2. Docker
------------

- Building *x0-base* on Linux Ubuntu 22.04 only
- Built images / containers **run** on Windows 11 Docker Desktop
- Building on Windows 11 Docker Desktop is not possible
- x0-skeleton* also builds on Debian 12 / Devuan

.. _appdeployment-kubernetes:

11.3. Kubernetes
----------------

Note Kubernetes Deployment is intended for setting up the cluster
/ namespace hierarchy only. 

You should convert the x0 generated cluster metadata immediately to
Terraform or similar after initial deployment has been successfull.

Especially when using multiple *x0-kubernetes-envs*

11.3.x. App Configuration
-------------------------

* Environments
* Virtual Hosts
* x0-Applications

11.3.1. Kubernetes Environments
******************************

The Environment intention is to setup multiple deployment environments per
Virtual Host, e.g. "test" and "production" each containing different
DNS definiton.

11.3.2. VHosts / Applications
****************************

Multiple VirtualHosts containing multiple *x0-applications* are definable.
1 VHost must contain 1 DNS setup with properties "hostname" and "domain" defined.
