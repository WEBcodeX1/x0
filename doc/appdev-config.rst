7. Basic Configuration
======================

Unlock the power of x0! This section guides you through setting up your
SPA with clear, modular, and scalable configurations.

--------------

7.1. Browser Content Areas
--------------------------

The x0 framework features a modern, three-pane layout:

1. **Menu Area** – Navigation and commands (DOM id: ``sysMenu``)
2. **Screen Content Area** – Main display for app content
3. **Notification Area** – Real-time app and status messages

.. figure:: images/x0-browser-content-areas.png
   :alt: Browser Content Areas

   Browser Content Areas

..

   💡 **Tip:** Invisible screen layers work behind the scenes for
   seamless transitions.

7.1.1. Menu Area
~~~~~~~~~~~~~~~~

-  Holds menu-related x0-objects, primarily of type **link**.
-  Menu objects are loaded from ``menu.json`` into the ``sysMenu`` DIV
   on page load.
-  Clicking a menu link activates the related screen in the Screen Area.
-  Positioning is CSS-driven (see: `Content Area
   Positioning <#content-area-positioning>`__).
-  Not just for links: any x0-object can be referenced for rich,
   flexible menus.

7.1.2. Screen Area
~~~~~~~~~~~~~~~~~~

-  The main stage for your content.
-  ``default_screen`` is set via config (see: `System
   Config <#systemconfig>`__).
-  UI structure and object relationships are defined in
   ``skeleton.json``.
-  CSS (e.g., Bootstrap Grid) controls layout.

.. figure:: images/x0-screen-switch.png
   :alt: Screen Switch

   Screen Switch

7.1.3. Notification Area
~~~~~~~~~~~~~~~~~~~~~~~~

-  Displays status info from backend/web service calls.
-  Flexible CSS positioning.

7.1.4. Object State Preservation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

x0 guarantees **100% state preservation**—switch screens, tabs, or
navigate, and every object stays exactly as you left it.

--------------

7.1.5. Area Positioning / CSS
-----------------------------

-  Uses Bootstrap Grid for simple, responsive layouts.
-  Example: ``<body class="row">``, with ``col-md-x`` classes for areas.
-  Menu defaults to ``position: absolute``, but fully customizable.
-  See `Bootstrap Grid
   Docs <https://getbootstrap.com/docs/5.3/layout/grid/>`__.

..

   ✨ **Modern CSS and Bootstrap make layout effortless!**

--------------

7.2. Database Configuration
---------------------------

**x0-application** config data lives in the ``system.config`` and
``webui.text`` tables.

-  SQL scripts must be in ``/database``.
-  Database updates occur during Docker image builds.

7.2.1. System Configuration
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Key config parameters (in ``system.config``):

+----------------------+--------------+--------------------------------+
| Parameter            | Type         | Description                    |
+======================+==============+================================+
| index_title          | String       | Page title                     |
+----------------------+--------------+--------------------------------+
| debug_level          | Integer      | Debug level                    |
+----------------------+--------------+--------------------------------+
| display_language     | ‘en’ \| ‘de’ | UI language                    |
+----------------------+--------------+--------------------------------+
| default_screen       | String       | Default screen ID              |
+----------------------+--------------+--------------------------------+
| parent_window_url    | String (URL) | Parent (WP) plugin URL         |
+----------------------+--------------+--------------------------------+
| subdir               | String       | Static backend path            |
|                      | (Path)       |                                |
+----------------------+--------------+--------------------------------+
| config_file_menu     | String       | Menu config filename           |
+----------------------+--------------+--------------------------------+
| config_file_object   | String       | Object config filename         |
+----------------------+--------------+--------------------------------+
| config_file_skeleton | String       | Skeleton config filename       |
+----------------------+--------------+--------------------------------+

..

   **Default insert example:**

.. code:: sql

   INSERT INTO system.config (config_group, "value") VALUES ('index_title', 'x0 Default App');

7.2.2. Display Text
~~~~~~~~~~~~~~~~~~~

-  Multi-language text in ``webui.text``.
-  Reference these IDs in your JSON configs.

.. code:: sql

   INSERT INTO webui.text (id, "group", value_en, value_de)
   VALUES ('TXT.TEXTID.1', 'group1', 'English Text #1', 'German Text #1');

7.2.3. Application ID
~~~~~~~~~~~~~~~~~~~~~

-  Append ``?appid=example2`` to your app URL to load another config
   set!
-  Store separate config rows for each ``app_id``.

--------------

7.7. Application Server Config (``app-config.json``)
----------------------------------------------------

Define in ``/config/app-config.json``:

-  Database auth
-  Virtual hosts
-  x0-applications

..

   ⚠️ Multi-virtual-host and environment support requires proper
   database config and packaging. Not available in standalone/Docker.

7.7.1. Database Authentication
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

-  Users created automatically during Docker build:

   -  ``postgres`` (su_password)
   -  ``x0`` (x0_password)
   -  ``replication`` (repl_password)

7.7.2. Virtual Hosts
~~~~~~~~~~~~~~~~~~~~

-  Apache virtual hosts are generated per JSON config during Docker
   builds.
-  SSL is only fully automated for Kubernetes deploys.

7.7.3. x0-Applications
~~~~~~~~~~~~~~~~~~~~~~

-  Multiple apps: **Kubernetes only**.

7.7.4. Default Config Example
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code:: json

   {
     "installer": { "type": "x0" },
     "database": { "name": "x0", "su_password": "changeme", "x0_password": "changeme" },
     "env_list": [ "default" ],
     "vhosts": {
       "x0-app": {
         "apps": [ "x0" ],
         "env": {
           "default": {
             "dns": { "hostname": "x0-app", "domain": "x0.localnet" }
           }
         }
       }
     }
   }

--------------

7.4. Application Metadata & Object Model
----------------------------------------

x0 uses a declarative, JSON-driven UI/config model:

-  **object.json** – All UI objects, attributes, metadata
-  **skeleton.json** – How objects/screens are structured and related
-  **menu.json** – Menu objects and navigation hierarchy

**Workflow:** 1. ``skeleton.json`` initializes the UI hierarchy. 2.
``object.json`` defines the objects, inserted dynamically. 3.
``menu.json`` creates the menu structure.

   **Highly modular, scalable, and runtime-flexible!**

7.4.1. object.json
~~~~~~~~~~~~~~~~~~

Each object:

.. code:: json

   {
     "$ObjectID": {
       "Type": "$ObjectType",
       "Attributes": { ... }
     }
   }

-  IDs are referenced in ``menu.json`` and ``skeleton.json``.

7.4.2. skeleton.json
~~~~~~~~~~~~~~~~~~~~

Defines screens and what objects are on them, e.g.:

.. code:: json

   {
     "Screen1": [
       { "Object1": { "RefID": "Screen1" } }
     ]
   }

7.4.3. menu.json
~~~~~~~~~~~~~~~~

Same syntax as skeleton, but root ``RefID`` is always ``sysMenu``.

--------------

7.5. Metadata ElementID
-----------------------

-  Reference object elements (like tabs) via ``ElementID`` property in
   ``skeleton.json``.

Example: Tab Container
~~~~~~~~~~~~~~~~~~~~~~

**object.json**

.. code:: json

   {
     "TabContainer1": {
       "Type": "TabContainer",
       "Attributes": {
         "Tabs": [
           { "ID": "Tab1", "Default": true, "TextID": "TXT.BASIC-TABCONTAINER.TAB1", "Style": "col-md-4" },
           { "ID": "Tab2", "TextID": "TXT.BASIC-TABCONTAINER.TAB2", "Style": "col-md-8" }
         ]
       }
     }
   }

**skeleton.json**

.. code:: json

   {
     "Screen1": [
       { "TabContainer1": { "RefID": "Screen1" } },
       { "Text1": { "RefID": "TabContainer1", "ElementID": "Tab1" } },
       { "Text2": { "RefID": "TabContainer1", "ElementID": "Tab2" } }
     ]
   }

--------------

7.6. Object Templates
---------------------

-  Add custom object templates via ``template_file`` and ``setup_class``
   config parameters in the DB.
-  Place ``.js`` templates in ``/static``.
-  See: `Object Modeling <#devobjectmodeling>`__

--------------

**🚀 x0: Modular, Dynamic, and Developer Friendly**

With JSON-powered configuration, robust state management, and modern CSS
support, x0 is built for serious SPA development—without sacrificing
flexibility or performance.
