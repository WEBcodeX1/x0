.. appdev-context-menu

.. _appdevcontextmenu:

10. Context Menu
================

A context menu (right mouse click) can be bound to any *x0-object-type*
(if it was implemented by the *x0-developer*).

.. note::

    Currently only ``List`` and ``FormfieldList`` *x0-object-types* are supported,
    this will change in future releases.

10.1. Global Attributes
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

10.2. Implemented Methods
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

10.3. Edit Attributes
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

