.. appdev-objects

.. _system-objects:

10. System Objects
==================

Currently the following *x0-system-objects* are usable inside ``object.json``.

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
* :ref:`objecttype-openclosecontainer`
* :ref:`objecttype-treesimple`

.. _objecttype-div:

10.1. Div
---------

The ``Div`` *x0-object-type* is the simplest of all.
It generates a DOM layer with a configurable CSS class attribute.

10.1.1. Object Attributes
*************************

.. table:: Object Type Div Attributes
	:widths: 30 20 100

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| DOMType             | String               | Container Div Type, <DOMType></DOMType>         |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+

10.1.2. JSON Example
********************

.. code-block:: javascript

	"$ObjectID":
	{
		"Type": "Div",
		"Attributes": {
			"Style": "css1 css2 css3"
		}
	}

10.1.3. Runnable Example
************************

* http://x0-app.x0.localnet/python/Index.py?appid=example9

.. _objecttype-sqltext:

10.2. SQLText
-------------

The ``SQLText`` *x0-object-type* renders a multilingual text retrieved from the *x0-system-db*
``webui.text`` table.

10.2.1. Object Attributes
*************************

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

10.2.2. JSON Example
********************

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

10.3. Button
------------

The ``Button`` *x0-object-type* generates a control-flow modifying object.

Details see :ref:`appdevcontrolbutton`.

10.3.1. Object Attributes
*************************

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
	| Action              | Action-String        | Single Action before Service Exec, see 10.3.2.  |
	+---------------------+----------------------+-------------------------------------------------+
	| DstObjectID         | ObjectID-String      | Destination ObjectID Reference                  |
	+---------------------+----------------------+-------------------------------------------------+
	| DstScreenID         | ScreenID-String      | Destination ScreenID Reference                  |
	+---------------------+----------------------+-------------------------------------------------+
	| FireEvents          | Array of EventIDs    | Array of EventIDs                               |
	+---------------------+----------------------+-------------------------------------------------+
	| CloseOverlay        | Boolean              | Close Overlay On Click                          |
	+---------------------+----------------------+-------------------------------------------------+
	| OnResult            | Array of Actions     | Actions after Service Execution, see 10.3.3.    |
	+---------------------+----------------------+-------------------------------------------------+

10.3.2. Actions
***************

.. table:: Button Actions
	:widths: 30 70

	+---------------------+------------------------------------------------------------------------+
	| **Action**          | **Description**                                                        |
	+=====================+========================================================================+
	| enable              | Set DOM Visible State "visible"                                        |
	+---------------------+------------------------------------------------------------------------+
	| disable             | Set DOM Visible State "hidden"                                         |
	+---------------------+------------------------------------------------------------------------+
	| activate            | Set Internal State to "active" (processing validation)                 |
	+---------------------+------------------------------------------------------------------------+
	| deactivate          | Set Internal State to "inactive" (omitting from validation)            |
	+---------------------+------------------------------------------------------------------------+
	| reset               | Call Objects reset() Method                                            |
	+---------------------+------------------------------------------------------------------------+
	| switchscreen        | Switch Screen to Value in DstScreenID                                  |
	+---------------------+------------------------------------------------------------------------+

10.3.3. OnResult Actions
************************

.. table:: Button OnResult Actions
	:widths: 30 70

	+---------------------+------------------------------------------------------------------------+
	| **Action**          | **Description**                                                        |
	+=====================+========================================================================+
	| enable              | Set DOM Visible State "visible"                                        |
	+---------------------+------------------------------------------------------------------------+
	| disable             | Set DOM Visible State "hidden"                                         |
	+---------------------+------------------------------------------------------------------------+
	| activate            | Set Internal State to "active" (processing validation)                 |
	+---------------------+------------------------------------------------------------------------+
	| deactivate          | Set Internal State to "inactive" (omitting from validation)            |
	+---------------------+------------------------------------------------------------------------+
	| reset               | Call Objects reset() Method                                            |
	+---------------------+------------------------------------------------------------------------+
	| tabswitch           | Switch to TabContainers Tab                                            |
	+---------------------+------------------------------------------------------------------------+

.. _objecttype-buttoninternal:

10.4. ButtonInternal
--------------------

The ``ButtonInternal`` *x0-object-type* inherits ``Button`` *x0-object-type* and, as the name suggests,
is designed for use cases that are not centered around backend services.

Details see :ref:`appdevcontrolbuttoninternal`.

10.4.1. Object Attributes
*************************

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
	| Action              | Action-String        | Single Action before Service Exec, see 10.3.2.  |
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

10.5. Link
----------

The ``Link`` *x0-object-type* unlike the Button x0-object-type, is not form-oriented and is primarily
used to manage internal control flow..

10.5.1. Object Attributes
*************************

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

10.6. LinkExternal
------------------

The ``LinkExternal`` *x0-object-type* manages the behavior for opening external URLs.

10.6.1. Object Attributes
*************************

.. table:: Object Type LinkExternal Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| LinkDisplay         | String               | Display String                                  |
	+---------------------+----------------------+-------------------------------------------------+
	| LinkURL             | URL-String           | Link URL                                        |
	+---------------------+----------------------+-------------------------------------------------+
	| OpenInTab           | Boolean              | Open Link in new, additional Browser Tab        |
	+---------------------+----------------------+-------------------------------------------------+

10.6.2. JSON Example
********************

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

10.7. List
----------

The ``List`` *x0-object-type* renders a table-like HTML structure using Bootstrap's Grid CSS,
avoiding the traditional ``<table><tr><td>`` HTML syntax for a more modern and flexible layout.

Additionally, it incorporates advanced features such as *x0-realtime-container*
for dynamic updates and *x0-context-menu* for enhanced user interaction.

10.7.1. Object Attributes
*************************

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
	| ContextMenuItems    | Array of Items       | Context Menu Entries, see 10.7.4.               |
	+---------------------+----------------------+-------------------------------------------------+

10.7.2. Column Attributes
*************************

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

10.7.3. RT Attributes
*********************

.. table:: Object Type List Real Time Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| DoubleCheckColumn   | String               | Check Column Value already exists on Row append |
	+---------------------+----------------------+-------------------------------------------------+

10.7.4. Grid Attributes
***********************

Global Grid Attributes can be applied, see :ref:`appdevglobalgrid`.

10.7.5. Context Menu
********************

Global Context Menu Attributes can be applied, see :ref:`appdevglobalcontextmenu`.

10.7.6. Backend JSON Schema
***************************

Backend services must return the following JSON to provide table cell data on
service execution.

.. code-block:: javascript

	[
		{ "id": "1", "col1": "row1-1", "col2": "row1-2" },
		{ "id": "2", "col1": "row2-1", "col2": "row2-2" },
		{ "id": "3", "col1": "row3-1", "col2": "row3-2" },
		{ "id": "4", "col1": "row4-1", "col2": "row4-2" }
	]

10.7.7. Runtime Features
************************

The following runtime-features are supported.

* RuntimeGetDataFunc()
* RuntimeAppendDataFunc()

10.7.8. Runnable Example
************************

* http://x0-app.x0.localnet/python/Index.py?appid=example1
* http://x0-app.x0.localnet/python/Index.py?appid=example4

.. _objecttype-tabcontainer:

10.8. TabContainer
------------------

The ``TabContainer`` *x0-object-type* offers a real-time switchable object container,
enabling seamless transitions between different views or components. Like all *x0-object-types*,
it preserves object states recursively, ensuring continuity and consistency across interactions.

.. code-block:: bash

	+---------+---------+---------+
	| Tab1    | Tab2    | Tab3    |
	+---------+---------+---------+
	    |         |         |
	 ObjRef1   ObjRef3    ObjRef4
	 ObjRef2              ObjRef5
	              
10.8.1. Object Attributes
*************************

.. table:: Object Type TabContainer Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Tabs                | Array of Elements    | Array of Tab Elements (Config)                  |
	+---------------------+----------------------+-------------------------------------------------+

10.8.2. Tab Attributes
**********************

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

10.8.3. Runnable Example
************************

* http://x0-app.x0.localnet/python/Index.py?appid=example3
* http://x0-app.x0.localnet/python/Index.py?appid=example8

.. _objecttype-fileupload:

10.9. FileUpload
----------------

The ``FileUpload`` *x0-object-type* provides a file selection dialog along with a visually
intuitive upload progress indicator.

10.9.1. Object Attributes
*************************

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
	| StyleProgressBarPercentage | CSS-String           | CSS Style Classes, space separated       |
	+----------------------------+----------------------+------------------------------------------+
	| StyleUploadButton          | CSS-String           | CSS Style Classes, space separated       |
	+----------------------------+----------------------+------------------------------------------+
	| UploadScript               | URL-String           | POST Upload URL                          |
	+----------------------------+----------------------+------------------------------------------+
	| ScreenDataLoad             | ScreenID-String      | On Successful Upload trigger Data reload |
	+----------------------------+----------------------+------------------------------------------+

10.9.2. Runnable Example
************************

* http://x0-app.x0.localnet/python/Index.py?appid=example1

.. _objecttype-errorcontainer:

10.10. ErrorContainer
---------------------

The ``ErrorContainer`` *x0-object-type* is designed to display informational and error messages.

10.10.1. Object Attributes
**************************

None.

10.10.2. JSON Example
*********************

.. code-block:: javascript

	"$ObjectID":
	{
		"Type": "ErrorContainer",
		"Attributes":
		{
		}
	}

11. Formfield Objects
=====================

* :ref:`objecttype-formfieldlist`
* :ref:`objecttype-formfieldtext`
* :ref:`objecttype-formfieldlabel`
* :ref:`objecttype-formfieldtextarea`
* :ref:`objecttype-formfieldpulldown`
* :ref:`objecttype-formfielddynpulldown`
* :ref:`objecttype-formfieldcheckbox`
* :ref:`objecttype-formfieldhidden`

.. _objecttype-formfieldlist:

11.1. FormfieldList
-------------------

The ``FormfieldList`` *x0-object-type* serves as both a *x0-form* management tool
and a *x0-object-container*.

It offers advanced *x0-form-validation* capabilities and can be referenced by multiple
*x0-control-flow-modifying* *x0-object-types*.

More info at :ref:`appdevforms`.

11.1.1. Object Attributes
*************************

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| HiddenFields        | Array                | Array of Formfield IDs                          |
	+---------------------+----------------------+-------------------------------------------------+
	| Sections            | Array of Elements    | Array of Section Objects / Section Properties   |
	+---------------------+----------------------+-------------------------------------------------+

11.1.2. Section Attributes
**************************

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| ID                  | String               | Section Identifier                              |
	+---------------------+----------------------+-------------------------------------------------+
	| Object              | String               | Header to x0-object (existing) Reference        |
	+---------------------+----------------------+-------------------------------------------------+
	| ObjectAttributes    | Object               | Header Properties                               |
	+---------------------+----------------------+-------------------------------------------------+
	| Formfields          | Array                | Array of Formfield IDs                          |
	+---------------------+----------------------+-------------------------------------------------+

11.1.3. Section Object Attributes
*********************************

	+---------------------+---------------+--------------------------------------------------------+
	| **Property**        | **Type**      | **Description**                                        |
	+=====================+===============+========================================================+
	| Style               | CSS-String    | CSS Style Classes, space separated                     |
	+---------------------+---------------+--------------------------------------------------------+
	| SubStyle            | CSS-String    | CSS Style Classes, space separated                     |
	+---------------------+---------------+--------------------------------------------------------+
	| HeaderIcon          | CSS-String    | Fontawesome Icon CSS for Prepend Icon                  |
	+---------------------+---------------+--------------------------------------------------------+
	| HeaderTextID        | TextID-String | TextID referenced in "webui.text" DB Table / Multilang |
	+---------------------+---------------+--------------------------------------------------------+
	| SubHeaderTextID     | TextID-String | TextID referenced in "webui.text" DB Table / Multilang |
	+---------------------+---------------+--------------------------------------------------------+

11.1.4. Grid Attributes
***********************

Global Grid Attributes can be applied, see :ref:`appdevglobalgrid`.

11.1.5. Runnable Example
************************

* http://x0-app.x0.localnet/python/Index.py?appid=example5

.. _objecttype-formfieldtext:

11.2. FormfieldText
-------------------

The ``FormfieldText`` *x0-object-type* renders an HTML ``<input>`` element of type ``text``.

11.2.1. Object Attributes
*************************

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

11.2.2. FormfieldList Related
*****************************

.. table:: Object Type FormfieldText FormfieldList Related Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| DBColumn            | String               | Database Column Reference                       |
	+---------------------+----------------------+-------------------------------------------------+

.. _objecttype-formfieldlabel:

11.3. FormfieldLabel
--------------------

The ``FormfieldLabel`` *x0-object-type* renders an HTML ``<label>`` element for form inputs.

11.3.1. Object Attributes
*************************

.. table:: Object Type FormfieldLabel Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Type                | Constant String      | Fixed String 'label'                            |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| LabelFor            | String               | HTML attribute "labelfor"                       |
	+---------------------+----------------------+-------------------------------------------------+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| DisplayText         | String               | Hardcoded / Non-multilanguage String            |
	+---------------------+----------------------+-------------------------------------------------+

.. _objecttype-formfieldtextarea:

11.4. FormfieldTextarea
-----------------------

The ``FormfieldTextarea`` *x0-object-type* renders an HTML ``<textarea>`` element for form inputs.

11.4.1. Object Attributes
*************************

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

11.5. FormfieldPulldown
-----------------------

The ``FormfieldPulldown`` *x0-object-type* renders a static HTML ``<select>`` element with
predefined options.

11.5.1. Object Attributes
*************************

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

11.5.2. Options Element
***********************

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

11.6. FormfieldDynPulldown
--------------------------

The ``FormfieldDynPulldown`` *x0-object-type*  renders renders a dynamic HTML ``<select>`` element
with options populated from backend data. This allows for flexible and dynamic selection based on
server-side content.

.. note::

    Unlike other *x0-object-types*, it retrieves backend data directly, bypassing the typical
    *x0-service-connector* mechanism.

11.6.1. Object Attributes
*************************

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

11.7. FormfieldCheckbox
-----------------------

The ``FormfieldCheckbox`` *x0-object-type* renders an HTML ``<input>`` element of type ``checkbox``.

11.7.1. Object Attributes
*************************

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

11.8. FormfieldHidden
---------------------

The ``FormfieldHidden`` *x0-object-type* renders a non-visible HTML ``<input>`` element of type
``hidden``, which is rarely used to pass hidden form data to backend services.

11.8.1. Object Attributes
*************************

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

.. _objecttype-openclosecontainer:

10.11. OpenCloseContainer
------------------------

The ``OpenCloseContainer`` *x0-object-type* provides a collapsible content container 
with toggle functionality, allowing users to expand or collapse sections to manage 
screen real estate effectively. This component is particularly useful for organizing 
large amounts of content in a compact, user-friendly manner.

10.11.1. Object Attributes
**************************

.. table:: Object Type OpenCloseContainer Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+

10.11.2. Features
****************

- **Toggle Functionality**: Click to expand or collapse content sections
- **State Management**: Maintains open/close state across interactions
- **Nested Content**: Can contain any x0-system-objects within collapsible sections
- **Responsive Design**: Adapts to different screen sizes using Bootstrap styling
- **Visual Indicators**: Uses FontAwesome caret icons to indicate state

10.11.3. JSON Example
*********************

.. code-block:: javascript

	"OpenCloseElement1": {
		"Type": "OpenCloseContainer",
		"Attributes": {
			"TextID": "TXT.OPENCLOSE1-HEADER"
		}
	}

.. code-block:: javascript

	"OpenCloseElement2": {
		"Type": "OpenCloseContainer",
		"Attributes": {
			"Style": "mb-4",
			"TextID": "TXT.SECTION.ADVANCED.SETTINGS"
		}
	}

10.11.4. Usage Examples
**********************

This system object can be used for:

- Creating collapsible content sections
- Organizing complex forms with grouped sections
- Building accordion-style interfaces
- Managing information hierarchy and screen space
- Demonstrating modular UI construction

10.11.5. Runnable Example
************************

* Example #14 - Open Close Container: 
  ``http://x0-app.x0.localnet/python/Index.py?appid=example14``

.. _objecttype-treesimple:

10.12. TreeSimple
----------------

The ``TreeSimple`` *x0-object-type* creates hierarchical tree structures with 
expandable/collapsible nodes, FontAwesome icons, and navigation capabilities. It 
supports both expandable nodes (containers) and interactive items (navigation elements) 
with visual selection indicators and state management.

10.12.1. Object Attributes
**************************

.. table:: Object Type TreeSimple Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| TreeItems           | Array of Elements    | Array of Tree Node and Item definitions         |
	+---------------------+----------------------+-------------------------------------------------+

10.12.2. Tree Item Types
***********************

10.12.2.1. Node Type
-------------------

Expandable/collapsible containers that can contain other nodes or items:

.. table:: Tree Node Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Type                | Constant String      | Fixed String 'Node'                             |
	+---------------------+----------------------+-------------------------------------------------+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| Icon                | CSS-String           | FontAwesome Icon CSS Classes                    |
	+---------------------+----------------------+-------------------------------------------------+
	| Children            | Array of Elements    | Array of child Node and Item elements           |
	+---------------------+----------------------+-------------------------------------------------+

10.12.2.2. Item Type
-------------------

Interactive navigation elements that trigger screen navigation:

.. table:: Tree Item Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Type                | Constant String      | Fixed String 'Item'                             |
	+---------------------+----------------------+-------------------------------------------------+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| Icon                | CSS-String           | FontAwesome Icon CSS Classes                    |
	+---------------------+----------------------+-------------------------------------------------+
	| ScreenID            | ScreenID-String      | Target Screen for navigation                    |
	+---------------------+----------------------+-------------------------------------------------+

10.12.3. Features
****************

- **Hierarchical Structure**: Support for nested nodes and items
- **Expandable Nodes**: Click caret controls to expand/collapse tree nodes
- **Navigation Items**: Tree items trigger screen navigation while maintaining tree state
- **Icon Integration**: FontAwesome icons provide visual cues for different node and item types
- **Visual Feedback**: Hover effects and selection indicators enhance user interaction
- **State Management**: Tree state is preserved during navigation between screens

10.12.4. JSON Example
*********************

.. code-block:: javascript

	"TreeSimpleElement1": {
		"Type": "TreeSimple",
		"Attributes": {
			"TreeItems": [
				{
					"Type": "Node",
					"TextID": "TXT.NODE1",
					"Icon": "fa-solid fa-hexagon-nodes",
					"Children": [
						{
							"Type": "Item",
							"TextID": "TXT.ITEM1",
							"Icon": "fa-solid fa-code-branch",
							"ScreenID": "Screen1"
						},
						{
							"Type": "Item",
							"TextID": "TXT.ITEM2",
							"Icon": "fa-solid fa-lightbulb",
							"ScreenID": "Screen2"
						}
					]
				},
				{
					"Type": "Node",
					"TextID": "TXT.NODE2",
					"Icon": "fa-solid fa-folder",
					"Children": [
						{
							"Type": "Node",
							"TextID": "TXT.SUBNODE1",
							"Icon": "fa-solid fa-folder-open",
							"Children": [
								{
									"Type": "Item",
									"TextID": "TXT.SUBITEM1",
									"Icon": "fa-solid fa-file",
									"ScreenID": "Screen3"
								}
							]
						}
					]
				}
			]
		}
	}

10.12.5. Usage Examples
**********************

This system object can be used for:

- Creating hierarchical navigation menus with expandable categories
- Building file explorer-style interfaces
- Implementing sidebar navigation with nested menu structures
- Demonstrating tree-based data organization in x0 applications
- Creating multi-level category browsers

10.12.6. Integration with OpenCloseContainer
*******************************************

TreeSimple objects work well when wrapped in OpenCloseContainer for additional 
collapsibility:

.. code-block:: javascript

	"TreeContainer": {
		"Type": "OpenCloseContainer",
		"Attributes": {
			"TextID": "TXT.NAVIGATION.TREE"
		}
	}

10.12.7. Runnable Example
************************

* Example #15 - Tree Simple: 
  ``http://x0-app.x0.localnet/python/Index.py?appid=example15``
