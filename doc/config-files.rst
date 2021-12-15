.. config-files

Configuration Files
===================

sysInitOnLoad.js
----------------

Actually the main configuration takes place in sysInitOnLoad.js.

.. code-block:: javascript

	// define .json configuration files
	sysFactory.ObjMenu.requestXMLRPCData('static/menu.json');
	sysFactory.DataObject.requestXMLRPCData('static/object.json');
	sysFactory.DataSkeleton.requestXMLRPCData('static/skeleton.json');

	// set default screen which will be loaded at initialization
	sysFactory.DisplayDefaultScreen = 'ScreenID';

	// set menu visiable on true, on false disabled
	sysFactory.AdminInterface = true;

	// deprecated
	sysFactory.HideLayerForceActivated = false;

	// set default system display languaga
	sysFactory.EnvUserLanguage = 'de';

menu.json
---------

The menu.json configuration file contains a non-nested Associative Array, for each **Link** one
Object. The Object Properties are listed in the following table:

.. table:: Test1
    :widths: 30 70

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
			"TextID": "TXT.MENU.SUBLINK1",
			"ScreenID": "Sublink1",
			"RefID": "Link1Root",
			"IconStyle": "StandardLink"
		},
		"SubLink2":
		{
			"TextID": "TXT.MENU.SUBLINK2",
			"ScreenID": "Sublink2",
			"RefID": "Link1Root",
			"IconStyle": "StandardLink"
		},
		"SubSubLink1":
		{
			"TextID": "TXT.MENU.SUBSUBLINK1",
			"ScreenID": "SubSubLink1",
			"RefID": "SubLink2",
			"IconStyle": "StandardLink"
		}
	}


skeleton.json
-------------

The skelleton.json file connects objects defined in objects.json with Screens defined in menu.json.

You can map multiple Objects to multiple Screens.


skeleton.json Example
---------------------

The following JSON Example shows simple Object to Screen / Hierarchical Object to Object Mapping.

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

.. _ref-elidmap:

ElementID Mapping
*****************

The additional Property "ElementID" in skeleton.json allows mapping to Sub-Elements of some
Type of Objects.

.. note::

	The following Example maps the TabContainer Object "TabContainer1" to the RootObject of "ScreenName1".	
	Afterwards the Formfields Object "Formfields1" will be mapped to the "TabContainer1"s ElementID "Tab1".

.. code-block:: javascript

	{
		"ScreenName1":
		[
			{
				"TabContainer1":
				{
					"RefID": "ScreenName1"
				}
			},
			{
				"Formfields1":
				{
					"RefID": "TabContainer1",
					"ElementID": "Tab1"
				}
			}

		]
	}
