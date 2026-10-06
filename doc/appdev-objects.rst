.. appdev-objects

.. _systemobjects:

10. System Objects
==================

The runtime registry in ``sysFactory.SetupClasses`` provides the following
object types for application metadata:

* **Layout and text:** ``Div``, ``DivUnique``, ``SQLText``,
  ``HeaderBodyContainer``, ``InfoParagraph``.
* **Controls:** ``Button``, ``ButtonInternal``, ``FileUpload``, ``Image``,
  ``ImageSelector``, ``ProgressBar``, ``RangeSlider``, ``RangeSliderContainer``.
* **Containers and navigation:** ``TabContainer``, ``OpenCloseContainer``,
  ``TreeSimple``, ``DynRadioList``, ``LanguageSwitch``.
* **Data and services:** ``List``, ``ServiceConnector``, ``ErrorContainer``.
* **Settings:** ``SystemSettingsContainer`` and
  ``SystemSettingsContainerGrid``.
* **Example objects:** ``TimedProgress``, ``ExampleEditableItem``,
  ``ExampleEditableItemContainer``, ``ExampleFlightDetails``,
  ``ExampleFlightStatus``, and ``ExampleWizard``.

Detailed reference sections are provided below for the principal system
objects. For form-specific objects, see :ref:`appdevformobjects`; service
configuration is described in :ref:`appdev-backend`. For practical examples,
see :ref:`object-examples-reference`.

.. note::

   The source tree contains a low-level drag-and-drop handler, but built-in
   runtime objects do not currently register its listeners. Drag-and-drop is
   therefore not a supported object feature in this release.

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

* Example #9 - Table Rowspan with Bootstrap:
  ``http://x0-app.x0.localnet/python/Index.py?appid=example9``

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

.. _objecttype-list:

10.5. List
----------

The ``List`` *x0-object-type* renders a table-like HTML structure using Bootstrap's Grid CSS,
avoiding the traditional ``<table><tr><td>`` HTML syntax for a more modern and flexible layout.

Additionally, it incorporates advanced features such as *x0-realtime-container*
for dynamic updates and *x0-context-menu* for enhanced user interaction.

10.5.1. Object Attributes
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

10.5.2. Column Attributes
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

10.5.3. RT Attributes
*********************

.. table:: Object Type List Real Time Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| DoubleCheckColumn   | String               | Check Column Value already exists on Row append |
	+---------------------+----------------------+-------------------------------------------------+

10.5.4. Grid Attributes
***********************

Global Grid Attributes can be applied, see :ref:`appdevgridsystem`.

10.5.5. Context Menu
********************

Global Context Menu Attributes can be applied, see :ref:`appdevcontextmenu`.

10.5.6. Backend JSON Schema
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

10.5.7. Runtime Features
************************

The following runtime-features are supported.

* RuntimeGetDataFunc()
* RuntimeAppendDataFunc()

10.5.8. Runnable Example
************************

* Example #1 - Basic Tab Container:
  ``http://x0-app.x0.localnet/python/Index.py?appid=example1``
* Example #4 - List Detail Switch Screen:
  ``http://x0-app.x0.localnet/python/Index.py?appid=example4``

.. _objecttype-tabcontainer:

10.6. TabContainer
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
	              
10.6.1. Object Attributes
*************************

.. table:: Object Type TabContainer Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Tabs                | Array of Elements    | Array of Tab Elements (Config)                  |
	+---------------------+----------------------+-------------------------------------------------+

10.6.2. Tab Attributes
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

10.6.3. Runnable Example
************************

* Example #3 - Basic Tab Container:
  ``http://x0-app.x0.localnet/python/Index.py?appid=example3``
* Example #8 - Multi Tab Container:
  ``http://x0-app.x0.localnet/python/Index.py?appid=example8``

.. _objecttype-fileupload:

10.7. FileUpload
----------------

The ``FileUpload`` *x0-object-type* provides a file selection dialog along with a visually
intuitive upload progress indicator.

10.7.1. Object Attributes
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

10.7.2. Runnable Example
************************

* Example #1 - Add Object Table Column:
  ``http://x0-app.x0.localnet/python/Index.py?appid=example1``

.. _objecttype-errorcontainer:

10.8. ErrorContainer
---------------------

The ``ErrorContainer`` *x0-object-type* is designed to display informational and error messages.

10.8.1. Object Attributes
**************************

None.

10.8.2. JSON Example
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

10.9. OpenCloseContainer
-------------------------

The ``OpenCloseContainer`` *x0-object-type* provides a collapsible content container 
with toggle functionality, allowing users to expand or collapse sections to manage 
screen real estate effectively. This component is particularly useful for organizing 
large amounts of content in a compact, user-friendly manner.

10.9.1. Object Attributes
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

10.9.2. Features
*****************

- **Toggle Functionality**: Click to expand or collapse content sections
- **State Management**: Maintains open/close state across interactions
- **Nested Content**: Can contain any x0-system-objects within collapsible sections
- **Responsive Design**: Adapts to different screen sizes using Bootstrap styling
- **Visual Indicators**: Uses FontAwesome caret icons to indicate state

10.9.3. JSON Example
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

10.9.4. Usage Examples
***********************

This system object can be used for:

- Creating collapsible content sections
- Organizing complex forms with grouped sections
- Building accordion-style interfaces
- Managing information hierarchy and screen space
- Demonstrating modular UI construction

10.9.5. Runnable Example
*************************

* Example #14 - Open Close Container: 
  ``http://x0-app.x0.localnet/python/Index.py?appid=example14``

.. _objecttype-treesimple:

10.10. TreeSimple
-----------------

The ``TreeSimple`` *x0-object-type* creates hierarchical tree structures with 
expandable/collapsible nodes, FontAwesome icons, and navigation capabilities. It 
supports both expandable nodes (containers) and interactive items (navigation elements) 
with visual selection indicators and state management.

10.10.1. Object Attributes
**************************

.. table:: Object Type TreeSimple Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| TreeItems           | Array of Elements    | Array of Tree Node and Item definitions         |
	+---------------------+----------------------+-------------------------------------------------+

10.10.2. Element Type Node
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

10.10.3. Element Type Item
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

10.10.4. Features
*****************

- **Hierarchical Structure**: Support for nested nodes and items
- **Expandable Nodes**: Click caret controls to expand/collapse tree nodes
- **Navigation Items**: Tree items trigger screen navigation while maintaining tree state
- **Icon Integration**: FontAwesome icons provide visual cues for different node and item types
- **Visual Feedback**: Hover effects and selection indicators enhance user interaction
- **State Management**: Tree state is preserved during navigation between screens

10.10.5. JSON Example
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

10.10.6. Usage Examples
***********************

This system object can be used for:

- Creating hierarchical navigation menus with expandable categories
- Building file explorer-style interfaces
- Implementing sidebar navigation with nested menu structures
- Demonstrating tree-based data organization in x0 applications
- Creating multi-level category browsers

10.10.7. Integration with OpenCloseContainer
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

10.10.8. Runnable Example
*************************

* Example #15 - Tree Simple: 
  ``http://x0-app.x0.localnet/python/Index.py?appid=example15``

10.11. DivUnique
----------------

The ``DivUnique`` *x0-object-type* is an extended ``Div`` that sets its DOM
``ObjectID`` to a guaranteed-unique value derived from the object's own ``ID``
(overriding the default recursive naming). This makes it safe to use multiple
instances on the same screen without ID collisions. It supports the same
``Style``, ``DOMType``, and ``TextID`` attributes as the standard ``Div`` and
can act as a parent container for nested child objects.

10.11.1. Object Attributes
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

10.11.2. JSON Example
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

10.12. ProgressBar
------------------

The ``ProgressBar`` *x0-object-type* renders a Bootstrap-styled horizontal
progress indicator. It wraps an inner bar child object whose width is driven by
a percentage value. The percentage can be read and written at runtime through
the standard ``getObjectData()`` / ``setObjectData()`` API, making it easy to
update from button actions or backend callbacks.

10.12.1. Object Attributes
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

10.12.2. Runtime API
********************

.. code-block:: javascript

	// read current percentage (0-100)
	var pct = sysFactory.getObjectByID('MyProgressBar').getObjectData();

	// set percentage and re-render
	sysFactory.getObjectByID('MyProgressBar').setObjectData(75);

10.12.3. JSON Example
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

10.13. RangeSlider
------------------

The ``RangeSlider`` *x0-object-type* renders an HTML ``<input type="range">``
element styled with Bootstrap's ``form-range`` class. It exposes ``Min`` and
``Max`` configuration attributes and supports the standard
``getObjectData()`` / ``setObjectData()`` API so its current value can be read
from or written to by any other *x0-object* or button action.

10.13.1. Object Attributes
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

10.13.2. Runtime API
********************

.. code-block:: javascript

	// read current slider value
	var val = sysFactory.getObjectByID('MySlider').getObjectData();

	// set slider value programmatically
	sysFactory.getObjectByID('MySlider').setObjectData(50);

10.13.3. JSON Example
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

.. _objecttype-image:

10.14. Image
------------

The ``Image`` object renders an ``<img>`` element. ``Value`` supplies its
initial source; ``Width`` and ``Height`` set the corresponding DOM attributes,
and ``Style`` supplies CSS classes. Its runtime value can be read or updated
through ``getObjectData()`` and ``setObjectData()``.

.. code-block:: javascript

   "Logo": {
     "Type": "Image",
     "Attributes": {
       "Value": "/image/logo.png",
       "Width": "160px",
       "Style": "border rounded"
     }
   }

.. _objecttype-imageselector:

10.15. ImageSelector
--------------------

``ImageSelector`` displays selectable image records. Its ``Value`` is an array
of records containing ``ID``, ``Description``, and ``Path``; ``RowCount``
controls the page size and ``Style`` overrides the container classes. When a
record is selected, the selector passes that record to its configured source
object, which is responsible for handling the selection.

.. code-block:: javascript

   "ImageChoices": {
     "Type": "ImageSelector",
     "Attributes": {
       "RowCount": 3,
       "Value": [
         {
           "ID": "Logo",
           "Description": "Application logo",
           "Path": "/image/logo.png"
         }
       ]
     }
   }

.. _objecttype-headerbodycontainer:

10.16. HeaderBodyContainer
--------------------------

``HeaderBodyContainer`` creates separate header and body slots. Its optional
``HeaderStyle`` and ``BodyStyle`` attributes replace the default CSS classes.
For an object with ID ``Card``, child objects can target ``CardHeader`` or
``CardContent`` with ``ElementID`` in ``skeleton.json``.

.. code-block:: javascript

   "Card": {
     "Type": "HeaderBodyContainer",
     "Attributes": {
       "HeaderStyle": "row p-2 bg-primary text-white",
       "BodyStyle": "row p-3 border"
     }
   }

.. _objecttype-infoparagraph:

10.17. InfoParagraph
--------------------

``InfoParagraph`` renders a sequence of translated text elements. Each entry in
``Text`` requires an ``ID`` referencing a text resource; optional ``Style`` and
``IconStyle`` values control its appearance. The container's ``Style`` may be
overridden.

.. code-block:: javascript

   "Notice": {
     "Type": "InfoParagraph",
     "Attributes": {
       "Style": "row p-3 bg-info-subtle",
       "Text": [
         {
           "ID": "TXT.APP.NOTICE",
           "Style": "fw-bold",
           "IconStyle": "fa-solid fa-circle-info"
         }
       ]
     }
   }

.. _objecttype-systemsettingscontainer:

10.18. SystemSettingsContainer and SystemSettingsContainerGrid
---------------------------------------------------------------

Both settings objects render a collection of labeled controls. Each item in
``Settings`` specifies a ``TextID`` and a ``SettingsObject`` containing the
control's registered ``ObjectType`` and its ``Attributes``. Optional ``Style``
and ``IconStyle`` values customize the label.

``SystemSettingsContainerGrid`` additionally accepts ``GridStyles`` and a
``GridGenerator`` configuration. The generator's ``Variants`` define the
available column layouts through ``RowAfterElements``, ``ColAfterElements``,
and ``ColStyles``; users can select a layout at runtime.

The built-in Save control reads and writes the control's value through its
runtime data interface. It does not persist settings to a database or backend;
applications that require persistence must implement that behavior separately.

.. code-block:: javascript

   "DisplaySettings": {
     "Type": "SystemSettingsContainer",
     "Attributes": {
       "Settings": [
         {
           "TextID": "TXT.SETTINGS.BRIGHTNESS",
           "IconStyle": "fa-solid fa-sun",
           "SettingsObject": {
             "ObjectType": "RangeSlider",
             "Attributes": {
               "Min": 0,
               "Max": 100,
               "Value": 75
             }
           }
         }
       ]
     }
   }

.. _object-examples-reference:
.. _object-examples-reference-section:

10.19. Object Examples Reference
--------------------------------

Runnable database-backed examples are maintained under ``example/``. Current
examples include ``add_object_table_column``, ``basic_menu_screen``,
``basic_tabcontainer``, ``bootstrap_rowspan``, ``copy_paste``, ``enhanced_form``,
``list_detail_switch_screen``, ``list_dyn_radio``, ``list_objectdata_grid``,
``multi_tabcontainer``, ``net_messages``, ``object_instances``,
``open_close_container``, ``screen_overlay``, and ``tree_simple``.

The static deployment also bundles a metadata demonstration that uses the new
image, image-selector, informational-text, header/body, and settings objects;
see :ref:`appdev-static-deployment`.

The static runtime also registers demonstration objects for timed progress,
editable items, flight details and status, and a wizard workflow. Their
implementations are in ``www/userObjExampleTimedProgress.js`` and the
``www/userObjExample*.js`` modules.

**Object Type Categories:**

* **Containers and layout:** :ref:`objecttype-div`, ``DivUnique``,
  :ref:`objecttype-tabcontainer`, :ref:`objecttype-openclosecontainer`, and
  :ref:`objecttype-headerbodycontainer`.
* **Navigation:** :ref:`objecttype-treesimple`.
* **Data and text:** :ref:`objecttype-list`, :ref:`objecttype-sqltext`, and
  :ref:`objecttype-infoparagraph`.
* **Interactive controls:** :ref:`objecttype-button`,
  :ref:`objecttype-buttoninternal`, :ref:`objecttype-fileupload`,
  :ref:`objecttype-progressbar`, :ref:`objecttype-rangeslider`,
  :ref:`objecttype-image`, :ref:`objecttype-imageselector`, and
  :ref:`objecttype-systemsettingscontainer`.

For application-level examples and test guidance, see :ref:`devexamples`.
