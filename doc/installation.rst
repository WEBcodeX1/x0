.. installation

.. _installation:

2. Installation
===============

Before proceeding, check if it is **really necessary** for you to install the
*x0-base-system*.

If your goal is to **develop** *x0-applications* only, you should first set up
your own repository using the *x0-skeleton* (a Git template repository) available at:
https://github.com/WEBcodeX1/x0-skeleton.

After setting up your *x0-app-repository*, continue by **reading** the documentation section
:ref:`appdevconfig` for details about **building** and **configuring** an *x0-application*.

If you plan to **create** your own *x0-system-objects* to use in your
*x0-application*, installing the *x0 system* is **mandatory**, and you should
**continue reading** this chapter.

2.1. Environments
-----------------

Any Linux distribution is supported where Debian Packages can be built (``debuild``).

* Ubuntu 22.04 / 24.04
* Debian 12
* Devuan 5

Docker images created by the *x0-system* are based on *Ubuntu 24.04*.

2.2. Dependencies
-----------------

The following are the base dependencies required to run the *x0-system*:

* Apache2 / Python3 WSGI (https://httpd.apache.org)
* PostgreSQL Relational Database 14 (http://www.postgresql.org)
* Psycopg2 high-speed threaded PostgreSQL DB interface (https://pypi.org/project/psycopg2)
* Python DB-Pool for Apache2 (https://github.com/clauspruefer/python-db-pool)
* Bootstrap 5.3 CSS (https://getbootstrap.com)
* Sphinx Documentation Generator and RTD Theme (https://www.sphinx-doc.org)
* Selenium Test Framework (https://www.selenium.dev)
* Chromedriver for Chromium Browser (https://chromedriver.chromium.org)
* Docker (https://www.docker.com)

For deployment on GKE (Google Kubernetes Engine), the following additional dependencies are required:

* Kubegres (https://www.kubegres.io)
* ingress-nginx (https://kubernetes.github.io/ingress-nginx)
* cert-manager (https://cert-manager.io)

Optional dependencies for a highly structured OOP-based Web Services backend abstraction layer:

* Python microesb (https://github.com/clauspruefer/python-micro-esb)

For local messaging testing (non-production, optional):

* Python micro-msg-server (https://github.com/clauspruefer/micro-msg-server)

2.3. Get System Ready
---------------------

We recommend using **Docker containers** as the development environment.

The *x0-system* provides tools to build **Docker images** with **network setup**, enabling
the system, including the **database** and messaging server, to run locally within minutes.

First, install the required dependencies:

.. code-block:: bash

	# install docker
	apt-get install -qq -y docker.io docker-buildx

	# install debian build dependencies
	apt-get install -qq -y debuild gpg

	# install python pip, pytest
	apt-get install -qq -y python3-pip python3-pytest python3-selenium

	# install sphinx doc builder
	apt-get install -qq -y python3-sphinx python3-sphinx-rtd-theme

The following steps are required to set up a **development environment**:

1. Clone x0 Git Repository
2. Setup Debian Build System
3. Setup Local Docker
4. Build Debian and Docker Packages
5. Run Docker Containers
6. Develop / Deploy / Rebuild

2.3.1. Clone Git Repository
***************************

To clone the repository in read-only mode:

.. code-block:: bash

	# clone x0 git repository
	git clone https://github.com/WEBcodeX1/x0.git

If you want to participate in *x0 development*, send your public SSH key
and use git+ssh (preferably using ssh-agent with HSM):

.. code-block:: bash

	# clone x0 git repository
	git clone git@github.com:WEBcodeX1/x0.git

2.3.2. Setup Debian Build System
********************************

Generate your GPG keys (or import existing ones):

.. code-block:: bash

	# generate gpg signing key
	gpg --full-generate-key

.. note::

	The gpg-ID ("Real Name" plus "Comment" in brackets, "Email address") must match
	exactly the format inside **./debian/changelog** "Real Name (Comment) <email-address.com>".

Next, build the package:

.. code-block:: bash

	# build x0 debian packages
	cd ./debian && debuild

If the build is successful, the Debian build system will sign all packages. The packages
and metadata will be available in the **"../../"** directory.

2.3.3. Prepare Docker
*********************

As the **root** user, add your current user to the Docker Unix group:

.. code-block:: bash

	# add user to docker group
	sudo usermod -aG docker your-user

A restart of your shell, desktop session, or even your computer may be required for the
changes to take effect.

After adding your user to the Docker group, you will be able to control the Docker engine
from the CLI (shell) and start building.

2.3.4. Build
************

Build Debian packages and Docker images:

.. code-block:: bash

	# build x0 debian packages
	cd ./debian && debuild

	# build x0 docker images
	cd ../docker
	./build-x0-app.sh
	./build-x0-db.sh
	./build-x0-test.sh

2.3.5. Start System
*******************

.. code-block:: bash

	# start x0 containers
	cd ./docker && x0-start-containers.sh

2.3.6. Develop / Rebuild
************************

Begin developing, creating, or experimenting.

.. note::

    Before rebuilding the entire *x0-system*, consider copying files
    manually into the Docker containers.

The changelog is available at **./debian/changelog**.

2.4. IP-Addresses / DNS
-----------------------

The following table lists all docker container ids, assigned ip-addresses and
dns names.

.. table:: Docker Container / IP-Addresses / DNS
    :widths: 30 10 60

    +----------------------+-----------------+-------------------------------------+
    | **Container ID**     | IP-Address      | DNS                                 |
    +======================+=================+=====================================+
    | x0-app               | 172.20.0.10     | x0-app.x0.localnet                  |
    +----------------------+-----------------+-------------------------------------+
    | x0-db                | 172.20.0.20     | mypostgres                          |
    +----------------------+-----------------+-------------------------------------+
    | x0-test              | 172.20.0.30     |                                     |
    +----------------------+-----------------+-------------------------------------+
    | x0-selenium-server   | 172.20.0.40     | selenium-server-0                   |
    +----------------------+-----------------+-------------------------------------+
    | x0-selenium-server   | 172.20.0.50     | selenium-server-1                   |
    +----------------------+-----------------+-------------------------------------+
    | x0-selenium-server   | 172.20.0.60     | selenium-server-2                   |
    +----------------------+-----------------+-------------------------------------+
    | x0-msg-server        | 172.20.0.100    | x0-msg-server.x0.localnet           |
    +----------------------+-----------------+-------------------------------------+

2.5. Docker Tips
----------------

The following docker command line tips can be useful for debugging.

.. code-block:: bash

	# copy files to running docker container
	docker cp ./file x0-app:/path/

.. code-block:: bash

	# run a shell inside running docker container
	docker exec -ti x0-app /bin/bash

.. code-block:: bash

	# show (apache) log files
	docker logs x0-app

.. code-block:: bash

	# connect to the x0 system database
	docker exec -ti x0-db /bin/bash
	psql -U postgres -d x0

2.6. Local Ubuntu Mirror
------------------------

It is possible to use a local ubuntu (apt) mirror in case of internet-absence
or security related considerations.

.. note::

	Also it is preferable to use a local ubuntu package mirror if you are a
	*x0-developer* and change things a lot.

Set the following environment variables (permanent in ~/.bashrc) for using
your specified mirror. This requires a working mirror setup of course.

.. code-block:: bash

	# use a local ubuntu mirror
	export UBUNTU_MIRROR_DNS=your-hostname.localnet
	export UBUNTU_MIRROR_IP=192.168.0.253

.. warning::

	You **must** set **both** UBUNTU_MIRROR_DNS **and** UBUNTU_MIRROR_IP, the
	provided dns must be resolvable to the specified ip address.

2.7. Check Working System
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

2.8. Examples
-------------

Examples can be found in **./examples** subdir.

Examples inside this folder will be built on docker image build. After
*x0-system* start (docker containers up and running), the examples can be opened
by entering the following URL(s).

* http://x0-app.x0.localnet/python/Index.py?appid=example1
* http://x0-app.x0.localnet/python/Index.py?appid=example2
* http://x0-app.x0.localnet/python/Index.py?appid=example3

Depending on release version example count varies, just take a closer look
inside the examples folder. Detailed infos about example structure for adding own
examples, see application development documentation at:
#TODO: add link to dev subsection.

2.9. Tests / CI
----------------

Tests are located inside **./test** subdir.

Pytest framework in combination with Selenium-Server is used to guarantee
network based test execution even inside GKE kubernetes pods.

Tests are runnable

* From linux host to *x0-app-container*
* Inside x0-test docker container to *x0-app-container*
* Inside GKE (Google Kubernetes Engine)

Detailed test setup documentation see:
https://github.com/WEBcodeX1/x0/blob/main/test/README.md.

To run tests locally, *x0-app* and *x0-db* and *x0-selenium-server* container
must be up and running.

.. code-block:: bash

	# start selenium server container
	cd ./test && python3 ./run-selenium-server.py

	# wait for container startup, start all tests
	sleep 10 && pytest-3

2.10. Kubernetes
----------------

*x0* also runs on **GKE** (Google Kubernetes Engine) including **Minikube**.

A *x0-kubernetes-deployment* includes an **automated**, **loadbalanced**
(ingress-nginx), 99.9% redundant setup. Additionally the *x0-system-database*
is setup **failsave** using kubegres.

Detailed documentation see:
https://github.com/WEBcodeX1/x0/blob/main/kubernetes/README.md.

2.11. MS Windows
----------------

We managed to import images and run *x0-system* docker containers on
**Windows 11 Professional** using **Docker Desktop**.

Install **Docker Desktop** using **WSL2** and **Git for Windows**.

Git for Windows provides a **Cygwin** based **git bash** which enables
correct docker image load.

.. code-block:: bash

	# load docker images
	docker load < docker.x0-app.tar
	docker load < docker.x0-db.tar

	# start docker containers
	cd ./docker
	./x0-start-containers.sh
