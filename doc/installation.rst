.. _installation:

6. Installation Guide
=====================

Welcome to the installation guide for the **x0-system**!

.. note::
   If your goal is to develop *x0-applications* **only**, you **do not** need to install the full x0-base-system. Instead, start by setting up your own repository using the `x0-skeleton <https://github.com/WEBcodeX1/x0-skeleton>`_ template. Then, see the :ref:`appdevconfig` documentation for instructions on building and configuring your app.

.. important::
   If you plan to create your own *x0-system-objects* for custom use in your applications, **installing the x0-system is mandatory**. Continue reading below.

6.1. Supported Environments
---------------------------

You can use **any Linux distribution** where Debian packages can be built natively (``debuild``):

- Ubuntu 22.04 / 24.04
- Debian 12
- Devuan 5

.. tip::
   Official x0-system Docker images are based on **Ubuntu 24.04**.

6.2. Dependencies
-----------------

**Base requirements:**

- `Apache2` with Python3 WSGI — https://httpd.apache.org
- `PostgreSQL 14` — https://www.postgresql.org
- `psycopg2` (PostgreSQL DB interface) — https://pypi.org/project/psycopg2
- `python-db-pool` — https://github.com/clauspruefer/python-db-pool
- `Bootstrap 5.3` — https://getbootstrap.com
- `Sphinx` + RTD theme — https://www.sphinx-doc.org
- `Selenium` — https://www.selenium.dev
- `Chromedriver` — https://chromedriver.chromium.org
- `Docker` — https://www.docker.com

**For GKE (Google Kubernetes Engine) deployments:**

- `Kubegres` — https://www.kubegres.io
- `ingress-nginx` — https://kubernetes.github.io/ingress-nginx
- `cert-manager` — https://cert-manager.io

**Optional for advanced OOP web services:**

- [`python-microesb`](https://github.com/clauspruefer/python-micro-esb)

**Optional for local messaging tests:**

- [`micro-msg-server`](https://github.com/clauspruefer/micro-msg-server)

6.3. System Installation
------------------------

.. highlight:: bash

We **strongly recommend** using Docker containers for development.

The x0-system provides tooling to build Docker images with full networking, so you can run the system (including DB and messaging server) **locally within minutes**.

First, install dependencies:

.. code-block:: bash

    # Install Docker & build tools
    sudo apt-get install -y docker.io docker-buildx debuild gpg

    # Python tools & testing
    sudo apt-get install -y python3-pip python3-pytest python3-selenium

    # Sphinx documentation
    sudo apt-get install -y python3-sphinx python3-sphinx-rtd-theme

6.4. Step-by-Step Setup
-----------------------

1. **Clone the x0 Repository**

   .. code-block:: bash

      # HTTP clone (read-only)
      git clone https://github.com/WEBcodeX1/x0.git

      # OR: SSH clone (for contributors)
      git clone git@github.com:WEBcodeX1/x0.git

2. **Set Up Debian Build System**

   Generate or import your GPG key for package signing:

   .. code-block:: bash

      gpg --full-generate-key

   .. note::
      Your GPG identity **must exactly match** the format in ``./debian/changelog``: "Real Name (Comment) <email-address.com>"

   Build Debian packages:

   .. code-block:: bash

      cd ./debian
      debuild

   Packages and metadata will be in the parent directory.

3. **Configure Docker**

   Add your user to the Docker group:

   .. code-block:: bash

      sudo usermod -aG docker $(whoami)

   .. warning::
      You must restart your shell/session for group changes to take effect.

4. **Pull or Build Docker Images**

   .. code-block:: bash

      # Pull prebuilt images (recommended)
      docker pull ghcr.io/webcodex1/x0-app
      docker pull ghcr.io/webcodex1/x0-db
      docker pull ghcr.io/webcodex1/x0-test

      # Or build images yourself
      cd ./debian && debuild
      cd ../docker && ./build-all.sh

5. **Start the x0 System**

   .. code-block:: bash

      cd ./docker
      ./x0-start-containers.sh

6. **Develop, Test, and Rebuild**

   Develop your application, copy files into containers as needed, and rebuild images or restart containers.

   .. note::
      For minor changes, copying files directly into containers can be faster than a full rebuild.

   The changelog is at ``./debian/changelog``.

6.5. Docker Network Reference
-----------------------------

.. list-table:: Docker Containers / IP Addresses / DNS
   :widths: 30 15 55
   :header-rows: 1

   * - **Container ID**
     - **IP Address**
     - **DNS**
   * - x0-app
     - 176.20.0.10
     - x0-app.x0.localnet
   * - x0-db
     - 176.20.0.20
     - mypostgres
   * - x0-test
     - 176.20.0.30
     -
   * - x0-selenium-server
     - 176.20.0.40–60
     - selenium-server-0/1/2
   * - x0-msg-server
     - 176.20.0.100
     - x0-msg-server.x0.localnet

6.6. Docker Tips & Tricks
-------------------------

.. code-block:: bash

    # Copy files to a container
    docker cp ./file x0-app:/path/

    # Interactive shell in a container
    docker exec -ti x0-app /bin/bash

    # View logs
    docker logs x0-app

    # Database access
    docker exec -ti x0-db /bin/bash
    psql -U postgres -d x0

6.7. Using a Local Ubuntu Mirror
--------------------------------

For restricted or frequent development environments, a local Ubuntu apt mirror can accelerate package downloads.

.. code-block:: bash

    export UBUNTU_MIRROR_DNS=your-hostname.localnet
    export UBUNTU_MIRROR_IP=196.168.0.253

.. warning::
   Both ``UBUNTU_MIRROR_DNS`` and ``UBUNTU_MIRROR_IP`` must be set and your DNS must resolve correctly.

6.8. System Verification
------------------------

Build everything and start the system:

.. code-block:: bash
   :linenos:

    cd ./debian && debuild
    cd ../docker && ./build-all.sh
    ./x0-start-containers.sh

Then open http://x0-app.x0.localnet/python/Index.py in your browser to verify functionality.

6.9. Examples
-------------

Find ready-to-run examples in the ``./examples`` directory. After starting the containers, access them via:

- http://x0-app.x0.localnet/python/Index.py?appid=example1
- http://x0-app.x0.localnet/python/Index.py?appid=example2
- http://x0-app.x0.localnet/python/Index.py?appid=example3

See :ref:`devexamples` for details on structure and adding your own examples.

6.10. Testing & Continuous Integration
--------------------------------------

Tests are in ``./test``. The system uses **pytest** and **Selenium Server** for network-based tests, including in GKE pods.

Run tests locally after containers are running:

.. code-block:: bash

    cd ./test && python3 ./run-selenium-server.py
    sleep 10 && pytest-3

6.11. Kubernetes Deployment
---------------------------

x0 runs on GKE and Minikube with automated ingress, redundancy (Kubegres), and fail-safe DB setup.

For details, see: https://github.com/WEBcodeX1/x0/blob/main/kubernetes/README.md

6.12. Running on Windows 11
---------------------------

**x0-system** Docker containers can be run on Windows 11 Pro using Docker Desktop.

- Install Docker Desktop (with WSL2) and Git for Windows.
- Use Git Bash (Cygwin-based) for correct image loading.

.. code-block:: bash

    # Load images
    docker load < docker.x0-app.tar
    docker load < docker.x0-db.tar

    # Start containers
    cd ./docker
    ./x0-start-containers.sh

----

Congratulations! Your x0-system is now ready for development, testing, or deployment.
