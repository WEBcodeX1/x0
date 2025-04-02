.. appdev-objects

.. _system-objects:

5. System Objects
=================

Currently the following *x0-system-objects* are usable inside `object.json`.

* :ref:`objecttype-div`
* :ref:`objecttype-sqltext`
* :ref:`objecttype-button`
* :ref:`objecttype-buttoninternal`
* :ref:`objecttype-link`
* :ref:`objecttype-linkexternal` 
* :ref:`objecttype-list`
* :ref:`objecttype-tabcontainer`
* :ref:`objecttype-fileupload`
* :ref:`objecttype-errorcontainer`

.. _objecttype-div:

5.1. Div
--------

The ``"Type": "Div"`` *x0-system-object* is the most simple one.

It simply generates a DOM layer with variable CSS class attribute(s).

5.1.1. Object Attributes
************************
.. table:: Object Type Div Attributes
	:widths: 30 20 50

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| DOMType             | String               | Container Div Type, <DOMType></DOMType>         |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+

5.1.2. JSON Example
*******************

.. code-block:: javascript

	"$ObjectID":
	{
		"Type": "Div",
		"Attributes": {
			"Style": "css1 css2 css3"
		}
	}

5.1.3. Runnable Example
***********************

Ref 2 Row/Colspan Example

.. _objecttype-sqltext:

5.2. SQLText
------------

The ``"Type": "SQLText"`` *x0-system-object* renders a (multilanguage) text
defined in *x0-db* on systems initialization.

5.2.1. Object Attributes
************************

.. table:: Object Type SQLText Attributes
	:widths: 30 20 50

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| DOMType             | String               | Container Div Type, <DOMType></DOMType>         |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| IconStyle           | CSS-String           | Fontawesome Icon CSS for Prepend Icon           |
	+---------------------+----------------------+-------------------------------------------------+
	| IconStylePost       | CSS-String           | Fontawesome Icon CSS for Append Icon            |
	+---------------------+----------------------+-------------------------------------------------+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+

5.2.2. JSON Example
*******************

.. code-block:: javascript

	"$ObjectID":
	{
		"Type": "SQLText",
		"Attributes": {
			"Style": "css1 css2",
			"TextID": "TXT.TEST.NR1"
		}
	}

5.3. Button
-----------

The ``"Type": "Button"`` *x0-system-object* generates a control-flow .

Details + Examples see 

5.3.1. Object Attributes
************************

.. table:: Object Type Button Attributes
	:widths: 30 20 50

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| DOMType             | String               | Container Div Type, <DOMType></DOMType>         |
	+---------------------+----------------------+-------------------------------------------------+
	| DOMValue            | String               | Set Hardcoded Display Value                     |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| IconStyle           | CSS-String           | Fontawesome Icon CSS for Prepend Icon           |
	+---------------------+----------------------+-------------------------------------------------+
	| IconStylePost       | CSS-String           | Fontawesome Icon CSS for Append Icon            |
	+---------------------+----------------------+-------------------------------------------------+
	| FormButton          | Boolean              | Treat Button as HTML form input type "button"   |
	+---------------------+----------------------+-------------------------------------------------+
	| Disabled            | Boolean              | Disable Functionality Initially                 |
	+---------------------+----------------------+-------------------------------------------------+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| OnClick             | URL-String           | Backend Service URL                             |
	+---------------------+----------------------+-------------------------------------------------+
	| Action              | Action-String        | Single Action before Service Exec, see 5.3.2.   |
	+---------------------+----------------------+-------------------------------------------------+
	| DstObjectID         | ObjectID-String      | Destination ObjectID Reference                  |
	+---------------------+----------------------+-------------------------------------------------+
	| DstScreenID         | ScreenID-String      | Destination ScreenID Reference                  |
	+---------------------+----------------------+-------------------------------------------------+
	| FireEvents          | Array                | Array of EventIDs                               |
	+---------------------+----------------------+-------------------------------------------------+
	| CloseOverlay        | Boolean              | Close Overlay On Click                          |
	+---------------------+----------------------+-------------------------------------------------+
	| OnResult            | Array of Actions     | Actions after Service Execution, see 5.3.3.     |
	+---------------------+----------------------+-------------------------------------------------+

5.3.2. Actions
**************

.. table:: Button Actions
	:widths: 30 20 50

	+---------------------+----------------------+-------------------------------------------------+
	| **Action**          | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| enable              | Dst-Object           | Set DOM Visible State "visible"                 |
	+---------------------+----------------------+-------------------------------------------------+
	| disable             | Dst-Object           | Set DOM Visible State "hidden"                  |
	+---------------------+----------------------+-------------------------------------------------+
	| activate            | Dst-Object           | Set Internal State "active" (validate)          |
	+---------------------+----------------------+-------------------------------------------------+
	| deactivate          | Dst-Object           | Set Internal State "inactive" (no validate)     |
	+---------------------+----------------------+-------------------------------------------------+
	| reset               | Dst-Object           | Call Objects reset() Method                     |
	+---------------------+----------------------+-------------------------------------------------+
	| switchscreen        | Dst-Screen           | Switch Screen to Value in DstScreenID           |
	+---------------------+----------------------+-------------------------------------------------+

5.3.3. OnResult Actions
***********************

.. table:: Button OnResult Actions
	:widths: 30 20 50

	+---------------------+----------------------+-------------------------------------------------+
	| **Action**          | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| enable              | Dst-Object           | Set DOM Visible State "visible"                 |
	+---------------------+----------------------+-------------------------------------------------+
	| disable             | Dst-Object           | Set DOM Visible State "hidden"                  |
	+---------------------+----------------------+-------------------------------------------------+
	| activate            | Dst-Object           | Set Internal State "active" (validate)          |
	+---------------------+----------------------+-------------------------------------------------+
	| deactivate          | Dst-Object           | Set Internal State "inactive" (no validate)     |
	+---------------------+----------------------+-------------------------------------------------+
	| reset               | Dst-Object           | Call Objects reset() Method                     |
	+---------------------+----------------------+-------------------------------------------------+
	| tabswitch           | Dst-Object           | Switch to TabContainers Tab                     |
	+---------------------+----------------------+-------------------------------------------------+

5.4. ButtonInternal
-------------------

The ``"Type": "ButtonInternal"`` *x0-system-object* inherits  .

Details + Examples see 

5.4.1. Object Attributes
************************

.. table:: Object Type ButtonInternal Attributes
	:widths: 30 20 50

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| DOMType             | String               | Container Div Type, <DOMType></DOMType>         |
	+---------------------+----------------------+-------------------------------------------------+
	| DOMValue            | String               | Set Hardcoded Display Value                     |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| IconStyle           | CSS-String           | Fontawesome Icon CSS for Prepend Icon           |
	+---------------------+----------------------+-------------------------------------------------+
	| IconStylePost       | CSS-String           | Fontawesome Icon CSS for Append Icon            |
	+---------------------+----------------------+-------------------------------------------------+
	| FormButton          | Boolean              | Treat Button as HTML form input type "button"   |
	+---------------------+----------------------+-------------------------------------------------+
	| Disabled            | Boolean              | Disable Functionality                           |
	+---------------------+----------------------+-------------------------------------------------+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| Action              | Action-String        | Single Action before Service Exec, see 5.3.2.   |
	+---------------------+----------------------+-------------------------------------------------+
	| DstObjectID         | ObjectID-String      | Destination ObjectID Reference                  |
	+---------------------+----------------------+-------------------------------------------------+
	| DstScreenID         | ScreenID-String      | Destination ScreenID Reference                  |
	+---------------------+----------------------+-------------------------------------------------+
	| FireEvents          | Array                | Array of EventIDs                               |
	+---------------------+----------------------+-------------------------------------------------+
	| CloseOverlay        | Boolean              | Close Overlay On Click                          |
	+---------------------+----------------------+-------------------------------------------------+

5.5. Link
---------

The ``"Type": "Link"`` *x0-system-object* .

5.5.1. Object Attributes
************************

.. table:: Object Type Link Attributes
	:widths: 30 20 50

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| HiliteStyle         | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| ScreenStyle         | CSS-String           | Update ScreenStyle for given ScreenID           |
	+---------------------+----------------------+-------------------------------------------------+
	| ScreenID            | ScreenID-String      | Switch Screen to Screen set in ScreenID         |
	+---------------------+----------------------+-------------------------------------------------+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| OverlayID           | ScreenID-String      | Open Screen set in ScreenID in Overlay          |
	+---------------------+----------------------+-------------------------------------------------+
	| OverlayAttributes   | String               | Overlay Attributes                              |
	+---------------------+----------------------+-------------------------------------------------+
	| FireEvents          | Array                | Array of EventIDs                               |
	+---------------------+----------------------+-------------------------------------------------+

5.6. LinkExternal
-----------------

The ``"Type": "LinkExternal"`` *x0-system-object* .

5.6.1. Object Attributes
************************

.. table:: Object Type LinkExternal Attributes
	:widths: 30 20 50

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| LinkDisplay         | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| LinkURL             | URL-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| OpenInTab           | Boolean              | Update ScreenStyle for given ScreenID           |
	+---------------------+----------------------+-------------------------------------------------+

5.7. List
---------

The ``"Type": "List"`` *x0-system-object* .


5.7.1. Object Attributes
************************

.. table:: Object Type List Attributes
	:widths: 30 20 50

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| LinkDisplay         | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| LinkURL             | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| OpenInTab           | CSS-String           | Update ScreenStyle for given ScreenID           |
	+---------------------+----------------------+-------------------------------------------------+


Navigation Properties
*********************


Columns Properties
******************


ContextMenuItems Properties
***************************


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


6.6. TabContainer
-----------------

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


Tab Properties
**************


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


6.7. ObjectContainer
--------------------

The RowContainer Object Type is primarily used to group and style multiple Objects together.

The following Example shows a RowContainer Object grouping two ButtonInternal Objects in 
two columns side by side.
 

JSON Structure Example
**********************

Use following config in object.json and skeleton.json to check how RowContainer works.

object.json
^^^^^^^^^^^

.. code-block:: javascript

	"RowContainer1":
	{
		"Type": "RowContainer",
		"Attributes":
		{
			"Style": "row NavigationButtonsContainer",
			"Columns": [
				{
					"ObjectID": "NavigateBackwardButton",
					"Style": "col-sm-12 text-center col-md-4 text-lg-right text-md-right"
				},
				{
					"ObjectID": "NavigateForwardButton",
					"Style": "col-sm-12 text-center col-md-4 text-lg-right text-md-right"
				}
			]
		}
	}

skeleton.json
^^^^^^^^^^^^^

.. code-block:: javascript

	{
		"RowContainer1":
		{
			"RefID": "Screen1"
		}
	},
	{
		"ProjektUpdateKooperationspartnerNavigationButtonBackward":
		{
			"RefID": "RowContainer11",
			"ElementID": "NavigateBackwardButton"
		}
	},
	{
		"ProjektUpdateKooperationspartnerNavigationButtonForward":
		{
			"RefID": "RowContainer11",
			"ElementID": "NavigateForwardButton"
		}
	}

6.8. LinkExternal
-----------------

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

JSON Structure Example
**********************

.. code-block:: javascript

	"Link2":
	{
		"Type": "LinkExternal",
		"Attributes":
		{
			"LinkURL": "https://app.projektfonds-kulturelle-bildung.berlin/python/Download.py",
			"LinkDisplayValue": true,
			"LinkDisplayOnValueUndefined": "No Data available.",
			"OpenInTab": true,
			"ReplaceVars": {
				"userid": "wpuser_id",
				"filename": "$VALUE"
			},
			"ReplaceSessionID": true,
			"DBColumn": "test1"
		}
	}


6. Formfield Objects
====================

* :ref:`objecttype-formfieldlist`
* :ref:`objecttype-formfieldtext`
* :ref:`objecttype-formfieldlabel`
* :ref:`objecttype-formfieldtextarea`
* :ref:`objecttype-formfieldpulldown`
* :ref:`objecttype-formfielddynpulldown`
* :ref:`objecttype-formfieldcheckbox`
* :ref:`objecttype-formfieldhidden`


6.2. FormfieldText
------------------

The ``"Type": "FormfieldText"`` *x0-system-object* renders a HTML form input
type text element.


5.3.1. Object Attributes
************************

.. table:: Object Type FormfieldText Attributes
	:widths: 30 20 50

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| DOMType             | String               | Container Div Type, <DOMType></DOMType>         |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+



5.3. FormfieldList
------------------

Object Properties
*****************

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| HiddenFields        | Array                | Array of Formfield IDs                          |
	+---------------------+----------------------+-------------------------------------------------+
	| Sections            | Array                | Array of Section Objects                        |
	+---------------------+----------------------+-------------------------------------------------+


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


5.4. Formfield
--------------

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
