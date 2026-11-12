.. appdev-objects

.. _system-objects:

11. System Objects
==================

Currently, the following *x0-system-objects* can be used **declaratively** inside
``object.json`` and **programmatically** in custom *x0-objects*.

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

- See: :ref:`form-objects`

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

The ``Div`` *x0-object-type* is one of the system's most fundamental base
objects, even though it provides only minimal functionality on its own. It
generates a DOM layer with a configurable CSS class attribute, using the outer
HTML tag specified in ``DOMType`` (defaulting to ``div`` when omitted).

It should **never** be used directly in a **declarative configuration**—use
``DivUnique`` or ``DivValue`` instead. In **programmatic, custom**
*x0-system-classes*, the ``Div`` *x0-object-type* is used exclusively as an
**intermediate element** in nested hierarchies. This concept is described
in detail in the System Developer Documentation under :ref:`dev-object-nesting`.

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
   | Value               | String               | Value (innerHTML)                               |
   +---------------------+----------------------+-------------------------------------------------+

.. _objecttype-text:

11.2. Text
----------

The ``Text`` *x0-object-type* is used to render localized, multilingual strings
within the user interface. Rather than hardcoding text directly into the
layout, this object resolves text identifiers dynamically based on the active
user language.

Depending on the deployment mode, the text content is retrieved from one of two
sources:

- **Database Mode (Default):** In standard setups, strings are fetched directly
  from the ``webui.text`` table inside the *x0-system-db*.

- **Static / NoSQL Mode:** When running as a **static** *x0-component* without a
  live database connection, the object falls back to reading key-value pairs from
  the local ``/static/meta/text-data.json`` file.

.. important::
   For backward compatibility with legacy configurations, the ``Text`` object type
   can still be referenced under its former name ``SQLText``.

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
   | IconStyle           | CSS-String           | Font Awesome Icon CSS for Prepend Icon          |
   +---------------------+----------------------+-------------------------------------------------+
   | IconStylePost       | CSS-String           | Font Awesome Icon CSS for Append Icon           |
   +---------------------+----------------------+-------------------------------------------------+
   | TextID              | TextID-String        | TextID referenced in ``webui.text`` DB Table    |
   +---------------------+----------------------+-------------------------------------------------+

11.2.2. JSON Examples
*********************

.. code-block:: json

   {
      "ExampleText":
      {
         "Type": "Text",
         "Attributes":
         {
            "Style": "css1 css2",
            "TextID": "TXT.TEST.NR1"
         }
      }
   }

.. _objecttype-button:

11.3. Button
------------

The ``Button`` *x0-object-type* is the most important component regarding
control flows and object interactions. There are two derived types,
``ButtonInternal`` and ``ButtonCallback``; the following explains their purpose
and how they differ.

The ``Button`` type is **service-centric** and **always** connected to backend
interactions, whereas ``ButtonInternal``—as its name suggests—is used
exclusively for internal system interactions. Both ``Button`` and
``ButtonInternal`` can be used **declaratively** in ``object.json``.

The ``ButtonCallback`` type is **only** used for **programmatic**, custom
*x0-object* development.

By default, the ``DOMType`` for a ``Button`` is an HTML-compliant ``button``,
though it can be overridden. For example, to make it look like a link, you can
set ``DOMType`` to ``a`` or any other valid tag. Because its internal click
mechanism is attached via an event handler, the outer HTML tag does not affect
functionality. By setting ``DOMValue``, you can override the ``innerHTML``
completely. Setting ``FormButton`` renders it as an HTML form-compliant ``<input
type="button">`` usable inside HTML ``<form>`` tags.

Setting ``Disabled`` to ``true`` initializes the button in a disabled state.
Providing a ``TextID`` displays a localized, multilingual text label, while
``IconStyle`` **or** ``IconStylePost`` adds Font Awesome icons.

The ``OnClick`` property must contain a valid HTTP(S) URL to execute a backend
service upon clicking. In ``SrcDataObjects``, the global x0 *Source Data
Objects* mechanism is used to specify runtime data selectively (see
:ref:`sourcedata-objects`). When triggered, this metadata is fetched in realtime
and appended to the backend service POST request JSON.

The ``Notify`` object structure defines how the button interacts with the
notification indication system.

Control flow is managed via ``Action``, ``OnResult``, and ``FireEvents``:
``Action`` triggers actions **before** service execution, ``OnResult`` triggers
actions **after successful** execution, and ``FireEvents`` dispatches
*x0-events* to interact with the internal event system.

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
   | IconStyle           | CSS-String           | Font Awesome Icon CSS for Prepend Icon          |
   +---------------------+----------------------+-------------------------------------------------+
   | IconStylePost       | CSS-String           | Font Awesome Icon CSS for Append Icon           |
   +---------------------+----------------------+-------------------------------------------------+
   | FormButton          | Boolean              | Treat Button as HTML form input type "button"   |
   +---------------------+----------------------+-------------------------------------------------+
   | Disabled            | Boolean              | Disable Functionality Initially                 |
   +---------------------+----------------------+-------------------------------------------------+
   | TextID              | TextID-String        | TextID referenced in ``webui.text`` DB Table    |
   +---------------------+----------------------+-------------------------------------------------+
   | OnClick             | URL-String           | Backend Service URL                             |
   +---------------------+----------------------+-------------------------------------------------+
   | SrcDataObjects      | Type dependent       | Generic *Source Data Objects* Integration       |
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

Note that specifying ``Action`` or ``OnResult`` actions requires mandatory base
``Attributes`` to be set (see :ref:`event-actions`).

11.3.3. JSON Examples
*********************

.. code-block:: json

   {
      "ExampleButton":
      {
         "Type": "Button",
         "Attributes":
         {
            "TextID": "TXT.BUTTON1",
            "Style": "btn btn-primary btn-lg w-100 mt-3",
            "IconStyle": "fa-solid fa-floppy-disk",
            "OnClick": "/python/saveSettings.py",
            "RequestMethod": "POST",
            "Notify": {
               "ID": "SaveSystemSettings",
               "DisplayHeaderID": "TXT.NOTIFYMSG.SAVE_SYSTEMSETTINGS"
            }
         }
      }
   }

.. _objecttype-buttoninternal:

11.4. ButtonInternal
--------------------

The ``ButtonInternal`` *x0-object-type* inherits from ``Button``. The main difference
is that it lacks backend functionality; otherwise, its behavior is identical.

11.4.1. Object Attributes
*************************

.. table:: Object Type ButtonInternal Attributes
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
   | IconStyle           | CSS-String           | Font Awesome Icon CSS for Prepend Icon          |
   +---------------------+----------------------+-------------------------------------------------+
   | IconStylePost       | CSS-String           | Font Awesome Icon CSS for Append Icon           |
   +---------------------+----------------------+-------------------------------------------------+
   | FormButton          | Boolean              | Treat Button as HTML form input type "button"   |
   +---------------------+----------------------+-------------------------------------------------+
   | Disabled            | Boolean              | Disable Functionality Initially                 |
   +---------------------+----------------------+-------------------------------------------------+
   | TextID              | TextID-String        | TextID referenced in ``webui.text`` DB Table    |
   +---------------------+----------------------+-------------------------------------------------+
   | Notify              | Object               | Notify Indicator Configuration                  |
   +---------------------+----------------------+-------------------------------------------------+
   | Action              | Array of Actions     | Actions executed                                |
   +---------------------+----------------------+-------------------------------------------------+
   | FireEvents          | Array of EventIDs    | Array of EventIDs / Reactor Integration         |
   +---------------------+----------------------+-------------------------------------------------+

11.4.2. JSON Examples
*********************

.. code-block:: json

   {
      "ExampleButtonInternal":
      {
         "Type": "ButtonInternal",
         "Attributes":
         {
            "TextID": "TXT.BUTTON.EXAMPLE1",
            "Style": "btn btn-primary w-100 mt-2 mb-2",
            "IconStylePost": "fa-solid fa-arrow-down",
            "Action": "append",
            "SrcDataObject": "SourceObjectID",
            "DstDataObject": "DestinationObjectID"
         }
      }
   }

.. _objecttype-buttoncallback:

11.5. ButtonCallback
--------------------

``ButtonCallback`` is intended **only** for **programmatically** building
**custom** *x0-objects*. It is used inside an object's class model to react to
*single* or *multiple* defined actions within its ``ButtonCallback()`` method
whenever a button is clicked.

The implementer must distinguish between the **button definition**—where the
callback and target function identifier are *registered*—and the **usage**
inside the ``ButtonCallback()`` method.

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

To process and distinguish between the triggered button actions, implement the
``ButtonCallback()`` method on your custom object:

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

The ``Image`` *x0-object-type* renders an HTML ``<img>`` element. Its ``DOMType``
is fixed to ``img`` and should not be altered. Its source path can be read and
updated at runtime through the standard ``getObjectData()`` /
``setObjectData()`` API.

.. warning::
   The data abstraction model (declarative as well as programmatic) will
   **change** for the ``Image`` *x0-object-type* in later *x0-versions*, because
   it does not meet the criteria for a 100% generic approach.

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

11.6.2. JSON Examples
*********************

.. code-block:: json

   {
      "ExampleImage":
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

The ``ImageSelector`` *x0-object-type* renders a paginated, scrollable picker
listing a set of images (ID, description and path per row), each with a
"select" action. It inherits :ref:`objecttype-divunique` and composes
:ref:`objecttype-image`, ``FileUpload`` and ``FormfieldList`` child objects to
additionally offer an inline upload form for registering new images. Row
pagination reuses the same mechanism as :ref:`objecttype-list`.

.. tip::
   This object's implementation demonstrates how to **programmatically**
   integrate the *x0-object-type* ``FormfieldList``.

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

11.7.2. JSON Examples
*********************

.. code-block:: json

   {
      "ExampleImageSelector":
      {
         "Type": "ImageSelector",
         "Attributes":
         {
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

11.8.2. JSON Examples
*********************

.. code-block:: json

   {
      "ExampleBadgeSelector":
      {
         "Type": "BadgeSelector"
      }
   }

.. _objecttype-list:

11.9. List
----------

The ``List`` *x0-object-type* renders a table-like, grid-based structure using
the internal *x0-grid* component (see :ref:`grid-system`) to provide a
modern, flexible, and responsive layout. Internally, every row is a dedicated
``sysListRow`` instance that composes the configured ``Column`` cells and
participates in the same recursive object hierarchy as any other *x0-object*,
so individual cells may hold arbitrarily complex nested objects rather than
plain text.

Beyond static tabular display, ``List`` declaratively integrates the
*x0-context-menu* for **per-row** (remove) and **multi-row** (remove selected)
interactions (see :ref:`context-menu`). When ``Navigation`` is enabled,
pagination is delegated to the same generic ``sysPagination`` mechanism
documented in :ref:`realtime-pagination`, toggling already-rendered rows
between pages without a backend reload.

It also supports runtime data manipulation via ``getObjectData()`` /
``setObjectData()`` to append rows in realtime, e.g., by using *x0-actions* in
``Button`` or ``ButtonInternal`` *x0-object-types* **or** by using
*x0-context-menu* configuration.

When specifying the ``ErrorContainer`` attribute, occurring errors—such as
exceeding the maximum allowed row count—will trigger the error output there.
Like any other *x0-object-types* supporting ``ServiceConnector`` integration,
the ``List`` can be populated with data on an occurring *x0-event* (e.g., on
system initialization or a runtime ``Button`` or ``ButtonInternal`` click).

11.9.1. Object Attributes
*************************

.. table:: Object Type List Attributes
   :widths: 15 15 70

   +------------------------+----------------------+-------------------------------------------------+
   | **Property**           | **Type**             | **Description**                                 |
   +========================+======================+=================================================+
   | Style                  | CSS-String           | CSS Style Classes, space separated              |
   +------------------------+----------------------+-------------------------------------------------+
   | HeaderRowStyle         | CSS-String           | CSS Style Classes, space separated              |
   +------------------------+----------------------+-------------------------------------------------+
   | DisableHeader          | Boolean              | Suppress rendering of the header row            |
   +------------------------+----------------------+-------------------------------------------------+
   | RowCount               | Integer              | Table Row Count                                 |
   +------------------------+----------------------+-------------------------------------------------+
   | RowSelectable          | Boolean              | Row / Multirow / Context Menu selectable        |
   +------------------------+----------------------+-------------------------------------------------+
   | Navigation             | Boolean              | Pagination / Navigation enabled                 |
   +------------------------+----------------------+-------------------------------------------------+
   | ErrorContainer         | ObjectID-String      | Error Container Object Reference                |
   +------------------------+----------------------+-------------------------------------------------+
   | DataMaxRows            | Integer              | Maximum Row Count accepted on append            |
   +------------------------+----------------------+-------------------------------------------------+
   | DoubleCheckColumn      | String               | Column checked for duplicate values on append   |
   +------------------------+----------------------+-------------------------------------------------+
   | ValidateColumnRegEx    | Object               | Per-Column ``{RegexTemplate, ErrorMsg}`` checks |
   +------------------------+----------------------+-------------------------------------------------+
   | ContextMenuItems       | Array of Items       | Row Context Menu Entries, see 11.9.5.           |
   +------------------------+----------------------+-------------------------------------------------+
   | HeaderContextMenuItems | Array of Items       | Header Context Menu Entries, see 11.9.5.        |
   +------------------------+----------------------+-------------------------------------------------+

11.9.2. Column Attributes
*************************

.. table:: Object Type List Column Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | ID                  | ID-String            | Column ID, also DB Column Reference             |
   +---------------------+----------------------+-------------------------------------------------+
   | HeaderTextID        | TextID-String        | TextID referenced in ``webui.text`` DB Table    |
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

Global Grid Attributes can be applied, see :ref:`grid-system`.

11.9.5. Context Menu
********************

Global Context Menu Attributes can be applied, see :ref:`context-menu`.

11.9.6. Backend JSON Schema
***************************

When bound to an :ref:`objecttype-serviceconnector`, the backend service must return
the following JSON array to populate table cell data; each element's keys correlate to
the configured ``Column`` IDs (``col1``, ``col2``, ...) and are appended row-by-row
into the list's internal ``RuntimeData`` array on service execution.

.. code-block:: json

   [
      { "id": "1", "col1": "row1-1", "col2": "row1-2" },
      { "id": "2", "col1": "row2-1", "col2": "row2-2" },
      { "id": "3", "col1": "row3-1", "col2": "row3-2" },
      { "id": "4", "col1": "row4-1", "col2": "row4-2" }
   ]

.. _objecttype-tabcontainer:

11.10. TabContainer
-------------------

The ``TabContainer`` *x0-object-type* organizes content into side-by-side
rendered ``Tab`` instances, where each single tab can display a multilingual
description and, optionally, a Font Awesome icon. Every single ``Tab`` can hold
its own complete object hierarchy; selecting a tab activates and displays its
hierarchy while automatically disabling and hiding the content of all other
``Tab`` instances. Because inactive tabs are simply disabled rather than
destroyed and recreated, the state of every child object within each tab is
preserved across all other interactions, including switching to a different
*x0-screen*.

.. code-block:: text

   +---------+---------+---------+
   | Tab1    | Tab2    | Tab3    |
   +---------+---------+---------+
       |         |         |
    ObjRef1   ObjRef3    ObjRef4
    ObjRef2              ObjRef5

To **connect** a single object to a single ``Tab``, reference the object inside
``skeleton.json`` using the Tab ObjectID suffixed with ``Content`` (see section
11.10.3 for a working example).

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

.. table:: Object Type Tab Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | ID                  | String               | Tab Identifier                                  |
   +---------------------+----------------------+-------------------------------------------------+
   | Default             | Boolean              | Default "selected" Tab                          |
   +---------------------+----------------------+-------------------------------------------------+
   | TextID              | TextID-String        | TextID referenced in ``webui.text`` DB Table    |
   +---------------------+----------------------+-------------------------------------------------+
   | Style               | CSS-String           | CSS Style Classes, space separated              |
   +---------------------+----------------------+-------------------------------------------------+

11.10.3. Example
****************

In ``object.json``, declaratively configure the ``Tab`` and two example ``DivUnique``
instances:

.. code-block:: json

   {
      "ExampleTabcontainer":
      {
         "Type": "TabContainer",
         "Attributes":
         {
            "Tabs":
            [
               {
                  "ID": "Tab1",
                  "Attributes":
                  {
                     "TextID": "TXT.TABCONTAINER.NUMBER1",
                     "Style": "col-md-6",
                     "IconStyle": "fa-solid fa-hourglass-half",
                     "Default": true
                  }
               },
               {
                  "ID": "Tab2",
                  "Attributes":
                  {
                     "TextID": "TXT.TABCONTAINER.NUMBER2",
                     "Style": "col-md-6",
                     "IconStyle": "fa-solid fa-link"
                  }
               }
            ]
         }
      },
      "DivContent1":
      {
         "Type": "DivUnique",
         "Attributes":
         {
            "Value": "Display Content1"
         }
      },
      "DivContent2":
      {
         "Type": "DivUnique",
         "Attributes":
         {
            "Value": "Display Content2"
         }
      }
   }

In ``skeleton.json``, **connect** the ``DivUnique`` instances to the ``TabContainer``
using the additional ``ElementID`` property:

.. code-block:: json

   {
      "ExampleScreen":
      [
         {
            "ExampleTabcontainer":
            {
               "RefID": "ExampleScreen"
            }
         },
         {
            "DivContent1":
            {
               "RefID": "ExampleTabcontainer",
               "ElementID": "Tab1Content"
            }
         },
         {
            "DivContent2":
            {
               "RefID": "ExampleTabcontainer",
               "ElementID": "Tab2Content"
            }
         }
      ]
   }

.. _objecttype-fileupload:

11.11. FileUpload
-----------------

The ``FileUpload`` *x0-object-type* renders a ``multipart/form-data``
file-selection control paired with a visual upload progress indicator.
Internally, it is composed of a callback-bound ``ButtonCallback`` trigger and a
nested :ref:`objecttype-progressbar` instance.

Invoking ``startUpload()`` dispatches an asynchronous ``XMLHttpRequest`` POST
request to ``UploadScript``. During transmission, upload progress events update
the inner progress bar in realtime via ``updateProgress()``, while the
``Status`` attribute transitions through ``init`` → ``uploading`` →
``success`` / ``failed`` → ``finished`` as the request resolves.

Upon successful completion, an optional ``FireEvents`` array triggers
*x0-reactor*-based interactions in dependent objects, such as a backend data
update.

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

The ``ErrorContainer`` *x0-object-type* provides a dedicated target container
for displaying informational and error messages anywhere within the application
layout. Because it is completely decoupled from the objects that trigger it, an
``ErrorContainer`` instance can be placed at any desired position within the
*x0-screen* hierarchy (``skeleton.json``).

Although ``ErrorContainer`` defines no attributes of its own, any other
*x0-object* can declaratively bind to it by referencing its ``ObjectID`` inside
the ``ErrorContainer`` attribute. This mechanism is primarily used by
:ref:`objecttype-button` and :ref:`objecttype-buttoninternal` for form
validation errors, as well as :ref:`objecttype-list` for runtime row append
errors.

Refer to the individual documentation of each respective *x0-object-type* to
see how to declaratively configure its interaction with ``ErrorContainer``,
including how to define multilingual error messages.

11.12.1. Object Attributes
**************************

None.

11.12.2. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleErrorContainer":
      {
         "Type": "ErrorContainer",
         "Attributes": {}
      }
   }

.. _objecttype-openclosecontainer:

11.13. OpenCloseContainer
-------------------------

The ``OpenCloseContainer`` *x0-object-type* renders a Bootstrap card with a
styled header row and a collapsible body, allowing users to expand or collapse a
section to manage screen space without losing its contents.

Internally, the body is a nested ``Div`` whose ``VisibleState`` attribute is
toggled between ``visible`` and ``hidden`` via ``toggleVisibleState()`` by
clicking a Font Awesome caret icon. Because the body is only hidden rather than
destroyed, any child *x0-object* placed inside remains fully initialized and
preserves its state while collapsed.

The ``StateOpen`` attribute controls whether the container body starts expanded
or collapsed when the *x0-screen* is initially rendered.

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
   | TextID              | TextID-String        | TextID referenced in ``webui.text`` DB Table    |
   +---------------------+----------------------+-------------------------------------------------+
   | IconStyle           | CSS-String           | Font Awesome Icon CSS                           |
   +---------------------+----------------------+-------------------------------------------------+
   | StateOpen           | Boolean              | Initial expanded (``true``) / collapsed state   |
   +---------------------+----------------------+-------------------------------------------------+

11.13.2. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleOpenCloseElement1":
      {
         "Type": "OpenCloseContainer",
         "Attributes":
         {
            "TextID": "TXT.OPENCLOSE1-HEADER"
         }
      }
   }

.. code-block:: json

   {
      "ExampleOpenCloseElement2":
      {
         "Type": "OpenCloseContainer",
         "Attributes":
         {
            "Style": "mb-4",
            "TextID": "TXT.SECTION.ADVANCED.SETTINGS",
            "StateOpen": false
         }
      }
   }

.. _objecttype-treesimple:

11.14. TreeSimple
-----------------

The ``TreeSimple`` *x0-object-type* renders a hierarchical Bootstrap list-group
tree composed of expandable/collapsible ``Node`` elements and interactive,
navigation-triggering ``Item`` elements, each carrying its own Font Awesome
icon.

Clicking the folder icon of a ``Node`` toggles its ``Children`` container
between expanded and collapsed without affecting the state of other branches.
In contrast, clicking the link of an ``Item`` invokes
``sysFactory.switchScreen()`` targeting its configured ``DstScreenID``.

Upon selection, the clicked row is visually highlighted while resetting the
previous selection tracked via the ``LastSelectedItem`` reference on the tree
root. Rows are additionally highlighted on ``mouseover`` and ``mouseout``
events to provide immediate visual feedback independent of the persisted
selection state.

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
   | TextID              | TextID-String        | TextID referenced in ``webui.text`` DB Table    |
   +---------------------+----------------------+-------------------------------------------------+
   | Icon                | CSS-String           | Font Awesome Icon CSS Classes                   |
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
   | TextID              | TextID-String        | TextID referenced in ``webui.text`` DB Table    |
   +---------------------+----------------------+-------------------------------------------------+
   | Icon                | CSS-String           | Font Awesome Icon CSS Classes                   |
   +---------------------+----------------------+-------------------------------------------------+
   | DstScreenID         | ScreenID-String      | Target Screen for navigation                    |
   +---------------------+----------------------+-------------------------------------------------+

11.14.4. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleTree":
      {
         "Type": "TreeSimple",
         "Attributes":
         {
            "TreeItems":
            [
               {
                  "Type": "Node",
                  "TextID": "TXT.NODE1",
                  "Icon": "fa-solid fa-hexagon-nodes",
                  "Children":
                  [
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
                        "Children":
                        [
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
   }

.. _objecttype-divunique:

11.15. DivUnique
----------------

The ``DivUnique`` *x0-object-type* is **mostly** identical to the ``Div``
*x0-object-type*, with one primary difference: ``this.overrideDOMObjectID`` is
set to ``true`` inside its constructor. When enabled, this flag prevents the
automatic recursive prefixing of parent ObjectIDs during
``sysBaseObject.renderObject(Prefix)`` inside the recursive rendering loop.

For a direct comparison, consider three nested ``Div`` objects configured
inside ``object.json``: the resulting DOM layer IDs are ``Object1ID`` for the
first object, ``Object1ID_Object2ID`` for the second, and
``Object1ID_Object2ID_Object3ID`` for the third.

When using ``DivUnique``, the resulting DOM IDs remain unaltered: ``Object1ID``,
``Object2ID``, and ``Object3ID``. This makes ``DivUnique`` the ideal choice for
single-container modeling within the declarative scope of ``object.json``.

When using ``DivUnique`` inside the **programmatic** scope (building custom
*x0-object-types*), the implementor must **ensure** the uniqueness of each
assigned ObjectID (e.g., for dynamically created row containers). In contrast,
the standard ``Div`` *x0-object-type* is explicitly used in nested programmatic
setups as an intermediate structural layer without logic. This concept is
described in detail in the System Developer Documentation under
:ref:`dev-object-nesting`.

11.15.1. Object Attributes
**************************

.. table:: Object Type DivUnique Attributes
   :widths: 10 10 80

   +-----------------+------------------+---------------------------------------------------------+
   | **Property**    | **Type**         | **Description**                                         |
   +=================+==================+=========================================================+
   | DOMType         | String           | Container element tag, e.g. ``div``, ``span``           |
   +-----------------+------------------+---------------------------------------------------------+
   | Style           | CSS-String       | CSS Style Classes, space separated                      |
   +-----------------+------------------+---------------------------------------------------------+
   | Value           | String           | Value (innerHTML)                                       |
   +-----------------+------------------+---------------------------------------------------------+

11.15.2. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleDivUnique":
      {
         "Type": "DivUnique",
         "Attributes":
         {
            "Style": "container-fluid p-3"
         }
      }
   }

.. _objecttype-divvalue:

11.16. DivValue
---------------

The ``DivValue`` *x0-object-type* is **mostly** identical to the ``DivUnique``
*x0-object-type*, with one primary difference: it provides ``getObjectData()``
and ``setObjectData()`` methods for runtime data manipulation.

Because it inherits from ``DivUnique``, ``this.overrideDOMObjectID`` is also
set to ``true``, resulting in identical DOM ID behavior.

11.16.1. Object Attributes
**************************

.. table:: Object Type DivValue Attributes
   :widths: 10 10 80

   +-----------------+------------------+---------------------------------------------------------+
   | **Property**    | **Type**         | **Description**                                         |
   +=================+==================+=========================================================+
   | DOMType         | String           | Container element tag, e.g. ``div``, ``span``           |
   +-----------------+------------------+---------------------------------------------------------+
   | Style           | CSS-String       | CSS Style Classes, space separated                      |
   +-----------------+------------------+---------------------------------------------------------+
   | Value           | String           | Initial Display / Data Value                            |
   +-----------------+------------------+---------------------------------------------------------+

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

11.16.3. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleDivValue":
      {
         "Type": "DivValue",
         "Attributes":
         {
            "Style": "fw-bold"
         }
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
   :widths: 10 10 80

   +---------------------+----------------------+-------------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                       |
   +=====================+======================+=======================================================+
   | Style               | CSS-String           | Additional CSS classes applied to the inner bar       |
   +---------------------+----------------------+-------------------------------------------------------+

11.17.2. Runtime API
********************

.. code-block:: javascript

   // read current percentage (0-100)
   var pct = sysFactory.getObjectByID('MyProgressBar').getObjectData();

   // set percentage and re-render
   sysFactory.getObjectByID('MyProgressBar').setObjectData(75);

11.17.3. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleProgressBar":
      {
         "Type": "ProgressBar",
         "Attributes":
         {
            "Style": "bg-success"
         }
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
   :widths: 10 10 80

   +-----------------+------------------+---------------------------------------------------------+
   | **Property**    | **Type**         | **Description**                                         |
   +=================+==================+=========================================================+
   | Min             | Number           | Minimum slider value (HTML ``min`` attribute)           |
   +-----------------+------------------+---------------------------------------------------------+
   | Max             | Number           | Maximum slider value (HTML ``max`` attribute)           |
   +-----------------+------------------+---------------------------------------------------------+

11.18.2. Runtime API
********************

.. code-block:: javascript

   // read current slider value
   var val = sysFactory.getObjectByID('MySlider').getObjectData();

   // set slider value programmatically
   sysFactory.getObjectByID('MySlider').setObjectData(50);

11.18.3. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleSlider":
      {
         "Type": "RangeSlider",
         "Attributes":
         {
            "Min": 0,
            "Max": 100
         }
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

11.19.2. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleRangeSliderContainer":
      {
         "Type": "RangeSliderContainer",
         "Attributes":
         {
            "Min": 1,
            "Max": 100,
            "Value": 50,
            "UnitTextID": "TXT.EXAMPLE.RANGESLIDER.UNIT.PERCENTAGE"
         }
      }
   }

.. _objecttype-headerbodycontainer:

11.20. HeaderBodyContainer
--------------------------

The ``HeaderBodyContainer`` *x0-object-type* renders a two-row layout consisting
of a styled header row and a body row, each exposing a ``Div`` to hold
*x0-object* instances.

To **connect** child objects inside ``skeleton.json``, reference the container
``ObjectID`` suffixed with ``Header`` (header) or ``Content`` (body) via the
``ElementID`` property, following the same attachment mechanism used by
:ref:`objecttype-tabcontainer`. See example JSON below (11.20.2.).

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

11.20.2. JSON Examples
**********************

In ``object.json``:

.. code-block:: json

   {
      "ExampleHeaderBodyContainer":
      {
         "Type": "HeaderBodyContainer",
         "Attributes":
         {
            "HeaderStyle": "row m-0 p-3 border border-1 bg-success bg-opacity-50",
            "BodyStyle": "row m-0 p-3 border border-1 bg-success-subtle bg-opacity-25"
         }
      },
      "DisplayText1":
      {
         "Type": "Text",
         "Attributes":
         {
            "DOMType": "h1",
            "TextID": "TXT.HEADER.EXAMPLE_TEXT1",
            "Style": "text-primary-emphasis"
         }
      },
      "DisplayText2":
      {
         "Type": "Text",
         "Attributes":
         {
            "DOMType": "h2",
            "TextID": "TXT.HEADER.EXAMPLE_TEXT1",
            "Style": "text-primary-emphasis"
         }
      }
   }

In ``skeleton.json``:

.. code-block:: json

   {
      "ExampleHeaderBodyContainer":
      {
         "RefID": "ExampleScreen1"
      },
      "DisplayText1":
      {
         "RefID": "ExampleHeaderBodyContainer",
         "ElementID": "ExampleHeaderBodyContainerHeader"
      },
      "DisplayText2":
      {
         "RefID": "ExampleHeaderBodyContainer",
         "ElementID": "ExampleHeaderBodyContainerContent"
      }
   }

.. _objecttype-systemsettingscontainer:

11.21. SystemSettingsContainer
------------------------------

The ``SystemSettingsContainer`` *x0-object-type* renders a list of labeled
configuration rows used for internal *x0-system* settings.

.. warning::
   ``SystemSettingsContainer`` is an internal *x0-system* object that also
   serves as a demonstration component and should not be used in production
   applications.

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
   | IconStyle           | CSS-String           | Font Awesome Icon CSS                           |
   +---------------------+----------------------+-------------------------------------------------+
   | SettingsObject      | Object               | ``{ObjectType, Attributes}``, nested object     |
   +---------------------+----------------------+-------------------------------------------------+

11.21.3. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleSettingsContainer":
      {
         "Type": "SystemSettingsContainer",
         "Attributes":
         {
            "Settings":
            [
               {
                  "TextID": "TXT.SYSTEMSETTINGS.VIDEO.BRIGHTNESS",
                  "IconStyle": "fa-solid fa-sun",
                  "SettingsObject":
                  {
                     "ObjectType": "RangeSlider",
                     "Attributes": { "Style": "w-100", "Min": 1, "Max": 100, "Value": 90 }
                  }
               }
            ]
         }
      }
   }

.. _objecttype-systemsettingscontainergrid:

11.22. SystemSettingsContainerGrid
----------------------------------

The ``SystemSettingsContainerGrid`` *x0-object-type* extends
:ref:`objecttype-systemsettingscontainer` with the Global Grid System
(see :ref:`grid-system`).

.. important::
   ``SystemSettingsContainerGrid`` demonstrates the *x0-grid* live functionality,
   how different models (styles) can be attached to a grid in realtime.

11.22.1. Object Attributes
**************************

.. table:: Object Type SystemSettingsContainerGrid Attributes
   :widths: 15 15 70

   +-------------------+--------------------+--------------------------------------------------+
   | **Property**      | **Type**           | **Description**                                  |
   +===================+====================+==================================================+
   | Settings          | Array of Elements  | Same schema as 11.21.2.                          |
   +-------------------+--------------------+--------------------------------------------------+
   | GridStyles        | Object             | ``{SelectorRowStyle}``, variant selector style   |
   +-------------------+--------------------+--------------------------------------------------+
   | GridGenerator     | Object             | ``sysGridGenerator`` see :ref:`grid-system`      |
   +-------------------+--------------------+--------------------------------------------------+

.. _objecttype-infoparagraph:

11.23. InfoParagraph
--------------------

The ``InfoParagraph`` *x0-object-type* acts as a multi-paragraph ``Text``
container for *fast paragraph design*, avoiding the overhead of modeling
individual objects in ``object.json`` and ``skeleton.json``.

Its primary use is to render simple text blocks containing multiple items,
each consisting of:

- a multilingual ``Text``,
- a CSS ``Style``, **and**
- an optional ``IconStyle`` to prepend a Font Awesome icon.

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

11.23.2. Text Attributes
************************

.. table:: Object Type InfoParagraph Text Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | ID                  | TextID-String        | Text ID, referenced in ``webui.text``           |
   +---------------------+----------------------+-------------------------------------------------+
   | Style               | CSS-String           | CSS Style Classes                               |
   +---------------------+----------------------+-------------------------------------------------+
   | IconStyle           | CSS-String           | Font Awesome Icon CSS for Prepend Icon          |
   +---------------------+----------------------+-------------------------------------------------+

11.23.3. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleInfoParagraph":
      {
         "Type": "InfoParagraph",
         "Attributes":
         {
            "Text":
            [
               {
                  "ID": "TXT.EXAMPLE.PARAGRAPH1.HEADER",
                  "Style": "text-primary-emphasis text-opacity-75 fw-bold",
                  "IconStyle": "fa-solid fa-user-group"
               },
               {
                  "ID": "TXT.EXAMPLE.PARAGRAPH1.TEXT1",
                  "Style": "text-dark text-opacity-50"
               }
            ]
         }
      }
   }

.. _objecttype-languageswitch:

11.24. LanguageSwitch
---------------------

The ``LanguageSwitch`` *x0-object-type* renders a dropdown list of the
configured display languages (see :ref:`system-config`) paired with
an activation button to switch to the selected language at runtime without a
page reload.

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

11.24.2. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleLanguageSwitch":
      {
         "Type": "LanguageSwitch",
         "Attributes":
         {
            "Style": "row border rounded m-0 p-3 fw-bold"
         }
      }
   }

.. _objecttype-dynradiolist:

11.25. DynRadioList
-------------------

The ``DynRadioList`` *x0-object-type* renders a dynamically growable list of
radio button rows, each paired with a text input. Clicking the trailing "add"
control appends a new row with its own "remove" control; right-clicking a
removable row opens a context menu offering the same removal action (see
:ref:`context-menu`).

.. important::
   ``DynRadioList`` can be treated as a fully supported ``Formfield``
   *x0-object-type* and used inside ``FormfieldList``. In addition, it
   demonstrates how the ``ContextMenu`` and ``Button`` *x0-object-types* can be
   combined within a single component.

11.25.1. Object Attributes
**************************

.. table:: Object Type DynRadioList Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | ButtonTextDisabled  | Boolean              | Hide add/remove button text, icon-only display  |
   +---------------------+----------------------+-------------------------------------------------+

11.25.2. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleDynRadioList":
      {
         "Type": "DynRadioList",
         "Attributes":
         {
            "ButtonTextDisabled": false
         }
      }
   }

.. _objecttype-serviceconnector:

11.26. ServiceConnector
-----------------------

The ``ServiceConnector`` *x0-object-type* binds a backend service call to a
target *x0-system-object* (currently supported *x0-object-types* are ``List``
and ``FormfieldList``), triggering the call whenever one of the configured
system events fires (e.g., ``InitSystem``).

Its full event-registration and dispatch mechanics are documented in
:ref:`backend-connector`.

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

11.26.2. JSON Examples
**********************

.. code-block:: json

   "ExampleServiceConnector":
   {
      "Type": "ServiceConnector",
      "Attributes": {
         "OnEvent": {
            "Events": [ "InitSystem" ],
            "ServiceCall": "/python/BackendService.py"
         }
      }
   }

.. _objecttype-timedprogress:

11.27. TimedProgress
--------------------

The ``TimedProgress`` *x0-object-type*
(``/www/userObjExampleTimedProgress.js``) renders a self-contained,
periodically auto-incrementing progress indicator composed of a core
:ref:`objecttype-progressbar` instance, a ``FormfieldItemLabel``, and a
callback-bound :ref:`objecttype-buttoninternal` trigger.

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

11.27.2. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleTimedProgress":
      {
         "Type": "TimedProgress",
         "Attributes":
         {
            "Interval": 100,
            "IncreaseBy": 1
         }
      }
   }

.. _objecttype-examplewizard:

11.28. ExampleWizard
--------------------

The ``ExampleWizard`` *x0-object-type* (``/www/userObjExampleWizard.js``)
renders a step-controlled, multi-tab wizard pattern built on top of
:ref:`objecttype-tabcontainer` and :ref:`objecttype-progressbar` instances.

It inherits from ``DivUnique``, tracks the active step via an internal
``StepIndex`` and ``StepCount`` state pair, and enforces per-step form
validation through its ``ValidateForm`` array before permitting forward
navigation.

.. important::
   ``ExampleWizard``, like any other example prefixed with ``Example*``, can
   be viewed inside the *x0-static* Docker container at ``http://localhost/``
   once started.

11.28.1. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleWizard":
      {
         "Type": "ExampleWizard",
         "Attributes": {}
      }
   }

.. _objecttype-exampleeditableitem:

11.29. ExampleEditableItem
--------------------------

The ``ExampleEditableItem`` *x0-object-type*
(``/www/userObjExampleEditableItemContainer.js``) renders a single, optionally
in-place editable row—displaying an image, header text, and content text—that
serves as the per-row template for
:ref:`objecttype-exampleeditableitemcontainer`.

It inherits from ``DivUnique`` and supports a switchable edit mode.

.. warning::
   ``ExampleEditableItem`` serves as a demonstration of a *complex, nested*,
   *realtime editable* **and** *paginated* **x0-object** and must be
   treated as **experimental**.

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

11.29.2. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleEditableItem":
      {
         "Type": "ExampleEditableItem",
         "Attributes":
         {
            "Editable": true,
            "OrderChangeable": false
         }
      }
   }

.. _objecttype-exampleeditableitemcontainer:

11.30. ExampleEditableItemContainer
-----------------------------------

The ``ExampleEditableItemContainer`` *x0-object-type*
(``/www/userObjExampleEditableItemContainer.js``) renders the paginated
container counterpart to :ref:`objecttype-exampleeditableitem` instances.

It inherits from ``DivUnique`` and integrates a ``sysPagination``
instance. In addition, it exposes the standard runtime data API using
``SetDataMechanism: 'Plain'`` and routes both ``RuntimeSetDataFunc`` and
``RuntimeAppendDataFunc`` through its internal ``addItem()`` method, allowing
new rows to be appended at runtime in the same way as :ref:`objecttype-list`
rows.

.. warning::
   ``ExampleEditableItemContainer`` serves as a demonstration of a
   *runtime editable container* and must be treated as **experimental**.

11.30.1. Object Attributes
**************************

.. table:: Object Type ExampleEditableItemContainer Attributes
   :widths: 15 15 70

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Style               | CSS-String           | CSS Style Classes, space separated              |
   +---------------------+----------------------+-------------------------------------------------+
   | HeaderTextID        | TextID-String        | TextID referenced in ``webui.text`` DB Table    |
   +---------------------+----------------------+-------------------------------------------------+
   | HeaderStyle         | CSS-String           | CSS Style Classes for the header text           |
   +---------------------+----------------------+-------------------------------------------------+
   | HeaderIconStyle     | CSS-String           | Font Awesome icon style for the header          |
   +---------------------+----------------------+-------------------------------------------------+

11.30.2. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleEditableTemplate":
      {
         "Type": "ExampleEditableItemContainer",
         "Attributes":
         {
            "HeaderTextID": "TXT.HEADER1",
            "HeaderStyle": "h3 text-primary-emphasis",
            "HeaderIconStyle": "fa-solid fa-card-shopping"
         }
      }
   }

.. _objecttype-exampleflightdetails:

11.31. ExampleFlightDetails
---------------------------

The ``ExampleFlightDetails`` *x0-object-type*
(``/www/userObjExampleFlightData.js``) renders a single, read-only flight
summary row—displaying an airline icon, airline name, flight number, and
airport.

It inherits from ``DivUnique`` and is used for demonstration purposes
inside a parent :ref:`objecttype-list` column container.

.. warning::
   ``ExampleFlightDetails`` serves as a demonstration of a *status-display*
   *container* and must be treated as **experimental**.

11.31.1. Object Attributes
**************************

.. table:: Object Type ExampleFlightDetails Attributes
   :widths: 10 10 80

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Value               | Object               | ``{Icon, Airline, FlightNr, Airport}``          |
   +---------------------+----------------------+-------------------------------------------------+

11.31.2. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleFlightDetails":
      {
         "Type": "ExampleFlightDetails",
         "Attributes":
         {
            "Value":
            {
               "Icon": "icon-airline-lufthansa.png",
               "Airline": "Lufthansa",
               "FlightNr": "LH441",
               "Airport": "FRA"
            }
         }
      }
   }

.. _objecttype-exampleflightstatus:

11.32. ExampleFlightStatus
--------------------------

The ``ExampleFlightStatus`` *x0-object-type*
(``/www/userObjExampleFlightData.js``) renders a status badge—composed of a
colored indicator circle, status type, and time.

It inherits from ``DivUnique`` and derives both its border color and
inner text color from the ``Value.Alert`` Bootstrap contextual color keyword
(e.g., ``success``, ``warning``, or ``danger``).

.. warning::
   ``ExampleFlightStatus`` serves as a demonstration of a *status-display*
   *container* and must be treated as **experimental**.

11.32.1. Object Attributes
**************************

.. table:: Object Type ExampleFlightStatus Attributes
   :widths: 10 10 80

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Value               | Object               | ``{Alert, Type, Time}``                         |
   +---------------------+----------------------+-------------------------------------------------+

11.32.2. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleFlightStatus":
      {
         "Type": "ExampleFlightStatus",
         "Attributes":
         {
            "Value":
            {
               "Alert": "success",
               "Type": "On Time",
               "Time": "14:35"
            }
         }
      }
   }

.. _objecttype-examplecardtasklist:

11.33. ExampleCardTasklist
--------------------------

The ``ExampleCardTasklist`` *x0-object-type*
(``/www/userObjExampleCardTasklists.js``) renders a Kanban-style card with
badge selection, collaborator selection, and one or more nested, independently
addable tasklists and tasks.

.. warning::
   ``ExampleCardTasklist`` serves as a demonstration of a *complex, nested object*
   *interaction* and must be treated as **experimental**.

11.33.1. Object Attributes
**************************

.. table:: Object Type ExampleCardTasklist Attributes
   :widths: 10 10 80

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Style               | CSS-String           | CSS Style Classes, space separated              |
   +---------------------+----------------------+-------------------------------------------------+

11.33.2. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleCardTasklist":
      {
         "Type": "ExampleCardTasklist"
      }
   }

.. _objecttype-examplepeopleselector:

11.34. ExamplePeopleSelector
----------------------------

The ``ExamplePeopleSelector`` *x0-object-type*
(``/www/userObjExamplePeopleSelector.js``) renders a fixed, non-overridable
roster of selectable collaborator rows—each displaying an image, a name, and
localized text—within a closable overlay-style header and body layout.

It inherits from ``DivUnique`` and is typically instantiated inside an
:ref:`appdev-overlay` container.

.. warning::
   ``ExamplePeopleSelector`` serves as a demonstration of an *overlay-select*
   *container* and must be treated as **experimental**.

11.34.1. Object Attributes
**************************

.. table:: Object Type ExamplePeopleSelector Attributes
   :widths: 10 10 80

   +---------------------+----------------------+-------------------------------------------------+
   | **Property**        | **Type**             | **Description**                                 |
   +=====================+======================+=================================================+
   | Style               | CSS-String           | CSS Style Classes, space separated              |
   +---------------------+----------------------+-------------------------------------------------+

11.34.2. JSON Examples
**********************

.. code-block:: json

   {
      "ExampleCollaboratorsList":
      {
         "Type": "ExamplePeopleSelector"
      }
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
