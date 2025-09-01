.. appdev-objects

.. _systemobjects:

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

Global Grid Attributes can be applied, see :ref:`appdevgridsystem`.

10.7.5. Context Menu
********************

Global Context Menu Attributes can be applied, see :ref:`appdevcontextmenu`.

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

* Example #1 - Basic Tab Container:
  ``http://x0-app.x0.localnet/python/Index.py?appid=example1``
* Example #4 - List Detail Switch Screen:
  ``http://x0-app.x0.localnet/python/Index.py?appid=example4``

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

* Example #3 - Basic Tab Container:
  ``http://x0-app.x0.localnet/python/Index.py?appid=example3``
* Example #8 - Multi Tab Container:
  ``http://x0-app.x0.localnet/python/Index.py?appid=example8``

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

* Example #1 - Add Object Table Column:
  ``http://x0-app.x0.localnet/python/Index.py?appid=example1``

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


.. _objecttype-openclosecontainer:

10.11. OpenCloseContainer
-------------------------

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
*****************

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
***********************

This system object can be used for:

- Creating collapsible content sections
- Organizing complex forms with grouped sections
- Building accordion-style interfaces
- Managing information hierarchy and screen space
- Demonstrating modular UI construction

10.11.5. Runnable Example
*************************

* Example #14 - Open Close Container: 
  ``http://x0-app.x0.localnet/python/Index.py?appid=example14``

.. _objecttype-treesimple:

10.12. TreeSimple
-----------------

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

10.12.2. Element Type Node
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

10.12.3. Element Type Item
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

10.12.4. Features
*****************

- **Hierarchical Structure**: Support for nested nodes and items
- **Expandable Nodes**: Click caret controls to expand/collapse tree nodes
- **Navigation Items**: Tree items trigger screen navigation while maintaining tree state
- **Icon Integration**: FontAwesome icons provide visual cues for different node and item types
- **Visual Feedback**: Hover effects and selection indicators enhance user interaction
- **State Management**: Tree state is preserved during navigation between screens

10.12.5. JSON Example
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

10.12.6. Usage Examples
***********************

This system object can be used for:

- Creating hierarchical navigation menus with expandable categories
- Building file explorer-style interfaces
- Implementing sidebar navigation with nested menu structures
- Demonstrating tree-based data organization in x0 applications
- Creating multi-level category browsers

10.12.7. Integration with OpenCloseContainer
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

10.12.8. Runnable Example
*************************

* Example #15 - Tree Simple: 
  ``http://x0-app.x0.localnet/python/Index.py?appid=example15``

.. _object-examples-reference:

10.13. Object Examples Reference
=================================

This section provides a comprehensive overview of examples demonstrating various *x0-system-objects* in action.

**Local Repository Examples:**

* **Example 1** - `Basic Objects <http://x0-app.x0.localnet/python/Index.py?appid=example1>`_: List, FileUpload
* **Example 3** - `Tabcontainer <http://x0-app.x0.localnet/python/Index.py?appid=example3>`_: Basic tabbed interface
* **Example 4** - `List with Data <http://x0-app.x0.localnet/python/Index.py?appid=example4>`_: Advanced list functionality
* **Example 8** - `Advanced Tabcontainer <http://x0-app.x0.localnet/python/Index.py?appid=example8>`_: Multi-level tabs
* **Example 9** - `Div Containers <http://x0-app.x0.localnet/python/Index.py?appid=example9>`_: Layout and styling
* **Example 11** - `Object Instancing <http://x0-app.x0.localnet/python/Index.py?appid=example11>`_: Dynamic object creation ⚠️ *Experimental*
* **Example 14** - `Open Close Container <http://x0-app.x0.localnet/python/Index.py?appid=example14>`_: Collapsible sections
* **Example 15** - `Tree Simple <http://x0-app.x0.localnet/python/Index.py?appid=example15>`_: Hierarchical navigation

**Object Type Categories:**

**Container Objects:**
  - :ref:`objecttype-div` - Example 9
  - :ref:`objecttype-tabcontainer` - Examples 3, 8  
  - :ref:`objecttype-openclosecontainer` - Example 14

**Navigation Objects:**
  - :ref:`objecttype-link` - Various examples
  - :ref:`objecttype-linkexternal` - See documentation
  - :ref:`objecttype-treesimple` - Example 15

**Data Objects:**
  - :ref:`objecttype-list` - Examples 1, 4
  - :ref:`objecttype-sqltext` - Various examples

**Interactive Objects:**
  - :ref:`objecttype-button` - Various examples
  - :ref:`objecttype-buttoninternal` - Various examples
  - :ref:`objecttype-fileupload` - Example 1

**External x0-skeleton Examples:**

* **List with Calculations:** `https://github.com/WEBcodeX1/x0-skeleton/tree/main/example/02-list-calculateable <https://github.com/WEBcodeX1/x0-skeleton/tree/main/example/02-list-calculateable>`_
  
  - Advanced list object with calculation capabilities
  - Demonstrates dynamic data processing

**Related Documentation:**

* :ref:`appdevforms` - Form-specific objects
* :ref:`appdevformobjects` - Detailed form object documentation  
* :ref:`appdevoverlay` - Overlay mode and object instancing
* :ref:`devexamples` - Guidelines for creating new examples
