.. appdev-context-menu

.. _appdevcontextmenu:

12. Context Menu
================

Context menus are currently supported by ``List`` and ``FormfieldList``.
They are declared in an object's ``ContextMenuItems`` attribute. List objects
may also define ``HeaderContextMenuItems``. Each menu item may specify an
``ID``, ``TextID``, and ``IconStyle``.

.. code-block:: javascript

   "ContextMenuItems": [
     {
       "ID": "CopyValue",
       "TextID": "TXT.CONTEXTMENU.COPY",
       "IconStyle": "fa-solid fa-copy",
       "InternalFunction": "get-data"
     }
   ]

12.1. Built-in Functions
------------------------

The ``InternalFunction`` field dispatches one of the following built-in
operations:

.. list-table:: Built-in context-menu functions
   :header-rows: 1

   * - Function ID
     - Effect
   * - ``get-data``
     - Copies the selected object's data to the runtime clipboard.
   * - ``set-data``
     - Sets the selected object's data from the runtime clipboard.
   * - ``get-set-data``
     - Copies the selected object's data directly to the object named by
       ``DstObjectID``.
   * - ``remove``
     - Calls ``remove()`` on the selected object.
   * - ``remove-selected``
     - Calls ``removeSelected()`` on the selected object.
   * - ``reset``
     - Calls ``reset()`` on the selected object.

The clipboard is held in browser runtime memory and is not persisted. For a
complete copy/paste configuration, see ``example/copy_paste``.

Menu items may also specify ``OverlayScreenID`` to open an overlay or
``FireEvents`` to dispatch events after selection. These operations are
independent of ``InternalFunction``.
