.. appdev-context-menu

.. _appdevcontextmenu:

12. Context Menu
================

The runtime creates context menus for ``List`` rows and ``FormfieldList``
objects when their ``ContextMenuItems`` attribute is configured. A ``List``
can also define ``HeaderContextMenuItems`` for its header.

Each item uses ``TextID`` and optional ``IconStyle`` for its display.
``InternalFunction`` selects a built-in operation; optional
``DstObjectID``, ``OverlayScreenID``, and ``FireEvents`` provide the
destination or follow-up behavior. The old ``Method``-based menu API is not
implemented.

12.1. Built-in Functions
------------------------

The current ``InternalFunction`` values are:

* ``get-data``: copy the selected object's data to the runtime clipboard.
* ``set-data``: set the selected object's data from the runtime clipboard.
* ``get-set-data``: copy data to the object named by ``DstObjectID``.
* ``remove``: remove the selected object.
* ``remove-selected``: remove selected entries.
* ``reset``: reset the selected object.

12.2. Example
-------------

.. code-block:: javascript

   "Tasks": {
     "Type": "List",
     "Attributes": {
       "ContextMenuItems": [
         {
           "ID": "Copy",
           "TextID": "TXT.CONTEXTMENU.COPY",
           "IconStyle": "fa-solid fa-copy",
           "InternalFunction": "get-data"
         },
         {
           "ID": "ShowDetails",
           "TextID": "TXT.CONTEXTMENU.DETAILS",
           "InternalFunction": "get-set-data",
           "DstObjectID": "TaskDetails",
           "OverlayScreenID": "TaskDetailsOverlay"
         }
       ]
     }
   }

Context-menu items may also supply a runtime ``CallbackFunction`` and its
``CallbackObjRef`` when the menu is constructed by JavaScript. No
``UserContextMenu`` class or custom ``Method`` dispatcher is provided.
