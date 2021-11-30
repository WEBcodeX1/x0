.. base-objects

Base Objects
============

The system Meta-Data Configuration consists of Objects-Declaration / Configuration in JSON.

* DIV
* SQLText
* FormfieldList
* Formfield
* List
* TabContainer
* RowContainer
* LinkExternal

DIV
---

Object Properties
*****************

+---------------------+----------------------+-------------------------------------------------+
| **Property**        | **Value(s)**         | **Description**                                 |
+=====================+======================+=================================================+
| Style               | CSS Style Classes    | Likewise HTML DIV CSS Styles                    |
+---------------------+----------------------+-------------------------------------------------+

JSON Structure Example
**********************

.. code-block:: javascript

	"ObjectID":
	{
		"Type": "DIV",
		"Attributes": {
			"Style": "Style1 Style2 Style3"
		}
	}

SQLText
-------

Object Properties
*****************

+---------------------+----------------------+-------------------------------------------------+
| **Property**        | **Value(s)**         | **Description**                                 |
+=====================+======================+=================================================+
| Style               | CSS Style Classes    | Likewise HTML DIV CSS Styles                    |
+---------------------+----------------------+-------------------------------------------------+
| TextID              | String (ID)          | Backend Text ID, in DB Table "webui.text"       |
|                     |                      |                                                 |
+---------------------+----------------------+-------------------------------------------------+

JSON Structure Example
**********************

.. code-block:: javascript

	"ObjectID":
	{
		"Type": "SQLText",
		"Attributes": {
			"Style": "Style1 Style2 Style3",
			"TextID": "TXT.TEST.NR1"
		}
	}


FormfieldList
-------------

Object Properties
*****************

+---------------------+----------------------+-------------------------------------------------+
| **Property**        | **Value(s)**         | **Description**                                 |
+=====================+======================+=================================================+
| Style               | CSS Style Classes    | Likewise HTML DIV CSS Styles                    |
+---------------------+----------------------+-------------------------------------------------+
| FormFields          | Array of Strings     | List of Formfields, Formfield Objects           |
|                     | (Formfield IDs)      |                                                 |
+---------------------+----------------------+-------------------------------------------------+

.. warning::

	Object-Mapping takes place at "skeleton.json" file in general. To map Formfield Objects to
	FormfieldList Object Type in a much more easier way this has been moved to the FormfieldList
	Object itself.

	In later Releases (Editor has been finished) the mapping will in certain circumstances be
	moved back to "skeleton.json".

JSON Structure Example
**********************

.. code-block:: javascript

	"FormfieldTest1":
	{
		"Type": "FormFieldList",
		"Attributes": {
			"Style": "DefaultFormList",
			"FormFields": [
				"FormfieldID1",
				"FormfieldID2",
				"FormfieldID3"
			]
		}
	}


Formfield
---------

Following Sub-Types exist:

* text
* pulldown
* dynpulldown
* label


Sub Type "text"
***************

Object Properties
^^^^^^^^^^^^^^^^^

+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+
| **Property**        | **Type**  | **Value(s)**   | **Description**                          | **Optional** | **Default**  |
+=====================+===========+================+==========================================+==============+==============+
| Style               | Strings   | CSS Classes    | Likewise HTML DIV CSS Styles             |              |              |
+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+
| StyleOnFocus        | Strings   | CSS Classes    | Styles which will be set On Focus        |              |              |
+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+
| StyleValidateOk     | Strings   | CSS Classes    | Styles which will be set On Success      |              |              |
+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+
| StyleValidateFail   | Strings   | CSS Classes    | Styles which will be set On Failure      |              |              |
+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+
| | ValidateRef       | | String  | | ID Reference | | Validate (Regex or JS Method) Reference| | x          |              |
| |                   | |         | |              | | from sysFormFieldValidate.js           | |            |              |
+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+
| | ValidateNullable  | | Bool    | | true | false | | Override ValidateRef                   | | x          |              |
| |                   | |         | |              | | If true: Formfield Value can be empty  | |            |              |
+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+

.. warning::

	Default Values for multiple Properties will be set in future Releases. Actually no Default Values exist.


JSON Structure Example
^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: javascript

	"FormfieldTestText":
	{
		"Type": "FormField",
		"Attributes":
		{
			"Type": "text",
			"Style": "FormFieldBorder",
			"StyleOnFocus": "FormFieldBorderOnFocus",
			"StyleValidateOk": "FormFieldBorderValidateOk",
			"StyleValidateFail": "FormFieldBorderValidateFail",
			"ValidateRef": "DefaultString",
			"ValidateNullable": true
		}
	}


Sub Type "pulldown"
*******************

Object Properties
^^^^^^^^^^^^^^^^^

+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| **Property**        | **Type**  | **Value(s)**   | **Description**                                 | **Optional** | **Default**  |
+=====================+===========+================+=================================================+==============+==============+
| Style               | String(s) | CSS Classes    | Likewise HTML DIV CSS Styles                    |              |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| StyleOnFocus        | String    | CSS Class      |                                                 | x            |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| AddNoneItem         | Bool      | true | false   |                                                 | x            |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| Options             | Objects   | Objects List   | Pulldown Options, see Option Properties         |              |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| OnChange            | Object    | JS Object      | Pulldown Onchange see Pulldown OnChangeHandling | x            |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+

Options Properties
^^^^^^^^^^^^^^^^^^
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| **Property**        | **Type**  | **Value(s)**   | **Description**                                 | **Optional** | **Default**  |
+=====================+===========+================+=================================================+==============+==============+
| TextID              | String    |                | Backend Text ID                                 |              |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| Value               | String    |                | Option Value                                    |              |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+

JSON Structure Example
^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: javascript

	"FormfieldTest":
	{
		"Type": "FormField",
		"Attributes":
		{
			"Type": "pulldown",
			"Style": "Style1 Style2",
			"StyleOnFocus": "StyleOnFocus",
			"AddNoneItem": true,
			"Options": {
				"10":
				{
					"TextID": "TXT.ID.1",
					"Value": "10"
				},
				"20":
				{
					"TextID": "TXT.ID.2",
					"Value": "20"
				}
			}
		}
	}

Sub Type "dynpulldown"
**********************


Sub Type "label"
****************

The Sub Type "label" renders a single DIV Layer which can be CSS styled. 
The "LabelFor" Property connects the Display Object to the given Formfield (ID).

.. note::

	Actually no "TextID" Propery exists to map Backend Text, this will be added in future versions.

JSON Structure Example
^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: javascript

	"FormfieldTest1":
	{
		"Type": "FormField",
		"Attributes":
		{
			"Type": "label",
			"DisplayText": "Display Text",
			"Style": "Style1 Style2",
			"LabelFor": "FormfieldID"
		}
	}


Object Properties
^^^^^^^^^^^^^^^^^

+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| **Property**        | **Type**  | **Value(s)**   | **Description**                                 | **Optional** | **Default**  |
+=====================+===========+================+=================================================+==============+==============+
| Style               | String(s) | CSS Classes    | Likewise HTML DIV CSS Styles                    |              |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+


List
----

Description Text.

Object Properties
*****************

+-----------------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| **Property**                | **Type**  | **Value(s)**   | **Description**                                 | **Optional** | **Default**  |
+=============================+===========+================+=================================================+==============+==============+
| Style                       | String(s) | CSS Classes    | Likewise HTML DIV CSS Styles                    |              |              |
+-----------------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| HeaderRowStyle              | String(s) | CSS Classes    | List Header CSS Styles                          |              |              |
+-----------------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| RowStyle                    | String(s) | CSS Classes    | List Row CSS Styles                             |              |              |
+-----------------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| Navigation                  | Object    | JS Object      | Navigation Config Attributes                    |              |              |
+-----------------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| Columns                     | Objects   | JS Object List | Column Config Attributes                        |              |              |
+-----------------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| ContextMenuItems            | Objects   | JS Object List | Context Menu Config Attributes                  | x            |              |
+-----------------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| CellGroupRowStyle           | String(s) | CSS Classes    | CSS Styles used for RowAfterElements            | x            |              |
+-----------------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| RowAfterElements            | Array     | JS Array       | see Extended Row Styling Topic                  | x            |              |
+-----------------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| ElementsEnclosedByDivStyle  | Array     | JS Array       | see Extended Row Styling Topic                  | x            |              |
+-----------------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+


Navigation Properties
*********************

+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| **Property**        | **Type**  | **Value(s)**   | **Description**                                 | **Optional** | **Default**  |
+=====================+===========+================+=================================================+==============+==============+
| Type                | String    | Nav Types      | Actual just "Page.Index"                        |              |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+

Columns Properties
******************

+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| **Property**        | **Type**  | **Value(s)**   | **Description**                                 | **Optional** | **Default**  |
+=====================+===========+================+=================================================+==============+==============+
| HeaderStyle         | String(s) | CSS Classes    | Likewise HTML DIV CSS Styles                    |              |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| HeaderTextID        | String    |                | Backend Text ID                                 |              |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| sortable            | Bool      | true | false   | Column sortable, actually unsupported           | x            |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| visible             | Bool      | Nav Types      | Column invisible hides Column display           | x            |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| Attributes          | Object    | JS Object      | Connect any System Object to Column             | x            |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| DBPrimaryKey        | Bool      | true | false   | Deprecated                                      | x            |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| DBPrimaryKeyID      | String    |                | Deprecated                                      | x            |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+


.. warning::

	"DBPrimaryKey" and "DBPrimaryKeyID" Properties are deprecated. The Database Primary Key Column name (e.g. "id") is sufficient.
	
	Automatically storing "DBPrimaryKeyID" into a "Screen Container" will be removed from future Releases.


ContextMenuItems Properties
***************************

+---------------------+-----------+-----------------+-------------------------------------------------+--------------+--------------+
| **Property**        | **Type**  | **Value(s)**    | **Description**                                 | **Optional** | **Default**  |
+=====================+===========+=================+=================================================+==============+==============+
| TextID              | String    |                 | Backend Text ID                                 |              |              |
+---------------------+-----------+-----------------+-------------------------------------------------+--------------+--------------+
| Icon                | String    |                 | Display Icon                                    |              |              |
+---------------------+-----------+-----------------+-------------------------------------------------+--------------+--------------+
| DstScreenID         | String    |                 | Switch to Destination Screen on Selection       |              |              |
+---------------------+-----------+-----------------+-------------------------------------------------+--------------+--------------+
| FireEvents          | Array     | Array of String | Events which will be triggered                  |              |              |
+---------------------+-----------+-----------------+-------------------------------------------------+--------------+--------------+

JSON Structure Example
**********************

.. code-block:: javascript

	"List1":
		{
			"Type": "List",
			"Attributes":
			{
				"RowCount": 15,
				"Style": "sysList",
				"HeaderRowStyle": "Style1 Style2",
				"RowStyle": "Style1 Style2",
				"Navigation":
				{
					"Type":	"Page.Index"
				},
				"Columns":
				{
					"ID":
					{
						"visible": false
					},
					"col1":
					{
						"HeaderTextID": "TXT.TABLE.HEADER.COL1",
						"sortable": true,
						"HeaderStyle": "col-md-5"
					},
					"col2":
					{
						"HeaderTextID": "TXT.TABLE.HEADER.COL2",
						"sortable": true,
						"HeaderStyle": "col-md-5"
					},
					"col3":
					{
						"HeaderTextID": "TXT.TABLE.HEADER.COL3",
						"sortable": false,
						"HeaderStyle": "col-md-2",
						"Attributes": {
							"ObjectType": "ButtonInternal",
							"ButtonAttributes": {
								"TextID": "TXT.BUTTON.TEST",
								"Style": "sysButton",
								"FireEvents": [ "EventName" ],
								"Action": "copy",
								"SrcType": "ListRow",
								"SrcColumn": "col2",
								"DstObject": "DstTestObject",
								"SwitchScreenID": "TestScreen"
							}
						}
					}
				},
				"CellGroupRowStyle": "row sysListContent",
				"RowAfterElements": [ 2, 1 ]
				"ElementsEnclosedByDivStyle": [
					"col-md-5",
					"col-md-7",
					"col-md-12"
				],
				"ContextMenuItems": {
					"Item1": {
						"TextID": "TXT.CONTEXTMENU.ITEM1",
						"Icon": "Edit",
						"DstScreenID": "ScreenID1",
						"FireEvents": [ "EventID1", "EventID2" ]
					},
					"Item2": {
						"TextID": "TXT.CONTEXTMENU.ITEM2",
						"Icon": "Edit",
						"DstScreenID": "ScreenID2",
						"FireEvents": [ "EventID1", "EventID2" ]
					}
				}
			}
		}


TabContainer
------------

The TabContainer Object renders multiple Tabs. The Tab Look is defined in the Tabs Object-Properties.
Object-Mapping takes place in "skeleton.json" (Example below).

On Tab Switch all Elements not connected to the Tab will de deactiveted / switched to CSS display::none.
Style. The Elements 

.. code-block:: javascript

	+---------+---------+---------+
	| Tab1    | Tab2    | Tab3    |
	+---------+---------+---------+
	    |         |         |
	 Object1   Object4    Object6
	 Object2   Object5    Object7
	 Object3              Object8

Object Properties
*****************

+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| **Property**        | **Type**  | **Value(s)**   | **Description**                                 | **Optional** | **Default**  |
+=====================+===========+================+=================================================+==============+==============+
| Tabs                | Objects   | Objects List   | Tabs Items List                                 |              |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+

Tab Properties
**************

+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| **Property**        | **Type**  | **Value(s)**   | **Description**                                 | **Optional** | **Default**  |
+=====================+===========+================+=================================================+==============+==============+
| Default             | Bool      | true | false   | Selected Default Tab                            |              |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| Width               | Integer   |                | Tab Width in Pixel                              |              |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+
| TextID              | String    |                | Backend Text ID (Tab Display Text)              |              |              |
+---------------------+-----------+----------------+-------------------------------------------------+--------------+--------------+

JSON Structure Example
**********************

.. code-block:: javascript

	"TabContainer1":
	{
		"Type": "TabContainer",
		"Attributes":
		{
			"Tabs":
			{
				"Tab1":
				{
					"Attributes":
					{
						"Default": true,
						"Width": 120,
						"TextID": "TXT.TAB1"
					}
				},
				"Tab2":
				{
					"Attributes":
					{
						"Default": false,
						"Width": 120,
						"TextID": "TXT.TAB2"
					}
				},
				"Tab3":
				{
					"Attributes":
					{
						"Default": false,
						"Width": 200,
						"TextID": "TXT.TAB3"
					}
				}
			}
		}
	}

Skeleton Mapping Example
************************

Also see :ref:`ref-elidmap`.

LinkExternal
------------

JSON Structure Example Static
*****************************

.. code-block:: javascript

	"Link1":
	{
		"Type": "LinkExternal",
		"Attributes":
		{
			"LinkURL": "https://linkurl.com/test",
			"LinkDisplay": "LinkDisplayText",
			"OpenInTab": true
		}
	}

JSON Structure Example Dynamic
******************************

.. code-block:: javascript

	"Link2":
	{
		"Type": "LinkExternal",
		"Attributes":
		{
			"LinkURL": "https://linkurl.com/python/Download.py?session_id=%session_id&filename=%value&userid=%userid",
			"LinkDisplay": "%value",
			"OpenInTab": true,
			"ReplaceVars": {
				"userid": "wpuser_id"
			},
			"DisplayTextNoData": "Null Value in Backend Data",
			"DBColumn": "columnid"
		}
	}
