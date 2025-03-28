.. installation

.. _installation:

2. Installation
===============

As first step, check if it is **really necessary** for you to install the
*x0-base-system*.

If you intend to **develop** *x0-applications* **only**, you first should start
setting up your own repository from *x0-skeleton* (git template repository) at
https://github.com/WEBcodeX1/x0-skeleton.

After finish setting up your *x0-app-repository*, you should continue
**reading** the documentation section :ref:`appdevelopment` to get details about
**building** / **configuring** an *x0-application*.

If you intend to **create** own *x0 system objects* used in your
*x0 application*, the *x0-system* **installation is mandatory**  and you should
**continue reading** this chapter.

2.1. Environments
-----------------

The following native linux distributions are supported to build the *x0-system*.

* Ubuntu 22.04.4
* Debian 12
* Devuan 5 (daedalus)

Docker images created by *x0-system* rely on Ubuntu 22.04.

2.2. Dependencies
-----------------

Base dependencies.

* Apache2 / Python3 WSGI (https://httpd.apache.org)
* PostgreSQL Relational Database 14 (http://www.postgresql.org)
* Psycopg2 high-speed threaded PostgreSQL DB interface (https://pypi.org/project/psycopg2)
* Python DB-Pool for Apache2 (https://github.com/clauspruefer/python-db-pool)
* Bootstrap 5.3 CSS (https://getbootstrap.com)
* Sphinx Documentation Generator and RTD Theme (https://www.sphinx-doc.org)
* Selenium Test Framework (https://www.selenium.dev)
* Chromedriver for Chromium Browser (https://chromedriver.chromium.org)
* Docker (https://www.docker.com)

GKE (Google Kubernetes Engine) deployment also depends on the following.

* Kubegres (https://www.kubegres.io)
* ingress-nginx (https://kubernetes.github.io/ingress-nginx)
* cert-manager (https://cert-manager.io)

Highly strutured OOP based WebServices backend abstraction layer (optional).

* Python microesb (https://github.com/clauspruefer/python-micro-esb)

Messaging server used for local messaging testing (non-production, optional).

* Python micro-msg-server (https://github.com/clauspruefer/micro-msg-server)

2.3. Get System Ready
---------------------

We recommend using **docker container** as development basis.

The *x0-system* provides building **docker images** including **network setup**
for running the system including **database** and messaging server locally in
minutes.

But first, install dependenies.

.. code-block:: bash

	# install docker
	apt-get install -qq -y docker.io docker-buildx

	# install debian build dependencies
	apt-get install -qq -y debuild gpg

	# install python pip, pytest
	apt-get install -qq -y python3-pip python3-pytest python3-selenium

	# install sphinx doc builder
	apt-get install -qq -y python3-sphinx python3-sphinx-rtd-theme

The following steps are required to get a **dev-environment** up and running.

1. Clone x0 Git Repository
2. Setup Debian Build System
3. Setup Local Docker
4. Build Debian and Docker Packages
5. Run Docker Containers
6. Develop / Deploy / Rebuild

2.3.1. Clone Git Repository
***************************

If you are interested in getting the repository in read-only mode.

.. code-block:: bash

	# clone x0 git repository
	git clone https://github.com/WEBcodeX1/x0.git

If you want to participate in *x0-develpopment*, send me your public ssh key
and use git+ssh (preferable using ssh-agent with hsm).

.. code-block:: bash

	# clone x0 git repository
	git clone git@github.com:WEBcodeX1/x0.git

2.3.2. Setup Debian Build System
********************************

First generate your gpg keys (or import existing).

.. code-block:: bash

	# generate gpg signing key
	gpg --full-generate-key

.. note::

	The gpg-ID ("Real Name" plus "Comment" in brackets, "Email address") must match
	exactly the format inside **./debian/changelog** "Real Name (Comment) <email-address.com>".

Afterwards check building.

.. code-block:: bash

	# build x0 debian packages
	cd ./debian && debuild

If build was successful, the debian build system signed all packages. Packages
plus metadata can be found in **"../../"**.

2.3.3. Prepare Docker
*********************

As **root** user, add your current user to the docker unix group.

.. code-block:: bash

	# add user to docker group
	sudo usermod -aG docker your-user

Eventually a restart of your current shell, desktop session or even
computer is required for changes to take effect.

After adding your build user to the docker group you are able to control the
docker engine by cli (shell) and ready for building.

2.3.4. Build
************

Build debian packages and docker images.

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

Start developing / creating / experimenting.

.. note::

	Before you rebuild the whole *x0-system* you should think about copying files
	inside the docker containers manually.

Changelog is located at **./debian/changelog**.

.. _docker-setup:

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

http://x0-app.x0.localnet/python/Index.py?appid=example1
http://x0-app.x0.localnet/python/Index.py?appid=example2
http://x0-app.x0.localnet/python/Index.py?appid=example3

Depending on release version example count varies, just take a closer look
inside the examples folder. Examples are also referenced in application development
documentation.

Howto add your own examples, see developer documentation:

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

.. note::

	We did not manage to get network setup (probably bridged) work correctly
	to access the container(s) by its assigned ip-address(es) from the
	Windows host.
