.. dev-examples

.. _devexamples:

28. Developing Examples
=======================

This section provides guidelines for **creating and structuring examples**
within the *x0-framework*. These examples are critical for showcasing the
framework's capabilities and providing developers with a reference for
implementing features.

For production-ready examples and advanced implementations, see the `x0-skeleton repository <https://github.com/WEBcodeX1/x0-skeleton>`_ which contains comprehensive examples including:

* `Forms with MicroESB <https://github.com/WEBcodeX1/x0-skeleton/tree/main/example/01-forms-microesb>`_ - Complete form implementation with microservice integration
* `List with Calculations <https://github.com/WEBcodeX1/x0-skeleton/tree/main/example/02-list-calculateable>`_ - Advanced list processing with dynamic calculations

28.1. Example Structure
------------------------

Each example should adhere to a well-defined structure to ensure consistency
and ease of understanding. The structure includes the following components:

28.1.1. App Configuration (Database)
************************************

- Define the system database configuration for the example.
- Include necessary entries in the ``system.config`` table to register the example as a valid *x0-application*.

Example SQL:

.. code-block:: sql

	INSERT INTO system.config (app_id, config_group, "value") VALUES ('example_app_id', 'index_title', 'Example Application');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('example_app_id', 'debug_level', '5');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('example_app_id', 'display_language', 'en');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('example_app_id', 'default_screen', 'MainScreen');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('example_app_id', 'subdir', '/example/${example_subdir}');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('example_app_id', 'config_file_menu', 'menu.json');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('example_app_id', 'config_file_object', 'object.json');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('example_app_id', 'config_file_skeleton', 'skeleton.json');

Save this SQL script in: ``/examples/${example_app_id}/sql/01-sys-config.sql``.

28.1.2. App Configuration (Static Files)
****************************************

Include the following static JSON configuration files:

- **object.json**: Defines the objects available in the application.
- **skeleton.json**: Structures the application's UI layout.
- **menu.json**: Provides navigation options.

Place these files in: ``/examples/${example_app_id}/static/``.

28.1.3. Database Data
*********************

If the example requires preloaded data, provide an SQL script to populate the database.

Example SQL:

.. code-block:: sql

    INSERT INTO example_table (id, name, description) VALUES (1, 'Sample Item', 'This is a sample entry.');
    INSERT INTO example_table (id, name, description) VALUES (2, 'Another Item', 'Another sample entry.');

Save this SQL script in: ``/examples/${example_app_id}/sql/02-app-data.sql``.

28.1.4. Backend Scripts
***********************

For examples with server-side functionality, include the necessary Python scripts.
These scripts should:

- Handle backend logic.
- Return JSON data required by the frontend.

Place the scripts in: ``/examples/example_app/python/``.

28.2. Example Processing
-------------------------

After storing your example *x0-application* configuration in the correct locations,
*x0-system* must be re-built. This happens automatically when you build all docker images.

Refer to the relevant sections for instructions:

- https://github.com/WEBcodeX1/x0/blob/main/docker/README.md
- https://github.com/WEBcodeX1/x0/blob/main/debian/README.md

After building, restart the *x0-system*:

.. code-block:: bash

	# start x0-app, x0-db containers
	cd ./docker && ./x0-start-containers.sh

20.3. Final Checklist
---------------------

1. **Test the Example**:
   - Verify that the example runs as expected.
   - Ensure all configurations, database entries, and scripts are functional.

2. **Document the Example**:
   - Provide a detailed README file explaining the purpose, usage, and setup of the example.
   - Include screenshots or diagrams if applicable.

3. **Version Control**:
   - Commit the example to the repository, following the project's contribution guidelines.

By following these guidelines, you can create robust and reusable examples that demonstrate
the capabilities of the *x0-framework*.

28.4. Example Repository Reference
----------------------------------

**Current Local Examples:**

The `/example` directory contains numerous demonstrations of x0-framework features:

**Form Examples:**
  - :ref:`Enhanced Form (Example 5) <enhanced-form-example>` - `http://x0-app.x0.localnet/python/Index.py?appid=example5 <http://x0-app.x0.localnet/python/Index.py?appid=example5>`_

**Object Examples:**
  - See :ref:`object-examples-reference` for comprehensive object demonstrations

**Navigation Examples:**
  - Example 15 - Tree Simple: `http://x0-app.x0.localnet/python/Index.py?appid=example15 <http://x0-app.x0.localnet/python/Index.py?appid=example15>`_
  - Example 14 - Open Close Container: `http://x0-app.x0.localnet/python/Index.py?appid=example14 <http://x0-app.x0.localnet/python/Index.py?appid=example14>`_

**External Production Examples:**

**x0-skeleton Repository:** `https://github.com/WEBcodeX1/x0-skeleton <https://github.com/WEBcodeX1/x0-skeleton>`_

* **01-forms-microesb:** `https://github.com/WEBcodeX1/x0-skeleton/tree/main/example/01-forms-microesb <https://github.com/WEBcodeX1/x0-skeleton/tree/main/example/01-forms-microesb>`_
  
  - Production-ready form implementation
  - MicroESB microservice integration  
  - Advanced validation and error handling
  - Service abstraction layer

* **02-list-calculateable:** `https://github.com/WEBcodeX1/x0-skeleton/tree/main/example/02-list-calculateable <https://github.com/WEBcodeX1/x0-skeleton/tree/main/example/02-list-calculateable>`_
  
  - Advanced list object with calculation capabilities
  - Dynamic data processing and aggregation
  - Real-time computation examples
  - Complex data manipulation patterns

**Related Documentation:**

* :ref:`appdevforms` - Form development and validation
* :ref:`systemobjects` - System object reference
* :ref:`appdevformobjects` - Form-specific objects
* :ref:`appdevoverlay` - Overlay and object instancing
