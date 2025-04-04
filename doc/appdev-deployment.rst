.. appdev-deployment

11. Deployment
==============

Imagine the *x0-deployment-system* is devided into 3 Sub-Layer.

* Linux Standalone (Layer 1)
* Docker (Layer 2)
* Kubernetes Engine (Layer 3)

Layer 1 provides Debian Packages for Layer 2 (Docker),
Layer 2 generates Docker Images used by Layer 3 (GKE Google Kubernetes Engine).

.. _appdeployment-standalone:

11.1. Standalone / Debian Packaging
-----------------------------------

Standalone provides packages for Ubuntu 22.04.



.. _appdeployment-docker:

11.2. Docker
------------

Docker 

- Building *x0-base* on Linux Ubuntu 22.04 only
- Built images / containers **run** on Windows 11 Docker Desktop
- Building on Windows 11 Docker Desktop not possible
- x0-skeleton* also builds on Debian 12 / Devuan

.. _appdeployment-kubernetes:

11.3. Kubernetes / DevOps
-------------------------

*x0-kubernetes-installer* / Kubernetes Deployment is intended for setting
up a cluster / namespace hierarchy only. 

.. warning::

	It is **not** intended for managing / updating a kubernetes cluster.

You should convert the x0 generated cluster metadata immediately to
Terraform or similar after initial deployment has been successfull.

Especially when using multiple *x0-kubernetes-envs* intended for large-scale
deployments (many cluster-setup).

11.3.x. App Configuration
-------------------------

* Environments
* Virtual Hosts
* x0-Applications

11.3.1. Kubernetes Environments
*******************************

The Environment intention is to setup multiple deployment environments per
Virtual Host, e.g. "development", "test" and "production" each containing different
DNS parameter.

11.3.2. VHosts / Applications
*****************************

Multiple VirtualHosts containing multiple *x0-applications* are definable.
1 VHost must contain 1 DNS setup with properties "hostname" and "domain" defined.
