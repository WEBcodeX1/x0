.. appdev-grid

4. Grid System
==============

Some *x0-object-types* offer extended Formating Properties. Actually the following Object-Types are supported:

* List
* FormfieldList


This Technique replaces Table Row/Colspan with a simple mechanism without loosing functionality.


The following Examples (Bootstrap Table Styles) will show you how to use correctly.


Example 1
*********

.. code-block:: javascript

	"RowStyle": [
		"row"
	],
	"RowAfterElements": [ x, x ]
	"ColStyle": [
		"col-md-5",
		"col-md-7",
		"col-md2",
		"col-md3",
		"col-md3",
		"col-md5"
	]
	"ColAfterElements": [ x, x ]

.. code-block:: javascript

	+---------------------------------+---------------------------------+
	| Col1 (col-md-5)                 | Col2 (col-md-7)                 |
	+----------------+----------------+----------------+----------------+
	| Col3 (col-md2) | Col4 (col-md3) | Col5 (col-md3) | Col6 (col-md5) |
	+---------------------------------+---------------------------------+
	| Col1 (col-md-5)                 | Col2 (col-md-7)                 |
	+----------------+----------------+----------------+----------------+
	| Col3 (col-md2) | Col4 (col-md3) | Col5 (col-md3) | Col6 (col-md5) |
	+----------------+----------------+----------------+----------------+
