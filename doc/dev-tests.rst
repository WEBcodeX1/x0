.. dev-tests

.. _devtests:

19. Developing Tests
====================

Tests are an essential component for ensuring the stability of newly designed
*x0-system-objects* and the base system, especially after major system program
changes.

The *x0-system* design enables you to locally simulate the entire *x0-infrastructure*
using Docker images (including ``x0-test``) in no time, thereby offloading valuable CPU
execution time. This approach ensures that only one developer executes a single
infrastructure run, rather than multiplying the load by the number of developers,
reducing strain on the Git CI system's server.

As a developer you are strongly advised to write sufficient tests and add them
to the ``/tests`` subdirectory. Read on this chapter howto do this in detail.

Howto build the x0-test image and run the tests inside, see :ref:`installation-tests-ci`.

19.1. Test Branch
-----------------

Automated CI tests will be triggered on
``git push --set-upstream origin current-release``
(when pushing to the **current-release** branch).

After the tests have passed, a snapshot of the branch will be named
``/releases/$release-tag``.

19.2. Directory Structure
-------------------------

19.3. Directory Structure
-------------------------


- structure
  - app config (database)
  - app config (object.json, skeleton.json, menu.json)
  - database data
  - backend scripts
- processing (.deb postinstall)
