.. base-layout

Base Layout
===========

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

sysInitOnLoad.js
----------------

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

menu.json
---------

The menu.json configuration file contains a non-nested Associative Array, for each **Link** one
Object. The Object Properties are listed in the following table:

+------------------------+------------------------------------------------------------------------+
| **Property**           | **Description**                                                        |
+========================+========================================================================+
| TextID                 | Backend Text ID (Database) stored in Table "webui.text"                |
+------------------------+------------------------------------------------------------------------+
| ScreenID               | Screen Reference, which Screen will be loaded in Content Area on click |
+------------------------+------------------------------------------------------------------------+
| RefID                  | Parent Menu Reference (recursive)                                      |
+------------------------+------------------------------------------------------------------------+
| IconStyle              | Menu Icon CSS Style                                                    |
+------------------------+------------------------------------------------------------------------+


menu.json Example
-----------------

.. code-block:: javascript

	{
		"Link1Root":
		{
			"TextID": "TXT.MENU.LINK1",
			"RefID": "MenuRoot"
		},
		"SubLink1":
		{
			"TextID": "TXT.MENU.SUBLINK1.TEST",
			"ScreenID": "Sublink1",
			"RefID": "Link1Root",
			"IconStyle": "StandardLink"
		},
		"SubLink2":
		{
			"TextID": "TXT.MENU.SUBLINK2.TEST",
			"ScreenID": "Sublink2",
			"RefID": "Link1Root",
			"IconStyle": "StandardLink"
		},
		"SubSubLink1":
		{
			"TextID": "TXT.MENU.SUBSUBLINK1.TEST",
			"ScreenID": "SubSubLink1",
			"RefID": "SubLink2",
			"IconStyle": "StandardLink"
		}
	}


skelleton.json
--------------

The skelleton.json file connects objects defined in objects.json with Screens defined in menu.json.

You can map multiple Objects to multiple Screens.


skelleton.json Example
----------------------

.. code-block:: javascript

	{
		"ScreenName1":
		[
			{
				"Formfields1":
				{
					"RefID": "ScreenName1"
				}
			},
			{
				"Formfields2":
				{
					"RefID": "ScreenName1"
				}
			}
		],
		"ScreenName2":
		[
			{
				"Formfields1":
				{
					"RefID": "ScreenName2"
				}
			}
		]
	}

Bootstrap
---------

The system optionally can use Bootstrap for CSS Styles.

Checkout the Documentation at https://getbootstrap.com how to use correctly.

.. note::

	The system does not rely on Bootstrap, everything works fine with self defined CSS Sytles as well.
