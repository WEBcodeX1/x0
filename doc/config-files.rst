.. config-files

4. App Metadata-Definitions
===========================

4.1 menu.json
-------------

#TODO: update to new specifications.

4.1.1 menu.json Example
***********************

#TODO: update to new specifications.

4.2 skeleton.json
-----------------

The *skeleton.json* file connects **x0 System-Objects** defined in *objects.json* with **x0 System-Screens** defined in *menu.json*.

A single **x0 System-Object** can be mapped / referenced to multiple **x0 System-Screens**.


4.2.1 skeleton.json Example
***************************

The following JSON Example shows simple **Object to Screen** mapping.

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

The additional Property "ElementID" in *skeleton.json* allows mapping to Sub-Elements of **x0 System-Objects**
which welche die Property "ElementID" unterstützen.

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
