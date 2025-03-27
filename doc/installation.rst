.. installation

.. _installation:

2. Installation
===============

As first step, check if it is really necessary for you to install the
*x0-base-system*.

If you intend to develop *x0-applications* only, you first should start setting
up *x0-skeleton* (git template repository) at https://github.com/WEBcodeX1/x0-skeleton.

After finish setting up your x0-app repository, you should continue reading the
documentation section :ref:`appdevelopment` to get details about building
/ configuring an *x0-application*.

If you intend to create own *x0 system objects* used in your *x0 application*,
you should continue reading this chapter.

2.1. Environments
-----------------

The following native linux distributions .

* Ubuntu 22.04.4
* Debian 12
* Devuan 5 (daedalus)

Docker images created by x0-system rely on Ubuntu 22.04.



2.3. Dependencies
-----------------

* Apache2 / Python3 WSGI (https://httpd.apache.org)
* PostgreSQL Relational Database 14 (http://www.postgresql.org)
* Psycopg2 high-speed threaded PostgreSQL DB interface (https://pypi.org/project/psycopg2)
* Python DB-Pool for Apache2 (https://github.com/clauspruefer/python-db-pool)
* Bootstrap 5.3 CSS (https://getbootstrap.com)
* Sphinx Documentation Generator and RTD Theme (https://www.sphinx-doc.org)
* Selenium Test Framework (https://www.selenium.dev)
* Chromedriver for Chromium Browser (https://chromedriver.chromium.org)
* Docker (https://www.docker.com)

GKE (Google Kubernetes Engine) deployment also depends on additional ...

* Kubegres (https://www.kubegres.io)
* ingress-nginx (https://kubernetes.github.io/ingress-nginx)
* cert-manager (https://cert-manager.io)

High strutured OOP based WebServices backend abstraction layer (optional)

* Python microesb (https://github.com/clauspruefer/python-micro-esb)

2.4. Get System Ready
---------------------

Using docker.io as development ... reduces the dependencies you need to install
on the underlaying linux host.

- setup docker / user permissions
- debuild + gpg signing keys

Working docker images can be downloaded from: (current version)

.


.. code-block:: bash
	:linenos:

	# generate gpg signing key
	gpg --full-generate-key

.. note::

	The gpg ID (name and comment in brackets) must match exactly the git user you are building with!

2.5. Docker Images
------------------

The following docker images are used to run the *x0-base-system* including
system database.

- **"x0-app"** (*x0 application* containing web- and application-server)
- **"x0-db"** (PostgreSQL 14 database including *x0 system database*)

Kubernetes deployment also uses the following images.

- **"x0-db-install"** ()
- **"x0-db-install-tpl"** ()

2.6. Local Ubuntu Mirror
------------------------

.. note::

	Also it is preferable to use a local ubuntu package mirror if you are a x0-Developer and change things a lot.

2.7. IP Addresses / DNS
-----------------------

copy from x0-skeleteon!

2.8. Check Working System
-------------------------

Build debian packages, docker images and start *x0-system* containers.

.. code-block:: bash
	:linenos:

	# build package
	cd ./debian/
	debuild

	# build container(s)
	cd ../docker/

	./x0-build-app.sh &
	./x0-build-db.sh &
	./x0-build-test.sh &

	# start container(s)
	./x0-start-containers.sh

Open http://x0-app.x0.localnet/python/Index.py in a local browser to check if
the system is working correctly.

2.9. Examples
-------------

http://x0-app.x0.localnet/python/Index.py?appid=example1 (Examples, replace example number)


2.10. Tests / CI
----------------


2.11. Kubernetes
----------------

*x0* also runs on GKE (Google Kubernetes Engine) including Minikube.

A *x0-kubernetes-deployment* includes an automated loadbalanced (ingress-nginx),
99.9% redundant setup. Also *x0-system-database* is setup failsave.

Detailed documentation see: https:// ./kubernetes/README.md .

+ ADD app-config JSON schema documentation!
