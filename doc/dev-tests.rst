.. dev-tests

.. _devtests:

19. Developing Tests
====================

Tests are an essential component for ensuring the stability of newly designed
*x0-system-objects* and the base system, especially after major system program
changes.

The *x0-system* design enables you to locally simulate the entire *x0-infrastructure*
using Docker images (including the ``x0-test`` image) in no time, thereby offloading
valuable CPU execution time. This approach ensures that only one developer executes a
single infrastructure run, rather than multiplying the load by the number of developers,
reducing strain on the Git CI system's server.

As a developer you are strongly advised to write sufficient tests and add them to the
``/tests`` subdirectory. Read on this chapter howto do this in detail.

Howto build the x0-test image and run the tests inside, see :ref:`installation-tests-ci`.

19.1. Test CI
-------------

Automated CI tests will be triggered on
``git push --set-upstream origin current-release``
(when pushing to the **current-release** branch).

After the tests have passed, a snapshot of the branch will be named
``/releases/${release-tag}``.

19.2. Test Config
-----------------

A single test is devided in the following sub-parts:

- Test Application (x0-app)
- Test Controller Client (pytest / Selenium)

A single test always must include:

- System Database Configuration
- Application Metadata (object.json, skeleton.json, menu.json)

A single (enhanced) test optionally includes:

- Additional Database Data
- Backend Scripts Returning App JSON Data

19.2.1. Test Identifier
***********************

A test must be given an identifier. It will be treated as a single independent
*x0-application*. It is accessible like any other *x0-application* by ${test_id} via:
http://x0-app.x0.localnet/python/Index.py?appid=${test_id}.

19.2.2. System Database Config
******************************

The following db-config must be generated providing the test-identifier and all
the test properties including test subdirectory.

.. code-block:: sql

	INSERT INTO system.config (app_id, config_group, "value") VALUES ('${test_id}', 'index_title', 'x0 Test - ${test_description}');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('${test_id}', 'debug_level', '10');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('${test_id}', 'display_language', 'en');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('${test_id}', 'default_screen', 'Screen1');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('${test_id}', 'parent_window_url', 'null');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('${test_id}', 'subdir', '/test/${test_subdir}');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('${test_id}', 'config_file_menu', 'menu.json');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('${test_id}', 'config_file_object', 'object.json');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('${test_id}', 'config_file_skeleton', 'skeleton.json');

``./test/integration/config/${test_id}/sql/01-sys-config.sql``.

19.2.3. App Metadata
********************

Like all other *x0-applications*, valid ``object.json``, ``skeleton.json`` and
``menu.json`` must be provided.

* ``./test/integration/config/${test_id}/static/menu.json``
* ``./test/integration/config/${test_id}/static/object.json``
* ``./test/integration/config/${test_id}/static/skeleton.json``

19.2.4. Test Global Data
************************

If a test needs backend (Python) scripts, they must be added to the global
Python script directory ``./test/integration/python/${script_name}.py``

19.2.5. Test Building
*********************

After your test *x0-application* configuration has been stored in the
correct places, it must be built.

This happens automatically when you build the *x0-test* container,
see:

19.2.6. Final Check
*******************

After the Test Application part has been finished, you should
test if it is working correctly be opening it manually in the browser.

19.3. Pytest / Selenium
-----------------------

You should be familiar with Pytest and Selenium Framework.

Try to orient at already existing tests ...

19.3.1. Pytest Naming Schema
****************************

Test must be named ``./test/integration/test_${test_group}.py``.

19.3.2. Selenium Config
***********************
