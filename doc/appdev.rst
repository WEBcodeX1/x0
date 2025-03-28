.. appdev

.. _appdevelopment:

3. Application Development
==========================

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

    Note the invisible screen areas. They represent

3.1.1. Menu Area
****************

The **x0-menu-area** is primarily intended to contain menu related objects
/ internal links.

The DOM DIV layer id = "sysMenu". Referenced objects inside menu.json will be
appended to "sysMenu" DIV in system init / page load.

A link object can be referenced to a given Screen ID. On click the system
ativates loads the screen data into the Screen Area.

The menu DIV layers class attribute (CSS styles) will be defined in ...

3.1.2. Screen Area
******************

The Screen Area is the Main Content Display Area ...

The "default_screen" *x0-config-parameter* see 3.2.1. System Configuration
controls which screen will be displayed (activated) on system init (page load).

Each screens DIV layers class attribute (CSS styles) can be defined ...

3.1.3. NotifyIndicator Area
***************************

The Notify Indicator Area displays Web-Service Status Information when
Data is exchanged with the backend or on external web-service calls.

The DIV layer id is

3.3.4. Object State Preservation
********************************

On switching Screens or e.g. on objects pagination the *x0-system* guarantees
any object state is preserved to 100%.

E.g. if you switch from screen with id "Screen1" to "Screen2", do some
work, switch back to "Screen1", any object look including (form) data is
exactly like it had been before switching.

This is real cool, Never loose any user input data on "going back" actions!




3.1. Database Configuration
---------------------------

Basic *x0-application* configuration data will be stored inside the following
system tables **system.config** and **webui.text**.

The following described meta-data **must** exist for an *x0-application* to work
properly.

The sql scripts (filename suffix **.sql**)  must reside in **/database** folder
of *x0-system* **or** *x0-skeleton*.

System database will be updated from **.sql** scripts inside **/database** folder
on docker image re-build (see subsection  ... docker ... ).

3.1.1. System Configuration
***************************

System configuration data is stored in database table `system.config`.

.. table:: System Database Table "system.config"
    :widths: 20 30 50

    +----------------------+-----------------+-------------------------------------+
    | **Table Column**     | **Default**     | **Description**                     |
    +======================+=================+=====================================+
    | app_id               | default (String)| x0 Application ID                   |
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

3.1.2. Display Text
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

3.1.3. Application ID
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

3.2. app-config.json
--------------------



3.4. System Metadata
--------------------

With help of the x0-system-metadata JSON configuration files any object
structure and object relations will be defined.

We will give a simple ...

The example section also can help to get a better understanding how object
definition and object relation is setup correctly.

See `/examples` subdir.

3.4.1. object.json
******************

The object.json config file contains all x0-systems object declarations.

Each object must have its unique ID and will be referenced with its ID inside
menu.js and skeleton.js where *screen* and *object relations* will be defined.

All current usable *x0-system-objects* JSON definitions can be found here:
:ref:`system-objects`.

3.4.2. skeleton.json
********************

.. code-block:: javascript

    {
        "Screen1":
        [
            {
                "FormfieldList1":
                {
                    "RefID": "Screen1"
                }
            },
            {
                "FormfieldList2":
                {
                    "RefID": "Screen1"
                }
            }
        ],

        "Screen2":
        [
            {
                "FormfieldList3":
                {
                    "RefID": "Screen2"
                }
            }
        ]
    }

3.4.3. menu.json
****************

3.4.4. MultiRef / ElementID
***************************

Some *x0-objects* define elements inside object.json

* TabContainer
* ObjectContainer

If so, they are also referencable inside skeleton.json.

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
