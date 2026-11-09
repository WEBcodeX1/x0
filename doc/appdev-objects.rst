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
- :ref:`objecttype-infoparagraph`
- :ref:`objecttype-dynradiolist`

**Form-specific Objects**:

- See: :ref:`appdevformobjects`

**Backend Service:**

- :ref:`objecttype-serviceconnector`

**Systems Internal:**

- :ref:`objecttype-imageselector`
- :ref:`objecttype-badgeselector`
- :ref:`objecttype-systemsettingscontainer`
- :ref:`objecttype-systemsettingscontainergrid`
- :ref:`objecttype-languageswitch`

Additionally, the following custom object extensions illustrate how the core system
components can be composed into higher-level, **reusable building blocks**, serving as
a blueprint for **programmatically** building **custom** *x0-objects*.

- :ref:`objecttype-timedprogress`
- :ref:`objecttype-examplewizard`
- :ref:`objecttype-exampleeditableitem`
- :ref:`objecttype-exampleeditableitemcontainer`
- :ref:`objecttype-exampleflightdetails`
- :ref:`objecttype-exampleflightstatus`
- :ref:`objecttype-examplecardtasklist`
- :ref:`objecttype-examplepeopleselector`

These examples can be viewed immediately by starting the included *x0-static* Docker
container (see :ref:`installation-minimal`). Additional practical examples with detailed
descriptions can be found in the ``/examples/`` directory at the project root.

.. _objecttype-div:

11.1. Div
---------

The ``Div`` *x0-object-type* is one of the system's most fundamental base objects, even though
it provides only minimal functionality on its own. It generates a DOM layer with a configurable
CSS class attribute, using the outer HTML tag specified in ``DOMType`` (defaulting to ``div``
when omitted).

It should **never** be used directly in a **declarative configuration**—use ``DivUnique`` or
``DivValue`` instead. In **programmatic, custom** *x0-system-classes* the ``Div`` *x0-object-type*
exclusively is used as a **between-element** in a multi-nested hierarchy. This concept is described
in detail in the system-developers documentation under “Development Best Practices” :ref:`dev-object-nesting`.

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

   "ExampleDivObject":
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

The ``Text`` *x0-object-type* is used to render localized, multilingual strings within the
user interface. Rather than hardcoding text directly into the layout, this object resolves
text identifiers dynamically based on the active user language.

Depending on the deployment mode, the text content is retrieved from one of two sources:

- **Database Mode (Default):** In standard setups, strings are fetched directly from the
  ``webui.text`` table inside the *x0-system-db*.

- **Static / NoSQL Mode:** When running as a **static** *x0-component* without a live
  database connection, the object falls back to reading key-value pairs from the local
  ``/static/meta/text-data.json`` file.

.. important::
   For backward compatibility with legacy configurations, the ``Text`` object type can
   still be referenced under its former name ``SQLText``.

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

   "ExampleTextObject":
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

The ``Button`` *x0-object-type* is the most important component regarding control flows and
object interactions. There are two derived types, ``ButtonInternal`` and ``ButtonCallback``;
the following explains their purpose and how they differ.

The ``Button`` type is **service-centric** and **always** connected to backend interactions,
whereas ``ButtonInternal``—as its name suggests—is used exclusively for internal system
interactions. Both ``Button`` and ``ButtonInternal`` can be used **declaratively** in
``object.json``.

The ``ButtonCallback`` type is **only** used for **programmatic**, custom *x0-object*
development.

By default, the ``DOMType`` for a ``Button`` is an HTML-compliant ``button``, though it can
be overridden. For example, to make it look like a link, you can set ``DOMType`` to ``a`` or
any other valid tag. Because its internal click mechanism is attached via an event handler,
the outer HTML tag does not affect functionality. By setting ``DOMValue``, you can override
the ``innerHTML`` completely. Setting ``FormButton`` renders it as an HTML form-compliant
``<input type="button">`` usable inside HTML ``<form>`` tags.

Setting ``Disabled`` to ``true`` initializes the button in a disabled state. Providing a
``TextID`` displays a localized, multilingual text label, while ``IconStyle`` **or**
``IconStylePost`` adds Font Awesome icons.

The ``OnClick`` property must contain a valid HTTP(S) URL to execute a backend service upon
clicking. In ``SrcDataObjects``, the global x0 *Source Data Objects* mechanism is used to
specify runtime data selectively (see :ref:`appdevcontrolflow`). When triggered, this metadata
is fetched in real time and appended to the backend service POST request JSON.

The ``Notify`` object structure defines how the button interacts with the notification
indication system.

Control flow is managed via ``Action``, ``OnResult``, and ``FireEvents``: ``Action`` triggers
actions **before** service execution, ``OnResult`` triggers actions **after successful**
execution, and ``FireEvents`` dispatches *x0-events* to interact with the internal event system.

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
   | SrcDataObjects      | Type dependend       | Generic *Source Data Objects* Integration       |
   +---------------------+----------------------+-------------------------------------------------+
   | Notify              | Object               | Notify Indicator Configuration                  |
   +---------------------+----------------------+-------------------------------------------------+
   | Action              | Array of Actions     | Actions **before** Service Execution            |
   +---------------------+----------------------+-------------------------------------------------+
   | OnResult            | Array of Actions     | Actions **after** Service Execution             |
   +---------------------+----------------------+-------------------------------------------------+
   | FireEvents          | Array of EventIDs    | Array of EventIDs / Reactor Integration         |
   +---------------------+----------------------+-------------------------------------------------+

11.3.2. Actions / OnResult
**************************

Note that specifying ``Action`` or ``OnResult`` actions requires mandatory base properties to be set.

See :ref:`event-actions`.

.. _objecttype-buttoninternal:

11.4. ButtonInternal
--------------------

The ``ButtonInternal`` *x0-object-type* inherits from ``Button``. The main difference is that it
lacks backend functionality; otherwise, its behavior is identical.

11.4.1. Object Attributes
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
   | Notify              | Object               | Notify Indicator Configuration                  |
   +---------------------+----------------------+-------------------------------------------------+
   | Action              | Array of Actions     | Actions executed                                |
   +---------------------+----------------------+-------------------------------------------------+
   | FireEvents          | Array of EventIDs    | Array of EventIDs / Reactor Integration         |
   +---------------------+----------------------+-------------------------------------------------+

.. _objecttype-buttoncallback:

11.5. ButtonCallback
--------------------

``ButtonCallback`` is intended **only** for **programmatically** building **custom** *x0-objects*.
It is used inside an object's class model to react to *single* or *multiple* defined actions
within its ``ButtonCallback()`` method whenever a button is clicked.

The implementer must distinguish between the **button definition**—where the callback and target
function identifier are *registered*—and the **usage** inside the ``ButtonCallback()`` method.

11.5.1. Definition
******************

To define two buttons that will invoke the ``ButtonCallback()`` method when clicked,
do the following:

.. code-block:: javascript

   //- setup move up button
   this.MoveUpButton = new sysObjButtonCallback();
   this.MoveUpButton.overrideDOMObjectID = true;
   this.MoveUpButton.setCallback(this, 'moveUp');
   this.addObject(this.MoveUpButton);

   //- setup move down button
   this.MoveDownButton = new sysObjButtonCallback();
   this.MoveDownButton.overrideDOMObjectID = true;
   this.MoveDownButton.setCallback(this, 'moveDown');
   this.addObject(this.MoveDownButton);

11.5.2. Usage
*************

To process and distinguish between the triggered button actions, implement the ``ButtonCallback()``
method on your custom object:

.. code-block:: javascript

   userObject.prototype.ButtonCallback = function(FunctionID)
   {
      if (FunctionID == 'moveUp')
      {
         this.moveItemUp();
      }
      else if (FunctionID == 'moveDown')
      {
         this.moveItemDown();
      }
   };

.. _objecttype-image:

11.6. Image
-----------

The ``Image`` *x0-object-type* renders an HTML ``<img>`` element. Its ``DOMType`` is
fixed to ``img`` and should not be altered. Its source path can be read and updated at
runtime through the standard ``getObjectData()`` / ``setObjectData()`` API.

.. warning::
   The data abstraction model (declarative as well as programmatic) will **change** for
   the ``Image`` *x0-object-type* in later *x0-versions*, because it does not meet the
   criteria for a 100% generic approach.

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

11.6.2. JSON Example
********************

.. code-block:: javascript

   "ExampleImageObject":
   {
      "Type": "Image",
      "Attributes":
      {
         "Value": "/image/x0-logo.png",
         "Width": "80px",
         "Height": "80px",
         "Style": "border rounded"
      }
   }

11.6.3. Programmatic Implementation
***********************************

.. code-block:: javascript

   // read current image source
   const src = sysFactory.getObjectByID('MyImage').getObjectData();

   // swap the image source and re-render
   sysFactory.getObjectByID('MyImage').setObjectData('/image/other.png');

.. _objecttype-imageselector:

11.7. ImageSelector
-------------------

The ``ImageSelector`` *x0-object-type* renders a paginated, scrollable picker listing
a set of images (ID, description and path per row), each with a "select" action. It
inherits :ref:`objecttype-divunique` and composes :ref:`objecttype-image`,
``FileUpload`` and ``FormfieldList`` child objects to additionally offer an inline
upload form for registering new images. Row pagination reuses the same mechanism as
:ref:`objecttype-list`.

.. important::
   This object's implementation demonstrates how to **programmatically** integrate the
   *x0-object-type* ``FormfieldList``.

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

   "ExampleImageSelector":
   {
      "Type": "ImageSelector",
      "Attributes": {
         "RowCount": 3,
         "Value":
         [
            { "ID": "UTF-Emoji-Clock", "Description": "Clock Icon", "Path": "/image/icon-emoji-clock.png" },
            { "ID": "UTF-Emoji-Truck", "Description": "Truck Icon", "Path": "/image/icon-emoji-truck.png" },
            { "ID": "UTF-Emoji-Package", "Description": "Package Icon", "Path": "/image/icon-emoji-package.png" },
            { "ID": "UTF-Emoji-Beer", "Description": "Beer Icon", "Path": "/image/icon-emoji-beer.png" },
            { "ID": "UTF-Emoji-Houses", "Description": "Houses Icon", "Path": "/image/icon-emoji-houses.png" }
         ]
      }
   }

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

   "ExampleBadgeSelector":
   {
      "Type": "BadgeSelector"
   }

.. _objecttype-list:

11.9. List
----------

The ``List`` *x0-object-type* renders a table-like, grid-based structure built on
Bootstrap's Grid CSS, deliberately avoiding the legacy ``<table><tr><td>`` HTML syntax
in favor of a modern, responsive layout. Internally, every row is a dedicated
``sysListRow`` instance that composes the configured ``Column`` cells and participates
in the same recursive object hierarchy as any other *x0-system-object*, so individual
cells may hold arbitrarily complex nested objects rather than plain text.

Beyond static tabular display, ``List`` directly integrates two further x0 subsystems:
*x0-context-menu* for per-row and multi-row interaction (see :ref:`appdevcontextmenu`),
and *x0-realtime-container* semantics for incremental, backend-driven row updates. When
``Navigation`` is enabled, pagination is delegated to the same generic ``sysPagination``
mechanism documented in :ref:`realtime-pagination`, toggling already-rendered rows
between pages without a backend reload. Newly appended rows (for example, submitted via
a linked ``FormfieldList``) are validated through the optional ``DoubleCheckColumn`` and
``ValidateColumnRegEx`` mechanisms, with user-facing feedback routed through a referenced
``ErrorContainer``.

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
   | DisableHeader       | Boolean              | Suppress rendering of the header row            |
   +---------------------+----------------------+-------------------------------------------------+
   | RowCount            | Integer              | Table Row Count                                 |
   +---------------------+----------------------+-------------------------------------------------+
   | RowSelectable       | Boolean              | Row / Multirow / Context Menu selectable        |
   +---------------------+----------------------+-------------------------------------------------+
   | Navigation          | Boolean              | Pagination / Navigation enabled                 |
   +---------------------+----------------------+-------------------------------------------------+
   | ErrorContainer      | ObjectID-String      | Error Container Object Reference                |
   +---------------------+----------------------+-------------------------------------------------+
   | DataMaxRows         | Integer              | Maximum Row Count accepted on append            |
   +---------------------+----------------------+-------------------------------------------------+
   | DoubleCheckColumn   | String               | Column checked for duplicate values on append   |
   +---------------------+----------------------+-------------------------------------------------+
   | ValidateColumnRegEx | Object               | Per-Column ``{RegexTemplate, ErrorMsg}`` checks |
   +---------------------+----------------------+-------------------------------------------------+
   | ContextMenuItems    | Array of Items       | Row Context Menu Entries, see 11.9.5.           |
   +---------------------+----------------------+-------------------------------------------------+
   | HeaderContextMenuItems | Array of Items    | Header Context Menu Entries, see 11.9.5.        |
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

When bound to an :ref:`objecttype-serviceconnector`, the backend service must return
the following JSON array to populate table cell data; each element's keys correlate to
the configured ``Column`` IDs (``col1``, ``col2``, ...) and are appended row-by-row
into the list's internal ``RuntimeData`` array on service execution.

.. code-block:: javascript

   [
      { "id": "1", "col1": "row1-1", "col2": "row1-2" },
      { "id": "2", "col1": "row2-1", "col2": "row2-2" },
      { "id": "3", "col1": "row3-1", "col2": "row3-2" },
      { "id": "4", "col1": "row4-1", "col2": "row4-2" }
   ]

11.9.7. Runtime Features
************************

``List`` supports the standard ``getObjectData()`` / ``setObjectData()`` runtime
contract:

.. table:: Object Type List Runtime Methods
   :widths: 25 75

   +---------------------------+------------------------------------------------------------------------+
   | **Mechanism**             | **Description**                                                        |
   +===========================+========================================================================+
   | RuntimeGetDataFunc        | Returns the full ``RuntimeData`` array as currently rendered           |
   +---------------------------+------------------------------------------------------------------------+
   | RuntimeSetDataFunc        | Validates and appends a single new row (``DataMaxRows``,               |
   |                           | ``DoubleCheckColumn`` and ``ValidateColumnRegEx`` are enforced here),  |
   |                           | then re-renders the page                                               |
   +---------------------------+------------------------------------------------------------------------+

.. _objecttype-tabcontainer:

11.10. TabContainer
-------------------

11.10. TabContainer
-------------------

The ``TabContainer`` *x0-object-type* organizes content into separate tabs within a single view,
allowing users to switch seamlessly between different panels. Each tab can hold its own complete
object hierarchy; selecting a tab activates and displays its hierarchy while automatically disabling
and hiding the content of all other tabs. Because inactive tabs are simply disabled rather than
destroyed and recreated, the state of every child object within each tab is preserved across
all other interactions, including switching to a different *x0-screen*.

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

The ``FileUpload`` *x0-object-type* renders a ``multipart/form-data`` file-selection
control paired with a visual upload progress indicator, composed internally of a
callback-bound ``ButtonCallback`` trigger and a nested :ref:`objecttype-progressbar`.
Invoking ``startUpload()`` dispatches an asynchronous ``XMLHttpRequest`` POST request to
``UploadScript``. Upload progress events update the inner progress bar in real time via
``updateProgress()``, while the object's ``Status`` transitions through
``init`` → ``uploading`` → ``success`` / ``failed`` → ``finished`` as the request resolves.
Upon successful completion, an optional ``FireEvents`` array triggers *x0-reactor*-based
interactions in dependent objects, such as a backend data update.

11.11.1. Object Attributes
**************************

.. table:: Object Type FileUpload Attributes
   :widths: 15 15 70

   +----------------------------+----------------------+------------------------------------------+
   | **Property**               | **Type**             | **Description**                          |
   +============================+======================+==========================================+
   | Style                      | CSS-String           | CSS Style Classes, space separated       |
   +----------------------------+----------------------+------------------------------------------+
   | StyleSelectButton          | CSS-String           | CSS Style Classes for the file input     |
   +----------------------------+----------------------+------------------------------------------+
   | UploadScript               | URL-String           | POST Upload URL                          |
   +----------------------------+----------------------+------------------------------------------+
   | FireEvents                 | Array of EventIDs    | On Successful Upload trigger Data reload |
   +----------------------------+----------------------+------------------------------------------+

.. _objecttype-errorcontainer:

11.12. ErrorContainer
---------------------

The ``ErrorContainer`` *x0-object-type* provides a dedicated container for displaying
informational and error messages anywhere within the application layout. Because it is
completely decoupled from the objects that trigger it, an ``ErrorContainer`` can be
placed at any desired position in the view hierarchy. Although ``ErrorContainer`` defines
no attributes of its own, any other *x0-object* can declaratively bind to it by referencing
its ``ObjectID`` in that object's ``ErrorContainer`` attribute—primarily :ref:`objecttype-button`
and :ref:`objecttype-buttoninternal` for form validation errors, as well as :ref:`objecttype-list`
for runtime column append errors. Refer to the individual documentation for each of these objects
to see how to declaratively configure their interaction with ``ErrorContainer``, including how to
define localized error messages across multiple languages.

11.12.1. Object Attributes
**************************

None.

11.12.2. JSON Example
*********************

.. code-block:: javascript

   "$ObjectID":
   {
      "Type": "ErrorContainer",
      "Attributes": {}
   }

.. _objecttype-openclosecontainer:

11.13. OpenCloseContainer
-------------------------

The ``OpenCloseContainer`` *x0-object-type* renders a Bootstrap card with a styled header
row and a collapsible body, letting users expand or collapse a section to manage screen
real estate without losing its contents. The body is a nested ``Div`` whose
``VisibleState`` is toggled between ``visible`` and ``hidden`` by ``toggleVisibleState()``
— bound to a FontAwesome caret icon click — so any child *x0-system-object* placed inside
remains fully initialized and continues to hold its state while collapsed. The initial
``StateOpen`` attribute controls whether the body starts expanded or collapsed when the
screen is first rendered.

11.13.1. Object Attributes
**************************

.. table:: Object Type OpenCloseContainer Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Style               | CSS-String           | CSS Style Classes, space separated              |
   +---------------------+----------------------+-------------------------------------------------+
   | HeaderStyle         | CSS-String           | CSS Style Classes applied to the header row     |
   +---------------------+----------------------+-------------------------------------------------+
   | TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
   +---------------------+----------------------+-------------------------------------------------+
   | IconStyle           | CSS-String           | Fontawesome Icon CSS for the header text        |
   +---------------------+----------------------+-------------------------------------------------+
   | StateOpen           | Boolean              | Initial expanded (``true``) / collapsed state   |
   +---------------------+----------------------+-------------------------------------------------+

11.13.2. JSON Example
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
         "TextID": "TXT.SECTION.ADVANCED.SETTINGS",
         "StateOpen": false
      }
   }

.. _objecttype-treesimple:

11.14. TreeSimple
-----------------

The ``TreeSimple`` *x0-object-type* renders a hierarchical, Bootstrap list-group tree of
expandable/collapsible ``Node`` elements and interactive, navigation-triggering ``Item``
elements, each carrying its own FontAwesome icon. Clicking a node's folder icon toggles
its own ``Children`` container between expanded and collapsed without affecting tree
state elsewhere; clicking an item's link instead invokes ``sysFactory.switchScreen()``
against its configured ``DstScreenID`` and visually hi-lites the clicked row, replacing
the style on whichever item (tracked via the tree root's ``LastSelectedItem`` reference)
was previously selected. Rows are additionally hi-lited on ``mouseover``/``mouseout`` for
immediate visual feedback, independent of the persisted selection state.

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
   | DstScreenID         | ScreenID-String      | Target Screen for navigation                    |
   +---------------------+----------------------+-------------------------------------------------+

11.14.4. JSON Example
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
                     "DstScreenID": "Screen1"
                  },
                  {
                     "Type": "Item",
                     "TextID": "TXT.ITEM2",
                     "Icon": "fa-solid fa-lightbulb",
                     "DstScreenID": "Screen2"
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
                           "DstScreenID": "Screen3"
                        }
                     ]
                  }
               ]
            }
         ]
      }
   }

.. _objecttype-divunique:

11.15. DivUnique
----------------


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

   +---------------------+------------------------------------------------------------------------+
   | **Method**          | **Description**                                                        |
   +=====================+========================================================================+
   | setValue(Data)      | Sets ``Value``/``DOMValue`` and refreshes the rendered DOM             |
   +---------------------+------------------------------------------------------------------------+
   | getValue()          | Returns the current, rendered DOM value                                |
   +---------------------+------------------------------------------------------------------------+

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
the standard ``getObjectData()`` / ``setObjectData()`` API so its current value
can be read from or written to by any other *x0-object* or button action.

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
the standard ``getObjectData()`` / ``setObjectData()`` API.

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
*x0-system-object* (typically a ``List`` or a ``FormfieldList``), triggering the call
whenever one of the configured system events fires (e.g. ``InitSystem``). Its full
event-registration and dispatch mechanics are documented in :ref:`devoopmodel`.

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
inherits from ``sysObjDivUnique`` and supports a switchable edit mode.

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
:ref:`appdevoverlay`.

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
  - :ref:`objecttype-text`
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
