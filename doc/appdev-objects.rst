.. appdev-objects

.. _systemobjects:

10. System Objects
==================

Currently the following *x0-system-objects* are usable inside ``object.json``.

* :ref:`objecttype-div`
* :ref:`objecttype-sqltext`
* :ref:`objecttype-button`
* :ref:`objecttype-buttoninternal`
* :ref:`objecttype-image`
* :ref:`objecttype-imageselector`
* :ref:`objecttype-badgeselector`
* :ref:`objecttype-list`
* :ref:`objecttype-tabcontainer`
* :ref:`objecttype-fileupload`
* :ref:`objecttype-errorcontainer`
* :ref:`objecttype-openclosecontainer`
* :ref:`objecttype-treesimple`
* :ref:`objecttype-divunique`
* :ref:`objecttype-progressbar`
* :ref:`objecttype-rangeslider`
* :ref:`objecttype-rangeslidercontainer`
* :ref:`objecttype-headerbodycontainer`
* :ref:`objecttype-systemsettingscontainer`
* :ref:`objecttype-systemsettingscontainergrid`
* :ref:`objecttype-infoparagraph`
* :ref:`objecttype-languageswitch`
* :ref:`objecttype-dynradiolist`
* :ref:`objecttype-serviceconnector`

Additionally, the following user-space example objects (``/www/userObj*.js``) ship
with the static reference container and illustrate how core objects can be
composed into higher-level, reusable building blocks:

* :ref:`objecttype-timedprogress`
* :ref:`objecttype-examplewizard`
* :ref:`objecttype-exampleeditableitem`
* :ref:`objecttype-exampleeditableitemcontainer`
* :ref:`objecttype-exampleflightdetails`
* :ref:`objecttype-exampleflightstatus`
* :ref:`objecttype-examplecardtasklist`
* :ref:`objecttype-examplepeopleselector`

For form-specific objects, see :ref:`appdevformobjects`. For practical examples and implementations, see the :ref:`examples section <object-examples-reference>` at the end of this document.

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

.. _objecttype-image:

10.5. Image
------------

The ``Image`` *x0-object-type* renders an HTML ``<img>`` element. Unlike most other
*x0-object-types*, its ``DOMType`` is fixed to ``img`` rather than being generic
(see :ref:`devoopmodel_base`). Its source path can be read and updated at runtime
through the standard ``getObjectData()`` / ``setObjectData()`` API.

10.5.1. Object Attributes
*************************

.. table:: Object Type Image Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Value               | URL-String           | Image ``src`` path                              |
	+---------------------+----------------------+-------------------------------------------------+
	| Width               | String               | Image ``width`` attribute, e.g. ``80px``        |
	+---------------------+----------------------+-------------------------------------------------+
	| Height              | String               | Image ``height`` attribute, e.g. ``80px``       |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+

10.5.2. Runtime API
*********************

.. code-block:: javascript

	// read current image source
	var src = sysFactory.getObjectByID('MyImage').getObjectData();

	// swap the image source and re-render
	sysFactory.getObjectByID('MyImage').setObjectData('/image/other.png');

10.5.3. JSON Example
*********************

.. code-block:: javascript

	"$ObjectID":
	{
		"Type": "Image",
		"Attributes": {
			"Value": "/image/x0-logo.png",
			"Style": "border rounded"
		}
	}

.. _objecttype-imageselector:

10.6. ImageSelector
--------------------

The ``ImageSelector`` *x0-object-type* renders a paginated, scrollable picker listing
a set of images (ID, description and path per row), each with a "select" action. It
inherits :ref:`objecttype-divunique` and composes :ref:`objecttype-image`,
``FileUpload`` and ``FormfieldList`` child objects to additionally offer an inline
upload form for registering new images. Row pagination reuses the same mechanism as
:ref:`objecttype-list`.

10.6.1. Object Attributes
*************************

.. table:: Object Type ImageSelector Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| RowCount            | Integer              | Rows displayed per pagination page (default 5)  |
	+---------------------+----------------------+-------------------------------------------------+
	| Value               | Array of Elements    | Array of ``{ID, Description, Path}`` image rows |
	+---------------------+----------------------+-------------------------------------------------+

10.6.2. JSON Example
*********************

.. code-block:: javascript

	"ExamplesBasicOverlayImageList":
	{
		"Type": "ImageSelector",
		"Attributes": {
			"RowCount": 3,
			"Value": [
				{ "ID": "UTF-Emoji-Clock", "Description": "Clock Icon", "Path": "/image/icon-emoji-clock.png" }
			]
		}
	}

10.6.3. Runnable Example
*************************

* Example - Global Settings "Default Settings" overlay image picker, reachable via the
	static reference container's Main Menu under "Settings/Global Settings".

.. _objecttype-badgeselector:

10.7. BadgeSelector
---------------------

The ``BadgeSelector`` *x0-object-type* renders a fixed, non-configurable list of the
six Bootstrap contextual badge colors (``primary``, ``secondary``, ``success``,
``info``, ``warning``, ``danger``), each with a checkbox, for multi-selection inside
an overlay. It inherits :ref:`objecttype-divunique`.

10.7.1. Object Attributes
*************************

.. table:: Object Type BadgeSelector Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+

10.7.2. JSON Example
*********************

.. code-block:: javascript

	"OverlayGlobalBadgesList":
	{
		"Type": "BadgeSelector"
	}

.. _objecttype-list:

10.8. List
----------

The ``List`` *x0-object-type* renders a table-like HTML structure using Bootstrap's Grid CSS,
avoiding the traditional ``<table><tr><td>`` HTML syntax for a more modern and flexible layout.

Additionally, it incorporates advanced features such as *x0-realtime-container*
for dynamic updates and *x0-context-menu* for enhanced user interaction.

10.8.1. Object Attributes
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
	| ContextMenuItems    | Array of Items       | Context Menu Entries, see 10.8.4.               |
	+---------------------+----------------------+-------------------------------------------------+

10.8.2. Column Attributes
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

10.8.3. RT Attributes
*********************

.. table:: Object Type List Real Time Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| DoubleCheckColumn   | String               | Check Column Value already exists on Row append |
	+---------------------+----------------------+-------------------------------------------------+

10.8.4. Grid Attributes
***********************

Global Grid Attributes can be applied, see :ref:`appdevgridsystem`.

10.8.5. Context Menu
********************

Global Context Menu Attributes can be applied, see :ref:`appdevcontextmenu`.

10.8.6. Backend JSON Schema
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

10.8.7. Runtime Features
************************

The following runtime-features are supported.

* RuntimeGetDataFunc()
* RuntimeAppendDataFunc()

.. _objecttype-tabcontainer:

10.9. TabContainer
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
	              
10.9.1. Object Attributes
*************************

.. table:: Object Type TabContainer Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Tabs                | Array of Elements    | Array of Tab Elements (Config)                  |
	+---------------------+----------------------+-------------------------------------------------+

10.9.2. Tab Attributes
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

.. _objecttype-fileupload:

10.10. FileUpload
-----------------

The ``FileUpload`` *x0-object-type* provides a file selection dialog along with a visually
intuitive upload progress indicator.

10.10.1. Object Attributes
**************************

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

.. _objecttype-errorcontainer:

10.11. ErrorContainer
---------------------

The ``ErrorContainer`` *x0-object-type* is designed to display informational and error messages.

10.11.1. Object Attributes
**************************

None.

10.11.2. JSON Example
*********************

.. code-block:: javascript

	"$ObjectID":
	{
		"Type": "ErrorContainer",
		"Attributes":
		{
		}
	}

.. _objecttype-openclosecontainer:

10.12. OpenCloseContainer
-------------------------

The ``OpenCloseContainer`` *x0-object-type* provides a collapsible content container 
with toggle functionality, allowing users to expand or collapse sections to manage 
screen real estate effectively. This component is particularly useful for organizing 
large amounts of content in a compact, user-friendly manner.

10.12.1. Object Attributes
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

10.12.2. Features
*****************

- **Toggle Functionality**: Click to expand or collapse content sections
- **State Management**: Maintains open/close state across interactions
- **Nested Content**: Can contain any x0-system-objects within collapsible sections
- **Responsive Design**: Adapts to different screen sizes using Bootstrap styling
- **Visual Indicators**: Uses FontAwesome caret icons to indicate state

10.12.3. JSON Example
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

10.12.4. Usage Examples
***********************

This system object can be used for:

- Creating collapsible content sections
- Organizing complex forms with grouped sections
- Building accordion-style interfaces
- Managing information hierarchy and screen space
- Demonstrating modular UI construction

.. _objecttype-treesimple:

10.13. TreeSimple
-----------------

The ``TreeSimple`` *x0-object-type* creates hierarchical tree structures with 
expandable/collapsible nodes, FontAwesome icons, and navigation capabilities. It 
supports both expandable nodes (containers) and interactive items (navigation elements) 
with visual selection indicators and state management.

10.13.1. Object Attributes
**************************

.. table:: Object Type TreeSimple Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| TreeItems           | Array of Elements    | Array of Tree Node and Item definitions         |
	+---------------------+----------------------+-------------------------------------------------+

10.13.2. Element Type Node
**************************

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

10.13.3. Element Type Item
**************************

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

10.13.4. Features
*****************

- **Hierarchical Structure**: Support for nested nodes and items
- **Expandable Nodes**: Click caret controls to expand/collapse tree nodes
- **Navigation Items**: Tree items trigger screen navigation while maintaining tree state
- **Icon Integration**: FontAwesome icons provide visual cues for different node and item types
- **Visual Feedback**: Hover effects and selection indicators enhance user interaction
- **State Management**: Tree state is preserved during navigation between screens

10.13.5. JSON Example
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

10.13.6. Usage Examples
***********************

This system object can be used for:

- Creating hierarchical navigation menus with expandable categories
- Building file explorer-style interfaces
- Implementing sidebar navigation with nested menu structures
- Demonstrating tree-based data organization in x0 applications
- Creating multi-level category browsers

10.13.7. Integration with OpenCloseContainer
********************************************

TreeSimple objects work well when wrapped in OpenCloseContainer for additional 
collapsibility:

.. code-block:: javascript

	"TreeContainer": {
		"Type": "OpenCloseContainer",
		"Attributes": {
			"TextID": "TXT.NAVIGATION.TREE"
		}
	}

.. _objecttype-divunique:

10.14. DivUnique
----------------

The ``DivUnique`` *x0-object-type* is an extended ``Div`` that sets its DOM
``ObjectID`` to a guaranteed-unique value derived from the object's own ``ID``
(overriding the default recursive naming). This makes it safe to use multiple
instances on the same screen without ID collisions. It supports the same
``Style``, ``DOMType``, and ``TextID`` attributes as the standard ``Div`` and
can act as a parent container for nested child objects.

10.14.1. Object Attributes
**************************

.. table:: Object Type DivUnique Attributes
	:widths: 30 20 100

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| DOMType             | String               | Container element tag, e.g. ``div``, ``span``   |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| TextID              | TextID-String        | TextID referenced in ``webui.text`` DB Table    |
	+---------------------+----------------------+-------------------------------------------------+

10.14.2. JSON Example
*********************

.. code-block:: javascript

	"$ObjectID":
	{
		"Type": "DivUnique",
		"Attributes": {
			"Style": "container-fluid p-3"
		}
	}

.. _objecttype-progressbar:

10.15. ProgressBar
------------------

The ``ProgressBar`` *x0-object-type* renders a Bootstrap-styled horizontal
progress indicator. It wraps an inner bar child object whose width is driven by
a percentage value. The percentage can be read and written at runtime through
the standard ``getObjectData()`` / ``setObjectData()`` API, making it easy to
update from button actions or backend callbacks.

10.15.1. Object Attributes
**************************

.. table:: Object Type ProgressBar Attributes
	:widths: 30 20 100

	+---------------------+----------------------+-------------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                       |
	+=====================+======================+=======================================================+
	| Style               | CSS-String           | Additional CSS classes applied to the inner bar       |
	|                     |                      | (appended after ``progress-bar``). If omitted, the    |
	|                     |                      | default striped/animated style is used.               |
	+---------------------+----------------------+-------------------------------------------------------+

10.15.2. Runtime API
********************

.. code-block:: javascript

	// read current percentage (0-100)
	var pct = sysFactory.getObjectByID('MyProgressBar').getObjectData();

	// set percentage and re-render
	sysFactory.getObjectByID('MyProgressBar').setObjectData(75);

10.15.3. JSON Example
*********************

.. code-block:: javascript

	"MyProgressBar":
	{
		"Type": "ProgressBar",
		"Attributes": {
			"Style": "bg-success"
		}
	}

.. _objecttype-rangeslider:

10.16. RangeSlider
------------------

The ``RangeSlider`` *x0-object-type* renders an HTML ``<input type="range">``
element styled with Bootstrap's ``form-range`` class. It exposes ``Min`` and
``Max`` configuration attributes and supports the standard
``getObjectData()`` / ``setObjectData()`` API so its current value can be read
from or written to by any other *x0-object* or button action.

10.16.1. Object Attributes
**************************

.. table:: Object Type RangeSlider Attributes
	:widths: 30 20 100

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Min                 | Number               | Minimum slider value (HTML ``min`` attribute)   |
	+---------------------+----------------------+-------------------------------------------------+
	| Max                 | Number               | Maximum slider value (HTML ``max`` attribute)   |
	+---------------------+----------------------+-------------------------------------------------+

10.16.2. Runtime API
********************

.. code-block:: javascript

	// read current slider value
	var val = sysFactory.getObjectByID('MySlider').getObjectData();

	// set slider value programmatically
	sysFactory.getObjectByID('MySlider').setObjectData(50);

10.16.3. JSON Example
*********************

.. code-block:: javascript

	"MySlider":
	{
		"Type": "RangeSlider",
		"Attributes": {
			"Min": 0,
			"Max": 100
		}
	}

.. _objecttype-rangeslidercontainer:

10.17. RangeSliderContainer
-----------------------------

The ``RangeSliderContainer`` *x0-object-type* wraps :ref:`objecttype-rangeslider` with
Min/Max/Unit labels and a disabled, auto-updating text field reflecting the current
value, composed as a single Bootstrap grid row. It inherits ``DivUnique`` and supports
the standard ``getObjectData()`` / ``setObjectData()`` API, delegating both to the
inner ``RangeSlider`` child.

10.17.1. Object Attributes
****************************

.. table:: Object Type RangeSliderContainer Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| Min                 | Number               | Minimum slider value (HTML ``min`` attribute)   |
	+---------------------+----------------------+-------------------------------------------------+
	| Max                 | Number               | Maximum slider value (HTML ``max`` attribute)   |
	+---------------------+----------------------+-------------------------------------------------+
	| Value               | Number               | Initial slider value                            |
	+---------------------+----------------------+-------------------------------------------------+
	| UnitTextID          | TextID-String        | TextID for the Min/Max unit label               |
	+---------------------+----------------------+-------------------------------------------------+

10.17.2. JSON Example
************************

.. code-block:: javascript

	"TeamPercentageMin":
	{
		"Type": "RangeSliderContainer",
		"Attributes": {
			"Min": 1,
			"Max": 100,
			"Value": 50,
			"UnitTextID": "TXT.EXAMPLE.RANGESLIDER.UNIT.PERCENTAGE"
		}
	}

.. _objecttype-headerbodycontainer:

10.18. HeaderBodyContainer
-----------------------------

The ``HeaderBodyContainer`` *x0-object-type* sets up a two-row layout consisting of a
styled header row and a body row, each exposing a nested ``Div`` for child objects.
Child objects are attached using ``ElementID`` in ``skeleton.json``, where the
``ElementID`` is the container's own ``ObjectID`` suffixed with ``Header`` or
``Content``.

10.18.1. Object Attributes
*****************************

.. table:: Object Type HeaderBodyContainer Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| HeaderStyle         | CSS-String           | CSS Style Classes for the header row            |
	+---------------------+----------------------+-------------------------------------------------+
	| BodyStyle           | CSS-String           | CSS Style Classes for the body row              |
	+---------------------+----------------------+-------------------------------------------------+

10.18.2. skeleton.json Example
*********************************

.. code-block:: javascript

	"IntroductionContainerLeftHeaderText": { "RefID": "IntroductionContainerLeftHeader" },
	"IntroductionContainerLeftText":       { "RefID": "IntroductionContainerLeftContent" }

10.18.3. JSON Example
************************

.. code-block:: javascript

	"IntroductionContainerRight":
	{
		"Type": "HeaderBodyContainer",
		"Attributes": {
			"HeaderStyle": "row m-0 p-3 border border-1 border-success rounded-top bg-success bg-opacity-50",
			"BodyStyle": "row m-0 p-3 border border-1 border-success bg-success-subtle bg-opacity-25"
		}
	}

.. _objecttype-systemsettingscontainer:

10.19. SystemSettingsContainer
----------------------------------

The ``SystemSettingsContainer`` *x0-object-type* renders a list of labeled settings
rows, each pairing a ``TextID`` description with an arbitrary nested *x0-system-object*
(any entry of ``sysFactory.SetupClasses``, commonly ``FormfieldPulldown``,
``FormfieldCheckbox`` or :ref:`objecttype-rangeslider` /
:ref:`objecttype-rangeslidercontainer`), plus per-row "reset" and "save" controls. It
is the backing object for the static example's "Settings/Global Settings" screens.

10.19.1. Object Attributes
*****************************

.. table:: Object Type SystemSettingsContainer Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Settings            | Array of Elements    | Array of Setting rows, see 10.19.2.             |
	+---------------------+----------------------+-------------------------------------------------+

10.19.2. Setting Element Attributes
***************************************

.. table:: SystemSettingsContainer Setting Element Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| TextID              | TextID-String        | Row description, referenced in ``webui.text``   |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes applied to the description    |
	+---------------------+----------------------+-------------------------------------------------+
	| IconStyle           | CSS-String           | Fontawesome Icon CSS for the description        |
	+---------------------+----------------------+-------------------------------------------------+
	| SettingsObject      | Object               | ``{ObjectType, Attributes}``, nested object     |
	|                     |                      | instantiated from ``sysFactory.SetupClasses``   |
	+---------------------+----------------------+-------------------------------------------------+

10.19.3. JSON Example
************************

.. code-block:: javascript

	"SettingsGlobalVideoSettings":
	{
		"Type": "SystemSettingsContainer",
		"Attributes": {
			"Settings": [
				{
					"TextID": "TXT.SYSTEMSETTINGS.VIDEO.BRIGHTNESS",
					"IconStyle": "fa-solid fa-sun",
					"SettingsObject": {
						"ObjectType": "RangeSlider",
						"Attributes": { "Style": "w-100", "Min": 1, "Max": 100, "Value": 90 }
					}
				}
			]
		}
	}

10.19.4. Runnable Example
****************************

* Reachable via the static reference container's Main Menu under
  "Settings/Global Settings", Tab "Default Settings".

.. _objecttype-systemsettingscontainergrid:

10.20. SystemSettingsContainerGrid
--------------------------------------

The ``SystemSettingsContainerGrid`` *x0-object-type* extends
:ref:`objecttype-systemsettingscontainer` with the Global Grid System
(see :ref:`appdevgridsystem`), rendering the same setting rows across one or more
selectable grid "variants". This is the live demonstrator referenced in
:ref:`appdevgridsystem`'s "Runtime Flexibility and Dynamic Restructuring" section: the
entire structural layout — not just column widths — can be toggled at runtime (e.g.
between a 3-column and a 6-column view), entirely client-side and without any backend
request.

10.20.1. Object Attributes
*****************************

.. table:: Object Type SystemSettingsContainerGrid Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Settings            | Array of Elements    | Same schema as 10.19.2.                         |
	+---------------------+----------------------+-------------------------------------------------+
	| GridStyles          | Object               | ``{SelectorRowStyle}``, variant selector style  |
	+---------------------+----------------------+-------------------------------------------------+
	| GridGenerator       | Object               | ``sysGridGenerator`` config, see                |
	|                     |                      | :ref:`appdevgridsystem`                         |
	+---------------------+----------------------+-------------------------------------------------+

10.20.2. Runnable Example
****************************

* Reachable via the static reference container's Main Menu under
  "Settings/Global Settings", Tab "Default Settings", Subsection
  "Adjust Grid / Column View".

.. _objecttype-infoparagraph:

10.21. InfoParagraph
------------------------

The ``InfoParagraph`` *x0-object-type* renders a sequence of ``SQLText`` paragraphs
inside a single styled container, commonly used as an introductory info box at the
top of a screen or tab.

10.21.1. Object Attributes
*****************************

.. table:: Object Type InfoParagraph Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Style               | CSS-String           | CSS Style Classes applied to the container      |
	+---------------------+----------------------+-------------------------------------------------+
	| Text                | Array of Elements    | Array of ``{ID, Style, IconStyle}`` paragraphs  |
	+---------------------+----------------------+-------------------------------------------------+

10.21.2. JSON Example
************************

.. code-block:: javascript

	"IntroductionBodyInfo":
	{
		"Type": "InfoParagraph",
		"Attributes": {
			"Text": [
				{
					"ID": "TXT.INTRODUCTION.INFOPARAGRAPH.START",
					"Style": "h4 text-dark text-opacity-75 fw-bold",
					"IconStyle": "fa-solid fa-user-group"
				}
			]
		}
	}

.. _objecttype-languageswitch:

10.22. LanguageSwitch
--------------------------

The ``LanguageSwitch`` *x0-object-type* renders a pulldown of the configured display
languages (see :ref:`appdevconfig-systemconfig`) next to an activation button.
Selecting a language and triggering the button updates ``sysFactory.EnvUserLanguage``
and re-renders every active ``SQLText`` object application-wide via
``sysFactory.updateLanguageObjectsGlobal()``, without a page reload.

10.22.1. Object Attributes
*****************************

.. table:: Object Type LanguageSwitch Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Style               | CSS-String           | CSS Style Classes applied to the row container  |
	+---------------------+----------------------+-------------------------------------------------+
	| PulldownStyle       | CSS-String           | CSS Style Classes for the language pulldown     |
	+---------------------+----------------------+-------------------------------------------------+
	| ButtonStyle         | CSS-String           | CSS Style Classes for the activation button     |
	+---------------------+----------------------+-------------------------------------------------+

10.22.2. JSON Example
************************

.. code-block:: javascript

	"SettingsLanguageSwitch":
	{
		"Type": "LanguageSwitch",
		"Attributes": {
			"Style": "row border rounded m-0 p-3 fw-bold"
		}
	}

.. _objecttype-dynradiolist:

10.23. DynRadioList
------------------------

The ``DynRadioList`` *x0-object-type* renders a dynamically growable list of radio
button rows, each paired with a text input. Clicking the trailing "add" control
appends a new row with its own "remove" control; right-clicking a removable row opens
a context menu offering the same removal action (see :ref:`appdevcontextmenu`).

10.23.1. Object Attributes
*****************************

.. table:: Object Type DynRadioList Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| ButtonTextDisabled  | Boolean              | Hide add/remove button text, icon-only display  |
	+---------------------+----------------------+-------------------------------------------------+

10.23.2. JSON Example
************************

.. code-block:: javascript

	"$ObjectID":
	{
		"Type": "DynRadioList",
		"Attributes": {
			"ButtonTextDisabled": false
		}
	}

.. _objecttype-serviceconnector:

10.24. ServiceConnector
----------------------------

The ``ServiceConnector`` *x0-object-type* binds a backend service call to a target
*x0-system-object* (typically a ``List``), triggering the call whenever one of the
configured system events fires (e.g. ``InitSystem``). Its full event-registration and
dispatch mechanics are documented in :ref:`devoopmodel` (section 23.8).

10.24.1. Object Attributes
*****************************

.. table:: Object Type ServiceConnector Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| OnEvent.Events      | Array of EventIDs    | EventIDs triggering the service call            |
	+---------------------+----------------------+-------------------------------------------------+
	| OnEvent.ServiceCall | URL-String           | Backend Service URL                             |
	+---------------------+----------------------+-------------------------------------------------+
	| OnEvent.ServiceID   | String               | Optional Backend Service Identifier             |
	+---------------------+----------------------+-------------------------------------------------+

10.24.2. JSON Example
************************

.. code-block:: javascript

	"$ObjectID":
	{
		"Type": "ServiceConnector",
		"Attributes": {
			"OnEvent": {
				"Events": [ "InitSystem" ],
				"ServiceCall": "/python/IntegrationTestGetTableData.py"
			}
		}
	}

.. _objecttype-timedprogress:

10.25. TimedProgress
---------------------

The ``TimedProgress`` *x0-object-type* is a user-space demonstrator object
(``/www/userObjExampleTimedProgress.js``) illustrating how the core
:ref:`objecttype-progressbar` primitive can be composed with
``sysFormfieldItemLabel`` and a callback-bound :ref:`objecttype-buttoninternal`
into a self-contained, periodically auto-incrementing progress indicator. It
inherits from ``sysObjDivUnique`` and is the first of several user-space
example objects located under ``/www/userObj*.js`` documented in this and the
following sections.

10.25.1. Object Attributes
***************************

.. table:: Object Type TimedProgress Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Interval            | Integer (ms)         | Auto-increment timer interval, in milliseconds  |
	+---------------------+----------------------+-------------------------------------------------+
	| IncreaseBy          | Integer              | Percentage increment applied on every interval  |
	+---------------------+----------------------+-------------------------------------------------+

10.25.2. JSON Example
***********************

.. code-block:: javascript

	"ExamplesBasicSlidersSlider1":
	{
		"Type": "TimedProgress",
		"Attributes": {
			"Interval": 100,
			"IncreaseBy": 1
		}
	}

.. _objecttype-examplewizard:

10.26. ExampleWizard
---------------------

The ``ExampleWizard`` *x0-object-type* (``/www/userObjExampleWizard.js``)
demonstrates a step-controlled, multi-tab wizard pattern built on top of
:ref:`objecttype-tabcontainer` and :ref:`objecttype-progressbar`. It inherits
from ``sysObjDivUnique``, tracks the active step via an internal
``StepIndex``/``StepCount`` state pair and drives per-step form validation
through its ``ValidateForm`` array before allowing forward navigation.

10.26.1. Object Attributes
***************************

This object type currently accepts no configurable ``Attributes`` beyond the
common base properties; step tabs, navigation buttons and the validated
formfield-list IDs per step are wired internally.

10.26.2. JSON Example
***********************

.. code-block:: javascript

	"ExamplesBasicSlidersStepControlledWizard":
	{
		"Type": "ExampleWizard",
		"Attributes": {}
	}

.. _objecttype-exampleeditableitem:

10.27. ExampleEditableItem
----------------------------

The ``ExampleEditableItem`` *x0-object-type*
(``/www/userObjExampleEditableItemContainer.js``) renders a single, optionally
in-place editable row (image, header text and content text) used as the
per-row template of :ref:`objecttype-exampleeditableitemcontainer`. It
inherits from ``sysObjDivUnique`` and supports a switchable edit mode as well
as a switchable drag-reorder mode.

10.27.1. Object Attributes
***************************

.. table:: Object Type ExampleEditableItem Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| Editable            | Boolean              | Enables in-place edit mode for this item        |
	+---------------------+----------------------+-------------------------------------------------+
	| OrderChangeable     | Boolean              | Enables drag-based reordering of this item      |
	+---------------------+----------------------+-------------------------------------------------+
	| ImagePath           | URL-String           | Item image, defaults to a placeholder icon      |
	+---------------------+----------------------+-------------------------------------------------+
	| HeaderText          | String               | Item header/title text                          |
	+---------------------+----------------------+-------------------------------------------------+
	| ContentText         | String               | Item body/description text                      |
	+---------------------+----------------------+-------------------------------------------------+

10.27.2. JSON Example
***********************

.. code-block:: javascript

	"ExamplesBasicEditableTemplate1EditableItem":
	{
		"Type": "ExampleEditableItem",
		"Attributes": {
			"Editable": true,
			"OrderChangeable": false
		}
	}

.. _objecttype-exampleeditableitemcontainer:

10.28. ExampleEditableItemContainer
--------------------------------------

The ``ExampleEditableItemContainer`` *x0-object-type*
(``/www/userObjExampleEditableItemContainer.js``) is the paginated container
counterpart to :ref:`objecttype-exampleeditableitem`. It inherits from
``sysObjDivUnique``, integrates a ``sysPagination`` instance and exposes the
common runtime data API (``SetDataMechanism: 'Plain'``,
``RuntimeSetDataFunc``/``RuntimeAppendDataFunc`` both routed through its
internal ``addItem()`` method) so new rows can be pushed in at runtime exactly
like :ref:`objecttype-list` rows.

10.28.1. Object Attributes
***************************

.. table:: Object Type ExampleEditableItemContainer Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| HeaderTextID        | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| HeaderStyle         | CSS-String           | CSS Style Classes for the header text           |
	+---------------------+----------------------+-------------------------------------------------+
	| HeaderIconStyle     | CSS-String           | FontAwesome icon style for the header           |
	+---------------------+----------------------+-------------------------------------------------+

10.28.2. JSON Example
***********************

.. code-block:: javascript

	"ExamplesBasicEditableTemplate1":
	{
		"Type": "ExampleEditableItemContainer",
		"Attributes": {
			"HeaderTextID": "TXT.HEADER.EXAMPLES_BASIC_EDITABLE_TEMPLATE1_HEADER",
			"HeaderStyle": "h3 text-primary-emphasis",
			"HeaderIconStyle": "fa-solid fa-card-shopping"
		}
	}

.. _objecttype-exampleflightdetails:

10.29. ExampleFlightDetails
------------------------------

The ``ExampleFlightDetails`` *x0-object-type*
(``/www/userObjExampleFlightData.js``) renders a single, read-only flight
summary row (airline icon, airline name, flight number and airport) from a
single ``Value`` object. It inherits from ``sysObjDivUnique`` and is typically
used as a repeated row inside a parent :ref:`objecttype-list` or
:ref:`objecttype-div` layout.

10.29.1. Object Attributes
***************************

.. table:: Object Type ExampleFlightDetails Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Value               | Object               | ``{Icon, Airline, FlightNr, Airport}``          |
	+---------------------+----------------------+-------------------------------------------------+

10.29.2. JSON Example
***********************

.. code-block:: javascript

	"MyFlightDetails":
	{
		"Type": "ExampleFlightDetails",
		"Attributes": {
			"Value": {
				"Icon": "icon-airline-lufthansa.png",
				"Airline": "Lufthansa",
				"FlightNr": "LH441",
				"Airport": "FRA"
			}
		}
	}

.. _objecttype-exampleflightstatus:

10.30. ExampleFlightStatus
-----------------------------

The ``ExampleFlightStatus`` *x0-object-type*
(``/www/userObjExampleFlightData.js``) renders a status badge (colored
indicator circle, status type and time) sharing its parent file with
:ref:`objecttype-exampleflightdetails`. It inherits from ``sysObjDivUnique``
and derives both its border color and inner text color from the
``Value.Alert`` Bootstrap contextual-color keyword (for example ``success``,
``warning`` or ``danger``).

10.30.1. Object Attributes
***************************

.. table:: Object Type ExampleFlightStatus Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Value               | Object               | ``{Alert, Type, Time}``                         |
	+---------------------+----------------------+-------------------------------------------------+

10.30.2. JSON Example
***********************

.. code-block:: javascript

	"MyFlightStatus":
	{
		"Type": "ExampleFlightStatus",
		"Attributes": {
			"Value": {
				"Alert": "success",
				"Type": "On Time",
				"Time": "14:35"
			}
		}
	}

.. _objecttype-examplecardtasklist:

10.31. ExampleCardTasklist
-----------------------------

The ``ExampleCardTasklist`` *x0-object-type*
(``/www/userObjExampleCardTasklists.js``) implements a Kanban-style card with
badge selection, collaborator selection and one or more nested, independently
addable tasklists/tasks. It inherits from ``sysObjDivUnique`` and composes
:ref:`objecttype-image`, :ref:`objecttype-badgeselector` and
:ref:`objecttype-examplepeopleselector` internally; the card itself exposes
``selectBadges()``, ``selectColaborators()``, ``addTasklist()`` and
``saveData()`` callback-bound actions.

10.31.1. Object Attributes
***************************

.. table:: Object Type ExampleCardTasklist Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+

10.31.2. JSON Example
***********************

.. code-block:: javascript

	"ExamplesBasicEditableTemplate2CardTasklists":
	{
		"Type": "ExampleCardTasklist"
	}

.. _objecttype-examplepeopleselector:

10.32. ExamplePeopleSelector
-------------------------------

The ``ExamplePeopleSelector`` *x0-object-type*
(``/www/userObjExamplePeopleSelector.js``) renders a fixed, non-overridable
roster of selectable collaborator rows (each with an image, name and
localized text) inside a closable overlay-style header/body layout. It
inherits from ``sysObjDivUnique`` and is typically instantiated inside a
:ref:`screen overlay <appdevoverlay>`.

10.32.1. Object Attributes
***************************

.. table:: Object Type ExamplePeopleSelector Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+

10.32.2. JSON Example
***********************

.. code-block:: javascript

	"OverlayGlobalCollaboratorsList":
	{
		"Type": "ExamplePeopleSelector"
	}

.. _object-examples-reference:
.. _object-examples-reference-section:

10.33. Object Examples Reference
----------------------------------

This section provides a comprehensive overview of where the *x0-system-objects*
documented above can be inspected in a live, production-representative context.
The legacy ``/example`` directory application set is intentionally **not**
referenced here, as its object definitions are outdated and do not reflect
current best practice; the static reference container (see
:ref:`appdev-static-deployment`) is the canonical, up-to-date demonstrator.

**Object Type Categories:**

**Container Objects:**
  - :ref:`objecttype-div`
  - :ref:`objecttype-divunique`
  - :ref:`objecttype-tabcontainer`
  - :ref:`objecttype-openclosecontainer`
  - :ref:`objecttype-headerbodycontainer`

**Navigation Objects:**
  - :ref:`objecttype-treesimple`

**Data Objects:**
  - :ref:`objecttype-list`
  - :ref:`objecttype-sqltext`
  - :ref:`objecttype-infoparagraph`

**Interactive Objects:**
  - :ref:`objecttype-button`
  - :ref:`objecttype-buttoninternal`
  - :ref:`objecttype-fileupload`
  - :ref:`objecttype-progressbar`
  - :ref:`objecttype-rangeslider`
  - :ref:`objecttype-rangeslidercontainer`
  - :ref:`objecttype-dynradiolist`

**Media & Selection Objects:**
  - :ref:`objecttype-image`
  - :ref:`objecttype-imageselector`
  - :ref:`objecttype-badgeselector`

**System & Backend Objects:**
  - :ref:`objecttype-errorcontainer`
  - :ref:`objecttype-languageswitch`
  - :ref:`objecttype-serviceconnector`
  - :ref:`objecttype-systemsettingscontainer` - Settings/Global Settings
  - :ref:`objecttype-systemsettingscontainergrid` - Settings/Global Settings, "Adjust Grid / Column View"

**User-Defined Example Objects (/www/userObj\*.js):**
  - :ref:`objecttype-timedprogress`
  - :ref:`objecttype-examplewizard`
  - :ref:`objecttype-exampleeditableitem`
  - :ref:`objecttype-exampleeditableitemcontainer`
  - :ref:`objecttype-exampleflightdetails`
  - :ref:`objecttype-exampleflightstatus`
  - :ref:`objecttype-examplecardtasklist`
  - :ref:`objecttype-examplepeopleselector`

**Related Documentation:**

* :ref:`appdevforms` - Form-specific objects
* :ref:`appdevformobjects` - Detailed form object documentation
* :ref:`appdevoverlay` - Overlay mode and object instancing
* :ref:`appdevgridsystem` - Global Grid System and runtime grid restructuring

