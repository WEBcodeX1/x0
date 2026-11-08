.. appdev-objects

.. _systemobjects:

11. System Objects
==================

Currently the following *x0-system-objects* are usable inside ``object.json``.

- :ref:`objecttype-div`
- :ref:`objecttype-text`
- :ref:`objecttype-button`
- :ref:`objecttype-buttoninternal`
- :ref:`objecttype-buttoncallback`
- :ref:`objecttype-image`
- :ref:`objecttype-imageselector`
- :ref:`objecttype-badgeselector`
- :ref:`objecttype-list`
- :ref:`objecttype-tabcontainer`
- :ref:`objecttype-fileupload`
- :ref:`objecttype-errorcontainer`
- :ref:`objecttype-openclosecontainer`
- :ref:`objecttype-treesimple`
- :ref:`objecttype-divunique`
- :ref:`objecttype-divvalue`
- :ref:`objecttype-progressbar`
- :ref:`objecttype-rangeslider`
- :ref:`objecttype-rangeslidercontainer`
- :ref:`objecttype-headerbodycontainer`
- :ref:`objecttype-systemsettingscontainer`
- :ref:`objecttype-systemsettingscontainergrid`
- :ref:`objecttype-infoparagraph`
- :ref:`objecttype-languageswitch`
- :ref:`objecttype-dynradiolist`
- :ref:`objecttype-serviceconnector`

Additionally, the following custom object extensions are provided within the
*x0-static* Docker **reference container**. They illustrate how the core system
components can be composed into higher-level, **reusable building blocks**,
serving as a blueprint for **programmatically** building custom *x0-objects*:

- :ref:`objecttype-timedprogress`
- :ref:`objecttype-examplewizard`
- :ref:`objecttype-exampleeditableitem`
- :ref:`objecttype-exampleeditableitemcontainer`
- :ref:`objecttype-exampleflightdetails`
- :ref:`objecttype-exampleflightstatus`
- :ref:`objecttype-examplecardtasklist`
- :ref:`objecttype-examplepeopleselector`

**Form-specific objects**, see :ref:`appdevformobjects`.

**Practical examples** can be found under ``/examples/``, including detailed descriptions.

.. note::
   For immediate access to these examples and to explore the system's full potential,
   you can use the pre-configured *x0-static* application running inside a minimal
   Docker container. For setup instructions, see :ref:`installation-minimal`.

.. _objecttype-div:

11.1. Div
---------

The ``Div`` *x0-object-type* is a very limited, yet very important, component.
It generates a DOM layer with a configurable CSS class attribute. The outer HTML
tag is specified in ``DOMType``; when omitted, its default value is ``div``.

It should **never** be used directly in a **declarative configuration**—use
``DivUnique`` or ``DivValue`` instead. The latter also explains where and why it should
be used in a **programmatic, custom** *x0-object*.

When building custom *x0-object*'s, you should be familiar with **when** exactly to
use this type of object and when **not** to. It should primarily be used **only**
for intermediate divs in so-called *object-between-layers*, because it does
**not** set its internal property ``this.overrideDOMObjectID`` to **true** (which
disables the automatic, prefixed DOM object generation in ``sysBaseObject.renderObject()``).

This concept is explained in detail in the system developer documentation; see:

11.1.1. Object Attributes
*************************

.. table:: Object Type Div Attributes
   :widths: 10 10 90

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | DOMType             | String               | Container Div Type, <DOMType></DOMType>         |
   +---------------------+----------------------+-------------------------------------------------+
   | Style               | CSS-String           | CSS Style Classes, space separated              |
   +---------------------+----------------------+-------------------------------------------------+

11.1.2. JSON Example
********************

.. code-block:: javascript

   "SimpleDivObject":
   {
      "Type": "Div",
      "Attributes":
      {
         "Style": "css1 css2 css3"
      }
   }

.. _objecttype-text:

11.2. Text
----------

The ``Text`` *x0-object-type* renders multilingual text retrieved from the *x0-system-db*
``webui.text`` table. Alternatively, the **static** *x0-component* uses the ``/static/meta/text-data.json``
file for **NoSQL** operations.

.. important::
   For backward compatibility, the ``Text`` object type is also referenceable as ``SQLText``.

11.2.1. Object Attributes
*************************

.. table:: Object Type Text Attributes
   :widths: 15 15 70

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

11.2.2. JSON Example
********************

.. code-block:: javascript

   "$ObjectID":
   {
      "Type": "Text",
      "Attributes":
      {
         "Style": "css1 css2",
         "TextID": "TXT.TEST.NR1"
      }
   }

.. _objecttype-button:

11.3. Button
------------

The ``Button`` *x0-object-type* generates a control-flow modifying object.

.. _button-attributes:

11.3.1. Object Attributes
*************************

.. table:: Object Type Button Attributes
   :widths: 15 15 70

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
   | Action              | Array of Actions     | Actions **before** Service Execution            |
   +---------------------+----------------------+-------------------------------------------------+
   | OnResult            | Array of Actions     | Actions **after** Service Execution             |
   +---------------------+----------------------+-------------------------------------------------+
   | FireEvents          | Array of EventIDs    | Array of EventIDs                               |
   +---------------------+----------------------+-------------------------------------------------+

11.3.2. Actions / OnResult
**************************

See :ref:`event-actions`.

.. _objecttype-buttoninternal:

11.4. ButtonInternal
--------------------

The ``ButtonInternal`` *x0-object-type* inherits ``Button`` *x0-object-type* and, as the name suggests,
is designed for use cases that are not centered around backend services.

11.4.1. Object Attributes
*************************

All attrributes are inherited from ``Button``, see :ref:`button-attributes`.

.. _objecttype-buttoncallback:

11.5. ButtonCallback
--------------------

The ``ButtonCallback`` *x0-object-type* is a programmatic variant of ``Button`` that
inherits its rendering and attribute handling (``init()``, ``enable()``, ``disable()``,
``addEventListenerClick()``), but replaces the backend ``OnClick`` service dispatch with
a direct, in-page method invocation. Rather than being declared through
``object.json``/``skeleton.json``, it is always instantiated and wired up in code via
``new sysObjButtonCallback()`` together with ``setCallback(CallbackObject,
CallbackFunction, CallbackArguments)``; once clicked, it invokes
``CallbackObject.ButtonCallback(CallbackFunction, CallbackArguments, Event)`` directly,
without involving a request/response round-trip. This makes it the preferred building
block for Button-styled UI controls that only need to trigger logic already local to the
current screen — for instance the previous/next and page-index navigation controls of
``sysPagination`` (see :ref:`realtime-pagination`), or the per-row action buttons of
custom containers such as ``ExampleEditableItemContainer``
(see :ref:`objecttype-exampleeditableitemcontainer`).

11.5.1. Object Attributes
*************************

All rendering attributes (``DOMType``, ``Style``, ``IconStyle``, ``IconStylePost``,
``TextID``, ``FormButton``, ``Disabled``) are inherited from ``Button``, see
:ref:`button-attributes`; ``OnClick``, ``Action``, ``OnResult`` and ``FireEvents`` are not
applicable, since dispatch is handled entirely via the programmatic callback below.

11.5.2. Programmatic Usage
**************************

.. code-block:: javascript

   let MyButton = new sysObjButtonCallback();
   MyButton.setCallback(ParentObjectRef, 'myFunctionID', OptionalArguments);

   //- the parent object implements the dispatch target
   ParentObjectRef.prototype.ButtonCallback = function(FunctionID, Arguments, Event)
   {
       if (FunctionID == 'myFunctionID') {
           //- handle the click, purely client-side
       }
   }

.. _objecttype-image:

11.6. Image
-----------

The ``Image`` *x0-object-type* renders an HTML ``<img>`` element. Unlike most other
*x0-object-types*, its ``DOMType`` is fixed to ``img`` rather than being generic
(see :ref:`devoopmodel_base`). Its source path can be read and updated at runtime
through the standard ``getObjectData()`` / ``setObjectData()`` API.

11.6.1. Object Attributes
*************************

.. table:: Object Type Image Attributes
   :widths: 10 10 80

   +-----------------+------------------+---------------------------------------------------------+
   | **Property**    | **Type**         | **Description**                                         |
   +=================+==================+=========================================================+
   | Value           | URL-String       | Image ``src`` path                                      |
   +-----------------+------------------+---------------------------------------------------------+
   | Width           | String           | Image ``width`` attribute, e.g. ``80px``                |
   +-----------------+------------------+---------------------------------------------------------+
   | Height          | String           | Image ``height`` attribute, e.g. ``80px``               |
   +-----------------+------------------+---------------------------------------------------------+
   | Style           | CSS-String       | CSS Style Classes, space separated                      |
   +-----------------+------------------+---------------------------------------------------------+

11.6.2. Runtime API
*******************

.. code-block:: javascript

   // read current image source
   const src = sysFactory.getObjectByID('MyImage').getObjectData();

   // swap the image source and re-render
   sysFactory.getObjectByID('MyImage').setObjectData('/image/other.png');

11.6.3. JSON Example
********************

.. code-block:: javascript

   "$ObjectID":
   {
      "Type": "Image",
      "Attributes":
      {
         "Value": "/image/x0-logo.png",
         "Style": "border rounded"
      }
   }

.. _objecttype-imageselector:

11.7. ImageSelector
-------------------

The ``ImageSelector`` *x0-object-type* renders a paginated, scrollable picker listing
a set of images (ID, description and path per row), each with a "select" action. It
inherits :ref:`objecttype-divunique` and composes :ref:`objecttype-image`,
``FileUpload`` and ``FormfieldList`` child objects to additionally offer an inline
upload form for registering new images. Row pagination reuses the same mechanism as
:ref:`objecttype-list`.

11.7.1. Object Attributes
*************************

.. table:: Object Type ImageSelector Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Style               | CSS-String           | CSS Style Classes, space separated              |
   +---------------------+----------------------+-------------------------------------------------+
   | RowCount            | Integer              | Rows displayed per pagination page (default 5)  |
   +---------------------+----------------------+-------------------------------------------------+
   | Value               | Array of Elements    | Array of ``{ID, Description, Path}`` image rows |
   +---------------------+----------------------+-------------------------------------------------+

11.7.2. JSON Example
********************

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

11.7.3. Runnable Example
************************

* Example - Global Settings "Default Settings" overlay image picker, reachable via the
   static reference container's Main Menu under "Settings/Global Settings".

.. _objecttype-badgeselector:

11.8. BadgeSelector
-------------------

The ``BadgeSelector`` *x0-object-type* renders a fixed, non-configurable list of the
six Bootstrap contextual badge colors (``primary``, ``secondary``, ``success``,
``info``, ``warning``, ``danger``), each with a checkbox, for multi-selection inside
an overlay. It inherits :ref:`objecttype-divunique`.

11.8.1. Object Attributes
*************************

.. table:: Object Type BadgeSelector Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Style               | CSS-String           | CSS Style Classes, space separated              |
   +---------------------+----------------------+-------------------------------------------------+

11.8.2. JSON Example
********************

.. code-block:: javascript

   "OverlayGlobalBadgesList":
   {
      "Type": "BadgeSelector"
   }

.. _objecttype-list:

11.9. List
----------

The ``List`` *x0-object-type* renders a table-like HTML structure using Bootstrap's Grid CSS,
avoiding the traditional ``<table><tr><td>`` HTML syntax for a more modern and flexible layout.

Additionally, it incorporates advanced features such as *x0-realtime-container*
for dynamic updates and *x0-context-menu* for enhanced user interaction.

11.9.1. Object Attributes
*************************

.. table:: Object Type List Attributes
   :widths: 15 15 70

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
   | ContextMenuItems    | Array of Items       | Context Menu Entries, see 11.9.4.               |
   +---------------------+----------------------+-------------------------------------------------+

11.9.2. Column Attributes
*************************

.. table:: Object Type List Column Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | ID                  | ID-String            | Column ID, also DB Column Reference             |
   +---------------------+----------------------+-------------------------------------------------+
   | HeaderTextID        | TextID-String        | TextID referenced in "webui.text" DB Table      |
   +---------------------+----------------------+-------------------------------------------------+
   | HeaderStyle         | CSS-String           | CSS Style Classes, space separated              |
   +---------------------+----------------------+-------------------------------------------------+

11.9.3. RT Attributes
*********************

.. table:: Object Type List Real Time Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | DoubleCheckColumn   | String               | Check Column Value already exists on Row append |
   +---------------------+----------------------+-------------------------------------------------+

11.9.4. Grid Attributes
***********************

Global Grid Attributes can be applied, see :ref:`appdevgridsystem`.

11.9.5. Context Menu
********************

Global Context Menu Attributes can be applied, see :ref:`appdevcontextmenu`.

11.9.6. Backend JSON Schema
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

11.9.7. Runtime Features
************************

The following runtime-features are supported.

* RuntimeGetDataFunc()
* RuntimeAppendDataFunc()

.. _objecttype-tabcontainer:

11.10. TabContainer
-------------------

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

11.10.1. Object Attributes
**************************

.. table:: Object Type TabContainer Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Tabs                | Array of Elements    | Array of Tab Elements (Config)                  |
   +---------------------+----------------------+-------------------------------------------------+

11.10.2. Tab Attributes
***********************

.. table:: Object Type TabAttributes
   :widths: 15 15 70

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

11.11. FileUpload
-----------------

The ``FileUpload`` *x0-object-type* provides a file selection dialog along with a visually
intuitive upload progress indicator.

11.11.1. Object Attributes
**************************

.. table:: Object Type FileUpload Attributes
   :widths: 15 15 70

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

11.12. ErrorContainer
---------------------

The ``ErrorContainer`` *x0-object-type* is designed to display informational and error messages.

11.12.1. Object Attributes
**************************

None.

11.12.2. JSON Example
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

11.13. OpenCloseContainer
-------------------------

The ``OpenCloseContainer`` *x0-object-type* provides a collapsible content container 
with toggle functionality, allowing users to expand or collapse sections to manage 
screen real estate effectively. This component is particularly useful for organizing 
large amounts of content in a compact, user-friendly manner.

11.13.1. Object Attributes
**************************

.. table:: Object Type OpenCloseContainer Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Style               | CSS-String           | CSS Style Classes, space separated              |
   +---------------------+----------------------+-------------------------------------------------+
   | TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
   +---------------------+----------------------+-------------------------------------------------+

11.13.2. Features
*****************

- **Toggle Functionality**: Click to expand or collapse content sections
- **State Management**: Maintains open/close state across interactions
- **Nested Content**: Can contain any x0-system-objects within collapsible sections
- **Responsive Design**: Adapts to different screen sizes using Bootstrap styling
- **Visual Indicators**: Uses FontAwesome caret icons to indicate state

11.13.3. JSON Example
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

11.13.4. Usage Examples
***********************

This system object can be used for:

- Creating collapsible content sections
- Organizing complex forms with grouped sections
- Building accordion-style interfaces
- Managing information hierarchy and screen space
- Demonstrating modular UI construction

.. _objecttype-treesimple:

11.14. TreeSimple
-----------------

The ``TreeSimple`` *x0-object-type* creates hierarchical tree structures with 
expandable/collapsible nodes, FontAwesome icons, and navigation capabilities. It 
supports both expandable nodes (containers) and interactive items (navigation elements) 
with visual selection indicators and state management.

11.14.1. Object Attributes
**************************

.. table:: Object Type TreeSimple Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | TreeItems           | Array of Elements    | Array of Tree Node and Item definitions         |
   +---------------------+----------------------+-------------------------------------------------+

11.14.2. Element Type Node
**************************

Expandable/collapsible containers that can contain other nodes or items:

.. table:: Tree Node Attributes
   :widths: 15 15 70

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

11.14.3. Element Type Item
**************************

Interactive navigation elements that trigger screen navigation:

.. table:: Tree Item Attributes
   :widths: 15 15 70

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

11.14.4. Features
*****************

- **Hierarchical Structure**: Support for nested nodes and items
- **Expandable Nodes**: Click caret controls to expand/collapse tree nodes
- **Navigation Items**: Tree items trigger screen navigation while maintaining tree state
- **Icon Integration**: FontAwesome icons provide visual cues for different node and item types
- **Visual Feedback**: Hover effects and selection indicators enhance user interaction
- **State Management**: Tree state is preserved during navigation between screens

11.14.5. JSON Example
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

11.14.6. Usage Examples
***********************

This system object can be used for:

- Creating hierarchical navigation menus with expandable categories
- Building file explorer-style interfaces
- Implementing sidebar navigation with nested menu structures
- Demonstrating tree-based data organization in x0 applications
- Creating multi-level category browsers

11.14.7. Integration with OpenCloseContainer
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

11.15. DivUnique
----------------

The ``DivUnique`` *x0-object-type* is an extended ``Div`` that sets its DOM
``ObjectID`` to a guaranteed-unique value derived from the object's own ``ID``
(overriding the default recursive naming). This makes it safe to use multiple
instances on the same screen without ID collisions. It supports the same
``Style``, ``DOMType``, and ``TextID`` attributes as the standard ``Div`` and
can act as a parent container for nested child objects.

11.15.1. Object Attributes
**************************

.. table:: Object Type DivUnique Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | DOMType             | String               | Container element tag, e.g. ``div``, ``span``   |
   +---------------------+----------------------+-------------------------------------------------+
   | Style               | CSS-String           | CSS Style Classes, space separated              |
   +---------------------+----------------------+-------------------------------------------------+
   | TextID              | TextID-String        | TextID referenced in ``webui.text`` DB Table    |
   +---------------------+----------------------+-------------------------------------------------+

11.15.2. JSON Example
*********************

.. code-block:: javascript

   "$ObjectID":
   {
      "Type": "DivUnique",
      "Attributes": {
         "Style": "container-fluid p-3"
      }
   }

.. _objecttype-divvalue:

11.16. DivValue
---------------

The ``DivValue`` *x0-object-type* extends ``Div`` (sharing its declarative ``DOMType``,
``Value`` and ``Style`` attribute handling) with the standard runtime data-exchange
contract: it exposes ``RuntimeSetDataFunc``/``RuntimeGetDataFunc`` (bound to
``setValue()``/``getValue()``), so a plain DOM container can participate in the same
get/set data mechanisms as formfield-type objects — for example as the target of a
``SrcDataObjects`` payload mapping or of a custom object's programmatic data assignment —
without requiring a dedicated formfield. Like ``ButtonCallback``, it follows the
``overrideDOMObjectID`` convention and therefore needs no additional naming scheme beyond
its own ``ObjectID``.

11.16.1. Object Attributes
**************************

.. table:: Object Type DivValue Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | DOMType             | String               | Container element tag, e.g. ``div``, ``span``   |
   +---------------------+----------------------+-------------------------------------------------+
   | Style               | CSS-String           | CSS Style Classes, space separated              |
   +---------------------+----------------------+-------------------------------------------------+
   | Value               | String               | Initial Display/Data Value                      |
   +---------------------+----------------------+-------------------------------------------------+

11.16.2. Runtime API
********************

.. table:: Object Type DivValue Runtime Methods
   :widths: 15 85

   +---------------------+-------------------------------------------------------------+
   | **Method**          | **Description**                                              |
   +=====================+===============================================================+
   | setValue(Data)      | Sets ``Value``/``DOMValue`` and refreshes the rendered DOM     |
   +---------------------+-------------------------------------------------------------+
   | getValue()          | Returns the current, rendered DOM value                       |
   +---------------------+-------------------------------------------------------------+

11.16.3. JSON Example
*********************

.. code-block:: javascript

   "$ObjectID":
   {
      "Type": "DivValue",
      "Attributes": {
         "Style": "fw-bold"
      }
   }

.. _objecttype-progressbar:

11.17. ProgressBar
------------------

The ``ProgressBar`` *x0-object-type* renders a Bootstrap-styled horizontal
progress indicator. It wraps an inner bar child object whose width is driven by
a percentage value. The percentage can be read and written at runtime through
the standard ``getObjectData()`` / ``setObjectData()`` API, making it easy to
update from button actions or backend callbacks.

11.17.1. Object Attributes
**************************

.. table:: Object Type ProgressBar Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                       |
   +=====================+======================+=======================================================+
   | Style               | CSS-String           | Additional CSS classes applied to the inner bar       |
   |                     |                      | (appended after ``progress-bar``). If omitted, the    |
   |                     |                      | default striped/animated style is used.               |
   +---------------------+----------------------+-------------------------------------------------------+

11.17.2. Runtime API
********************

.. code-block:: javascript

   // read current percentage (0-100)
   var pct = sysFactory.getObjectByID('MyProgressBar').getObjectData();

   // set percentage and re-render
   sysFactory.getObjectByID('MyProgressBar').setObjectData(75);

11.17.3. JSON Example
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

11.18. RangeSlider
------------------

The ``RangeSlider`` *x0-object-type* renders an HTML ``<input type="range">``
element styled with Bootstrap's ``form-range`` class. It exposes ``Min`` and
``Max`` configuration attributes and supports the standard
``getObjectData()`` / ``setObjectData()`` API so its current value can be read
from or written to by any other *x0-object* or button action.

11.18.1. Object Attributes
**************************

.. table:: Object Type RangeSlider Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Min                 | Number               | Minimum slider value (HTML ``min`` attribute)   |
   +---------------------+----------------------+-------------------------------------------------+
   | Max                 | Number               | Maximum slider value (HTML ``max`` attribute)   |
   +---------------------+----------------------+-------------------------------------------------+

11.18.2. Runtime API
********************

.. code-block:: javascript

   // read current slider value
   var val = sysFactory.getObjectByID('MySlider').getObjectData();

   // set slider value programmatically
   sysFactory.getObjectByID('MySlider').setObjectData(50);

11.18.3. JSON Example
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

11.19. RangeSliderContainer
---------------------------

The ``RangeSliderContainer`` *x0-object-type* wraps :ref:`objecttype-rangeslider` with
Min/Max/Unit labels and a disabled, auto-updating text field reflecting the current
value, composed as a single Bootstrap grid row. It inherits ``DivUnique`` and supports
the standard ``getObjectData()`` / ``setObjectData()`` API, delegating both to the
inner ``RangeSlider`` child.

11.19.1. Object Attributes
**************************

.. table:: Object Type RangeSliderContainer Attributes
   :widths: 15 15 70

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

11.19.2. JSON Example
*********************

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

11.20. HeaderBodyContainer
--------------------------

The ``HeaderBodyContainer`` *x0-object-type* sets up a two-row layout consisting of a
styled header row and a body row, each exposing a nested ``Div`` for child objects.
Child objects are attached using ``ElementID`` in ``skeleton.json``, where the
``ElementID`` is the container's own ``ObjectID`` suffixed with ``Header`` or
``Content``.

11.20.1. Object Attributes
**************************

.. table:: Object Type HeaderBodyContainer Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | HeaderStyle         | CSS-String           | CSS Style Classes for the header row            |
   +---------------------+----------------------+-------------------------------------------------+
   | BodyStyle           | CSS-String           | CSS Style Classes for the body row              |
   +---------------------+----------------------+-------------------------------------------------+

11.20.2. skeleton.json Example
******************************

.. code-block:: javascript

   "IntroductionContainerLeftHeaderText": { "RefID": "IntroductionContainerLeftHeader" },
   "IntroductionContainerLeftText":       { "RefID": "IntroductionContainerLeftContent" }

11.20.3. JSON Example
*********************

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

11.21. SystemSettingsContainer
------------------------------

The ``SystemSettingsContainer`` *x0-object-type* renders a list of labeled settings
rows, each pairing a ``TextID`` description with an arbitrary nested *x0-system-object*
(any entry of ``sysFactory.SetupClasses``, commonly ``FormfieldPulldown``,
``FormfieldCheckbox`` or :ref:`objecttype-rangeslider` /
:ref:`objecttype-rangeslidercontainer`), plus per-row "reset" and "save" controls. It
is the backing object for the static example's "Settings/Global Settings" screens.

11.21.1. Object Attributes
**************************

.. table:: Object Type SystemSettingsContainer Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Settings            | Array of Elements    | Array of Setting rows, see 11.21.2.             |
   +---------------------+----------------------+-------------------------------------------------+

11.21.2. Setting Element Attributes
***********************************

.. table:: SystemSettingsContainer Setting Element Attributes
   :widths: 15 15 70

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

11.21.3. JSON Example
*********************

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

11.21.4. Runnable Example
*************************

* Reachable via the static reference container's Main Menu under
  "Settings/Global Settings", Tab "Default Settings".

.. _objecttype-systemsettingscontainergrid:

11.22. SystemSettingsContainerGrid
----------------------------------

The ``SystemSettingsContainerGrid`` *x0-object-type* extends
:ref:`objecttype-systemsettingscontainer` with the Global Grid System
(see :ref:`appdevgridsystem`), rendering the same setting rows across one or more
selectable grid "variants". This is the live demonstrator referenced in
:ref:`appdevgridsystem`'s "Runtime Flexibility and Dynamic Restructuring" section: the
entire structural layout — not just column widths — can be toggled at runtime (e.g.
between a 3-column and a 6-column view), entirely client-side and without any backend
request.

11.22.1. Object Attributes
**************************

.. table:: Object Type SystemSettingsContainerGrid Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Settings            | Array of Elements    | Same schema as 11.21.2.                         |
   +---------------------+----------------------+-------------------------------------------------+
   | GridStyles          | Object               | ``{SelectorRowStyle}``, variant selector style  |
   +---------------------+----------------------+-------------------------------------------------+
   | GridGenerator       | Object               | ``sysGridGenerator`` config, see                |
   |                     |                      | :ref:`appdevgridsystem`                         |
   +---------------------+----------------------+-------------------------------------------------+

11.22.2. Runnable Example
*************************

* Reachable via the static reference container's Main Menu under
  "Settings/Global Settings", Tab "Default Settings", Subsection
  "Adjust Grid / Column View".

.. _objecttype-infoparagraph:

11.23. InfoParagraph
--------------------

The ``InfoParagraph`` *x0-object-type* renders a sequence of ``SQLText`` paragraphs
inside a single styled container, commonly used as an introductory info box at the
top of a screen or tab.

11.23.1. Object Attributes
**************************

.. table:: Object Type InfoParagraph Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Style               | CSS-String           | CSS Style Classes applied to the container      |
   +---------------------+----------------------+-------------------------------------------------+
   | Text                | Array of Elements    | Array of ``{ID, Style, IconStyle}`` paragraphs  |
   +---------------------+----------------------+-------------------------------------------------+

11.23.2. JSON Example
*********************

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

11.24. LanguageSwitch
---------------------

The ``LanguageSwitch`` *x0-object-type* renders a pulldown of the configured display
languages (see :ref:`appdevconfig-systemconfig`) next to an activation button.
Selecting a language and triggering the button updates ``sysFactory.EnvUserLanguage``
and re-renders every active ``SQLText`` object application-wide via
``sysFactory.updateLanguageObjectsGlobal()``, without a page reload.

11.24.1. Object Attributes
**************************

.. table:: Object Type LanguageSwitch Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Style               | CSS-String           | CSS Style Classes applied to the row container  |
   +---------------------+----------------------+-------------------------------------------------+
   | PulldownStyle       | CSS-String           | CSS Style Classes for the language pulldown     |
   +---------------------+----------------------+-------------------------------------------------+
   | ButtonStyle         | CSS-String           | CSS Style Classes for the activation button     |
   +---------------------+----------------------+-------------------------------------------------+

11.24.2. JSON Example
*********************

.. code-block:: javascript

   "SettingsLanguageSwitch":
   {
      "Type": "LanguageSwitch",
      "Attributes": {
         "Style": "row border rounded m-0 p-3 fw-bold"
      }
   }

.. _objecttype-dynradiolist:

11.25. DynRadioList
-------------------

The ``DynRadioList`` *x0-object-type* renders a dynamically growable list of radio
button rows, each paired with a text input. Clicking the trailing "add" control
appends a new row with its own "remove" control; right-clicking a removable row opens
a context menu offering the same removal action (see :ref:`appdevcontextmenu`).

11.25.1. Object Attributes
**************************

.. table:: Object Type DynRadioList Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | ButtonTextDisabled  | Boolean              | Hide add/remove button text, icon-only display  |
   +---------------------+----------------------+-------------------------------------------------+

11.25.2. JSON Example
*********************

.. code-block:: javascript

   "$ObjectID":
   {
      "Type": "DynRadioList",
      "Attributes": {
         "ButtonTextDisabled": false
      }
   }

.. _objecttype-serviceconnector:

11.26. ServiceConnector
-----------------------

The ``ServiceConnector`` *x0-object-type* binds a backend service call to a target
*x0-system-object* (typically a ``List``), triggering the call whenever one of the
configured system events fires (e.g. ``InitSystem``). Its full event-registration and
dispatch mechanics are documented in :ref:`devoopmodel` (section 23.8).

11.26.1. Object Attributes
**************************

.. table:: Object Type ServiceConnector Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | OnEvent.Events      | Array of EventIDs    | EventIDs triggering the service call            |
   +---------------------+----------------------+-------------------------------------------------+
   | OnEvent.ServiceCall | URL-String           | Backend Service URL                             |
   +---------------------+----------------------+-------------------------------------------------+
   | OnEvent.ServiceID   | String               | Optional Backend Service Identifier             |
   +---------------------+----------------------+-------------------------------------------------+

11.26.2. JSON Example
*********************

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

11.27. TimedProgress
--------------------

The ``TimedProgress`` *x0-object-type* is a user-space demonstrator object
(``/www/userObjExampleTimedProgress.js``) illustrating how the core
:ref:`objecttype-progressbar` primitive can be composed with
``sysFormfieldItemLabel`` and a callback-bound :ref:`objecttype-buttoninternal`
into a self-contained, periodically auto-incrementing progress indicator. It
inherits from ``sysObjDivUnique`` and is the first of several user-space
example objects located under ``/www/userObj*.js`` documented in this and the
following sections.

11.27.1. Object Attributes
**************************

.. table:: Object Type TimedProgress Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Interval            | Integer (ms)         | Auto-increment timer interval, in milliseconds  |
   +---------------------+----------------------+-------------------------------------------------+
   | IncreaseBy          | Integer              | Percentage increment applied on every interval  |
   +---------------------+----------------------+-------------------------------------------------+

11.27.2. JSON Example
*********************

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

11.28. ExampleWizard
--------------------

The ``ExampleWizard`` *x0-object-type* (``/www/userObjExampleWizard.js``)
demonstrates a step-controlled, multi-tab wizard pattern built on top of
:ref:`objecttype-tabcontainer` and :ref:`objecttype-progressbar`. It inherits
from ``sysObjDivUnique``, tracks the active step via an internal
``StepIndex``/``StepCount`` state pair and drives per-step form validation
through its ``ValidateForm`` array before allowing forward navigation.

11.28.1. Object Attributes
**************************

This object type currently accepts no configurable ``Attributes`` beyond the
common base properties; step tabs, navigation buttons and the validated
formfield-list IDs per step are wired internally.

11.28.2. JSON Example
*********************

.. code-block:: javascript

   "ExamplesBasicSlidersStepControlledWizard":
   {
      "Type": "ExampleWizard",
      "Attributes": {}
   }

.. _objecttype-exampleeditableitem:

11.29. ExampleEditableItem
--------------------------

The ``ExampleEditableItem`` *x0-object-type*
(``/www/userObjExampleEditableItemContainer.js``) renders a single, optionally
in-place editable row (image, header text and content text) used as the
per-row template of :ref:`objecttype-exampleeditableitemcontainer`. It
inherits from ``sysObjDivUnique`` and supports a switchable edit mode as well
as a switchable drag-reorder mode.

11.29.1. Object Attributes
**************************

.. table:: Object Type ExampleEditableItem Attributes
   :widths: 15 15 70

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

11.29.2. JSON Example
*********************

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

11.30. ExampleEditableItemContainer
-----------------------------------

The ``ExampleEditableItemContainer`` *x0-object-type*
(``/www/userObjExampleEditableItemContainer.js``) is the paginated container
counterpart to :ref:`objecttype-exampleeditableitem`. It inherits from
``sysObjDivUnique``, integrates a ``sysPagination`` instance and exposes the
common runtime data API (``SetDataMechanism: 'Plain'``,
``RuntimeSetDataFunc``/``RuntimeAppendDataFunc`` both routed through its
internal ``addItem()`` method) so new rows can be pushed in at runtime exactly
like :ref:`objecttype-list` rows.

11.30.1. Object Attributes
**************************

.. table:: Object Type ExampleEditableItemContainer Attributes
   :widths: 15 15 70

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

11.30.2. JSON Example
*********************

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

11.31. ExampleFlightDetails
---------------------------

The ``ExampleFlightDetails`` *x0-object-type*
(``/www/userObjExampleFlightData.js``) renders a single, read-only flight
summary row (airline icon, airline name, flight number and airport) from a
single ``Value`` object. It inherits from ``sysObjDivUnique`` and is typically
used as a repeated row inside a parent :ref:`objecttype-list` or
:ref:`objecttype-div` layout.

11.31.1. Object Attributes
**************************

.. table:: Object Type ExampleFlightDetails Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Value               | Object               | ``{Icon, Airline, FlightNr, Airport}``          |
   +---------------------+----------------------+-------------------------------------------------+

11.31.2. JSON Example
*********************

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

11.32. ExampleFlightStatus
--------------------------

The ``ExampleFlightStatus`` *x0-object-type*
(``/www/userObjExampleFlightData.js``) renders a status badge (colored
indicator circle, status type and time) sharing its parent file with
:ref:`objecttype-exampleflightdetails`. It inherits from ``sysObjDivUnique``
and derives both its border color and inner text color from the
``Value.Alert`` Bootstrap contextual-color keyword (for example ``success``,
``warning`` or ``danger``).

11.32.1. Object Attributes
**************************

.. table:: Object Type ExampleFlightStatus Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Value               | Object               | ``{Alert, Type, Time}``                         |
   +---------------------+----------------------+-------------------------------------------------+

11.32.2. JSON Example
*********************

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

11.33. ExampleCardTasklist
--------------------------

The ``ExampleCardTasklist`` *x0-object-type*
(``/www/userObjExampleCardTasklists.js``) implements a Kanban-style card with
badge selection, collaborator selection and one or more nested, independently
addable tasklists/tasks. It inherits from ``sysObjDivUnique`` and composes
:ref:`objecttype-image`, :ref:`objecttype-badgeselector` and
:ref:`objecttype-examplepeopleselector` internally; the card itself exposes
``selectBadges()``, ``selectColaborators()``, ``addTasklist()`` and
``saveData()`` callback-bound actions.

11.33.1. Object Attributes
**************************

.. table:: Object Type ExampleCardTasklist Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Style               | CSS-String           | CSS Style Classes, space separated              |
   +---------------------+----------------------+-------------------------------------------------+

11.33.2. JSON Example
*********************

.. code-block:: javascript

   "ExamplesBasicEditableTemplate2CardTasklists":
   {
      "Type": "ExampleCardTasklist"
   }

.. _objecttype-examplepeopleselector:

11.34. ExamplePeopleSelector
----------------------------

The ``ExamplePeopleSelector`` *x0-object-type*
(``/www/userObjExamplePeopleSelector.js``) renders a fixed, non-overridable
roster of selectable collaborator rows (each with an image, name and
localized text) inside a closable overlay-style header/body layout. It
inherits from ``sysObjDivUnique`` and is typically instantiated inside a
:ref:`screen overlay <appdevoverlay>`.

11.34.1. Object Attributes
**************************

.. table:: Object Type ExamplePeopleSelector Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Style               | CSS-String           | CSS Style Classes, space separated              |
   +---------------------+----------------------+-------------------------------------------------+

11.34.2. JSON Example
*********************

.. code-block:: javascript

   "OverlayGlobalCollaboratorsList":
   {
      "Type": "ExamplePeopleSelector"
   }

.. _object-examples:

11.35. Object Type Categories
-----------------------------

**Container Objects:**
  - :ref:`objecttype-div`
  - :ref:`objecttype-divunique`
  - :ref:`objecttype-divvalue`
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
  - :ref:`objecttype-buttoncallback`
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
  - :ref:`objecttype-systemsettingscontainer`
  - :ref:`objecttype-systemsettingscontainergrid`

**User-Defined Example Objects (/www/userObj\*.js):**
  - :ref:`objecttype-timedprogress`
  - :ref:`objecttype-examplewizard`
  - :ref:`objecttype-exampleeditableitem`
  - :ref:`objecttype-exampleeditableitemcontainer`
  - :ref:`objecttype-exampleflightdetails`
  - :ref:`objecttype-exampleflightstatus`
  - :ref:`objecttype-examplecardtasklist`
  - :ref:`objecttype-examplepeopleselector`
