.. _appdevconfig:

3. Basic Configuration
======================

The following sections describe the most important system components:

* Browser Content Areas / Screen Definition
* System Database Configuration
* Application Server Configuration (app-config.json)
* Application Metadata / Objects and Objects Reference Configuration

3.1. Browser Content Areas
--------------------------

The *x0-systems* browser **Main Display Area** is divided into three
visible sections:

1. "Menu" Area
2. "Screen" Content Area
3. "Notification" Area

.. image:: images/x0-browser-content-areas.png
  :alt: image - browser content areas

.. note::

    Note the invisible screen layers; details are provided below.

3.1.1. Menu Area
****************

The **x0-menu-area** is primarily intended to contain menu-related *x0-objects*
of *x0-object-type* **link**.

The DOM DIV layer with id = ``sysMenu`` is used for this purpose. The referenced
*x0-objects* inside ``menu.json`` will be appended to the ``sysMenu DIV`` during
system initialization (page load).

An *x0-screen* (textual ID) can be referenced by a **link** *x0-object-type*.
When clicked, the system activates or makes the corresponding screen layer visible
within the **x0-screen-area**.

DOM layer positioning can be managed using CSS styles. For detailed information
about content area positioning, see :ref:`content-area-positioning`.

.. note::

    The **x0-menu-area** is not limited to *x0-object-type* **link** only; any
    *x0-object* can be referenced in ``menu.json``, for example, as an object container
    (containing *x0-object-type* **link**) used for positioning.

3.1.2. Screen Area
******************

The **x0-screen-area** acts as the main content display area.

The **default_screen** which will be activated on system init (page load) can
be set by *x0-config-parameter* (details see :ref:`systemconfig`).

Screen definition and object relations will be defined inside **skeleton.json**
(details see :ref:`skeleton-json`).

Also DOM Layer positioning can be achieved via CSS styles, detailed info about
content area positioning, see :ref:`content-area-positioning`.

The following diagram shows what exactly happens on **x0-screen-switch**.

.. image:: images/x0-screen-switch.png
  :alt: image - screen switch

3.1.3. Notification Area
************************

The x0-notification-area displays web service status information during data
exchanges with the backend or external web service calls.

DOM layer positioning can also be managed using CSS styles. For detailed
information about content area positioning, refer to :ref:`content-area-positioning`.

3.1.4. Object State Preservation
********************************

The *x0-system* guarantees 100% **content state preservation** during any system
interaction, such as button clicks, screen or tab switches, and page navigation.

Even combined or chained real-time objects always preserve their state, thanks
to the *x0-system* design.

For example, if you switch from a screen with the ID ``screen1`` to ``screen2``,
perform some tasks, and then switch back to ``screen1``, every object, including
its data, will remain exactly in the state it was in before switching.

.. _content-area-positioning:

3.1.5. Area Positioning / CSS
*****************************

Styling, including the positioning of **x0-menu-area**, **x0-screen-area**, and
**x0-notification-area**, using Bootstrap Grid CSS is relatively straightforward.

You should be familiar with the basics of CSS Grid and the features of the
Bootstrap Grid system. For more information, refer to the Bootstrap Grid documentation
https://getbootstrap.com/docs/5.3/layout/grid/.

Currently, the **x0-menu-area** is positioned using ``position: absolute``, and the
**x0-screen-area** is styled with ``<div id="id" class="col-md-8 ms-auto me-auto">``.

A better approach would be to use ``<body class="row">`` and the *col-md-x* CSS classes
for styling the **x0-menu-area** and **x0-screen-area**.
.. note::

    CSS styles in 2025 are incredibly flexible. Additionally, Bootstrap simplifies this
    complexity and makes using the *x0-system* effortless.

3.2. Database Configuration
---------------------------

Basic *x0-application* configuration data is stored in the following system tables:
``system.config`` and ``webui.text``.`` The metadata described below must exist for
an *x0-application* to function properly.

The SQL scripts (with the filename suffix ``.sql``) must reside in the ``/database``
folder of the *x0-system* or *x0-skeleton*.

The system database is updated from ``.sql`` scripts located in the ``/database`` folder
during a Docker image rebuild (see subsection ref:`appdeployment-docker`).

.. _systemconfig:

3.2.1. System Configuration
***************************

*x0-systems-configuration* data is stored in database table ``system.config``.

.. table:: System Database Table "system.config"
    :widths: 20 30 100

    +----------------------+-----------------+-------------------------------------+
    | **Table Column**     | **Default**     | **Description**                     |
    +======================+=================+=====================================+
    | app_id               | 'default' (str) | x0 Application ID                   |
    +----------------------+-----------------+-------------------------------------+
    | config_group         |                 | Configuration Parameter ID          |
    +----------------------+-----------------+-------------------------------------+
    | "value"              |                 | Configuration Parameter Value       |
    +----------------------+-----------------+-------------------------------------+

.. table:: Configuration Parameter "x0-config-parameter"
    :widths: 20 30 50

    +----------------------+-----------------+-------------------------------------+
    | **Parameter**        | **Type**        | **Description**                     |
    +======================+=================+=====================================+
    | index_title          | String          | x0 Browser Page Title               |
    +----------------------+-----------------+-------------------------------------+
    | debug_level          | Integer         | System Debug Level                  |
    +----------------------+-----------------+-------------------------------------+
    | display_language     | 'en' | 'de'     | System Display Language             |
    +----------------------+-----------------+-------------------------------------+
    | default_screen       | String          | Screen ID Reference                 |
    +----------------------+-----------------+-------------------------------------+
    | parent_window_url    | String (URL)    | Wordpress Plugin Parent URL         |
    +----------------------+-----------------+-------------------------------------+
    | subdir               | String (Path)   | "static" Backend Path               |
    +----------------------+-----------------+-------------------------------------+
    | config_file_menu     | String (File)   | Override Menu Config Data Filename  |
    +----------------------+-----------------+-------------------------------------+
    | config_file_object   | String (File)   | Override Menu Config Data Filename  |
    +----------------------+-----------------+-------------------------------------+
    | config_file_skeleton | String (File)   | Override Menu Config Data Filename  |
    +----------------------+-----------------+-------------------------------------+

The following SQL data reflects the default x0-application-config, which can be viewed
at the URL: http://x0-app.x0.localnet/python/Index.py.

.. code-block:: sql

    INSERT INTO system.config (config_group, "value") VALUES ('index_title', 'x0 Default App');
    INSERT INTO system.config (config_group, "value") VALUES ('debug_level', '10');
    INSERT INTO system.config (config_group, "value") VALUES ('display_language', 'en');
    INSERT INTO system.config (config_group, "value") VALUES ('default_screen', 'Screen1');
    INSERT INTO system.config (config_group, "value") VALUES ('parent_window_url', 'null');
    INSERT INTO system.config (config_group, "value") VALUES ('subdir', '/static');
    INSERT INTO system.config (config_group, "value") VALUES ('config_file_menu', 'menu.json');
    INSERT INTO system.config (config_group, "value") VALUES ('config_file_object', 'object.json');
    INSERT INTO system.config (config_group, "value") VALUES ('config_file_skeleton', 'skeleton.json');

3.2.2. Display Text
*******************

Multilanguage display text is stored in the ``webui.text`` database table.

The following example inserts four multilanguage texts with IDs ``TXT.TEXTID.1`` and
``TXT.TEXTID.2`` (English and German) into the system text table, which can later be
referenced in *x0-object-metadata* JSON configuration files.

.. code-block:: sql

    INSERT INTO webui.text 
    (id, "group", value_en, value_de)
    VALUES
    ('TXT.TEXTID.1', 'group1', 'English Text #1', 'German Text #1');

    INSERT INTO webui.text
    (id, "group", value_en, value_de)
    VALUES
    ('TXT.TEXTID.2', 'group1', 'English Text #2', 'German Text #2');

3.2.3. Application ID
*********************

It is possible to append the HTTP GET parameter ``appid``, such as ``example2``,
to the base URL of the ``Index.py`` script.

For example: http://x0-app.x0.localnet/python/Index.py?appid=example2

The following SQL statements demonstrate how configuration data must be stored
for this to function correctly.

.. code-block:: sql

    INSERT INTO system.config (app_id, config_group, "value") VALUES ('example2', 'index_title', 'x0 Example Basic-Menu-Screen');
    INSERT INTO system.config (app_id, config_group, "value") VALUES ('example2', 'debug_level', '10');
    INSERT INTO system.config (app_id, config_group, "value") VALUES ('example2', 'display_language', 'en');
    INSERT INTO system.config (app_id, config_group, "value") VALUES ('example2', 'default_screen', 'Screen1');
    INSERT INTO system.config (app_id, config_group, "value") VALUES ('example2', 'parent_window_url', 'null');
    INSERT INTO system.config (app_id, config_group, "value") VALUES ('example2', 'subdir', '/examples/basic_menu_screen');
    INSERT INTO system.config (app_id, config_group, "value") VALUES ('example2', 'config_file_menu', 'menu.json');
    INSERT INTO system.config (app_id, config_group, "value") VALUES ('example2', 'config_file_object', 'object.json');
    INSERT INTO system.config (app_id, config_group, "value") VALUES ('example2', 'config_file_skeleton', 'skeleton.json');

3.3. Application Configuration
------------------------------

The following elements can be defined inside the ``/config/app-config.json``
configuration file:

* Database Authentication
* Virtual Hosts
* x0-Applications

.. note::

    Setting up multiple Virtual Hosts and x0-Applications requires a valid *x0-systems configuration*
    (database) and *x0-deb-packaging setup* (deb) for all configured Virtual Hosts.

.. warning::

    Environments are not supported by *x0-standalone* or *x0-docker* deployments.

3.3.1. Database Authentication
******************************

The following database users will be created during the Docker *x0-db* image build.

.. table:: Database Authentication Properties
    :widths: 30 20 50

    +-------------------------------+-----------------+-------------------------------------+
    | **Database User**             | **DB User**     | **Description**                     |
    +===============================+=================+=====================================+
    | su_password                   | postgres        | Database Superuser Auth PWD         |
    +-------------------------------+-----------------+-------------------------------------+
    | x0_password                   | x0              | Global Web-Backend User Auth PWD    |
    +-------------------------------+-----------------+-------------------------------------+
    | repl_password                 | replication     | Kubegres Replication User Auth PWD  |
    +-------------------------------+-----------------+-------------------------------------+

3.3.2. Virtual Hosts
********************

For each Virtual Host configured in the JSON vhosts property, an
Apache Virtual Host will be generated during the Docker (re-)build process.

Self-signed SSL certificates will be generated for the *x0-base*
Virtual Host (Hello World output).

.. note::

    A functional multi-Virtual Host setup requires correct metadata to be defined
    inside the deb package file `$x0-app-id.install`. For more details,
    refer to :ref:`appdeployment-standalone`.

.. note::

    If you require a more complex web server setup, such as aliasing, redirects,
    or similar configurations, it is intended that you manually edit the generated
    configuration inside the Docker containers after building.

.. warning::

    Automated SSL setup per Virtual Host has been discontinued in *x0-standalone*
    and *x0-docker* deployments. Only the *x0-kubernetes* deployment supports a
    fully automated workflow."

3.3.3. x0-Applications
**********************

Defining multiple *x0-applications* is supported only by the x0-kubernetes deployment.
For more details, refer to :ref:`appdeployment-kubernetes`.

3.3.4. Default Config
*********************

The following is the current default configuration of x0-systems.

.. code-block:: javascript

    {
        "installer": {
            "type": "x0"
        },
        "database": {
            "name": "x0",
            "su_password": "changeme",
            "x0_password": "changeme"
        },
        "env_list": [ "default" ],
        "vhosts": {
            "x0-app": {
                "apps": [ "x0" ],
                "env": {
                    "default": {
                        "dns": {
                            "hostname": "x0-app",
                            "domain": "x0.localnet"
                        }
                    },
                    "test": {
                        "dns": {
                            "hostname": "x0-app",
                            "domain": "x0.localnet"
                        }
                    }
                }
            }
        }
    }

3.3.4. JSON Schema
******************

1. JSON Header

.. table:: JSON Header
	:widths: 30 20 50

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| installer.type      | Enum String          | Installer Type                                  |
	+---------------------+----------------------+-------------------------------------------------+
	| env_list            | Array of EnvString   | Environment List                                |
	+---------------------+----------------------+-------------------------------------------------+

2. "vhosts" Property

.. table:: "vhosts" Property
	:widths: 30 20 50

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| vhosts              | Object of VHElements | Virtual Host Elements / Configuration           |
	+---------------------+----------------------+-------------------------------------------------+

3. $VhostConfig "apps" Property

.. table:: $VhostConfig "apps" Property
	:widths: 30 20 50

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| apps                | Array of AppString   | Application List                                |
	+---------------------+----------------------+-------------------------------------------------+
	| env                 | Object               | Environment Elements                            |
	+---------------------+----------------------+-------------------------------------------------+

4. Env Properties

.. table:: Env Properties
	:widths: 30 20 50

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| dns.hostname        | Host String          | DNS Hostname used for hostname.domain FQDN      |
	+---------------------+----------------------+-------------------------------------------------+
	| dns.domain          | Domain String        | DNS Domain used for hostname.domain FQDN        |
	+---------------------+----------------------+-------------------------------------------------+

3.4. Application Metadata
-------------------------

The configuration files ``object.json``, ``skeleton.json``, and ``menu.json`` in the x0 framework adopt
a declarative approach, akin to the infrastructure configuration style used in Google Kubernetes Engine (GKE).

They provide structured definitions for the user interface and application behavior. Below is a breakdown
of their roles and functionality:

1. object.json

    * Purpose:
        Describes the attributes and properties of objects that are used in the application.
    * Functionality:
        Defines object types, such as forms, lists, or custom UI components.
        Includes object-specific attributes (e.g., styles, event handlers, and data bindings).
        Provides metadata for runtime object creation and manipulation.
        Used by the sysFactory and sysSourceObjectHandler to initialize and manage objects dynamically.

2. skeleton.json

    * Purpose:
        Defines the hierarchical structure of the application's UI by providing a "skeleton" for all screen elements.
    * Functionality:
        1. Specifies the parent-child relationships between objects, defining the layout and structure of screens.
        2. Includes references to object.json definitions for detailed object configuration.
        3. Supports recursive setup of objects using methods like setupObject in sysScreen.
        4. Allows dynamic adjustment of attributes (e.g., overwriting or replacing attributes at runtime).

3. menu.json

    * Purpose:
        Configures menu elements and their behavior within the application.
    * Functionality:
        1. Defines the menu structure, including items and their hierarchical arrangement.
        2. Associates menu items with actions or screen navigation.
        3. Provides styling and attributes for menu components.
        4. Processed as a part of the skeleton for the "sysMenu" screen, enabling seamless integration with the UI.

- Integration and Workflow

    * These JSON files are processed by core system objects like sysFactory, sysScreen, and sysSourceObjectHandler.
    * The skeleton.json ties together the object.json and menu.json configurations to create a cohesive UI and behavior model.
    * During runtime:
        1. Skeleton Initialization: The skeleton.json is parsed to build the UI hierarchy.
        2. Object Configuration: Objects defined in object.json are dynamically created and added to the hierarchy.
        3. Menu Setup: The menu.json is applied to configure and render menus in the application.

These configuration files enable modular and scalable application development by separating concerns and allowing dynamic runtime adjustments.

.. _object-json:

3.4.1. Object
*************

The declaration of *x0-object* takes place in the ``object.json`` configuration
file.

Each object must have a unique ID, which can be referenced by its ID within the
``menu.js`` and ``skeleton.js`` configuration files.

All currently usable *x0-system-objects* JSON definitions ($ObjectType) are
described in detail here: :ref:system-objects.

.. code-block:: javascript

    {
        "$ObjectID": {
            "Type": String::$ObjectType
            "Attributes": {
                Object::$ObjectMetadata
            }
        }
    }

.. note::

    The internal JavaScript representation is of the *Object* type, not the
    *Array* type. While object definitions are unordered, object relations are
    strictly order-dependent and are defined in skeleton.json and menu.json."

.. _skeleton-json:

3.4.2. Skeleton
***************

*x0-screen* and *x0-object* relation declarations are defined in the ``skeleton.json``
configuration file.

    * Screen Data
    * Screen / Object Relations

The following metadata enables three screens: ``Screen1``, ``Screen2``, and ``Screen3``,
without any object relations.

.. code-block:: javascript

    {
        "Screen1":
        [
            {}
        ],
        "Screen2":
        [
            {}
        ],
        "Screen3":
        [
            {}
        ]
    }

The following metadata defines one screen, ``Screen1``, and references
one object to ``Screen1``.

.. code-block:: javascript

    {
        "Screen1":
        [
            {
                "Object1":
                {
                    "RefID": "Screen1"
                }
            }
        ]
    }


The following metadata defines one screen, ``Screen1``, and references
one object to ``Screen1``. Additionally, ``Object2`` is connected or
referenced to ``Object1``.

.. code-block:: javascript

    {
        "Screen1":
        [
            {
                "Object1":
                {
                    "RefID": "Screen1"
                },
                "Object2":
                {
                    "RefID": "Object1"
                }
            }
        ]
    }

.. _menu-json:

3.4.3. Menu
***********

Declarations inside the ``menu.json`` configuration file only reference object data
to the *x0-menu-area*. The syntax is the same as in ``skeleton.json``, except that
the root ``RefID`` property must be set to ``sysMenu``.

The following metadata defines two objects, ``Object1`` and ``Object2``. ``Object1``
is connected to the menu root, and ``Object2`` is connected or referenced to ``Object1``.

.. code-block:: javascript

    {
        {
            "Object1":
            {
                "RefID": "sysMenu"
            },
            "Object2":
            {
                "RefID": "Object1"
            }
        }
    }

3.5. Metadata ElementID
-----------------------

Some *x0-objects* define elements inside the ``**object.json**`` file.

* TabContainer

These elements can also be referenced inside ``**skeleton.json**`` using
the *x0-systems* ``ElementID`` property.

The following example demonstrates how to reference *x0-tabs* defined in
``**object.json**`` from ``**skeleton.json**``.

Example #3 (http://x0-app.x0.localnet/python/Index.py?appid=example3)
provides a working example.

3.5.1. Example object.json
**************************

.. code-block:: javascript

    {
        "TabContainer1":
            {
                "Type": "TabContainer",
                "Attributes":
                {
                    "Tabs": [
                        {
                            "ID": "Tab1",
                            "Attributes":
                                {
                                    "Default": true,
                                    "TextID": "TXT.BASIC-TABCONTAINER.TAB1",
                                    "Style": "col-md-4"
                                }
                        },
                        {
                            "ID": "Tab2",
                            "Attributes":
                                {
                                    "TextID": "TXT.BASIC-TABCONTAINER.TAB2",
                                    "Style": "col-md-8"
                                }
                        }
                    ]
                }
            }
        }
    }

3.5.2. Example skeleton.json
****************************

.. code-block:: javascript

    {
        "Screen1":
        [
            {
                "TabContainer1":
                {
                    "RefID": "Screen1"
                }
            },
            {
                "Text1":
                {
                    "RefID": "TabContainer1",
                    "ElementID": "Tab1"
                }
            },
            {
                "Text2":
                {
                    "RefID": "TabContainer1",
                    "ElementID": "Tab2"
                }
            }

        ]
    }

3.6. Object Templates
---------------------

To integrate user-based *x0-object-templates* (programmed user-based *x0-system-objects*),
the ``template_file`` and ``setup_class`` configuration parameters must be specified.

.. code-block:: sql

    INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'template_file', 'TemplateObject1.js');
    INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'template_file', 'TemplateObject2.js');
    INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'template_file', 'TemplateObject3.js');
    INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'setup_class', '["TemplateClass"] = TemplateClass');
    INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'setup_class', '["TemplateClassOther"] = TemplateClassOther');
    INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'setup_class', '["TemplateClassInfo"] = TemplateClassInfo');

Template ``.js`` files must be placed in the *x0-application* ``/static`` subdirectory
to be loaded correctly.

For detailed instructions on modeling *x0-system-objects*, see :ref:`devobjectmodeling`.
