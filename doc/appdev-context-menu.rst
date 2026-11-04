.. appdev-context-menu

.. _appdevcontextmenu:

13. Context Menu
================

An *x0-context-menu* is a flexible, configurable **building block** designed to model
**highly efficient** workflows. Instead of being bound only to specific, static, pre-existing
*x0-system-objects*, it can also be bound to **custom-made** objects easily.

What makes the *x0-infrastructure* so special is its **smart OOP model**, which allows callback
functions to be bound **directly** to an *x0-object-instance* or to **global system functions**.
For example, it can utilize the *x0-clipboard*, which operates on real objects rather
than *flat*, disconnected copy/paste metadata.

This enables complex **copy/paste** operations that other systems can only dream of,
especially since operating systems like Windows or Linux handle clipboard data with a very
limited (and often insecure) approach. The *x0-context-menu* is built for next-generation
applications—object-oriented and easily extensible.

13.1. Declarative Config
------------------------

The following out-of-the-box, predefined *x0-objects* support the activation and control
of context menu behavior via a **static declarative** configuration in ``object.json``.

This configuration is **generic**; all subsequent object types use the same structure. The
only difference is the specific **position** where the configuration must be placed.

This entire section and all subsequent sub-chapters focus exclusively on the **declarative method**.
This declarative concept is limited to standard *x0-system* objects. For advanced use cases,
refer to the "Programmatic Integration" section within the System Developer documentation
under "Best Practices" :ref:`devbestpractices` to see how to achieve fine-grained control
inside your custom *x0-objects*.

.. important::
   In *x0*, a single context menu is directly **object-bound**, rather than being connected
   globally through its item configuration. Consequently, performing a clipboard (get/set)
   operation between two distinct *x0-objects* requires **two** separately configured context
   menus: **one** on the **source object** with a **get-data** item configuration, and **another**
   on the **destination object** with a **set-data** item configuration.

13.2. Global Declaration
------------------------

The following properties are mandatory for any context menu item setup.

.. table:: Global Context Menu Property Definition
   :widths: 20 20 60

   +---------------+--------------------------+----------------------------------------------------+
   | Property      | Type                     | Description                                        |
   +===============+==========================+====================================================+
   | ID            | Unique String Identifier | Unique context menu item identifier.               |
   +---------------+--------------------------+----------------------------------------------------+
   | TextID        | Valid system TextID      | Display TextID with multi-language support.        |
   +---------------+--------------------------+----------------------------------------------------+
   | IconStyle     | Font Awesome Icon CSS    | Display icon (CSS style).                          |
   +---------------+--------------------------+----------------------------------------------------+

A generic example configuration for three context menu items without any associated functionality
looks like this:

.. code-block:: javascript

   "ContextMenuItems":
     {
       "ID": "EditItem",
       "TextID": "TXT.SYS.CONTEXTMENU.MENUENTRY.EDIT_DATA",
       "IconStyle": "fa-solid fa-edit"
     },
     {
       "ID": "RemoveItem",
       "TextID": "TXT.SYS.CONTEXTMENU.MENUENTRY.REMOVE_DATA",
       "IconStyle": "fa-solid fa-trash"
     },
     {
       "ID": "SaveData",
       "TextID": "TXT.SYS.CONTEXTMENU.MENUENTRY.SAVE_DATA",
       "IconStyle": "fa-solid fa-floppy-disk"
     }
   ]

13.3. Dispatch Mechanisms
-------------------------

To extend this minimal declarative configuration and add functionality when a user selects
a context menu item, the *x0-system* distinguishes between two models:

- **Internal Function** (refers to a global, *x0-system*-wide process)
- **Callback Function** (maps directly to the specified object's callback function)

.. important::
   From a declarative perspective, only the **Internal Function** method can be used to map
   functionality. The **Callback Function** method is strictly limited to custom *x0-objects*.

13.4. Function Mapping
----------------------

This section covers the function mapping for the **Internal Function** methodology only.

It is implemented in ``sysFunctionDispatcher.js`` and serves as a global, generic mapping
pattern between a string-based function description and programmatic functionality.

The following table lists the implemented and referenceable functions.

.. table:: InternalFunction Call References
   :widths: 10 30 60

   +-----------------+----------------------------------+-----------------------------------------------------+
   | Value           | Dispatched Internal Function     | Description                                         |
   +=================+==================================+=====================================================+
   | get-data        | ``getObjectData()``              | Reads data into ``sysFactory.ClipboardData``.       |
   +-----------------+----------------------------------+-----------------------------------------------------+
   | set-data        | ``setObjectData(ClipboardData)`` | Writes ``sysFactory.ClipboardData`` to object.      |
   +-----------------+----------------------------------+-----------------------------------------------------+
   | get-set-data    | ``getObjectData()``              | Copies data directly to ``DstObjectID`` without     |
   |                 | ``setObjectData(DstObjectID)``   | using the clipboard.                                |
   +-----------------+----------------------------------+-----------------------------------------------------+
   | remove          | ``this.remove()``                | Object-dependent, hard-coded inside object.         |
   +-----------------+----------------------------------+-----------------------------------------------------+
   | remove-selected | ``this.removeSelected()``        | Object-dependent, hard-coded inside object.         |
   +-----------------+----------------------------------+-----------------------------------------------------+
   | reset           | ``this.reset()``                 | Object-dependent, hard-coded inside object.         |
   +-----------------+----------------------------------+-----------------------------------------------------+

13.5. Supported Objects
-----------------------

The following object types allow a declarative context menu configuration within
``object.json``:

- ``List``
- ``FormfieldList``

13.5.1. List
************

Since x0 version 1.1, the ``List`` object type has supported a right-click context menu
within the table **header area**. This is primarily used for functionality such as adding
data (set-data) to populate the table at runtime with additional row data (append).

In future releases, this will be transparently supported via drag-and-drop behavior
(which is currently available as an early beta feature).

Essentially, this introduces two configuration arrays: **ContextMenuItems** (row-based)
and **HeaderContextMenuItems** (table header only).

- ContextMenuItems
- HeaderContextMenuItems

.. tip::
   Please also check the object's configuration section for more **global configuration options**.
   For example, combining this with the context menu's **remove-selected** function enables
   fine-grained, multi-line operations.

.. note::
   The *x0-static* runnable container includes multiple viewable examples showing how operating
   the context menu on a ``List`` looks like.

13.5.2. List Header
*******************

The ``List`` **header** supports an independent context menu to clearly separate
it from table rows.

.. code-block:: javascript

   "HeaderContextMenuItems": [
      {
         "ID": "AppendData",
         "TextID": "TXT.SYS.CONTEXTMENU.MENUENTRY.APPEND_DATA",
         "IconStyle": "fa-solid fa-paste",
         "InternalFunction": "set-data"
      }
   ]

.. warning::
   Currently, only the ``set-data`` function is officially tested and supported.
   Other methods may work but could contain errors or cause unexpected behavior.

13.5.3. List Row
****************

The ``List`` sub-type ``RowElement`` supports an own context menu which operates
on row level.

Supported **Internal Functions**:

- get-data
- set-data
- remove
- remove-selected

.. code-block:: javascript

   "ContextMenuItems": [
      {
         "ID": "GetData",
         "TextID": "TXT.SYS.CONTEXTMENU.MENUENTRY.GET_DATA",
         "IconStyle": "fa-solid fa-copy",
         "InternalFunction": "get-data"
      },
      {
         "ID": "SetData",
         "TextID": "TXT.SYS.CONTEXTMENU.MENUENTRY.SET_DATA",
         "IconStyle": "fa-solid fa-paste",
         "InternalFunction": "set-data"
      },
      {
          "ID": "RemoveRow",
          "TextID": "TXT.SYS.CONTEXTMENU.MENUENTRY.REMOVE_ROW",
          "IconStyle": "fa-solid fa-trash-can",
          "InternalFunction": "remove"
      },
      {
          "ID": "RemoveSelectedRows",
          "TextID": "TXT.SYS.CONTEXTMENU.MENUENTRY.REMOVE_SELECTED_ROWS",
          "IconStyle": "fa-solid fa-trash-can",
          "InternalFunction": "remove-selected"
      }
   ]

13.5.4. FormfieldList
*********************

The ``FormfieldList`` object type is a *x0-container* object comprising multiple
``FormfieldItems``. To enable *x0-data-get* and *x0-data-set* operations, each
``FormfieldItem`` must be configured with a ``KeyID`` property. This property identifies
which item will be targeted during a *x0-data-set* operation. Conversely, during a
*x0-data-get* operation, the clipboard or metadata will be formatted as key/value
pairs based on this ``KeyID``.

Supported **Internal Functions**:

    get-data
        Reads key/value structured data from ``FormfieldItems`` into the clipboard).
    set-data
        Updates the key-matching ``FormfieldItems`` inside the ``FormfieldList`` with key/value structured data.
    get-set-data
        Works only when specified as ``DestObjectID`` in the source object.
    reset
        Resets all ``FormfieldItems`` to their default values.

13.6. Overlay Activation
------------------------

Setting ``OverlayScreenID`` to a valid ScreenID activates the referenced
overlay screen via ``sysFactory.OverlayObj.activateOverlay()`` (see
:ref:`appdevoverlay`) before the menu is closed.

.. code-block:: javascript

   "ContextMenuItems": [
      {
         "ID": "EditData",
         "TextID": "TXT.SYS.CONTEXTMENU.MENUENTRY.EDIT_IN_OVERLAY",
         "IconStyle": "fa-solid fa-edit",
         "InternalFunction": "get-set-data",
         "OverlayScreenID": "ExamplesOverlayEditData",
         "DstObjectID": "ExamplesOverlayEditOverlayDataFormWorker"
      }
   ]

13.7. Reactor Integration
-------------------------

Setting ``FireEvents`` to an array of EventIDs fires the referenced
*x0-system-events* via ``sysFactory.Reactor.fireEvents()`` (see
:ref:`appdeveventsystem`), allowing a context menu action to notify arbitrary,
unrelated *x0-system-objects* without a direct object reference.

.. code-block:: javascript

   "ContextMenuItems": [
      {
         "ID": "FireEvent",
         "TextID": "TXT.SYS.CONTEXTMENU.MENUENTRY.LOAD_DATA",
         "IconStyle": "fa-solid fa-edit",
         "FireEvents": [ "Event1", "Event2" ]
      }
   ]

.. warning::
   Please note that ``FireEvents`` are executed additionally **after** an
   **Internal Function** call.
