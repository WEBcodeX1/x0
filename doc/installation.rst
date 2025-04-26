.. installation

.. _installation:

6. Installation
===============

6.1. Preamble
-------------

Before proceeding, verify whether it is **absolutely necessary** for you to install
the *x0-base-system*.

If your goal is to develop *x0-applications* **only**, you should begin by setting up
your own repository using the *x0-skeleton* (a Git template repository) available at:
https://github.com/WEBcodeX1/x0-skeleton.

After setting up your *x0-app-repository*, proceed by reading the documentation section
:ref:`appdevconfig` for detailed instructions on building and configuring an *x0-application*.

If you plan to create your own *x0-system-objects* for use in your *x0-application*,
installing the *x0-system* is mandatory, and you should continue reading this chapter.

6.2. Environments
-----------------

Any Linux distribution is supported where Debian Packages can be built natively (``debuild``).

* Ubuntu 22.04 / 24.04
* Debian 12
* Devuan 5

Docker images created by the *x0-system* are based on *Ubuntu 24.04*.

6.3. Dependencies
-----------------

The following are the **base dependencies** required to run the *x0-system*:

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

6.4. System Install
-------------------

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
6. Setup Debian Build System
3. Setup Local Docker
4. Build Debian and Docker Packages
5. Run Docker Containers
6. Develop / Deploy / Rebuild

6.4.1. Clone Git Repository
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

6.4.2. Setup Debian Build System
********************************

Generate your GPG keys (or import existing ones):

.. code-block:: bash

	# generate gpg signing key
	gpg --full-generate-key

.. note::

	The gpg-ID ("Real Name" plus "Comment" in brackets, "Email address") must match
	exactly the format inside ``./debian/changelog`` "Real Name (Comment) <email-address.com>".

Next, build the package:

.. code-block:: bash

	# build x0 debian packages
	cd ./debian && debuild

If the build is successful, the Debian build system will sign all packages. The packages
and metadata will be available in the ``../../`` directory.

6.4.3. Prepare Docker
*********************

As the **root** user, add your current user to the Docker Unix group:

.. code-block:: bash

	# add user to docker group
	sudo usermod -aG docker your-user

A restart of your shell, desktop session, or even your computer may be required for the
changes to take effect.

After adding your user to the Docker group, you will be able to control the Docker engine
from the CLI (shell) and start building.

6.4.4. Build
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

6.4.5. Start System
*******************

.. code-block:: bash

	# start x0 containers
	cd ./docker && x0-start-containers.sh

6.4.6. Develop / Rebuild
************************

Begin developing, creating, or experimenting.

.. note::

    Before rebuilding the entire *x0-system*, consider copying files
    manually into the Docker containers.

The changelog is available at **./debian/changelog**.

6.5. IP-Addresses / DNS
-----------------------

The following table lists all Docker container IDs, assigned IP addresses,
and DNS names.

.. table:: Docker Container / IP-Addresses / DNS
    :widths: 30 10 60

    +----------------------+-----------------+-------------------------------------+
    | **Container ID**     | IP-Address      | DNS                                 |
    +======================+=================+=====================================+
    | x0-app               | 176.20.0.10     | x0-app.x0.localnet                  |
    +----------------------+-----------------+-------------------------------------+
    | x0-db                | 176.20.0.20     | mypostgres                          |
    +----------------------+-----------------+-------------------------------------+
    | x0-test              | 176.20.0.30     |                                     |
    +----------------------+-----------------+-------------------------------------+
    | x0-selenium-server   | 176.20.0.40     | selenium-server-0                   |
    +----------------------+-----------------+-------------------------------------+
    | x0-selenium-server   | 176.20.0.50     | selenium-server-1                   |
    +----------------------+-----------------+-------------------------------------+
    | x0-selenium-server   | 176.20.0.60     | selenium-server-2                   |
    +----------------------+-----------------+-------------------------------------+
    | x0-msg-server        | 176.20.0.100    | x0-msg-server.x0.localnet           |
    +----------------------+-----------------+-------------------------------------+

6.6. Docker Tips
----------------

The following Docker command-line tips may be helpful for debugging.

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

6.7. Local Ubuntu Mirror
------------------------

It is possible to use a local Ubuntu (apt) mirror in cases of limited
internet access or for security-related considerations.

.. note::

	It is also preferable to use a local Ubuntu package mirror if
	you are an *x0-developer* and frequently make changes.

Set the following environment variables (permanently in ``~/.bashrc``) to
use your specified mirror. Note that this requires a properly configured
and functioning mirror setup.

.. code-block:: bash

	# use a local ubuntu mirror
	export UBUNTU_MIRROR_DNS=your-hostname.localnet
	export UBUNTU_MIRROR_IP=196.168.0.253

.. warning::

	You must set both ``UBUNTU_MIRROR_DNS`` and ``UBUNTU_MIRROR_IP``.
	The provided DNS must resolve correctly to the specified IP address.

6.8. Verify System Functionality
--------------------------------

Build Debian packages, Docker images, and start *x0-system* containers.

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

Open http://x0-app.x0.localnet/python/Index.py in a local browser to verify
that the system is functioning correctly.

.. _installation-examples:

6.9. Examples
-------------

Examples can be found in the ``./examples`` subdirectory.

The examples in this folder will be built during the Docker image build
process. After the *x0-system* is started (with Docker containers up and running),
the examples can be accessed via the following URLs:

* http://x0-app.x0.localnet/python/Index.py?appid=example1
* http://x0-app.x0.localnet/python/Index.py?appid=example2
* http://x0-app.x0.localnet/python/Index.py?appid=example3

The number of examples varies depending on the release version. Take a closer look
inside the examples folder for details. For information about the example structure and
how to add your own examples, see the devloper documentation at:
:ref:`devexamples`.

.. _installation-tests-ci:

6.10. Tests / CI
----------------

Tests are located inside the ``./test`` subdirectory.

The *Pytest* framework, in combination with *Selenium Server*, is used to ensure
network-based test execution, even within GKE Kubernetes pods.

Tests can be executed in the following environments:

- From a Linux host to the ``x0-app`` Docker container
- Inside the ``x0-test`` Docker container to the ``x0-app`` Docker container
- Inside GKE (Google Kubernetes Engine)

To run tests locally, the ``x0-app``, ``x0-db``, and ``x0-selenium-server`` containers
must be up and running.

.. code-block:: bash

	# start selenium server container
	cd ./test && python3 ./run-selenium-server.py

	# wait for container startup, start all tests
	sleep 10 && pytest-3

6.11. Kubernetes
----------------

*x0* also runs on GKE (Google Kubernetes Engine), including Minikube.

An *x0-kubernetes-deployment* includes an automated, load-balanced (ingress-nginx),
99.9% redundant setup. Additionally, the *x0-system-database* is set up to be fail-safe
using Kubegres.

For detailed documentation, see:
https://github.com/WEBcodeX1/x0/blob/main/kubernetes/README.md.

6.12. MS Windows
----------------

We successfully imported images and ran *x0-system* Docker containers
on **Windows 11 Professional** using **Docker Desktop**.

Install **Docker Desktop** with **WSL2** and **Git for Windows**.

Git for Windows provides a **Cygwin-based Git Bash**, which facilitates
the correct loading of Docker images.

.. code-block:: bash

	# load docker images
	docker load < docker.x0-app.tar
	docker load < docker.x0-db.tar

	# start docker containers
	cd ./docker
	./x0-start-containers.sh
