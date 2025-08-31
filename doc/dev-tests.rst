.. dev-tests

.. _devtests:

27. Developing Tests
====================

Tests are an essential component for ensuring the stability of newly designed
*x0-system-objects* and the base system, especially after major system changes.

The *x0-system* design enables you to locally simulate the entire *x0-infrastructure*
using Docker images (including the ``x0-test`` image) in minimal time, thereby offloading
valuable CPU resources. This approach ensures that only one developer executes a
single infrastructure run, rather than multiplying the load by the number of developers,
reducing strain on the Git CI system's server.

As a developer, you are strongly encouraged to write sufficient tests and add them to the
``/tests`` subdirectory. This chapter provides detailed instructions on how to do so.

27.1. Test CI
-------------

On pushing to the ``current-release`` branch, current-release`s test-containers will
be run and tests executed within.

An authenticated maintainer must ensure to push the relevant images to ``ghcr.io/webcodex1/``
before pushing to the ``current-release`` branch by:

.. code-block:: bash

	git branch current-release
	git checkout current-release
	git push --set-upstream origin current-release

Once the tests pass, a snapshot of the branch will be created and named:

``/releases/${release-tag}``.

27.2. Test Config
-----------------

A single test consists of the following components:

- Test Application (x0-app)
- Test Controller Client (Pytest / Selenium)

Every test must include:

- System Database Configuration
- Application Metadata (object.json, skeleton.json, menu.json)

Optional components for enhanced tests:

- Additional Database Data
- Backend Scripts Returning App JSON Data

27.2.1. Test Identifier
***********************

Each test must have a unique identifier. It is treated as a standalone
*x0-application* and is accessible like any other *x0-application* via:

http://x0-app.x0.localnet/python/Index.py?appid=${test_id}

27.2.2. System Database Config
******************************

The following database configuration must be generated, providing the
test identifier and all test properties, including the test subdirectory:

.. code-block:: sql

	INSERT INTO system.config (app_id, config_group, "value") VALUES ('test_id', 'index_title', 'x0 Test - ${test_description}');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('test_id', 'debug_level', '10');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('test_id', 'display_language', 'en');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('test_id', 'default_screen', 'Screen1');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('test_id', 'parent_window_url', 'null');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('test_id', 'subdir', '/test/${test_subdir}');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('test_id', 'config_file_menu', 'menu.json');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('test_id', 'config_file_object', 'object.json');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('test_id', 'config_file_skeleton', 'skeleton.json');

Save this configuration in:
``./test/integration/config/${test_id}/sql/01-sys-config.sql``.

27.2.3. App Metadata
********************

As with all *x0-applications*, the test requires valid ``object.json``, ``skeleton.json``,
and ``menu.json`` files:

* ``./test/integration/config/${test_id}/static/menu.json``
* ``./test/integration/config/${test_id}/static/object.json``
* ``./test/integration/config/${test_id}/static/skeleton.json``

27.2.4. Test Global Data
************************

If a test requires backend (Python) scripts, they must be added to the global Python
script directory: ``./test/integration/python/${script_name}.py``.

27.2.5. Building the Test
*************************

After storing your test *x0-application* configuration in the correct locations,
*x0-system* must be re-built. This happens automatically when you build all docker images.
Refer to https://github.com/WEBcodeX1/x0/tree/main/docker for detailed instructions.

See :ref:`appdeployment-tests` how to start tests after building.

27.2.6. Final Checklist
***********************

1. **Test the Test**:
   - Verify that the test runs as expected.
   - Ensure all configurations, database entries, and scripts are functional.

2. **Document the Test**:
   - Provide a detailed README file explaining the purpose, usage, and setup of the test.
   - Include screenshots or diagrams if applicable.

3. **Version Control**:
   - Commit the test to the repository, following the project's contribution guidelines.

27.3. Pytest / Selenium
-----------------------

Familiarity with the Pytest and Selenium frameworks is essential for writing tests.

Use existing tests as references to guide your work.

27.3.1. Pytest Naming Schema
****************************

Pytest files must follow this naming convention:
``./test/integration/test_${test_group}.py``.

27.3.2. Selenium Configuration
******************************

For Selenium-based tests, ensure you configure the Selenium WebDriver appropriately
to match the test environment. Specify browser options and required URLs in the test
configuration file to streamline execution. Example configurations can be found in
existing Selenium test files.

27.3.3. Python Hints
********************

- Always import these.

.. code-block:: python

	import os
	import json
	import time
	import pytest
	import logging

- Mandatory, internal processing.

.. code-block:: python

	import globalconf

- Basic Selenium imports.

.. code-block:: python

	from selenium import webdriver
	from selenium.webdriver.common.by import By
	from selenium.webdriver.common.keys import Keys
	from selenium.webdriver.support.ui import WebDriverWait
	from selenium.webdriver.support import expected_conditions as EC

- Always use logging like this.

.. code-block:: python

	logging.basicConfig(level=logging.DEBUG)
	logger = logging.getLogger()

- Always init like this.

.. code-block:: python

	wd_options = webdriver.ChromeOptions()
	wd_options.add_argument('ignore-certificate-errors')
	wd_options.add_argument('headless')

- The global conig() always must be defined like this.
  ``scope='module'`` will tell the selenium driver to only use one single
  tcp connection to the selenium-server and to reuse it for the complete test
  run.

.. code-block:: python

	@pytest.fixture(scope='module')
	def config():

- Currently config() **must** contain in every ``.py`` test file.

.. code-block:: python

	@pytest.fixture(scope='module')
	def config():

		try:
			run_namespace = os.environ['RUN_NAMESPACE']
		except Exception as e:
			run_namespace = None

		try:
			run_kube_env = os.environ['KUBERNETES_SERVICE_HOST']
		except Exception as e:
			run_kube_env = None

		try:
			domain_suffix = '.' + run_namespace
		except Exception as e:
			domain_suffix = ''

		if run_kube_env is not None:
			domain_suffix += '.svc.cluster.local'

		vhost_test_urls = globalconf.setup()

		logger.info('test urls:{}'.format(vhost_test_urls))

		selenium_server_url = 'http://selenium-server-0{}:4444'.format(domain_suffix)

		logger.info('selenium server url:{}'.format(selenium_server_url))

		wd = webdriver.Remote(
			command_executor=selenium_server_url,
			options=wd_options
		)

		config = {}
		config["timeout"] = 10
		config["driver"] = wd

		get_url = '{}/python/Index.py?appid=test_base'.format(vhost_test_urls['x0-app'])

		logger.info('test (get) url:{}'.format(get_url))

		config["driver"].get(get_url)

		return config

- Always get the global driver data inside test method.

.. code-block:: python

	def test_method_name(self, config):
		d, w = config["driver"], config["timeout"]
		wait = WebDriverWait(d, w)

- A common test class and method.

.. code-block:: python

	class TestGeneral:

		def test_suspicious_id_null(self, config):
			"""Find suspicious ID names containing the string null"""
			d, w = config["driver"], config["timeout"]
			wait = WebDriverWait(d, w)
			elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, config["ready_selector"])))

			elems = d.find_elements(By.XPATH, "//*[contains(@id,'null')]")
			assert len(elems) == 0, 'Problematic string "null" found in one or more IDs'
