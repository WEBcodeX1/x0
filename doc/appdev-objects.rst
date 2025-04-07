.. appdev-objects

.. _system-objects:

6. System Objects
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

6.1. Div
--------

The ``Div`` *x0-object-type* is the most simple one.

It simply generates a DOM layer with variable CSS class attribute(s).

6.1.1. Object Attributes
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

6.1.2. JSON Example
*******************

.. code-block:: javascript

	"$ObjectID":
	{
		"Type": "Div",
		"Attributes": {
			"Style": "css1 css2 css3"
		}
	}

6.1.3. Runnable Example
***********************

* http://x0-app.x0.localnet/python/Index.py?appid=example9

.. _objecttype-sqltext:

6.2. SQLText
------------

The ``SQLText`` *x0-object-type* renders a (multilanguage) text defined in *x0-db*.

6.2.1. Object Attributes
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

6.2.2. JSON Example
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

6.3. Button
-----------

The ``Button`` *x0-object-type* generates a control-flow modifying object.

Details see :ref:`appdevcontrolbutton`.

6.3.1. Object Attributes
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
	| Action              | Action-String        | Single Action before Service Exec, see 6.3.2.   |
	+---------------------+----------------------+-------------------------------------------------+
	| DstObjectID         | ObjectID-String      | Destination ObjectID Reference                  |
	+---------------------+----------------------+-------------------------------------------------+
	| DstScreenID         | ScreenID-String      | Destination ScreenID Reference                  |
	+---------------------+----------------------+-------------------------------------------------+
	| FireEvents          | Array of EventIDs    | Array of EventIDs                               |
	+---------------------+----------------------+-------------------------------------------------+
	| CloseOverlay        | Boolean              | Close Overlay On Click                          |
	+---------------------+----------------------+-------------------------------------------------+
	| OnResult            | Array of Actions     | Actions after Service Execution, see 6.3.3.     |
	+---------------------+----------------------+-------------------------------------------------+

6.3.2. Actions
**************

.. table:: Button Actions
	:widths: 30 70

	+---------------------+------------------------------------------------------------------------+
	| **Action**          | **Description**                                                        |
	+=====================+========================================================================+
	| enable              | Set DOM Visible State "visible"                                        |
	+---------------------+------------------------------------------------------------------------+
	| disable             | Set DOM Visible State "hidden"                                         |
	+---------------------+------------------------------------------------------------------------+
	| activate            | Set Internal State "active" (validate)                                 |
	+---------------------+------------------------------------------------------------------------+
	| deactivate          | Set Internal State "inactive" (no validate)                            |
	+---------------------+------------------------------------------------------------------------+
	| reset               | Call Objects reset() Method                                            |
	+---------------------+------------------------------------------------------------------------+
	| switchscreen        | Switch Screen to Value in DstScreenID                                  |
	+---------------------+------------------------------------------------------------------------+

6.3.3. OnResult Actions
***********************

.. table:: Button OnResult Actions
	:widths: 30 70

	+---------------------+------------------------------------------------------------------------+
	| **Action**          | **Description**                                                        |
	+=====================+========================================================================+
	| enable              | Set DOM Visible State "visible"                                        |
	+---------------------+------------------------------------------------------------------------+
	| disable             | Set DOM Visible State "hidden"                                         |
	+---------------------+------------------------------------------------------------------------+
	| activate            | Set Internal State "active" (validate)                                 |
	+---------------------+------------------------------------------------------------------------+
	| deactivate          | Set Internal State "inactive" (no validate)                            |
	+---------------------+------------------------------------------------------------------------+
	| reset               | Call Objects reset() Method                                            |
	+---------------------+------------------------------------------------------------------------+
	| tabswitch           | Switch to TabContainers Tab                                            |
	+---------------------+------------------------------------------------------------------------+

.. _objecttype-buttoninternal:

6.4. ButtonInternal
-------------------

The ``ButtonInternal`` *x0-object-type* inherits ``Button`` *x0-object-type* and as the name
implies its use is non-backend-service centric.

Details see :ref:`appdevcontrolbuttoninternal`.

6.4.1. Object Attributes
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
	| Action              | Action-String        | Single Action before Service Exec, see 6.3.2.   |
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

6.6. Link
---------

The ``Link`` *x0-object-type* compared to ``Button`` *x0-object-type* is non-form oriented and
controls internal control-flow.

6.6.1. Object Attributes
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

6.6. LinkExternal
-----------------

The ``LinkExternal`` *x0-object-type* controls howto open external URLs.

6.6.1. Object Attributes
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

6.6.2. JSON Example
*******************

.. code-block:: javascript

	"$ObjectID":
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

6.7. List
---------

The ``List`` *x0-object-type* renders a HTML-like table object.
It uses Bootstrap Grid CSS, **not** ``<table><tr><td>`` html syntax.

Also it provides *x0-realtime-container* and *x0-context-menu* functionality.

6.7.1. Object Attributes
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
	| ContextMenuItems    | Array of Items       | Context Menu Entries, see 6.7.4.                |
	+---------------------+----------------------+-------------------------------------------------+

6.7.2. Column Attributes
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

6.7.3. RT Attributes
********************

.. table:: Object Type List Real Time Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| DoubleCheckColumn   | String               | Check Column Value already exists on Row append |
	+---------------------+----------------------+-------------------------------------------------+

6.7.4. Grid Attributes
**********************

Also Global Grid Attributes can be applied, see :ref:`appdevglobalgrid`.

6.7.5. Context Menu
*******************

Also Global Conetxt Menu Attributes can be applied, see :ref:`appdevglobalcontextmenu`.

6.7.6. Backend JSON Schema
**************************

Backend services must return the following JSON to provide table cell data on
service execution.

.. code-block:: javascript

	[
		{ "id": "1", "col1": "row1-1", "col2": "row1-2" },
		{ "id": "2", "col1": "row2-1", "col2": "row2-2" },
		{ "id": "3", "col1": "row3-1", "col2": "row3-2" },
		{ "id": "4", "col1": "row4-1", "col2": "row4-2" }
	]

6.7.7. Runtime Features
***********************

The following runtime-features are supported.

* RuntimeGetDataFunc()
* RuntimeAppendDataFunc()

6.7.8. Runnable Example
***********************

* http://x0-app.x0.localnet/python/Index.py?appid=example1
* http://x0-app.x0.localnet/python/Index.py?appid=example4

.. _objecttype-tabcontainer:

6.8. TabContainer
-----------------

The ``TabContainer`` *x0-object-type* provides a realtime switchable object container.
It also preserves object-state recursive like any other *x0-object-type*.

.. code-block:: bash

	+---------+---------+---------+
	| Tab1    | Tab2    | Tab3    |
	+---------+---------+---------+
	    |         |         |
	 ObjRef1   ObjRef3    ObjRef4
	 ObjRef2              ObjRef5
	              
6.8.1. Object Attributes
************************

.. table:: Object Type TabContainer Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Tabs                | Array of Elements    | Array of Tab Elements (Config)                  |
	+---------------------+----------------------+-------------------------------------------------+

6.8.1. Tab Attributes
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

6.8.2. Runnable Example
***********************

* http://x0-app.x0.localnet/python/Index.py?appid=example3
* http://x0-app.x0.localnet/python/Index.py?appid=example8

.. _objecttype-fileupload:

6.9. FileUpload
---------------

The ``FileUpload`` *x0-object-type* provides a file picking dialog and a upload progress display.

6.9.1. Object Attributes
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

6.9.2. Runnable Example
***********************

* http://x0-app.x0.localnet/python/Index.py?appid=example1

.. _objecttype-errorcontainer:

6.10. ErrorContainer
--------------------

The ``ErrorContainer`` *x0-object-type* is intended to displays info / error messages.

6.10.1. Object Attributes
*************************

None.

6.10.2. JSON Example
********************

.. code-block:: javascript

	"$ObjectID":
	{
		"Type": "ErrorContainer",
		"Attributes":
		{
		}
	}

7. Formfield Objects
====================

* :ref:`objecttype-formfieldlist`
* :ref:`objecttype-formfieldtext`
* :ref:`objecttype-formfieldlabel`
* :ref:`objecttype-formfieldtextarea`
* :ref:`objecttype-formfieldpulldown`
* :ref:`objecttype-formfielddynpulldown`
* :ref:`objecttype-formfieldcheckbox`
* :ref:`objecttype-formfieldhidden`

.. _objecttype-formfieldlist:

7.1. FormfieldList
------------------

The ``FormfieldList`` *x0-object-type* acts as a *x0-form* management and *x0-object* container.

It provides enhanced *x0-form-validation* and is referencable from multiple *x0-control-flow*
modifying *x0-object-type*.

More info at :ref:`appdevforms`.

7.1.1. Object Attributes
************************

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| HiddenFields        | Array                | Array of Formfield IDs                          |
	+---------------------+----------------------+-------------------------------------------------+
	| Sections            | Array of Elements    | Array of Section Objects                        |
	+---------------------+----------------------+-------------------------------------------------+

7.1.2. Section Attributes
*************************

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

7.1.3. Section Object Attributes
********************************

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

7.1.4. Grid Attributes
**********************

Also Global Grid Attributes can be applied, see :ref:`appdevglobalgrid`.

7.1.5. Runnable Example
***********************

* http://x0-app.x0.localnet/python/Index.py?appid=example5

.. _objecttype-formfieldtext:

7.2. FormfieldText
------------------

The ``FormfieldText`` *x0-object-type* renders a HTML form input type ``text`` element.

7.2.1. Object Attributes
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

7.2.2. FormfieldList Related
****************************

.. table:: Object Type FormfieldText FormfieldList Related Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| DBColumn            | String               | Database Column Reference                       |
	+---------------------+----------------------+-------------------------------------------------+

.. _objecttype-formfieldlabel:

7.3. FormfieldLabel
-------------------

The ``FormfieldLabel`` *x0-object-type* renders a HTML form input type ``label`` element.

7.3.1. Object Attributes
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

.. _objecttype-formfieldtextarea:

7.34. FormfieldTextarea
-----------------------

The ``FormfieldTextarea`` *x0-object-type* renders a HTML form ``textarea`` element.

7.4.1. Object Attributes
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

.. _objecttype-formfieldpulldown:

7.5. FormfieldPulldown
----------------------

The ``FormfieldPulldown`` *x0-object-type* renders a fixed HTML form ``select`` element
including options.

7.5.1. Object Attributes
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

7.5.2. Options Element
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

.. _objecttype-formfielddynpulldown:

7.6. FormfieldDynPulldown
-------------------------

The ``FormfieldDynPulldown`` *x0-object-type*  renders a dynamic (backend data) HTML form
``select`` element including ``options``.

.. note::

    It is the only *x0-object* getting backend data not by *x0-service-connector* mechanism.

7.6.1. Object Attributes
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

.. _objecttype-formfieldcheckbox:

7.7. FormfieldCheckbox
----------------------

The ``FormfieldCheckbox`` *x0-object-type* renders a HTML form ``checkbox`` element.

7.7.1. Object Attributes
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

.. _objecttype-formfieldhidden:

7.8. FormfieldHidden
--------------------

The ``FormfieldHidden`` *x0-object-type* renders a non-visible HTML form ``hidden`` element
very seldomly used to pass non-visible form data to backend services.

7.8.1. Object Attributes
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
