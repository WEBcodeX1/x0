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
	:widths: 30 20 100

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
	:widths: 30 20 80

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

.. _objecttype-button:

5.3. Button
-----------

The ``"Type": "Button"`` *x0-system-object* generates a control-flow .

Details + Examples see 

5.3.1. Object Attributes
************************

.. table:: Object Type Button Attributes
	:widths: 30 20 80

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
	| FireEvents          | Array of EventIDs    | Array of EventIDs                               |
	+---------------------+----------------------+-------------------------------------------------+
	| CloseOverlay        | Boolean              | Close Overlay On Click                          |
	+---------------------+----------------------+-------------------------------------------------+
	| OnResult            | Array of Actions     | Actions after Service Execution, see 5.3.3.     |
	+---------------------+----------------------+-------------------------------------------------+

5.3.2. Actions
**************

.. table:: Button Actions
	:widths: 30 20 80

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
	:widths: 30 20 80

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

.. _objecttype-buttoninternal:

5.4. ButtonInternal
-------------------

The ``"Type": "ButtonInternal"`` *x0-system-object* inherits  .

Details + Examples see 

5.4.1. Object Attributes
************************

.. table:: Object Type ButtonInternal Attributes
	:widths: 30 20 80

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

.. _objecttype-link:

5.5. Link
---------

The ``"Type": "Link"`` *x0-system-object* .

5.5.1. Object Attributes
************************

.. table:: Object Type Link Attributes
	:widths: 30 20 80

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

.. _objecttype-linkexternal:

5.6. LinkExternal
-----------------

The ``"Type": "LinkExternal"`` *x0-system-object* .

5.6.1. Object Attributes
************************

.. table:: Object Type LinkExternal Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| LinkDisplay         | String               | Display String                                  |
	+---------------------+----------------------+-------------------------------------------------+
	| LinkURL             | URL-String           | Link URL                                        |
	+---------------------+----------------------+-------------------------------------------------+
	| OpenInTab           | Boolean              | Open Link in new Browser Tab                    |
	+---------------------+----------------------+-------------------------------------------------+

5.6.2. JSON Example
*******************

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

.. _objecttype-list:

5.7. List
---------

The ``"Type": "List"`` *x0-system-object* .


5.7.1. Object Attributes
************************

.. table:: Object Type List Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| HeaderRowStyle      | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| RowCount            | Integer              | Table Row Count                                 |
	+---------------------+----------------------+-------------------------------------------------+
	| RowSelectable       | Boolean              | Row / Multirow / Context Menu selectable        |
	+---------------------+----------------------+-------------------------------------------------+
	| Navigation          | Boolean              | Pagination / Navigation enabled                 |
	+---------------------+----------------------+-------------------------------------------------+
	| ErrorContainer      | ObjectID-String      | Error Container Object Reference                |
	+---------------------+----------------------+-------------------------------------------------+
	| ContextMenuItems    | Array of Items       | Context Menu Entries, see 5.7.4.                |
	+---------------------+----------------------+-------------------------------------------------+

5.7.2. Column Attributes
************************

.. table:: Object Type List Column Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| ID                  | ID-String            | Column ID, also DB Column Reference             |
	+---------------------+----------------------+-------------------------------------------------+
	| HeaderTextID        | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| HeaderStyle         | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+

5.7.3. RT Attributes
********************

.. table:: Object Type List Real Time Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| DoubleCheckColumn   | String               | Check Column Value exists on Row append         |
	+---------------------+----------------------+-------------------------------------------------+


5.7.5. Grid Attributes
**********************

5.7.5. Backend JSON Schema
**************************


JSON Structure Example
**********************

.. code-block:: javascript


.. _objecttype-tabcontainer:

5.8. TabContainer
-----------------


.. code-block:: javascript

	+---------+---------+---------+
	| Tab1    | Tab2    | Tab3    |
	+---------+---------+---------+
	    |         |         |
	 ObjRef1   ObjRef4    ObjRef6
	 ObjRef2              ObjRef7
	              

5.8.1. Object Attributes
************************

.. table:: Object Type TabContainer Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Tabs                | Array of Elements    | Array of Tab Elements (Config)                  |
	+---------------------+----------------------+-------------------------------------------------+

5.8.1. Tab Attributes
*********************

.. table:: Object Type TabAttributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| ID                  | Array of Elements    | Tab Identifier                                  |
	+---------------------+----------------------+-------------------------------------------------+
	| Default             | Boolean              | Default "selected" Tab                          |
	+---------------------+----------------------+-------------------------------------------------+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+

JSON Example
************

.. code-block:: javascript

.. _objecttype-fileupload:

5.9. FileUpload
---------------

5.9.1. Object Attributes
************************

.. table:: Object Type FileUpload Attributes
	:widths: 30 20 80

	+----------------------------+----------------------+------------------------------------------+
	| **Property**               | **Type**             | **Description**                          |
	+============================+======================+==========================================+
	| Style                      | CSS-String           | CSS Style Classes, space separated       |
	+----------------------------+----------------------+------------------------------------------+
	| StyleDescription           | CSS-String           | CSS Style Classes, space separated       |
	+----------------------------+----------------------+------------------------------------------+
	| StyleSelectButton          | CSS-String           | CSS Style Classes, space separated       |
	+----------------------------+----------------------+------------------------------------------+
	| StyleProgressContainer     | CSS-String           | CSS Style Classes, space separated       |
	+----------------------------+----------------------+------------------------------------------+
	| StyleProgressBar           | CSS-String           | CSS Style Classes, space separated       |
	+----------------------------+----------------------+------------------------------------------+
	| StyleProgressBarPErcentage | CSS-String           | CSS Style Classes, space separated       |
	+----------------------------+----------------------+------------------------------------------+
	| StyleUploadBUtton          | CSS-String           | CSS Style Classes, space separated       |
	+----------------------------+----------------------+------------------------------------------+
	| UploadScript               | URL-String           | POST Upload URL                          |
	+----------------------------+----------------------+------------------------------------------+
	| ScreenDataLoad             | ScreenID-String      | On Successful Upload trigger Data reload |
	+----------------------------+----------------------+------------------------------------------+

.. _objecttype-errorcontainer:

5.10. ErrorContainer
--------------------

5.10.1. Object Attributes
*************************



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

6.1. FormfieldList
------------------


Object Properties
*****************

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| HiddenFields        | Array                | Array of Formfield IDs                          |
	+---------------------+----------------------+-------------------------------------------------+
	| Sections            | Array of Elements    | Array of Section Objects                        |
	+---------------------+----------------------+-------------------------------------------------+

Section Properties
******************

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| ID                  | String               | Section Identifier                              |
	+---------------------+----------------------+-------------------------------------------------+
	| Object              | String               | Header x0-object Reference                      |
	+---------------------+----------------------+-------------------------------------------------+
	| ObjectAttributes    | Object               | Header Properties                               |
	+---------------------+----------------------+-------------------------------------------------+
	| Formfields          | Array                | Array of Formfield IDs                          |
	+---------------------+----------------------+-------------------------------------------------+

Section Object Attributes
*************************

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| SubStyle            | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| HeaderIcon          | CSS-String           | Fontawesome Icon CSS for Prepend Icon           |
	+---------------------+----------------------+-------------------------------------------------+
	| HeaderTextID        | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| SubHeaderTextID     | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+

JSON Structure Example
**********************

.. code-block:: javascript

	"FormfieldList1":
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


6.2. FormfieldText
------------------

The ``"Type": "FormfieldText"`` *x0-system-object* renders a HTML form input
type text element.

5.3.1. Object Attributes
************************

.. table:: Object Type FormfieldText Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Type                | Constant String      | Fixed String 'text'                             |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| StyleValidateOk     | CSS-String           | CSS Style Classes Override, space separated     |
	+---------------------+----------------------+-------------------------------------------------+
	| StyleValidateFail   | CSS-String           | CSS Style Classes Override, space separated     |
	+---------------------+----------------------+-------------------------------------------------+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| DBColumn            | String               | Database Column Reference                       |
	+---------------------+----------------------+-------------------------------------------------+
	| Placeholder         | String               | Placeholder                                     |
	+---------------------+----------------------+-------------------------------------------------+
	| MaxLength           | Integer              | Maximum Length Character Count                  |
	+---------------------+----------------------+-------------------------------------------------+
	| Number              | Boolean              | Container Div Type, <DOMType></DOMType>         |
	+---------------------+----------------------+-------------------------------------------------+
	| Disabled            | Boolean              | Set HTML Form "disabled" Property               |
	+---------------------+----------------------+-------------------------------------------------+
	| ReadOnly            | Boolean              | Set HTML Form "readonly" Property               |
	+---------------------+----------------------+-------------------------------------------------+
	| Min                 | Integer              | Minimum Number Value                            |
	+---------------------+----------------------+-------------------------------------------------+
	| Max                 | Integer              | Maximum Number Value                            |
	+---------------------+----------------------+-------------------------------------------------+

6.3. FormfieldLabel
-------------------

The ``"Type": "FormfieldLabel"`` *x0-system-object* renders a HTML form input
type text element.


5.3.1. Object Attributes
************************

.. table:: Object Type FormfieldLabel Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Type                | Constant String      | Fixed String 'label'                            |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| LabelFor            | String               | HTML attrribute "labelfor"                      |
	+---------------------+----------------------+-------------------------------------------------+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| DisplayText         | String               | Hardcoded / Non-multilanguage String            |
	+---------------------+----------------------+-------------------------------------------------+


6.3. FormfieldTextarea
----------------------

The ``"Type": "FormfieldTextarea"`` *x0-system-object* .


5.3.1. Object Attributes
************************

.. table:: Object Type FormfieldTextarea Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Type                | Constant String      | Fixed String 'textarea'                         |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| DBColumn            | String               | Database Column Reference                       |
	+---------------------+----------------------+-------------------------------------------------+
	| Placeholder         | String               | Placeholder                                     |
	+---------------------+----------------------+-------------------------------------------------+
	| MaxLength           | Integer              | Maximum Length Character Count                  |
	+---------------------+----------------------+-------------------------------------------------+
	| Number              | Boolean              | Container Div Type, <DOMType></DOMType>         |
	+---------------------+----------------------+-------------------------------------------------+
	| Disabled            | Boolean              | Set HTML Form "disabled" Property               |
	+---------------------+----------------------+-------------------------------------------------+
	| ReadOnly            | Boolean              | Set HTML Form "readonly" Property               |
	+---------------------+----------------------+-------------------------------------------------+
	| Min                 | Integer              | Minimum Number Value                            |
	+---------------------+----------------------+-------------------------------------------------+
	| Max                 | Integer              | Maximum Number Value                            |
	+---------------------+----------------------+-------------------------------------------------+

6.3. FormfieldPulldown
----------------------

The ``"Type": "FormfieldPulldown"`` *x0-system-object* .


5.3.1. Object Attributes
************************

.. table:: Object Type FormfieldPulldown Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Type                | Constant String      | Fixed String 'pulldown'                         |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| Options             | Array of Elements    | Array of Option Elements                        |
	+---------------------+----------------------+-------------------------------------------------+

5.3.2. Options Element
**********************

.. table:: FormfieldPulldown Options Element
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| Value               | String               | Hardcoded Value                                 |
	+---------------------+----------------------+-------------------------------------------------+
	| Default             | Boolean              | Default Display Element                         |
	+---------------------+----------------------+-------------------------------------------------+

6.3. FormfieldDynPulldown
-------------------------

The ``"Type": "FormfieldDynPulldown"`` *x0-system-object* .


5.3.1. Object Attributes
************************

.. table:: Object Type FormfieldDynPulldown Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Type                | Constant String      | Fixed String 'dynpulldown'                      |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| ServiceURL          | URL-String           | Backend Service URL                             |
	+---------------------+----------------------+-------------------------------------------------+
	| UpdateOnEvents      | Array of EventIDs    | Array of EventIDs                               |
	+---------------------+----------------------+-------------------------------------------------+

6.3. FormfieldCheckbox
----------------------

The ``"Type": "FormfieldCheckbox"`` *x0-system-object* .


5.3.1. Object Attributes
************************

.. table:: Object Type FormfieldCheckbox Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Type                | Constant String      | Fixed String 'checkbox'                         |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| Value               | Enum Integer         | 1 == checked || 0 == unchecked                  |
	+---------------------+----------------------+-------------------------------------------------+

6.3. FormfieldHidden
--------------------

The ``"Type": "FormfieldHidden"`` *x0-system-object* .


5.3.1. Object Attributes
************************

.. table:: Object Type FormfieldHidden Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Type                | Constant String      | Fixed String 'hidden'                           |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| Value               | String               | Hardcoded Value                                 |
	+---------------------+----------------------+-------------------------------------------------+
