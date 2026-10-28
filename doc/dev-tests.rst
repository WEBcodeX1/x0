.. dev-tests

.. _devtests:

29. Integration Tests
=====================

The integration suite is in ``test/integration/`` and uses pytest with a
browser driver to exercise the running application. Test-specific metadata and
SQL setup are kept in ``test/integration/config/``. The tests therefore require
the application, database, and browser-driver services described by the test
container configuration; they are not isolated unit tests.

29.1. Running the Tests
-----------------------

The test configuration is in ``test/pyproject.toml``. From the repository
root, run the suite in the configured test environment:

.. code-block:: console

   cd test
   pytest

The repository also provides ``test/run-test-container.sh`` and
``test/run-selenium-server.py`` for the containerized and browser-driver
workflows. Consult those scripts and ``test/docker-compose.yml`` for the
service names, ports, and environment required by the local setup.

29.2. Adding Integration Tests
------------------------------

Place pytest tests in ``test/integration/``. Put application metadata or
database setup required by a test in a corresponding subdirectory of
``test/integration/config/`` and keep the test independent of unrelated
examples. When a change affects runtime behavior, verify it through the same
application and browser path used by the existing tests.

29.3. Continuous Integration
----------------------------

The workflow in ``.github/workflows/ci.yml`` runs the project checks in the
configured CI environment. Consult the workflow file for the current triggers
and commands; do not infer CI behavior from a locally successful pytest run.
