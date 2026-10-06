.. dev-tests

.. _devtests:

27. Developing Tests
====================

Tests are an essential component for ensuring the stability of newly designed
*x0-system-objects* and the base system, especially after major system changes.

The integration tests use Pytest and Selenium against the database-backed Docker
environment. The repository also provides ``x0-test`` and ``x0-test-github``
images for running the test suite in containers.

Tests are located in ``test/integration/`` and follow the
``test_<group>.py`` naming convention. Application fixtures are under
``test/integration/config/``; backend fixture scripts are under
``test/integration/python/``.

27.1. Test CI
-------------

The ``.github/workflows/ci.yml`` workflow runs the ``x0-test-github`` image
with the ``x0-app``, ``x0-db``, and Selenium services on pushes to
``current-release``. The workflow invokes the packaged Pytest runner.

27.2. Test Config
-----------------

A browser integration test uses the following components:

- Test Application (x0-app)
- Test Controller Client (Pytest / Selenium)

The shared fixtures use the preconfigured ``test_base`` application and the
metadata in ``test/integration/config/basic/``. For additional test
applications, add their SQL and ``menu.json``, ``object.json``, and
``skeleton.json`` files in ``test/integration/config/<fixture_id>/``. Put
backend fixture scripts in ``test/integration/python/``. The containerized
environment must be rebuilt when these files need to be copied into the
relevant images.

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
``test/integration/test_<group>.py``.

Run tests from the repository's ``test/`` directory after starting the
database-backed application and Selenium server:

.. code-block:: bash

   cd test
   python3 ./run-selenium-server.py
   pytest

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
