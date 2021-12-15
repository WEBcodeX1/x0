.. base-layout

Base Layout
===========

Directory Structure
-------------------

The system is devided into following directory structure.

+------------------------+------------------------------------------------------------------------+
| **Path**               | **Description**                                                        |
+========================+========================================================================+
| | /python              | - x0 System Python Scripts (specified in apache wsgi module config)    |
+------------------------+------------------------------------------------------------------------+
| | /www                 | - index.html                                                           |
| |                      | - x0 system .js files                                                  |
+------------------------+------------------------------------------------------------------------+
| | /www/static          | - CSS Styles                                                           |
| |                      | - menu.json                                                            |
| |                      | - object.json                                                          |
| |                      | - skeleton.json                                                        |
+------------------------+------------------------------------------------------------------------+
| | /www/python          | - All backend user Python Xcripts                                      |
+------------------------+------------------------------------------------------------------------+


System Meta Data
----------------

The following configuration files contain the complete System-Meta-Data from which the Browser
Application will be rendered.

+------------------------+------------------------------------------------------------------------+
| **File**               | **Function**                                                           |
+========================+========================================================================+
| menu.json              | Menu / Screen Definition                                               |
+------------------------+------------------------------------------------------------------------+
| object.json            | Global Objects Metadata / Definition                                   |
+------------------------+------------------------------------------------------------------------+
| skeleton.json          | Objects to Screen Mapping                                              |
+------------------------+------------------------------------------------------------------------+

The files must reside in the ``/$systemroot/static/`` path.

System Configuration Data
-------------------------

+-------------------------+------------------------------------------------------------------------+
| **File**                | **Function**                                                           |
+=========================+========================================================================+
| sysInitOnLoad.js        | User Configuration and Initialization                                  |
+-------------------------+------------------------------------------------------------------------+
| userInitLayerContent.js | User based Initialization Code                                         |
+-------------------------+------------------------------------------------------------------------+
| userFunctions.js        | User Defined Functions, for EventMapping or                            |
+-------------------------+------------------------------------------------------------------------+

The files must reside in the ``/$systemroot`` path.

Browser Screen Logical Separation
---------------------------------

+------------------------+------------------------------------------------------------------------+
| **Menu Area**          | **Content Area**                                                       |
+========================+========================================================================+
| Link1                  | << Content triggerd by Link press from Menu Area                       |
+------------------------+                                                                        |
| Link2                  |                                                                        |
+------------------------+                                                                        |
| Link3                  |                                                                        |
+------------------------+------------------------------------------------------------------------+

Bootstrap
---------

The system optionally can use Bootstrap for CSS Styles.

Checkout the Documentation at https://getbootstrap.com how to use correctly.

.. note::

	The system does not rely on Bootstrap, everything works fine with self defined CSS Sytles as well.
