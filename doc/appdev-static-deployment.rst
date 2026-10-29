.. _appdev-static-deployment:

Static Deployment
=================

The ``x0-static`` profile serves an x0 application and its metadata as static
files through Apache. It is intended for deployments that do not require the
repository's PostgreSQL database or Python/WSGI application server. The
standard ``x0-app`` and ``x0-db`` containers remain available for applications
that depend on those services.

Build and start the static container from the repository's ``docker``
directory:

.. code-block:: bash

   cd ./docker
   ./build-x0-static.sh
   ./x0-start-static.sh

The build creates the local image ``x0-static``. The startup script runs it as
the ``x0-static`` container and publishes container port 80 on host port 80.
Open ``http://localhost/`` to load the application. To stop it, run
``docker stop x0-static``.

Application files are organized as follows:

* ``www/`` contains the JavaScript runtime, stylesheets, fonts, and images.
* ``static/system/index.html`` and ``static/system/sysInitOnLoad.js`` provide
  the static entry point and initialization.
* ``static/meta/menu.json``, ``object.json``, ``skeleton.json``, and
  ``text-data.json`` define the menu, object metadata, screen hierarchy, and
  translated text.
* ``www/image/`` contains the runtime image assets; the Docker image also
  installs the compact x0 logo under ``/image/``.

The image copies the metadata files to the web server's ``/static/`` path.
Update the files under ``static/meta/`` to customize the bundled application.
The ``static`` profile does not include a database, WSGI server, or backend
scripts; applications requiring backend services must provide those services
separately. The bundled metadata provides examples of the static object model,
including image selection, system settings, and the introduction screen.

For the database-backed Docker profile and Kubernetes deployment, see
:ref:`appdeployment-docker` and :ref:`appdeployment-kubernetes`.
