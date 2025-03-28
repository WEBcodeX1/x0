.. appdev

.. _appdevelopment:

3. Basic Configuration
======================

The following sections describe the most important system parts.

* Browser Content Areas / Screen Definition
* System Database Configuration Data
* Web-Application Server Configuration (app-config.json)
* Application Metadata / Objects and Objects Reference Configuration

3.1. Browser Content Areas
--------------------------

The *x0-systems* browser main display area is devided into **3 visible** areas.

1. "Menu" Area
2. "Screen" Content Area
3. "Notification" Area

.. image:: images/x0-browser-content-areas.png
  :alt: image - browser content areas

.. note::

    Note the invisible screen layers. Description following.

3.1.1. Menu Area
****************

The **x0-menu-area** is primarily intended to contain menu related objects
/ internal links.

The DOM DIV layer id = "sysMenu". Referenced objects inside **menu.json**
will be appended to "sysMenu" DIV on system init rendering / page load.

A **x0-screen** (textual id) can be referenced by a link type object. When
clicked, the system ativates / makes the screen layer visible inside the
**x0-screen-area**.

DOM Layer Positioning can be achieved via CSS styles, detailed info about
content area positioning, see :ref:`content-area-positioning`.

.. note::

    The **x0-menu-area** is not only limited to link-objects type, any object
    can be referenced in **menu.json**, e.g. as link **container** used for positioning.

3.1.2. Screen Area
******************

The **x0-screen-area** acts as the main content display area.

The "default_screen" which will be activated on system init / page load can be
set as *x0-config-parameter* (details see :ref:`systemconfig`).

Screen definition and object relations will be defined inside **skeleton.json**
(details see :ref:`skeleton-json`).

Also DOM Layer Positioning can be achieved via CSS styles, detailed info about
content area positioning, see :ref:`content-area-positioning`.

The following diagram shows what exactly happens on *x0-screen-switching*.

.. image:: images/x0-screen-switch.png
  :alt: image - screen switch

3.1.3. Notification Area
************************

The **x0-notification-area** displays web-service status information when
data is exchanged with the backend or on external web-service calls.

Also DOM Layer Positioning can be achieved via CSS styles, detailed info about
content area positioning, see :ref:`content-area-positioning`.

3.1.4. Object State Preservation
********************************

The *x0-system* guarantees 100% content state preservation on any systems
interaction (button, screen or tab switch, page navigation).

Even combined / chanined realtime objects always preserve their state
thanks to the *x0-systems-design*.

Imagine, if you switch from screen with id "screen1" to "screen2" e.g., do some
work, switch back to "screen1", any object look including its data is exactly
in the state it had been before switching.

.. note::

    This is real cool, never loose any user input data on "going back" actions
    again!

.. _content-area-positioning:

3.1.5. Area Positioning / CSS
*****************************

Styling including positioning **x0-menu-area** and **x0-screen-area** and
**x0-notification-area** using Boostrap Grid CSS is conceivable simple.

You should be familiar with CSS Grid basics and Boostrap Grid feature,
see https://getbootstrap.com/docs/5.3/layout/grid/.

Currently the **x0-menu-area** gets positioned by using ``position: absolute``
and **x0-screen-area** by ``<div id="id" class="col-md8 ms-auto me-auto">``.

A better approach is to use ``<body class="row">`` and ``col-md-x`` CSS classes
on **x0-menu-area** and **x0-screen-area**.

Positioning **x0-notification-area** using ``position: absolute`` could be a
really good idea.

.. note::

    CSS styles in 2025 are tremendously flexible. Bootstrap in addition reduces
    this complexity and makes using *x0-system* effortlessly.

3.2. Database Configuration
---------------------------

Basic *x0-application* configuration data will be stored inside the following
system tables **system.config** and **webui.text**.

The following described meta-data **must** exist for an *x0-application* to work
properly.

The sql scripts (filename suffix **.sql**)  must reside in **/database** folder
of *x0-system* **or** *x0-skeleton*.

System database will be updated from **.sql** scripts inside **/database** folder
on docker image re-build (see subsection  ... docker ... ).

.. _systemconfig:

3.2.1. System Configuration
***************************

System configuration data is stored in database table `system.config`.

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

The following example sql inserts demonstrate a default *x0-application-config*
viewable by URL http://x0-app.x0.localnet/python/Index.py.

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

Multilanguage display text is stored inside `webui.text` database table.

The following example inserts 4 multilanguage texts with IDs 'TXT.TEXTID.1'
and 'TXT.TEXTID.2' (english and german) into the system text table which can
be referenced in *x0-object-metadata* JSON configuration files later on.

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

It is possible to append HTTP get parameter "appid" with e.g. "example2"
to the base URL (Index.py) script.

http://x0-app.x0.localnet/python/Index.py?appid=example2

The following sql statements show how configuration data must be stored for this
to work properly.

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

3.3. App Server Configuration
-----------------------------

app-config.json



3.4. System Metadata
--------------------

With help of the **x0-system-metadata** JSON configuration files any object
structure and object relations will be defined.

We will give a simple ...

The example section also can help to get a better understanding how object
definition and object relation is setup correctly.

See `/examples` subdir.

.. _object-json:

3.4.1. Object
*************

Object declaration takes place in ***object.json*** config file.

Each object must have its unique ID and will be referenced with its ID inside
**menu.js** and **skeleton.js**.

All current usable *x0-system-objects* JSON definitions can be found here:
:ref:`system-objects`.

.. _skeleton-json:

3.4.2. Skeleton
***************

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
        ],

        "Screen2":
        [
            {
                "Object2":
                {
                    "RefID": "Screen2"
                }
            }
        ]
    }

.. _menu-json:

3.4.3. Menu
***********

3.4.4. MultiRef / ElementID
***************************

Some *x0-objects* define elements inside **object.json**.

* TabContainer
* ObjectContainer

These elements are also referencable inside **skeleton.json** by *x0-systems*
ElementID property.

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
                "Formfield1":
                {
                    "RefID": "TabContainer1",
                    "ElementID": "Tab1"
                }
            },
            {
                "Formfield2":
                {
                    "RefID": "TabContainer1",
                    "ElementID": "Tab2"
                }
            }

        ]
    }
