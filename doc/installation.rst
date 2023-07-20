.. installation

.. _installation:

2. Base-System Installation
===========================

This documentation describes installing the x0-Framework on a standard Ubuntu 22.04 LTE Linux System.

The following OpenSource software components are used:

* Apache2 / Python3 WSGI (https://httpd.apache.org)
* PostgreSQL Relational Database 14 (http://www.postgresql.org)
* Psycopg2 high-speed threaded PostgreSQL DB interface (https://pypi.org/project/psycopg2)
* Python DB-Pool for Apache2 (https://github.com/clauspruefer/python-db-pool)
* Bootstrap CSS (https://getbootstrap.com)
* Sphinx Documentation Generator and RTD Theme (https://www.sphinx-doc.org)
* Selenium Test Framework (https://www.selenium.dev)
* Chromedriver for Chromium Browser (https://chromedriver.chromium.org)
* Docker (https://www.docker.com)

.. note::

	The Kubernetes install runs 100% without Single-Point-Of-Failure.

For Kubernetes, additionally the following components are used:

* Kubegres (https://www.kubegres.io)
* ingress-nginx (https://kubernetes.github.io/ingress-nginx)
* cert-manager (https://cert-manager.io)

The Apache2 webserver will be replaced by the internal clickIT Python-AS-Middleware soon.

The git repository is located at: https://git01.click-it.online.

We recommend using HSM-based Smartcards for security reasons (https://www.smartcard-hsm.com).

.. warning::

	Architectures different than Ubuntu Linux are untested and need slightly modifications in the debian
	package management metadata (especially package relations). Feel free to contribute.

.. note::

	The installation subsection (2) only covers the Base-System installation, running local Docker-Containers and
	deploying the Base-System to Kubernetes (for x0-System Developers).

	Building and running own x0-Applications does not require a Base-System-Installation, we recommend to read
	through the installation process to understand basic x0-System aspects.

	Application building, configuration and deployment can be found here: :ref:`appconfiguration`.

2.1 Docker
----------

The x0-System is shipped with 3 build files for docker container (**docker.io** package required).

1. **"x0-app"** (Base Application containing Web-Server www-data)
2. **"x0-db"** (PostgreSQL 14 Database)
3. **"x0-db-install"** (App Database Installer used for Kubernetes DB installs without CI integration)

.. note::

	Also it is preferable to use a local ubuntu package mirror if you are a x0-Developer and change things a lot.

The most easy way to get a x0-Test-System up and running is to build all containers and start them afterwards.

.. code-block:: bash
	:linenos:

	# build container(s)
	cd ${PROJECT_DIR}docker

	./x0-build-app.sh &
	./x0-build-db.sh &
	./x0-build-db-install.sh &

Start the containers.

.. code-block:: bash
	:linenos:

	# start container(s)
	cd ${PROJECT_DIR}docker

	./x0-start-containers.sh

Open the following URLs to check if the system is working correctly.

.. note::

	http://127.0.0.1/python/Index.py (Base "Hello World")

.. note::

	http://127.0.0.1/python/Index.py?appid=example1 (Examples, replace example number)

2.2 Kubernetes
--------------

The following installer script needs kubectl and openstack client(s) to be setupand a correctly configured
and accessible kubernetes cluster.

.. warning::

	You need a cofigured Openstack::Designate DNS Zone up and running. The kubernetes installer script
	will try to add the LoadBalancer Floating-IP from the app-config.js automatically.

.. code-block:: bash
	:linenos:

	# install x0-test-app
	cd ${PROJECT_DIR}/kubernetes
	./install.sh

Documentation see: #TODO: add (rendered) documentation

2.3 Standalone
--------------

Download a prebuilt package from our website or build the standalone installation Debian Package with
Debian Package Build Tools.

#TODO: add link(s) for source and package after CI integration.

2.3.1 Building
**************

For building with `dpkg-buildpackage` or `debuild` you need to install following packages:

* git
* gpg
* debhelper

After package installation generate a GPG Signing Key used for every Package generation.

.. code-block:: bash
	:linenos:

	# generate gpg signing key
	gpg --full-generate-key

.. note::

	The gpg ID (name and comment in brackets) must match exactly the git user you are building with!

Build Package (as non root user).

.. code-block:: bash
	:linenos:

	# build package
	cd ${PROJECT_DIR}
	debuild

2.3.2 Installation
******************

Install the package with the following command. Replace $DEB_FILE_NAME with real .deb file name.

.. code-block:: bash
	:linenos:

	# install package (suppress output)
	apt-get -qq install -y ./$DEB_FILE_NAME

.. note::

	The apt package installation will automatically install all required package dependencies.
