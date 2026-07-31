.. appdev-context-menu

.. _appdevcontextmenu:

12. Context Menu
================

A context menu (right mouse click) can be bound to any *x0-object-type*
(if it was implemented by the *x0-developer*).

.. note::

    Supported *x0-object-types*: ``List``, ``FormfieldList``, and ``HiliteContainer``.
    For ``HiliteContainer``, the context menu is bound directly to the container element;
    ``RowData`` is not applicable (set to ``null``) — use ``openOverlay``, ``DstScreenID``,
    service calls, or user-defined ``InternalFunction`` values instead.

12.1. Global Attributes
***********************

.. table:: Context Menu Item Global Attributes
	:widths: 30 20 100

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Method              | Enum-String          | Implemented Context Menu Methods                |
	+---------------------+----------------------+-------------------------------------------------+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| IconStyle           | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+

12.2. Implemented Methods
*************************

.. table:: Context Menu Methods
	:widths: 30 20 100

	+---------------------+----------------------+-------------------------------------------------+
	| **Method**          | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Edit                | Table-Row            | Switch Screen into Edit-Mode                    |
	+---------------------+----------------------+-------------------------------------------------+
	| RemoveSingle        | Table-Row            | Remove Single Table Row                         |
	+---------------------+----------------------+-------------------------------------------------+
	| RemoveSelected      | Array of Table-Rows  | Remove Selected Table Rows                      |
	+---------------------+----------------------+-------------------------------------------------+

12.3. Edit Attributes
*********************

.. table:: Context Menu Item "Edit" Attributes
	:widths: 30 20 100

	+---------------------+----------------------+-------------------------------------------------+
	| **Method**          | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| DstScreenID         | ScreenID-String      | Destination ScreenID Reference                  |
	+---------------------+----------------------+-------------------------------------------------+
	| RowColumn           | RowID-String         | Table Row Column Reference                      |
	+---------------------+----------------------+-------------------------------------------------+
	| FireEvents          |  Array               | Array of EventIDs                               |
	+---------------------+----------------------+-------------------------------------------------+
