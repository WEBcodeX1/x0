.. appdev-deployment

14. Deployment
==============

The *x0-deployment* main goal is to get multiple production ready GKE
(Google Kubernetes Engine) environments online with minimum effort.

Why Kubernetes? Its the only current system worldwide to guarantee
native fail-safe operations including application load-balancing and
auto-scaling.

Following, our proposed deployment workflow.

* Run & Test Application in Docker Environment (x0-supported)
* Deploy on Kubernetes Minikube (x0-supported)
* Deploy to GKE Production Cluster (x0-supported)
* Terraform Convert Metadata (x0-supported)
* Takeover Livecycle Management by Terraform or similar tools

.. _appdeployment-standalone:

14.1. Standalone
----------------

Standalone installation provides packages for Ubuntu 22.04.

If you really like to run packages natively, install *x0-app* and *x0-db*
.deb packages. It is strongly advised to use the docker environment to
avoid unneccessary effort.

.. code-block:: bash

	dpkg -i x0-db_0.9_all.deb
	dpkg -i x-app_0.99_all.deb

.. _appdeployment-docker:

14.2. Docker
------------

The *x0-docker-environment* is primarily intended to test your application
locally before more time-consuming Kubernetes deployments apply.

A Minikube deployment also includes infrastructural / loadbalancing tests
to ensure your application also bahaves correctly on GKE.

Steps for running tests.

* Start Application Containers (x0-app, x0-db)
* Start Selenium Server Container
* Start Test-Runner Container

.. code-block:: bash

	# start x0-app, x0-db containers
	cd ./docker && ./x0-start-containers.sh

	# start x0-app, x0-db containers
	cd ../test
	python3 ./run-selenium-server.py
	sleep 10 && ./run-test-container.sh

Docker on Windows

* Final built images / containers also **run** on Windows 11 (Docker Desktop)
* Building on Windows 11 (Docker Desktop) is not possible

.. _appdeployment-kubernetes:

14.3. Kubernetes
----------------

The kubernetes installer (Setup.py )

* Multi-Pod PostgreSQL Database (Kubegres)
* Multi-Pod x0-application
* Ingress-nginX Application Load-Balancing

.. image:: images/x0-deployment.png
  :alt: image - kubernetes deployment

* Environments
* Virtual Hosts
* x0-Applications

14.3.1. Base Properties
***********************

.. table:: Kubernetes Installer Base Properties
	:widths: 30 20 50

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| project             | Object               |                                                 |
	+---------------------+----------------------+-------------------------------------------------+
	| installer           | Object               |                                                 |
	+---------------------+----------------------+-------------------------------------------------+
	| database            | Object               |                                                 |
	+---------------------+----------------------+-------------------------------------------------+
	| env_list            | Array of EnvStrings  |                                                 |
	+---------------------+----------------------+-------------------------------------------------+
	| environments        | Object               |                                                 |
	+---------------------+----------------------+-------------------------------------------------+
	| vhosts              | Object               |                                                 |
	+---------------------+----------------------+-------------------------------------------------+

14.3.2. Project Properties
**************************

.. table:: Kubernetes Installer Base Properties
	:widths: 30 20 50

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| name                | String               |                                                 |
	+---------------------+----------------------+-------------------------------------------------+
	| id                  | String               |                                                 |
	+---------------------+----------------------+-------------------------------------------------+
	| git-repo            | String               |                                                 |
	+---------------------+----------------------+-------------------------------------------------+

14.3.3. Installer Properties
****************************

.. table:: Kubernetes Installer Installer Properties
	:widths: 30 20 50

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| type                | Enum String          | "x0" | "debian-package"                         |
	+---------------------+----------------------+-------------------------------------------------+

14.3.4. Database Properties
***************************

.. table:: Kubernetes Installer Database Properties
	:widths: 30 20 50

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| name                | String               |                                                 |
	+---------------------+----------------------+-------------------------------------------------+
	| su_password         | String               |                                                 |
	+---------------------+----------------------+-------------------------------------------------+
	| x0_password         | String               |                                                 |
	+---------------------+----------------------+-------------------------------------------------+
	| repl_password       | String               |                                                 |
	+---------------------+----------------------+-------------------------------------------------+

14.3.5. Environment Element
***************************

.. table:: Kubernetes Installer Environment Element Properties
	:widths: 30 20 50

	+-----------------------------------------+----------------------+-------------------------------------------------+
	| **Property**                            | **Type**             | **Description**                                 |
	+=========================================+======================+=================================================+
	| $env.kubernetes                         | Object               |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $env.kubernetes.deployment              | Object               |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $env.kubernetes.deployment.image        | String               |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $env.kubernetes.deployment.replicas     | Integer              |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $env.kubernetes.deployment.cpu          | String               |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $env.kubernetes.deployment.memory       | String               |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $env.kubernetes.deployment.autoscale    | Boolean              |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $env.database                           | Object               |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $env.database.size                      | String               |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $env.database.replicas                  | Integer              |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+

14.3.6. VirtualHost Element
***************************

.. table:: Kubernetes Installer VirtualHost Element Properties
	:widths: 30 20 50

	+-----------------------------------------+----------------------+-------------------------------------------------+
	| **Property**                            | **Type**             | **Description**                                 |
	+=========================================+======================+=================================================+
	| $vhost.apps                             | Array of AppStrings  |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $vhost.env                              | Object               |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $vhost.env.$env                         | Object               |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $vhost.env.$env.dns                     | Object               |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $vhost.env.$env.dns.hostname            | String               |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $vhost.env.$env.dns.domain              | String               |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $vhost.env.$env.ip                      | Object               |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $vhost.env.$env.ip.v4.dns_register      | Boolean              |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $vhost.env.$env.ip.v4.dns_register_type | String               |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $vhost.env.$env.tls                     | Object               |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $vhost.env.$env.tls.certs               | Object               |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $vhost.env.$env.tls.certs.ca-cert       | CertID-String        |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $vhost.env.$env.tls.certs.cert          | CertID-String        |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $vhost.env.$env.tls.certs.key           | CertID-String        |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $vhost.env.$env.tls.verify-client-certs | Boolean              |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $vhost.env.$env.loadbalancer            | Object               |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
	| $vhost.env.$env.whitelist-source        | IPv4Net-String       |                                                 |
	+-----------------------------------------+----------------------+-------------------------------------------------+
