.. appdev-config

.. _appdevconfig:

7. Application Configuration
============================

x0 applications combine runtime configuration with JSON metadata. The
database-backed profile reads configuration from ``system.config`` and
translated strings from ``webui.text``. The static profile serves its metadata
as files and does not include a database or Python application server; see
:ref:`appdev-static-deployment`.

7.1. Application Metadata
-------------------------

Application metadata is separated into three JSON files:

* ``object.json`` defines objects, their registered ``Type``, and
  ``Attributes``.
* ``skeleton.json`` defines screens and places objects in the hierarchy. Its
  ``RefID`` values identify their parent object or screen; container slots can
  be addressed with ``ElementID``.
* ``menu.json`` defines the menu object hierarchy.

An object definition has this form:

.. code-block:: json

   {
     "Notice": {
       "Type": "InfoParagraph",
       "Attributes": {
         "Text": [
           { "ID": "TXT.APP.NOTICE", "Style": "fw-bold" }
         ]
       }
     }
   }

Only object types registered in ``sysFactory.SetupClasses`` are available to
metadata. See :ref:`systemobjects` and :ref:`appdevformobjects` for the
supported types and their attributes.

7.2. Database Application Configuration
----------------------------------------

In the database-backed profile, application settings are stored as rows in
``system.config``. Each row associates an ``app_id`` with a ``config_group``
and its string ``value``. Common groups include:

.. list-table:: Application configuration groups
   :header-rows: 1
   :widths: 30 70

   * - Group
     - Purpose
   * - ``index_title``
     - Browser document title.
   * - ``default_screen``
     - Initial screen identifier.
   * - ``subdir``
     - Application metadata directory.
   * - ``config_file_menu``, ``config_file_object``, ``config_file_skeleton``
     - Metadata filenames.
   * - ``display_language``, ``debug_level``
     - Runtime language and diagnostic verbosity.
   * - ``preload_script``, ``preload_var``
     - Optional backend preload endpoint and selected returned values.
   * - ``screen_config``, ``message_handler``
     - Optional per-screen settings and messaging configuration.
   * - ``user_function``, ``setup_class``, ``template_file``
     - Optional application functions, object classes, and JavaScript files.

An example configuration is maintained in
``test/integration/config/basic/sql/sys-config.sql``. Application-specific
configuration and data scripts are stored in the relevant ``example/`` or
``test/integration/config/`` directory.

7.3. Runtime Areas and Layout
-----------------------------

The browser interface includes the menu layer (DOM identifier ``sysMenu``),
screen content, and notification indicators. Screen and menu placement is
controlled by CSS; the standard defaults are initialized in
``www/sysInitOnLoad.js``. Applications can override these defaults through
``UserDefaults``; see :ref:`appdevuserdefaults`.

Use the Bootstrap classes supported by the runtime for responsive layouts.
The framework's grid metadata and CSS guidance are described in
:ref:`appdevgridsystem` and :ref:`appdevglobalcss`.

7.4. Application Extensions
---------------------------

An application may register additional JavaScript functions, object classes,
or templates through the corresponding ``system.config`` groups. These
extensions are loaded by ``python/Index.py`` and merged into the runtime at
initialization. For object implementation and registration guidance, see
:ref:`devobjectmodeling`.

For database-backed and Kubernetes deployment, see :ref:`appdeployment-docker`
and :ref:`appdeployment-kubernetes`. For the static profile, see
:ref:`appdev-static-deployment`.
